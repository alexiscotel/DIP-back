export class Test {
	id = '';
	label = '';
	image = '';
	logFile = '';
	statusFile = '';

	constructor(id, label, image, logFile = '', statusFile = '') {
		console.log('Test');
		this.id = id;
		this.label = label;
		this.image = image;
		this.logFile = logFile;
		this.statusFile = statusFile;
	}
}
