const SudokuSolver = require('../controllers/sudoku-solver');

let solver = new SudokuSolver();

const checkConflicts = (puzzle, row, col, value) => {
	const conflict = [];
	if (!solver.checkRowPlacement(puzzle, row, col, value)) conflict.push('row');
	if (!solver.checkColPlacement(puzzle, row, col, value)) conflict.push('column');
	if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflict.push('region');
	return conflict;
};

const extractColRow = (puzzle, value, coordinate) => {
	return new Promise((resolve, reject) => {
		if (+value > 9 || +value < 1 || (isNaN(value) && value !== undefined))
			reject({ error: 'Invalid value' });
		if (!value || !coordinate || !puzzle) reject({ error: 'Required field(s) missing' });
		if (coordinate.length > 2) reject({ error: 'Invalid coordinate' });

		const col = coordinate[1] - 1;
		const row = coordinate.toLowerCase().charCodeAt() - 97;

		if (isNaN(col) || isNaN(row) || 0 > row || row > 8 || 0 > col || col > 8)
			reject({ error: 'Invalid coordinate' });
		resolve({ row, col });
	});
};

module.exports = { checkConflicts, extractColRow };
