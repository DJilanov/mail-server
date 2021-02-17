const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
	onData(stream, session, callback) {
		console.log('INFORMATION INCOMING')
		stream.pipe(process.stdout); // print message to console
		stream.on("end", callback);
	}
});
server.listen(465);