import * as wordOccurrencies from "../data/word_occurrencies.json"

interface GridInfo {
	info: [
		{
			grid: string[][]
			insertedWords: { word: string; wordPath: Point[] }[]
		}
	]
	push: Function
	pop: Function
	getGrid: Function
	getLatestVersion: Function
	getInsertedWords: Function
	getLength: Function
}
interface Coordinates {
	x: number
	y: number
	direction: Directions
}

interface Point {
	x: number
	y: number
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
		push: (grid: string[][], word: string, wordPath: Point[]): void => {
			const info: GridInfo["info"][0] = {
				grid: grid,
				insertedWords: [
					...gridVersioning.getLatestVersion().insertedWords,
					{
						word: word,
						wordPath: wordPath,
					},
				],
			}
			gridVersioning.info.push(info)
		},
		pop: (): GridInfo["info"][0] => {
			return gridVersioning.getGrid()
		},
		getGrid: (): string[][] => {
			return gridVersioning.getLatestVersion().grid
		},
		getLatestVersion: (): GridInfo["info"][0] => {
			return gridVersioning.info[gridVersioning.getLength() - 1]
		},
		getInsertedWords: (): string[] => {
			if (gridVersioning.getLength() === 0) return []
			let words = []
			for (let { word } of gridVersioning.getLatestVersion().insertedWords) {
				words.push(word)
			}

			return words
		},
		getLength: (): number => {
			return gridVersioning.info.length
		},
	}

	let getEmptyCoordinates = (): number[][] => {
		const grid: string[][] = gridVersioning.getGrid()
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

	let getCompatibleWordPath = (maxLength: number, coordinates: Coordinates): Point[] => {
		let wordPath: Point[] = []
		const { x, y, direction }: { x: number; y: number; direction: Directions } = coordinates
		switch (direction) {
			case Directions.RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x + i, y: y })
				}
				return wordPath
			case Directions.LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x - i, y: y })
				}
				return wordPath
			case Directions.UP:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x, y: y - i })
				}
				return wordPath
			case Directions.DOWN:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x, y: y + i })
				}
				return wordPath
			case Directions.UP_RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x + i, y: y - i })
				}
				return wordPath
			case Directions.UP_LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x - i, y: y - i })
				}
				return wordPath
			case Directions.DOWN_RIGHT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x + i, y: y + i })
				}
				return wordPath
			case Directions.DOWN_LEFT:
				for (let i = 0; i < maxLength; i++) {
					wordPath.push({ x: x - i, y: y + i })
				}
				return wordPath
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
	}

	let pickWord = (maxLength: number, coordinates: Coordinates): { word: string; wordPath: Point[] } => {
		const grid: string[][] = gridVersioning.getGrid()
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) {
			wordList = wordList.concat(wordOccurrencies[`${length}`])
		}
		const wordPath: Point[] = getCompatibleWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let { x, y } of wordPath) {
			if (grid[y][x] !== "") regex += grid[y][x]
			else regex += "."
		}
		const compiledRegex: RegExp = new RegExp(regex)
		const matchingWords: string[] = wordList.filter((word) => compiledRegex.test(word))
		if (matchingWords.length === 0) return { word: "", wordPath: [] }
		const random = Math.floor(Math.random() * matchingWords.length)
		const word = matchingWords[random]
		return { word: word, wordPath: wordPath }
	}

	let startRecursiveWordPicking = (maxLength: number, coordinates: Coordinates, possibilities: Coordinates[]): { word: string; coordinates: Coordinates } => {
		const { word, wordPath } = pickWord(maxLength, coordinates)
		if (word === "") {
			possibilities = possibilities.filter((coordinate) => coordinate !== coordinates)
			if (possibilities.length === 0) {
				//Backtracking
				if (gridVersioning.getLength() > 0) gridVersioning.pop()
				return pickRandomValues()
			}
			const newCoordinates: Coordinates = possibilities[Math.floor(Math.random() * possibilities.length)]
			const newMaxWordLength: number = getMaximumWordLength(newCoordinates)
			return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities)
		} else {
			gridVersioning.push(gridVersioning.getGrid(), word, wordPath)
			return { word, coordinates }
		}
	}

	let fillGrid = (): { grid: string[][]; insertedWords: string[]; finalWord: string } => {
		const grid: string[][] = gridVersioning.getGrid()
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

			return { grid: grid, insertedWords: gridVersioning.getInsertedWords(), finalWord: finalWord }
		}
	}

	let insertLastWord = (): string => {
		let grid: string[][] = gridVersioning.getGrid()
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

	let getWordPath = (wordToFind: string): Point[] => {
		for (let { word, wordPath } of gridVersioning.getLatestVersion().insertedWords) {
			if (wordToFind === word) return wordPath
		}
		return [{ x: 0, y: 0 }]
	}

	let wordHint = (wordToFind: string): Point => {
		return getWordPath(wordToFind)[0]
	}

	return { fillGrid, getWordPath, gridVersioning }
})()

const values = WordFind.fillGrid()
const WORDS = WordFind.gridVersioning.getInsertedWords()
const wordPath = WordFind.getWordPath(WORDS[1])
console.log(values)
console.log(wordPath)
