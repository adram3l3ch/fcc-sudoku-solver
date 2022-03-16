'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { checkConflicts, extractColRow } = require('./helper.js');
let solver = new SudokuSolver();

module.exports = function (app) {
	app.route('/api/check').post(async (req, res) => {
		const { puzzle, coordinate, value } = req.body;
		try {
			const { col, row } = await extractColRow(+value, coordinate);
			const conflict = checkConflicts(puzzle, row, col, +value);
			if (conflict.length) res.json({ valid: false, conflict });
			else res.json({ valid: true });
		} catch (error) {
			console.log(error);
			res.json(error);
		}
	});

	app.route('/api/solve').post(async (req, res) => {
		const puzzleString = req.body.puzzle;
		try {
			await solver.validate(puzzleString);
			const solution = solver.solve(puzzleString);
			if (solution) res.json({ solution });
			else res.json({ error: 'Puzzle cannot be solved' });
		} catch (error) {
			res.json(error);
			return;
		}
	});
};
