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
					'command 1.1',
					'command 1.2',
					'command 1.3',
				]
			},
			{
				id: 2,
				label: 'Step 2',
				commands: [
					'command 2.1',
					'command 2.2',
					'command 2.3',
					'command 2.4',
				]
			},
			{
				id: 3,
				label: 'Step 3',
				commands: [
					'command 3.1',
					'command 3.2',
				]
			},
			{
				id: 4,
				label: 'Step 4',
				commands: [
					'command 1',
					'command 2',
					'command 3',
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