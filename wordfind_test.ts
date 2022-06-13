function WordFind(rows: number, cols: number) {
	this.rows = rows
	this.cols = cols
	this.grid = Array(9).fill(Array(9).fill(""))
}

WordFind.prototype.getEmptyCoordinates = function (): number[][] {
	let coordinates: number[][] = []
	for (let y = 0; y < this.rows; y++) {
		for (let x = 0; x < this.cols; x++) {
			if (this.grid[y][x] === "") coordinates.push([x, y])
		}
	}
	return coordinates
}

export default WordFind

function init() {
	const wordFind = new WordFind(10, 10)
	console.log(wordFind.getEmptyCoordinates())
}

init()

// const GridVersioning = {
// 	gridVersions: { previousGrids: [], insertedWords: [] },
// 	/**
// 	 * Removes and returns the last version of the grid
// 	 * @returns the removed elements from the list
// 	 */
// 	pop: (): string[][] => {
// 		return GridVersioning.gridVersions.previousGrids.pop()
// 	},
// 	add: (grid: string[][]): void => {
// 		GridVersioning.gridVersions.previousGrids.push(grid)
// 	},
// }

// const Wordfind = {
// 	grid: Array(9).fill(Array(9).fill("")),
// 	ROWS: 10,
// 	COLS: 10,
// 	wordsToFind: [],
// 	DIRECTIONS: ["RIGHT", "LEFT", "UP", "DOWN", "UP_RIGHT", "UP_LEFT", "DOWN_RIGHT", "DOWN_LEFT"],
// 	getEmptyCoordinates: (grid: string[][]): number[][] => {
// 		let coordinates: number[][] = []
// 		for (let y = 0; y < Wordfind.ROWS; y++) {
// 			for (let x = 0; x < Wordfind.COLS; x++) {
// 				if (grid[y][x] === "") coordinates.push([x, y])
// 			}
// 		}
// 		return coordinates
// 	},
// 	getPossibilities: (): number | string[][] => {
// 		let possibilities = []
// 		for (let coordinates of Wordfind.getEmptyCoordinates(Wordfind.grid)) {
// 			for (let direction of Wordfind.DIRECTIONS) {
// 				possibilities.push([coordinates[0], coordinates[1], direction])
// 			}
// 		}
// 		return possibilities
// 	},
// }

// interface Choice {}

// const CreatePuzzle = {
// 	pickRandomValues: (grid: string[][]): number | string[][] => {
// 		let possibilities = Wordfind.getPossibilities()
// 		return possibilities
// 	},
// }

// const init = () => {
// 	GridVersioning.add(Wordfind.grid)
// 	console.log(CreatePuzzle.pickRandomValues(Wordfind.grid))
// }

// init()
