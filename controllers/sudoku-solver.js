const Stack = require('./stack.js');

class SudokuSolver extends Stack {
	constructor() {
		super();
	}

	validate(puzzleString) {
		return new Promise((resolve, reject) => {
			if (puzzleString.length !== 81)
				reject({ error: 'Expected puzzle to be 81 characters long' });
			if (puzzleString.match(/[^1-9.]/)) reject({ error: 'Invalid characters in puzzle' });
			resolve();
		});
	}

	checkRowPlacement(puzzleString, row, column, value) {
		let rowStartInd = row * 9;
		let rowEndInd = rowStartInd + 9;
		for (rowStartInd; rowStartInd < rowEndInd; rowStartInd++) {
			if (+puzzleString[rowStartInd] === value) {
				return false;
			}
		}
		return true;
	}

	checkColPlacement(puzzleString, row, column, value) {
		let colStartInd = column;
		let colEndInd = column + 73;
		for (colStartInd; colStartInd < colEndInd; colStartInd += 9) {
			if (+puzzleString[colStartInd] === value) {
				return false;
			}
		}
		return true;
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		let boxi = Math.floor(row / 3) * 3;
		let boxj = Math.floor(column / 3) * 3;
		for (let x = boxi; x < boxi + 3; x++) {
			for (let y = boxj; y < boxj + 3; y++) {
				if (+puzzleString[x * 9 + y] === value) {
					return false;
				}
			}
		}
		return true;
	}

	isValid(sudoku, i, num) {
		const row = Math.floor(i / 9);
		const col = i % 9;
		return (
			this.checkRowPlacement(sudoku, row, col, num) &&
			this.checkColPlacement(sudoku, row, col, num) &&
			this.checkRegionPlacement(sudoku, row, col, num)
		);
	}

	getPossibilities(sudoku, i) {
		const possibilities = [];
		[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
			if (this.isValid(sudoku, i, num)) {
				possibilities.push(num);
			}
		});
		return possibilities;
	}

	solve(puzzleString) {
		let copy = puzzleString.split('');
		let index = 0;

		while (index < 81) {
			if (copy[index] === '.') {
				const possibilities = this.getPossibilities(copy, index);
				if (possibilities.length === 1) copy[index] = possibilities[0];
				else if (possibilities.length === 0) {
					try {
						this.update();
					} catch (error) {
						this.stack = [];
						return false;
					}
					const top = this.peak();
					copy = [
						...copy.slice(0, top.index),
						top.possibilities[top.current],
						...puzzleString.slice(top.index + 1),
					];
					index = top.index + 1;
					continue;
				} else {
					this.push({ index, possibilities, current: 0 });
					copy[index] = possibilities[0];
				}
			}
			index++;
		}
		this.stack = [];
		return copy.join('');
	}
}

module.exports = SudokuSolver;
