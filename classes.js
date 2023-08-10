class DIPTest {
	id = '';
	label = '';
	image = '';
	logFile = '';
	steps = [];

	constructor(id, label, image, logFile = '', steps = []) {
		this.id = id;
		this.label = label;
		this.image = image;
		this.logFile = logFile;
		steps?.forEach(elem => {
			this.steps.push(new DIPTestStep(elem.id, elem.label, elem.commands));
		});
	}
}

class DIPTestStep {
	id = '';
	label = '';
	commands = [];

	constructor(id, label, commands = []) {
		this.id = id;
		this.label = label;
		this.commands = commands;
	}
}

module.exports = {
	DIPTest: DIPTest,
	DIPTestStep: DIPTestStep,
  };