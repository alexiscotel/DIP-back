// # > IMPORTS
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const path = require('path');
const { exec } = require('child_process');
const WebSocket = require('ws');
// # < IMPORTS

// # > CONFIG FILES
const CONF = require("./files/conf.json");
const TESTS = require("./files/tests.json");
const STATUS = require("./files/status.json");
const IO = require("./files/io.json");
// # < CONFIG FILES

// # > EXPRESS CONFIG
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
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
// # < WEBSOCKET CONFIG

// # > WEBSOCKET SERVER
const webSocketServer = new WebSocket.Server({ port: PORT_WEBSOCKET });
console.log('WebSocket server listening on port ' + PORT_WEBSOCKET);
/*
* method: broadcast
* @data: the data you wanna send
* @sender: which client/ws/socket is sending
*/
webSocketServer.broadcast = function(data, sender) {
	webSocketServer.clients.forEach(function(client) {
		if (client !== sender) {
			client.send(data)
		}
	})
}
let CLIENTS=[];
let CLIENTSIDS=[];
let id;
webSocketServer.on('connection', function(websocket) {
	console.log('new WebSocket connection established');

	id = Math.random();
	CLIENTS[id] = websocket;
	CLIENTS.push(websocket);
	console.log('user ' + id + ' joined chat')

	// console.log(TESTS);

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
				// websocket.send(JSON.stringify(parsedData));
				break;
			case 'message':
				console.log('message received');
				// websocket.send(JSON.stringify(parsedData));
				webSocketServer.broadcast(JSON.stringify(parsedData), websocket);
				break;
			case 'askLogFile':
				console.log('ask for logFile content');
				readLogFile(websocket, parsedData.data.logFile);
				break;
			case 'readLogFile':
				console.log('want readLogFile');
				break;
			case 'statusFile':
				console.log('want statusFile content');
				break;
			case 'ioFile':
				console.log('want ioFile content');
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
	let readLogFileResponse = {
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
		readLogFileResponse.data.message = 'No filepath provided';
		readLogFileResponse.data.status = false;
		websocket.send(JSON.stringify(readLogFileResponse));
		return;
	}
	

	const logFilePath = path.join(__dirname, '/shared/'+filepath);
	console.log('logFilePath', logFilePath);

	if (!fileSystem.existsSync(logFilePath)) {
		const msg = 'filepath "'+filepath+'" does not exists'
		console.error(msg)
		readLogFileResponse.data.message = msg;
		readLogFileResponse.data.status = false;
		websocket.send(JSON.stringify(readLogFileResponse));
		return;
	}

	const sendLogUpdates = () => {
		console.log('sendLogUpdates')
		fileSystem.readFile(logFilePath, 'utf8', (err, data) => {
			console.log('readFile callback')
			if (err) {
				console.error('Error reading log file:', err);

				readLogFileResponse.data.message = 'Error reading log file:';
				readLogFileResponse.data.status = false;
				readLogFileResponse.data.error = err;
				websocket.send(JSON.stringify(readLogFileResponse));
				return;
			}

			readLogFileResponse.data = data;
			websocket.send(JSON.stringify(readLogFileResponse)); // Envoie les données du fichier de log au client WebSocket
		});
	};
	if(logFileWatcher){
		console.warn('logFileWatcher already used. Stoping it ...')
		logFileWatcher.close();
		logFileWatcher = null;
	}
	logFileWatcher = fileSystem.watch(logFilePath, sendLogUpdates);
	sendLogUpdates(); // Envoie les données du fichier de log lors de la première connexion
}
// # < WEBSOCKET SERVER


module.exports = app;