const ProxyLists = require('proxy-lists');
const express = require('express');
const puppeteer = require('puppeteer');
const ProxyVerifier = require('proxy-verifier');
const fetch = require('node-fetch');

const BE = 'http://46.233.58.178:13700';
// const BE = 'http://127.0.0.1:13700';
const dummy = 'https://www.google.com/?q=www.jilanov.com';
// const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const chromePath = '/usr/bin/google-chrome-stable';
const instances = 10;

let proxyArray = [];
let testedIndex = 0;
let chromeCounter = 0;
let workingProxies = [];
let started = false;

let app = express();

// listen to port
app.listen(process.env.PORT || 13900);
console.log(`You are listening to port ${process.env.PORT || 13900}`);

app.post('/hearthbeat', (req, res) => {
    res.end('Alive');
});

const runChrome = async (ip, port, proxy) => {
    console.log('Start chrome');
    chromeCounter++
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', ],
        headless: false,
        executablePath: chromePath,
        args: [
            // '--mute-audio',
            "--autoplay-policy=no-user-gesture-required",
            `--proxy-server=${ip}:${port}`,
            `--ignore-certificate-errors`,
            '--single-process', 
            '--no-zygote', 
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    browser.on('disconnected', () => {
        chromeCounter--;
    });
    const page = await browser.newPage();

    try {
        await page.setDefaultNavigationTimeout(60000);
        page.goto(dummy);
        await page.waitForNavigation({waitUntil: 'networkidle0'});

        proxySucceed(proxy);
    } catch (err) {
        proxyFailed(proxy);
    }

};

const proxyFailed = (proxy) => {
    fetch(BE + '/api/proxies', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            protocol: proxy.protocols[0],
            ip: proxy.ipAddress + ':' + proxy.port,
            success: false
        })
    })
    .then(res => res.json())
    .then(json => console.log(json));
};

const proxySucceed = (proxy) => {
    fetch(BE + '/api/proxies', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            protocol: proxy.protocols[0],
            ip: proxy.ipAddress + ':' + proxy.port,
            success: true
        })
    })
    .then(res => res.json())
    .then(json => console.log(json));
};

const fetchproxies = () => {
    console.log('Fetch proxies');
    proxyArray = [];
    ProxyLists.getProxies({
        // protocols: ['socks4'],
        // anonymityLevels: ['elite', 'anonymous']
    })
        .on('data', function(proxies) {
            // Received some proxies.
            console.log('got some proxies');
            console.log(proxyArray.length);
            proxyArray.push(...proxies);
            if(!started) {
                console.log('Start testing');
                testProxy(testedIndex);
                started = true;
            }
        })
        .on('error', function(error) {
            // Some error has occurred.
            // console.log('error!', error);
        })
        .once('end', function() {
            // Done getting proxies.
            console.log('proxyArray: ', proxyArray.length);
            console.log('end!');
            testProxy(testedIndex);
        });
}

const testProxy = (proxyIndex) => {
    if(proxyIndex >= proxyArray.length) {
        console.log('Finish proxy list');
        proxyIndex = 0;
    }
    proxy = proxyArray[proxyIndex];
    if(!proxy || !proxy.protocols) {
        setTimeout(() => {
            testProxy(testedIndex);
            testedIndex++;
        }, 1);
        return;
    }
    console.log('Test proxy');
    ProxyVerifier.test({
        ...proxy,
        protocol: proxy.protocols[0]
    }, {
        testUrl: 'https://www.google.com/?q=www.jilanov.com',
        testFn: (data, status, headers) => {
            if(status < 300) {
                if(chromeCounter < instances) {
                    runChrome(proxy.ipAddress, proxy.port, proxy);
                } else {
                    workingProxies.push(proxy);
                }
            } else {
                proxyFailed(proxy);
            }
            if(workingProxies.length < instances * 10) {
                setTimeout(() => {
                    testProxy(testedIndex);
                    testedIndex++;
                }, 1);
            }
        }
    }, (error, results) => {
        setTimeout(() => {
            testProxy(testedIndex);
            testedIndex++;
        }, 1);
        proxyFailed(proxy);
    });
};

setInterval(() => {
    if((chromeCounter < instances) && (workingProxies.length > instances)) {
        let proxy = workingProxies.pop();
        console.log('Run extra chrome');
        runChrome(proxy.ipAddress, proxy.port, proxy);
    }
}, 2000);

setInterval(() => {
    console.log('Update existing proxies');
    chromeCounter--;
    fetchproxies();
    // setTimeout(() => {
    //     checkAllProxies();
    // }, 60000);
    for(let counter = 1; counter < instances; counter++) {
        setTimeout(() => {
            testProxy(testedIndex);
            testedIndex++;
        }, 100 * counter)
    }
}, 3600000);

fetchproxies();