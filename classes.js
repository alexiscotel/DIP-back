export class DIPTest {
	id = '';
	label = '';
	image = '';
	logFile = '';
	steps = [];

	constructor(id, label, image, logFile = '', steps = []) {
		console.log('DIPTest');
		this.id = id;
		this.label = label;
		this.image = image;
		this.logFile = logFile;
		this.steps = steps;
	}

	avancer(){
		console.log('tete');
	}
}

export class DIPTestStep {
	id = '';
	label = '';
	commands = [];

	constructor(id, label, commands = []) {
		console.log('DIPTestStep');
		this.id = id;
		this.label = label;
		this.commands = commands;
	}
}
