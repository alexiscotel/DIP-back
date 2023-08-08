const DATA_TESTS = require("./data");


exports.getTests = (req, res, next) => {
    console.log('getTests');
	console.log(DATA_TESTS);
    res.status(200).json(DATA_TESTS)
}
exports.getTest = (req, res, next) => {
	console.log('getTestById', req.params.id);

	const id = req.params.id;
	
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
	}else{
		res.status(200).json(test)
	}
}

exports.getTestLogById = (req, res, next) => {
	console.log('getTestLogById', req.params.id);

	const id = req.params.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

	// read log file
	const logFile = test.logFile;
	if(!logFile) {
		res.status(404).json({ message: 'no log file for this test' });
		return;
	}

	// send log file
	res.status(200).json({ message: 'getTestLogById' })
}


exports.selectTest = (req, res, next) => {
	console.log('selectTest', req.body);

	const id = req.body.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

	// TODO: set selected Test if needed

    res.status(200).json({ message: 'selectTest' })
}

exports.startTest = (req, res, next) => {
	console.log('startTest');

	const id = req.body.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

    res.status(200).json({ message: 'startTest' })
}
exports.stopTest = (req, res, next) => {
	console.log('stopTest');

	const id = req.body.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

    res.status(200).json({ message: 'stopTest' })
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