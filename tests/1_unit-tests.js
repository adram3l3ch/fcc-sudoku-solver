const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
	test('Logic handles a valid puzzle string of 81 characters', async () => {
		assert.isOk(
			await solver.validate(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
			),
			'not accepting an unsolved valid puzzle'
		);
		assert.isOk(
			await solver.validate(
				'135762984946381257728459613694517832812936745357824196473298561581673429269145378'
			),
			'not accepting a solved valid puzzle'
		);
		assert.isOk(await solver.validate(new Array(81).fill('.').join('')));
	});

	test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', async () => {
		solver
			.validate(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16.?..926914.37.'
			)
			.catch(error =>
				assert.deepEqual(
					error,
					{ error: 'Invalid characters in puzzle' },
					'Not throwing error on invalid character (?)'
				)
			);

		solver
			.validate(
				'1.5..2.84..63.12.7.2..5.....9..1....8.0.3674.3.7.2..9.47...8..1..16....926914.37.'
			)
			.catch(error =>
				assert.deepEqual(
					error,
					{ error: 'Invalid characters in puzzle' },
					'Not throwing error on invalid number (0)'
				)
			);
	});

	test('Logic handles a puzzle string that is not 81 characters in length', async () => {
		solver
			.validate(
				'1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
			)
			.catch(error =>
				assert.deepEqual(
					error,
					{ error: 'Expected puzzle to be 81 characters long' },
					"Not throwing error if length doesn't meet"
				)
			);
	});

	test('Logic handles a valid row placement', () => {
		assert.isTrue(
			solver.checkRowPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				4
			)
		);
	});

	test('Logic handles an invalid row placement', () => {
		assert.isFalse(
			solver.checkRowPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				7
			)
		);
	});

	test('Logic handles a valid column placement', () => {
		assert.isTrue(
			solver.checkColPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				5
			)
		);
	});

	test('Logic handles an invalid column placement', () => {
		assert.isFalse(
			solver.checkColPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				8
			)
		);
	});

	test('Logic handles a valid region (3x3 grid) placement', () => {
		assert.isTrue(
			solver.checkRegionPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				3
			)
		);
	});

	test('Logic handles an invalid region (3x3 grid) placement', () => {
		assert.isFalse(
			solver.checkRegionPlacement(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
				1,
				0,
				6
			)
		);
	});

	test('Valid puzzle strings pass the solver', () => {
		solver
			.solve(
				'5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
			)
			.then(val => assert.isOk(val));
	});

	test('Invalid puzzle strings fail the solver', () => {
		solver
			.solve(
				'5..91372.3./.8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
			)
			.catch(e => assert.isNotOk(e));

		solver
			.solve(
				'5..91372.3..8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
			)
			.catch(e => assert.isNotOk(e));
	});

	test('Solver returns the expected solution for an incomplete puzzle', () => {
		solver
			.solve(
				'..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
			)
			.then(solution =>
				assert.equal(
					solution,
					'218396745753284196496157832531672984649831257827549613962415378185763429374928561'
				)
			);
	});
});
