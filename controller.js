const fileSystem = require('fs');
const path = require('path');

const { exec } = require('child_process');

const WebSocket = require('ws');
const connectedClients = new Set();
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

	const {status, message} = listenDIPTest(DIPTest);
	if(!status) {
		res.write("après traitement 1 KO");
		// res.status(500).json({message: message});
	}else{
		res.write("après traitement 1 OK");
		// res.status(200).json({message: message})
	}

	// console.log('DIPTest', DIPTest);

	// console.log('continue with commands execution');
	// next()
	// // res.status(200).json({message: 'continue with commands execution'});


	// // TODO: continue with commands execution = executeTestCommands(DIPTest);
	// // TODO: find a way to get commands execution logs
	executeTestSteps(DIPTest).then((result) => {
		console.log('executeTestCommands then', result);
		res.write("après traitement 2 OK");
	}).catch((error) => {
		console.log('executeTestCommands catch', error);
		res.write("après traitement 2 KO");
	});

	res.end();

	// // const steps = DIPTest.steps;
	// // if(!steps) {
	// // 	console.error('steps is undefined')
	// // 	// res.status(404).json({status: false, message: 'steps is undefined'});
	// // 	res.write('steps is undefined');
	// // }
	// // if(steps.length === 0) {
	// // 	console.error('steps is empty')
	// // 	// res.status(404).json({status: false, message: 'steps is empty'});
	// // 	res.write('steps is empty')
	// // }


	
	// // for (const step of steps) {
	// // 	try {
	// // 		executeStep(step).then((result) => {
	// // 			console.log('executeStep then :', result);
	// // 			res.status(200).json({message: 'executeStep success'});
	// // 		}).catch((error) => {
	// // 			console.log('executeStep catche error :', error);
	// // 			res.status(500).json({message: 'executeStep catch error'});
	// // 		});
	// // 	} catch (error) {
	// // 		console.error('executeStep try catch error', error);
	// // 		res.status(500).json({message: 'executeStep try catch error'});
	// // 	}
	// // }
}



exports.stopTest = (req, res, next) => {
	console.log('try to stop test "'+req.params.id+'"');
	stopWebSocketServer().then((result) => {

		if(result.status) {
			console.log('stop server 200 : '+result.message)
			res.status(200).json({message: result.message})
		}else{
			console.log('stop server 500 : '+result.message)
			res.status(500).json({message: result.message});
		}
	}).catch((error) => {
		console.log('stopWebSocketServer', error);
		res.status(500).json(error);
	});
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


function listenDIPTest(DIPTest) {
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
		connectedClients.add(websocket);
		
		// READ LOG FILE
		const logFilePath = path.join(__dirname, '/test/'+DIPTest.logFile);
		const sendLogUpdates = () => {
			fileSystem.readFile(logFilePath, 'utf8', (err, data) => {
				if (err) {
					console.error('Error reading log file:', err);
					return;
				}
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
			connectedClients.delete(websocket);
			if(logFileWatcher){
				logFileWatcher.close();
				logFileWatcher = null;
				console.log('logFileWatcher closed')
			}
			websocket.close();
			console.log('WebSocket connection closed');
		});

		websocket.on('error', console.error);
		
	});
	return {status: true, message: 'listenDIPTest ('+DIPTest.id+')'};
}
async function stopWebSocketServer() {
	if(!websocketInstance) {
		console.log('WebSocket instance not started');
		return {status: false, message: 'WebSocket instance not started'};
	}

	await websocketInstance.clients.forEach((socket) => {
		// Soft close
		socket.close();
		process.nextTick(() => {
			if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
				// Socket still hangs, hard close
				socket.terminate();
			}
		});
	});

	websocketInstance.close();
	websocketInstance = null;
	let message = 'WebSocket server stoped';

	if(logFileWatcher){
		logFileWatcher.close();
		logFileWatcher = null;
		message += ' and logFileWatcher stoped';
	}
	return {status: true, message: message};
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


async function executeTestSteps(DIPTest) {
	if(!DIPTest) {
		console.error('DIPTest is undefined')
		return {status: false, message: 'DIPTest is undefined'};
	}

	const steps = DIPTest.steps;

	if(!steps) {
		console.error('steps is undefined')
		return {status: false, message: 'steps is undefined'};
	}
	if(steps.length === 0) {
		console.error('steps is empty')
		return {status: false, message: 'steps is empty'};
	}
	
	for (const step of steps) {
		try {
			let {status, message} = await executeStep(step);
			console.log('executeStep', status, message);
		} catch (error) {
			console.error('executeStep', error);
			return {status: false, message: error};
		}
	}
}

async function executeStep(DIPTestStep) {

	if(!DIPTestStep) {
		console.error('DIPTestStep is undefined')
		return {status: false, message: 'DIPTestStep is undefined'};
	}
	const commands = DIPTestStep.commands;
	if(!commands) {
		console.error('commands is undefined')
		return {status: false, message: 'commands is undefined'};
	}
	if(commands.length === 0) {
		console.error('commands is empty')
		return {status: false, message: 'commands is empty'};
	}

	for (const command of commands) {
        try {
            const { stdout, stderr } = await executeCommand(command);
            console.log('Sortie de la commande :', stdout);
            if (stderr) {
                console.error(`Sortie standard d'erreur : ${stderr}`);
				
            }
			// TODO: send stdout to websocket
			if(stdout){
				// websocketInstance.clients.forEach((socket) => {
				// 	if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
				// 		socket.send(JSON.stringify(stdout));
				// 	}
				// });
			}
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande "${command}" : ${error}`);
        }
    }
	return {status: true, message: 'executeStep ('+DIPTestStep.id+') OK'};

}

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}
