const DATA_TESTS = require("./data");
const minRange = 1;
const maxRange = 3;

exports.getTests = (req, res, next) => {
    console.log('getTests');

	setTimeout(() => {
		res.status(200).json(DATA_TESTS)
    }, (getRandomNumber(minRange, maxRange)*1000));
}
exports.getTest = (req, res, next) => {
	console.log('getTestById', req.params.id);

	const id = req.params.id;
	
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
	}else{
		setTimeout(() => {
			res.status(200).json(test)
		}, (getRandomNumber(minRange, maxRange)*1000));
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


// exports.selectTest = (req, res, next) => {
// 	console.log('selectTest', req.body);

// 	const id = req.body.id;
// 	const test = getTestById(id);
// 	if(!test) {
// 		res.status(404).json({ message: 'test not found' });
// 		return;
// 	}

// 	// TODO: set selected Test if needed

//     res.status(200).json({ message: 'selectTest' })
// }

exports.startTest = (req, res, next) => {
	console.log('startTest', req.body);

	const id = req.body.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

	setTimeout(() => {
        res.status(200).json({ message: 'startTest' })
    }, (getRandomNumber(3, 5)*1000));
}
exports.stopTest = (req, res, next) => {
	console.log('stopTest');

	const id = req.body.id;
	const test = getTestById(id);
	if(!test) {
		res.status(404).json({ message: 'test not found' });
		return;
	}

	setTimeout(() => {
        res.status(200).json({ message: 'stopTest' })
    }, (getRandomNumber(minRange, maxRange)*1000));
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

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}