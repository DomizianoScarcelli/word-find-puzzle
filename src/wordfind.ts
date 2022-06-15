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

	let copyMatrix = (matrix: string[][]): string[][] => {
		return matrix.map((row) => {
			return row.map(function (element) {
				return element.slice()
			})
		})
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
				//TODO: grid must be deepcopied
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
			if (gridVersioning.getLength() > 1) gridVersioning.info.pop()
			return gridVersioning.getGrid()
		},
		getGrid: (): string[][] => {
			return gridVersioning.getLatestVersion().grid
		},
		getLatestVersion: (): GridInfo["info"][0] => {
			console.log(`Grid length: ${gridVersioning.getLength()}`)
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

	let getEmptyCoordinates = (): Point[] => {
		const grid: string[][] = gridVersioning.getGrid()
		let coordinates: Point[] = []
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x] == "") coordinates.push({ x: x, y: y })
			}
		}
		return coordinates
	}

	let getPossibilities = (): Coordinates[] => {
		const possibilities = []
		for (let { x, y } of getEmptyCoordinates()) {
			for (let direction in Directions) {
				possibilities.push({ x: x, y: y, direction: direction })
			}
		}
		return possibilities
	}

	let pickRandomValues = (): { word: string; coordinates: Coordinates } => {
		//TODO: change naming
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
		console.log(`Matching words: ${matchingWords.length}`)
		if (matchingWords.length === 0) return { word: "", wordPath: [] }
		const random = Math.floor(Math.random() * matchingWords.length)
		const word = matchingWords[random]
		return { word: word, wordPath: wordPath }
	}

	let startRecursiveWordPicking = (maxLength: number, coordinates: Coordinates, possibilities: Coordinates[]): { word: string; coordinates: Coordinates } => {
		const { word, wordPath } = pickWord(maxLength, coordinates)
		// console.log(`Partial chosen word: ${word}`)
		// console.log(`Possibilities: ${possibilities.length}`)
		if (word === "") {
			possibilities = possibilities.filter((coordinate) => coordinate !== coordinates)
			for (let newCoordinates of possibilities) {
				const newMaxWordLength: number = getMaximumWordLength(newCoordinates)
				return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities)
			}
			//TODO: backtrack doesn't work
			console.log("Backtracking")
			gridVersioning.pop()
			return pickRandomValues()
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
		//TODO: if doesn't exist a final word, backtrack
		let grid: string[][] = gridVersioning.getGrid()
		const emptyCoordinates: Point[] = getEmptyCoordinates()
		const finalWordArray: string[] = wordOccurrencies[`${emptyCoordinates.length}`]
		// if (finalWordArray == undefined || finalWordArray.length === 0) {
		// 	gridVersioning.pop()
		// 	pickRandomValues()
		// 	return "TEST"
		// }
		const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
		console.log(emptyCoordinates)
		console.log(finalWord)
		for (let i = 0; i < finalWord.length; i++) {
			const { x, y } = emptyCoordinates[i]
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
console.log(values)
