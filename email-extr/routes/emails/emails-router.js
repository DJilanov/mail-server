const { Router } = require('express');

const attachTo = (app, repository) => {
	const router = new Router();
	const controller = require('./emails-controller')(repository);

	router.get('/get-code/:id', controller.getCodeById)

	app.use('/api', router);
};

module.exports = { attachTo };