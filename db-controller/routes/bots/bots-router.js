const { Router } = require('express');

const attachTo = (app, repository) => {
	const router = new Router();
	const validator = require('./bots-validator')();
	const controller = require('./bots-controller')(repository);

	router
		.get('/bots', controller.getBots)
		.get('/bots/:id', controller.getBotById)
		.patch('/bots/:id', controller.patchBot)
		.post('/bots', controller.createBot)
		.delete('/bots/:id', controller.deleteBot)

	app.use('/api', router);
};

module.exports = { attachTo };