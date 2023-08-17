// # > IMPORTS
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const path = require('path');
const WebSocket = require('ws');
// # < IMPORTS

// # > CONFIG FILES
const CONF = require("./public/files/conf.json");
const TESTS = require("./public/files/tests.json");
// # < CONFIG FILES

// # > EXPRESS CONFIG
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const buildPath = path.join(__dirname, 'app');
// Servir les fichiers statiques du build en réponse aux requêtes GET
app.use(express.static(buildPath));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// # < EXPRESS CONFIG

// # > HTTP REQUESTS
app.get('/', (req, res) => {
	res.send('Hello World! I have to serve a website here');
	// res.sendFile(path.join(buildPath, 'index.html'));
});
// # < HTTP REQUESTS



// # > WEBSOCKET CONFIG
const PORT_WEBSOCKET = 8080;
let logFileWatcher = null;
let statusFileWatcher = null;
let ioFileWatcher = null;
// # < WEBSOCKET CONFIG

// # > WEBSOCKET SERVER
const webSocketServer = new WebSocket.Server({ port: PORT_WEBSOCKET });
console.log('WebSocket server listening on port ' + PORT_WEBSOCKET);

webSocketServer.on('connection', function(websocket) {
	console.log('new WebSocket connection established');

	const welcomeResponse = {
		sender: 'server',
		type:'join',
		data: {
			message: 'connected to websocket server',
			connected: true,
			tests: TESTS,
		}
	};
	websocket.send(JSON.stringify(welcomeResponse));
	// webSocketServer.broadcast(JSON.stringify(welcomeResponse), websocket);
	
	// On your message callback.
	websocket.on('message', function(data) {
		console.log('received: %s', data)
		if(data === 'ping') {
			websocket.send('pong');
			return;
		}
		const parsedData = JSON.parse(data);

		switch(parsedData.type) {
			case 'join':
				console.log('join received');
				break;
			case 'message':
				console.log('message received');
				webSocketServer.broadcast(JSON.stringify(parsedData), websocket);
				break;
			case 'askLogFile':
				console.log('ask for logFile content');
				readLogFile(websocket, parsedData.data.logFile);
				break;
			case 'askStatusFile':
				console.log('want statusFile content');
				readStatusFile(websocket, parsedData.data.statusFile);
				break;
			case 'askIoFile':
				console.log('want ioFile content');
				readIoFile(websocket, parsedData.data.ioFile);
				break;
			case 'execTest': 
				console.log('want to exec test');
				// const scripts = 'start'| 'stop' | 'pause';

				// // exec conf[scripts]

				break;
			
			default:
				console.log('unknown message received');
				break;
		}
	})

	// websocket.on('close', function() {
	// 	console.log('user ' + CLIENTS[websocket] + ' left chat');
	// 	delete CLIENTS[websocket];
	// });
});

function readLogFile(websocket, filepath) {
	let response = {
		sender: 'server',
		type:'readLogFile',
		data: {
			message: '',
			status: undefined,
			error: undefined,
		}
	};

	if(!filepath){
		console.warn('No filepath provided');
		response.data.message = 'No filepath provided';
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}
	

	const logFilePath = path.join(__dirname, '/public/'+filepath);
	console.log('logFilePath', logFilePath);

	if (!fileSystem.existsSync(logFilePath)) {
		const msg = 'filepath "'+filepath+'" does not exists'
		console.error(msg)
		response.data.message = msg;
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}

	const sendLogUpdates = () => {
		console.log('sendLogUpdates')
		fileSystem.readFile(logFilePath, 'utf8', (err, data) => {
			console.log('sendLogUpdates callback')
			if (err) {
				console.error('Error reading log file:', err);

				response.data.message = 'Error reading log file:';
				response.data.status = false;
				response.data.error = err;
				websocket.send(JSON.stringify(response));
				return;
			}

			response.data = data;
			websocket.send(JSON.stringify(response));
		});
	};
	if(logFileWatcher){
		console.warn('logFileWatcher already used. Stoping it ...')
		logFileWatcher.close();
		logFileWatcher = null;
	}
	logFileWatcher = fileSystem.watch(logFilePath, sendLogUpdates);
	sendLogUpdates();
}


function readStatusFile(websocket, filepath) {
	let response = {
		sender: 'server',
		type:'readStatusFile',
		data: {
			message: '',
			status: undefined,
			error: undefined,
		}
	};

	if(!filepath){
		console.warn('No filepath provided');
		response.data.message = 'No filepath provided';
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}
	

	const filePath = path.join(__dirname, '/public/'+filepath);
	console.log('statusFilePath', filePath);

	if (!fileSystem.existsSync(filePath)) {
		const msg = 'filepath "'+filepath+'" does not exists'
		console.error(msg)
		response.data.message = msg;
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}

	const sendStatusUpdates = () => {
		console.log('sendStatusUpdates')
		fileSystem.readFile(filePath, 'utf8', (err, data) => {
			console.log('sendStatusUpdates callback')
			if (err) {
				console.error('Error reading status file:', err);

				response.data.message = 'Error reading status file:';
				response.data.status = false;
				response.data.error = err;
				websocket.send(JSON.stringify(response));
				return;
			}

			response.data = data;
			websocket.send(JSON.stringify(response));
		});
	};
	if(statusFileWatcher){
		console.warn('statusFileWatcher already used. Stoping it ...')
		statusFileWatcher.close();
		statusFileWatcher = null;
	}
	statusFileWatcher = fileSystem.watch(filePath, sendStatusUpdates);
	sendStatusUpdates();
}


function readIoFile(websocket, filepath) {
	let response = {
		sender: 'server',
		type:'readIoFile',
		data: {
			message: '',
			status: undefined,
			error: undefined,
		}
	};

	if(!filepath){
		console.warn('No filepath provided');
		response.data.message = 'No filepath provided';
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}
	

	const filePath = path.join(__dirname, '/public/'+filepath);
	console.log('ioFilePath', filePath);

	if (!fileSystem.existsSync(filePath)) {
		const msg = 'filepath "'+filepath+'" does not exists'
		console.error(msg)
		response.data.message = msg;
		response.data.status = false;
		websocket.send(JSON.stringify(response));
		return;
	}

	const sendIoUpdates = () => {
		console.log('sendIoUpdates')
		fileSystem.readFile(filePath, 'utf8', (err, data) => {
			console.log('sendIoUpdates callback')
			if (err) {
				console.error('Error reading IO file:', err);

				response.data.message = 'Error reading IO file:';
				response.data.status = false;
				response.data.error = err;
				websocket.send(JSON.stringify(response));
				return;
			}

			response.data = data;
			websocket.send(JSON.stringify(response));
		});
	};
	if(ioFileWatcher){
		console.warn('ioFileWatcher already used. Stoping it ...')
		ioFileWatcher.close();
		ioFileWatcher = null;
	}
	ioFileWatcher = fileSystem.watch(filePath, sendIoUpdates);
	sendIoUpdates();
}
// # < WEBSOCKET SERVER


module.exports = app;