const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const cors = require('cors');


const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100 // limit each IP to 100 requests per windowMs
});

const init = async () => {
	const app = express();

	//  apply to all requests
	app.use(limiter);

	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cookieParser());
	app.use(helmet());

	// Routers
	const repository = require('../../services/repository')();
	require('./../../services/mailin')().init(repository);
	require('./../../routes/emails/emails-router').attachTo(app, repository);

	app.use((_req, _res, next) => { next(createError(404)) });
	app.use((err, req, res, next) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500);
		next();
	});

	return app;
};

module.exports = { init };