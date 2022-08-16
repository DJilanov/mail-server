const mongoose = require('mongoose');

const init = databaseConfig => new Promise(resolve => connectDb(databaseConfig, resolve));

const connectDb = (databaseConfig, resolve) => {
	mongoose.connection.on('error', error => {
		console.log('[dbConnector] Mongoose Default Connection Error: ' + error);
		mongoose.disconnect();
	});

	mongoose.connection.on('disconnected', () => {
		console.log('[dbConnector] Mongoose Default Connection Disconnected.');
		mongoose.connect(databaseConfig.dbAddress, { useNewUrlParser: true });
	});

	mongoose.connection.on('open', function () {
		console.log('Connected To Mongo Server.');
		mongoose.connection.db.listCollections().toArray((_error, names) => module.exports.Collection = names);
	})

	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			console.log('[dbConnector] Mongoose Default Connection Disconnected Through Application Termination.');
			process.exit(0);
		});
	});

	mongoose.connect(databaseConfig.dbAddress, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, error => {
		if (error) {
			throw error;
		}
		resolve(true);
	});
}

module.exports = { init };