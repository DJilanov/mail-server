const http = require('http');
const config = require('./config');

(async () => {

	try {
		await require('./../data/db/db-context').init(config.database);
		const repository = await require('./../data/repository').init();
		const app = await require('./config/express').init(repository);
		const port = parseInt(config.api.port, 10);

		app.set('port', port);

		const server = http.createServer(app)
			.listen(port)
			.on('listening', () => {
				const addr = server.address();
				const bind = typeof addr === 'string' ? `Pipe ${ addr }` : `Port ${ addr.port }.`;
				console.log(`Listening On ${ bind }`);
			})
			.on('error', error => {
				if (error.syscall !== 'listen')
					throw error;

				const bind = typeof port === 'string' ? `Pipe ${ port }` : `Port ${ port }.`;

				switch (error.code) {
					case 'EACCES':
						console.error(`${ bind } Requires Elevated Privileges.`);
						process.exit(1);
					case 'EADDRINUSE':
						console.error(`${ bind } Is Already In Use.`);
						process.exit(1);
					default:
						throw error;
				}
			});
	}
	catch (error) {
		console.log(error);
	}
})();