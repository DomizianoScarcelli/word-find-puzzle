import * as wordOccurrencies from "../data/word_occurrencies.json"

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

	let finalWordLenght: number = 8

	let emptyMatrix = (): string[][] => {
		let grid = []
		for (let y = 0; y < rows; y++) {
			let row = []
			for (let x = 0; x < cols; x++) {
				row.push("")
			}
			grid.push(row)
		}
		return grid
	}

	let gridVersioning: GridInfo = {
		info: [
			{
				grid: emptyMatrix(),
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
		const grid: string[][] = gridVersioning.info[gridVersioning.info.length - 1].grid
		let coordinates: number[][] = []
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x] == "") coordinates.push([x, y])
			}
		}
		return coordinates
	}

	let getPossibilities = (): Coordinates[] => {
		const possibilities = []
		for (let coordinates of getEmptyCoordinates()) {
			for (let direction in Directions) {
				possibilities.push({ x: coordinates[0], y: coordinates[1], direction: direction })
			}
		}
		return possibilities
	}

	let pickRandomValues = (): { word: string; coordinates: Coordinates } => {
		const possibilities = getPossibilities()
		const random: number = Math.floor(Math.random() * possibilities.length)
		const coordinates: Coordinates = possibilities[random]
		const maxWordLength: number = getMaximumWordLength(coordinates)
		return startRecursiveWordPicking(maxWordLength, coordinates, possibilities)
	}

	let getMaximumWordLength = (coordinates: Coordinates): number => {
		const { x, y, direction }: { x: number; y: number; direction: Directions } = coordinates
		switch (direction) {
			case Directions.RIGHT:
				return cols - x
			case Directions.LEFT:
				return x + 1
			case Directions.UP:
				return y + 1
			case Directions.DOWN:
				return rows - y
			case Directions.UP_RIGHT:
				return Math.min(y + 1, cols - x)
			case Directions.UP_LEFT:
				return Math.min(y + 1, x + 1)
			case Directions.DOWN_RIGHT:
				return Math.min(rows - y, cols - y)
			case Directions.DOWN_LEFT:
				return Math.min(rows - y, x + 1)
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
	}

	let getWordPath = (maxLength: number, coordinates: Coordinates): [x: number, y: number][] => {
		let wordPath: [x: number, y: number][] = []
		const { x, y, direction }: { x: number; y: number; direction: Directions } = coordinates
		switch (direction) {
			case Directions.RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x + i, y])
				}
				return wordPath
			case Directions.LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x - i, y])
				}
				return wordPath
			case Directions.UP:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x, y - i])
				}
				return wordPath
			case Directions.DOWN:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x, y + i])
				}
				return wordPath
			case Directions.UP_RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x + i, y - i])
				}
				return wordPath
			case Directions.UP_LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x - i, y - i])
				}
				return wordPath
			case Directions.DOWN_RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x + i, y + i])
				}
				return wordPath
			case Directions.DOWN_LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push([x - i, y + i])
				}
				return wordPath
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
	}

	let pickWord = (maxLength: number, coordinates: Coordinates): string => {
		const grid: string[][] = gridVersioning.info[gridVersioning.info.length - 1].grid
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) {
			wordList = wordList.concat(wordOccurrencies[`${length}`])
		}
		const wordPath: number[][] = getWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let point of wordPath) {
			let x: number = point[0]
			let y: number = point[1]
			if (grid[y][x] !== "") regex += grid[y][x]
			else regex += "."
		}
		const compiledRegex: RegExp = new RegExp(regex)
		const matchingWords: string[] = wordList.filter((word) => compiledRegex.test(word))
		if (matchingWords.length === 0) return ""
		const random = Math.floor(Math.random() * matchingWords.length)
		const word = matchingWords[random]
		return word
	}

	let startRecursiveWordPicking = (maxLength: number, coordinates: Coordinates, possibilities: Coordinates[]): { word: string; coordinates: Coordinates } => {
		const word = pickWord(maxLength, coordinates)
		if (word === "") {
			possibilities = possibilities.filter((coordinate) => coordinate !== coordinates)
			if (possibilities.length === 0) {
				//Backtracking
				if (gridVersioning.info.length > 0) gridVersioning.pop()
				return pickRandomValues()
			}
			const newCoordinates: Coordinates = possibilities[Math.floor(Math.random() * possibilities.length)]
			const newMaxWordLength: number = getMaximumWordLength(newCoordinates)
			return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities)
		} else {
			gridVersioning.info.push({
				grid: [...gridVersioning.info[gridVersioning.info.length - 1].grid],
				insertedWords: [...gridVersioning.info[gridVersioning.info.length - 1].insertedWords, word],
			})
			return { word, coordinates }
		}
	}

	let fillGrid = (): { grid: string[][]; insertedWords: string[]; finalWord: string } => {
		const grid: string[][] = gridVersioning.info[gridVersioning.info.length - 1].grid
		let { word, coordinates }: { word: string; coordinates: Coordinates } = pickRandomValues()
		console.log(word)
		let { x, y, direction }: { x: number; y: number; direction: Directions } = coordinates
		switch (direction) {
			case Directions.RIGHT:
				for (let i = 0; i < word.length; i++) {
					grid[y][x + i] = word[i]
				}
				break
			case Directions.LEFT:
				for (let i = 0; i < word.length; i++) {
					grid[y][x - i] = word[i]
				}
				break
			case Directions.UP:
				for (let i = 0; i < word.length; i++) {
					grid[y - i][x] = word[i]
				}
				break
			case Directions.DOWN:
				for (let i = 0; i < word.length; i++) {
					grid[y + i][x] = word[i]
				}
				break
			case Directions.UP_RIGHT:
				for (let i = 0; i < word.length; i++) {
					grid[y - i][x + i] = word[i]
				}
				break
			case Directions.UP_LEFT:
				for (let i = 0; i < word.length; i++) {
					grid[y - i][x - i] = word[i]
				}
				break
			case Directions.DOWN_RIGHT:
				for (let i = 0; i < word.length; i++) {
					grid[y + i][x + i] = word[i]
				}
				break
			case Directions.DOWN_LEFT:
				for (let i = 0; i < word.length; i++) {
					grid[y + i][x - i] = word[i]
				}
				break
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
		if (getEmptyCoordinates().length > finalWordLenght) return fillGrid()
		else {
			let finalWord = insertLastWord()

			return { grid: grid, insertedWords: gridVersioning.info[gridVersioning.info.length - 1].insertedWords, finalWord: finalWord }
		}
	}

	let insertLastWord = (): string => {
		let grid: string[][] = gridVersioning.info[gridVersioning.info.length - 1].grid
		const emptyCoordinates: number[][] = getEmptyCoordinates()
		const finalWordArray: string[] = wordOccurrencies[`${emptyCoordinates.length}`]
		const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
		console.log(emptyCoordinates)
		console.log(finalWord)
		for (let i = 0; i < finalWord.length; i++) {
			const x: number = emptyCoordinates[i][0]
			const y: number = emptyCoordinates[i][1]
			grid[y][x] = finalWord[i]
		}
		return finalWord
	}

	return { fillGrid }
})()

const values = WordFind.fillGrid()

console.log(values)
