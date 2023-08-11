const fileSystem = require('fs');
const path = require('path');
const { exec } = require('child_process');
const WebSocket = require('ws');

const DATA_TESTS = require("./data");
const { DIPTest, DIPTestStep } = require('./classes');


let websocketInstance = new WebSocket.Server({ port: 8080 });
websocketInstance.on('connection', (websocket) => {
	console.log('new WebSocket connection established');
	connectedClients.add(websocket);

	// WEBSOCKET EVENTS
	websocket.on('close', () => {
		console.log('WebSocket connection closed');
	});

	websocket.on('error', console.error);

	websocket.send(JSON.stringify({message: '_OK_'}));
	// currentResponse.status(200).json({message: 'test started'})
});


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




	// console.log('try to start test "'+req.params.id+'"');

	// const id = req.params.id;
	// const DIPTest = getTestById(id);
	// if(!DIPTest) {
	// 	res.status(404).json({ message: 'test not found' });
	// 	return;
	// }

	// const {status, message} = listenTestLogs(DIPTest);
	// if(!status) {
	// 	res.status(500).json({message: message});
	// }else{
	// 	res.status(200).json({message: message})
	// }

	// TODO: continue with commands execution = executeTestCommands(DIPTest);
	// TODO: find a way to get commands execution logs
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


function listenTestLogs(DIPTest) {
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


// async function executeTestCommands(DIPTest) {
// 	if(!DIPTest) {
// 		console.error('DIPTest is undefined')
// 		return {status: false, message: 'DIPTest is undefined'};
// 	}

// 	const commands = DIPTest.commands;
// 	if(!commands) {
// 		console.error('commands is undefined')
// 		return {status: false, message: 'commands is undefined'};
// 	}

// 	if(commands.length === 0) {
// 		console.error('commands is empty')
// 		return {status: false, message: 'commands is empty'};
// 	}

// 	await executeCommands(commands);
// }
// async function executeCommands(commands) {

//     for (const command of commands) {
//         try {
//             const { stdout, stderr } = await executeCommand(command);
//             console.log('Sortie de la commande :');
//             console.log(stdout);
//             if (stderr) {
//                 console.error(`Erreur de sortie standard d'erreur : ${stderr}`);
//             }
//         } catch (error) {
//             console.error(`Erreur lors de l'exécution de la commande "${command}" : ${error}`);
//         }
//     }
// }
// function executeCommand(command) {
//     return new Promise((resolve, reject) => {
//         exec(command, (error, stdout, stderr) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve({ stdout, stderr });
//             }
//         });
//     });
// }



exports.listenTest = (req, res, next) => {
	console.log('listenTest')
	const test = new DIPTest(
		req.body.id, 
		req.body.label, 
		req.body.image,
		req.body.logFile,
		req.body.steps
	);

	const logFileName = test.logFile;
	const commands = test.steps[0].commands;
	const command = commands[0];

	const commandProcess = exec(command);

	commandProcess.stdout.on('data', (data) => {
		console.log('stdout: ' + data.toString());
		// Envoi des sorties stdout au client via WebSocket
		websocketInstance.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data.toString());
			}
		});
	});

	commandProcess.stderr.on('data', (data) => {
		console.log('stderr: ' + data.toString());
		// Envoi des sorties stderr au client via WebSocket
		websocketInstance.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data.toString());
		}
		});
	});

	commandProcess.on('close', (code) => {
		console.log('child process exited with code ' + code.toString());
		// Chargement du contenu du fichier de log et envoi au client
		loadLogFileContent(logFileName, (logContent) => {
			res.status(200).json({ log: logContent });
		});
	});

	commandProcess.on('error', (error) => {
		console.error(`Erreur d'exécution de la commande : ${error}`);
		res.status(500).json({ error: 'Erreur d\'exécution des commandes.' });
	});



	// wss = new WebSocket.Server({ port: 8080 });
	// wss.on('connection', (socket) => {
	// 	console.log('Client connected');
	// });
	// const test = new DIPTest(
	// 	req.body.id, 
	// 	req.body.label, 
	// 	req.body.image,
	// 	req.body.logFile,
	// 	req.body.steps
	// );

	// console.log('test : ', test);

	// executeSteps(test, (result) => {
	// 	console.log('executeSteps result : ', result);
	// 	// res.status(200).send(result);
	// });
};

// Fonction pour charger le contenu du fichier de log
function loadLogFileContent(logFileName, callback) {
	console.log('loadLogFileContent');
	return;
	// Implémentez ici la logique pour charger le contenu du fichier de log
	// et appelez le callback avec le contenu.
}

// function executeSteps(DIPTest, callback) {
// 	console.log('executeSteps for test '+DIPTest.id);

// 	if(!DIPTest) {
// 		console.error('DIPTest is undefined')
// 		return {status: false, message: 'DIPTest is undefined'};
// 	}
// 	if(!DIPTest.steps) {
// 		console.error('DIPTest.steps is undefined')
// 		return {status: false, message: 'DIPTest.steps is undefined'};
// 	}
// 	if(DIPTest.steps.length === 0) {
// 		console.error('DIPTest.steps is empty')
// 		return {status: false, message: 'DIPTest.steps is empty'};
// 	}

// 	DIPTest.steps.forEach(DIPTestStep => {
// 		executeStep(DIPTestStep, (result) => {
// 			console.log('executeStep result : ', result);
// 			// res.status(200).send(logContent);
// 		});
// 	});
// }

// function executeStep(DIPTestStep, callback) {
// 	console.log('executeStep : ', DIPTestStep.label);

// 	if(!DIPTestStep) {
// 		console.error('DIPTestStep is undefined')
// 		return {status: false, message: 'DIPTestStep is undefined'};
// 	}

// 	if(!DIPTestStep.commands) {
// 		console.error('DIPTestStep.commands is undefined')
// 		return {status: false, message: 'DIPTestStep.commands is undefined'};
// 	}

// 	if(DIPTestStep.commands.length === 0) {
// 		console.error('DIPTestStep.commands is empty')
// 		return {status: false, message: 'DIPTestStep.commands is empty'};
// 	}

// 	DIPTestStep.commands.forEach(command => {

// 		exec(command, (error, stdout, stderr) => {
// 			console.log(stdout);

// 			// Envoi des logs au client via WebSocket
// 			wss.clients.forEach((client) => {
// 				if (client.readyState === WebSocket.OPEN) {
// 					client.send(stdout);
// 				}
// 			});

// 			if (error) {
// 				console.error(`Erreur d'exécution de la commande : ${error}`);
// 				// res.status(500).send('Erreur d\'exécution des commandes.');
// 				// return;
// 			}
// 		});
// 	});
// }
