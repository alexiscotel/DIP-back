const DATA_TESTS = [
	{
		id: 'test-1', 
		label: 'TEST 1',
		image: 'assets/dip.png',
		logFile: 'test1.log', // date;test-id;step-id;command-id;'info'|'debug'|'warn'|'err';logTrace
		statusFile: 'status1.json', // status: number = < 0: error, 0: pending, > 0: success
		/** contenu du fichier de status (status1.json)
		 * {
		 * tests: [
		 * {
		 * 	id: 'id-test-1', 
		 * 	status: < 0: arreté, 0: pause, > 0: démaré
		 * 	progress: 10,
		*   steps :[
			"id-step-1": [
		* 		{id: 'id-cmd-1', status: 1},
		* 		{id: 'id-cmd-2', , status: -1},
		* 		{id: 'id-cmd-3', , status: 0},
		*   ],
		    "id-step-2": [
		* 		{id: 'id-cmd-1', status: 1},
		* 		{id: 'id-cmd-2', , status: -1},
		* 		{id: 'id-cmd-3', , status: 0},
		*   ]
		]
		 * },
		 * 	
		 * }
		 */
		steps: [
			{
				id: 1,
				label: 'Step 1',
				commands: [
					{id: 1, command: 'echo "command 1.1"', poidPercent: 10},
					'echo "command 1.1" >> test1.log',
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