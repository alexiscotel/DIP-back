const DATA_TESTS = [
	{
		id: 'test-1', 
		label: 'TEST 1',
		image: 'assets/dip.png',
		logFile: 'test1.log',
		steps: [
			{
				id: 1,
				label: 'Step 1',
				commands: [
					'echo "command 1.1"',
					'echo "command 1.2"',
					'echo "command 1.3"',
				]
			},
			{
				id: 2,
				label: 'Step 2',
				commands: [
					'echo "command 2.1"',
				]
			},
			{
				id: 3,
				label: 'Step 3',
				commands: [
					'echo "command 3.1"',
					'echo "command 3.2"',
				]
			},
			{
				id: 4,
				label: 'Step 4',
				commands: [
					'echo "command 4.1"',
					'echo "command 4.2"',
					'echo "command 4.3"',
					'echo "command 4.4"',
					'echo "command 4.5"',
				]
			},
		]
	},
	{
		id: 'test-2', 
		label: 'TEST 2', 
		image: 'assets/dip.png',
		// logFile: 'test-2.log',
		steps: [
			{
				id: 1,
				label: 'Test 2 - Step 1',
				commands: ['command 1.1']
			},
			{
				id: 2,
				label: 'Test 2 - Step 2',
				commands: ['command 2.1']
			},
			{
				id: 3,
				label: 'Test 2 - Step 3',
				commands: ['command 3.1']
			},
		]
	},
	{
		id: 'test-3', 
		label: 'TEST 3', 
		image: 'assets/dip.png',
		// logFile: 'test-3.log',
		steps: []
	},
];

module.exports = DATA_TESTS;