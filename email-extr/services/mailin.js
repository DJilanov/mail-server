const mailin = require('mailin');

const mailHandler = () => {
    const init = (repository) => {
        mailin.start({
            port: 25,
            disableWebhook: true // Disable the webhook posting.
        });

        mailin.on('message', (connection, data, content) => {
            let code = data.subject.split(' ')[0];
            if(isNaN(code)) {
              return;
            }
            repository.push({
                email: data.to[0].address,
                code: code,
            })
        });
    };
  
    return {
      init
    };
};
  
module.exports = mailHandler;