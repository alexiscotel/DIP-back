const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');

let connectedClients = new Set();

let websocketInstance = new WebSocket.Server({server: server});
websocketInstance.on('connection', (websocket) => {
	console.log('new WebSocket connection established');
	connectedClients.add(websocket);

	// WEBSOCKET EVENTS
	websocket.on('message', (message) => {
		console.log('received: %s', message);
		connectedClients.forEach((client) => {
			if (client !== websocket && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});

	websocket.on('close', () => {
		console.log('WebSocket connection closed');
	});

	websocket.on('error', console.error);
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

server.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});