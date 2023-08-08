const http = require('http');
const app = require('./app');

console.log(process.env.PORT);

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      	return val;
    }
    if (port >= 0) {
      	return port;
    }
    return false;
};

let port = normalizePort('2999');
if(process.env.NODE_ENV === 'production'){
	if(process.env.PORT){
		port = normalizePort(process.env.PORT);
	}
}

app.set('port', port);
  
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      	throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
    }
};

const server = http.createServer(app);
  
server.on('error', errorHandler);
server.on('listening', () => {
    console.log('Listening on port ' + port);
});
  
server.listen(port);