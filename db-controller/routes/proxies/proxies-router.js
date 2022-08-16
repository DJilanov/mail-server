const { Router } = require('express');

const attachTo = (app, repository) => {
	const router = new Router();
	const validator = require('./proxies-validator')();
	const controller = require('./proxies-controller')(repository);

	router
		.get('/proxies', controller.getProxies)
		.get('/proxies/:id', controller.getProxyById)
		.patch('/proxies', controller.patchProxy)
		.post('/proxies', controller.createProxy)
		.delete('/proxies', controller.deleteProxy)

	app.use('/api', router);
};

module.exports = { attachTo };