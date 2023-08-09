const fileSystem = require('fs');
const path = require('path');

const WebSocket = require('ws');
let websocketInstance = null;
let logFileWatcher = null;

const DATA_TESTS = require("./data");

exports.getTests = (req, res, next) => {
    console.log('getTests');
	res.status(200).json(DATA_TESTS)
}
exports.getTest = (req, res, next) => {
	console.log('getTestById', req.params.id);	
	const test = getTestById(req.params.id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
	}else{
		setTimeout(() => {
			res.status(200).json(test)
		}, (getRandomNumber(minRange, maxRange)*1000));
	}
}


exports.startTest = (req, res, next) => {
	console.log('try to start test "'+req.params.id+'"');

	const id = req.params.id;
	const DIPTest = getTestById(id);
	if(!DIPTest) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

	const {status, message} = startDIPTest(DIPTest);
	if(!status) {
		res.status(500).json({ message: message });
	}else{
		res.status(200).json({ message: message })
	}
}
exports.stopTest = (req, res, next) => {
	console.log('stopTest');

	// const id = req.params.id;
	// const test = getTestById(id);
	// if(!test) {
	// 	res.status(404).json({ message: 'test not found' });
	// 	return;
	// }

	const {status, message} = stopWebSocketServer();
	if(status) {
		res.status(200).json({ message: message })
	}else{
		res.status(500).json({ message: message });
	}
}

// FUNCTIONS
function getTestById(id) {
	if(!id) {
		console.error('id is required')
		return;
	}

	// find test by id in DATA_TESTS
	const test = DATA_TESTS.find(test => test.id === id);
	if(!test) {
		console.error('test not found')
		return;
	}

	return DATA_TESTS.find(test => test.id === id);
}


function startDIPTest(DIPTest) {
	console.log('start DIP Test ('+DIPTest.id+')');

	if(!DIPTest.logFile) {
		console.error('logFile is required')
		return {status: false, message: 'logFile is required'};
	}else{
		// check if file exists
		const logFile = DIPTest.logFile;
		const filePath = __dirname + '/test/' + logFile;
		if (!fileSystem.existsSync(filePath)) {
			console.error('logFile "'+logFile+'" not found')
			return {status: false, message: 'logFile "'+logFile+'" not found'};
		}
	}

	InstanciateWebSocketServer();
	if(!websocketInstance) {
		return {status: false, message: 'WebSocket server not started'};
	}
	websocketInstance.on('connection', (websocket) => {
		console.log('new WebSocket connection established');
		
		// READ LOG FILE
		const logFilePath = path.join(__dirname, '/test/'+DIPTest.logFile);
		const sendLogUpdates = () => {
			fileSystem.readFile(logFilePath, 'utf8', (err, data) => {
				console.log('reading log file');
				if (err) {
					console.error('Error reading log file:', err);
					return;
				}
				console.log('send log file data')
				websocket.send(JSON.stringify(data)); // Envoie les données du fichier de log au client WebSocket
			});
		};
		if(logFileWatcher){
			console.warn('logFileWatcher already used. Stoping it ...')
			logFileWatcher.close();
			logFileWatcher = null;
		}
		logFileWatcher = fileSystem.watch(logFilePath, sendLogUpdates);
		sendLogUpdates(); // Envoie les données du fichier de log lors de la première connexion


		// WEBSOCKET EVENTS
		websocket.on('close', () => {
			console.log('WebSocket connection closed');
			if(logFileWatcher)
				logFileWatcher.close();
		});

		websocket.on('error', console.error);

		// websocket.on('open', (data) => {
		// 	console.log('WebSocket connection opened', data);
		// });
		
	});
	return {status: true, message: 'startDIPTest ('+DIPTest.id+')'};
}
function stopWebSocketServer() {
	if(websocketInstance) {
		websocketInstance.close();
		websocketInstance = null;
		let message = 'WebSocket server stoped';
		
		if(logFileWatcher){
			logFileWatcher.close();
			logFileWatcher = null;
			message += ' and logFileWatcher stoped';
		}

		return {status: true, message: message};
	}else{
		return {status: true, message: 'No WebSocket server to stop'};
	}
}

function InstanciateWebSocketServer() {
	if(websocketInstance) {
		console.log('WebSocket server already started. Stoping it ...');
		websocketInstance.close();
		websocketInstance = null;
	}
	
	websocketInstance = new WebSocket.Server({ port: 8080,  }); // Port de votre choix
	if(!websocketInstance) {
		console.error('WebSocket server failed to start');
		return {status: false, message: 'WebSocket server failed to start'}
	}else{
		console.log('WebSocket server started');
		return {status: true, message: 'WebSocket server started'}
	}
}