const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
		chai.request(server)
			.post('/api/solve')
			.send({
				puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, {
					solution:
						'827549163531672894649831527496157382218396475753284916962415738185763249374928651',
				});
				done();
			});
	});

	test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
		chai.request(server)
			.post('/api/solve')
			.send({
				puzzle: '',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Required field missing' });
				done();
			});
	});

	test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
		chai.request(server)
			.post('/api/solve')
			.send({
				puzzle: '82..4..6...16..89./.98315.749.157.............53..4...96.415..81..7632..3...28.51',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
				done();
			});
	});

	test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
		chai.request(server)
			.post('/api/solve')
			.send({
				puzzle: '82..4..6...16..89..98315.749.157.............53..4...96.415..81..7632..3...28.51',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
				done();
			});
	});

	test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
		chai.request(server)
			.post('/api/solve')
			.send({
				puzzle: '82..4..6.4..16..89...98315.749.157............53..4...96.415..81..7632..3...28.51',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
				done();
			});
	});

	test('Check a puzzle placement with all fields: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'a1',
				value: '4',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { valid: true });
				done();
			});
	});

	test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'a5',
				value: '5',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { valid: false, conflict: ['column'] });
				done();
			});
	});

	test('Check a puzzle placement with multiple placement conflict: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'e8',
				value: '8',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { valid: false, conflict: ['column', 'region'] });
				done();
			});
	});

	test('Check a puzzle placement with all placement conflict: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'h2',
				value: '7',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
				done();
			});
	});

	test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: '',
				value: '7',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Required field(s) missing' });
				done();
			});
	});

	test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89..m..5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'h2',
				value: '7',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
				done();
			});
	});

	test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'h2',
				value: '7',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
				done();
			});
	});

	test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'z2',
				value: '7',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Invalid coordinate' });
				done();
			});
	});

	test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
		chai.request(server)
			.post('/api/check')
			.send({
				puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
				coordinate: 'h2',
				value: '15',
			})
			.end((err, res) => {
				assert.deepEqual(res.body, { error: 'Invalid value' });
				done();
			});
	});
});
