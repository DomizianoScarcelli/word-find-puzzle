interface GridInfo {
	info: [
		{
			grid: string[][]
			insertedWords: string[]
		}
	]
	push: Function
	pop: Function
}
interface Coordinates {
	x: number
	y: number
	direction: Directions
}

enum Directions {
	RIGHT = "RIGHT",
	LEFT = "LEFT",
	UP = "UP",
	DOWN = "DOWN",
	UP_RIGHT = "UP_RIGHT",
	UP_LEFT = "UP_LEFT",
	DOWN_RIGHT = "DOWN_RIGHT",
	DOWN_LEFT = "DOWN_LEFT",
}

var WordFind = (() => {
	let rows: number = 10,
		cols: number = 10

	let gridVersioning: GridInfo = {
		info: [
			{
				grid: Array(cols).fill(Array(rows).fill("")),
				insertedWords: [],
			},
		],
		push: (gridInfo: GridInfo["info"][0]): void => {
			gridVersioning.info.push(gridInfo)
		},
		pop: (): GridInfo["info"][0] => {
			return gridVersioning.info[-1]
		},
	}

	let getEmptyCoordinates = (): number[][] => {
		let grid: string[][] = gridVersioning.info[gridVersioning.info.length - 1].grid
		let coordinates: number[][] = []
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x] === "") coordinates.push([x, y])
			}
		}
		return coordinates
	}

	let getPossibilities = (): Coordinates[] => {
		let possibilities = []
		for (let coordinates of getEmptyCoordinates()) {
			for (let direction in Directions) {
				possibilities.push([coordinates[0], coordinates[1], direction])
			}
		}
		return possibilities
	}

	let pickRandomValues = (): (number | Coordinates)[] => {
		let possibilities = getPossibilities()
		let random: number = Math.round(Math.random() * possibilities.length)
		let coordinates: Coordinates = possibilities[random]
		let maxWordLength: number = getMaximumWordLength(coordinates)
		return [maxWordLength, coordinates]
	}

	let getMaximumWordLength = (coordinates: Coordinates): number => {
		return 10
	}

	return { rows, cols, getEmptyCoordinates, getPossibilities, pickRandomValues }
})()

console.log(WordFind.pickRandomValues())
