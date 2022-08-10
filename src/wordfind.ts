import * as wordOccurrenciesJSON from "../data/word_occurrencies.json"

interface Coordinates {
	x: number
	y: number
	direction: Directions
}

interface Point {
	x: number
	y: number
}

interface WordFindOptions {
	//TODO: add optional final phrase instead of final word length
	cols?: number //TODO: strict between 4 and 11
	rows?: number
	finalWordLength?: number
	wordsToFind?: string[] //TODO: implementation
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
/**
 *
 * @param options
 * @returns
 */
var WordFind = (options?: WordFindOptions) => {
	/**
	 * Number of rows in the puzzle grid
	 */
	let rows: number = options?.rows || 8
	/**
	 * Number of columns in the puzzle grid
	 */
	let cols: number = options?.cols || 8
	/**
	 * The maximum length that the final word has to be
	 */
	let finalWordLength: number = options?.finalWordLength || 8

	let insertedWords: { word: string; wordPath: Point[] }[] = []

	let choices: Map<String, Map<String, String[]>> = new Map()

	let iterations: number = 0

	const ITERATIONS_LIMIT = Math.max(50, rows * cols)

	let createWordOccurrenciesMap = (): Map<number, string[]> => {
		let map: Map<number, string[]> = new Map()
		for (let elem in wordOccurrenciesJSON) map.set(Number(elem), wordOccurrenciesJSON[elem])
		return map
	}

	const wordOccurrencies = createWordOccurrenciesMap()

	let copyMatrix = (matrix: string[][]): string[][] => {
		return JSON.parse(JSON.stringify(matrix))
	}

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

	let grid = emptyMatrix()

	let getEmptyCoordinates = (): Point[] => {
		let coordinates: Point[] = []
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x] === "") coordinates.push({ x: x, y: y })
			}
		}
		return coordinates
	}

	let getPossibilities = (): Coordinates[] => {
		let possibilities = []
		for (let { x, y } of getEmptyCoordinates()) {
			for (let direction in Directions) {
				const coordinates: Coordinates = { x: x, y: y, direction: Directions[direction as keyof typeof Directions] }
				possibilities.push(coordinates)
			}
		}
		return possibilities
	}

	let getMaximumWordLength = (coordinates: Coordinates): number => {
		const { x, y, direction } = coordinates
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
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x + i, y: y })
				return wordPath
			case Directions.LEFT:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x - i, y: y })
				return wordPath
			case Directions.UP:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x, y: y - i })
				return wordPath
			case Directions.DOWN:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x, y: y + i })
				return wordPath
			case Directions.UP_RIGHT:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x + i, y: y - i })
				return wordPath
			case Directions.UP_LEFT:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x - i, y: y - i })
				return wordPath
			case Directions.DOWN_RIGHT:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x + i, y: y + i })
				return wordPath
			case Directions.DOWN_LEFT:
				for (let i = 0; i < maxLength; i++) wordPath.push({ x: x - i, y: y + i })
				return wordPath
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
	}

	let pickWord = (maxLength: number, coordinates: Coordinates): { words: string[]; wordPath: Point[] } => {
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) wordList = wordList.concat(wordOccurrencies.get(length))
		const wordPath = getCompatibleWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let { x, y } of wordPath) regex += grid[y][x] !== "" ? grid[y][x] : "."
		if (!choices.has(JSON.stringify(coordinates))) choices.set(JSON.stringify(coordinates), new Map())
		let wordRegex = choices.get(JSON.stringify(coordinates))
		const visitedWords = wordRegex.has(regex) ? wordRegex.get(regex) : []
		const matchingWords: string[] = wordList.filter((word) => new RegExp(regex).test(word) && !getInsertedWords().includes(word) && !visitedWords.includes(word))
		wordRegex.set(regex, [...visitedWords, ...matchingWords])
		if (matchingWords.length === 0) return { words: [], wordPath: [] }
		return { words: shuffle(matchingWords), wordPath: wordPath }
	}

	let addWordToGrid = (grid: string[][], word: string, coordinates: Coordinates): string[][] => {
		let { x, y, direction } = coordinates

		switch (direction) {
			case Directions.RIGHT:
				for (let i = 0; i < word.length; i++) grid[y][x + i] = word[i]
				break
			case Directions.LEFT:
				for (let i = 0; i < word.length; i++) grid[y][x - i] = word[i]
				break
			case Directions.UP:
				for (let i = 0; i < word.length; i++) grid[y - i][x] = word[i]
				break
			case Directions.DOWN:
				for (let i = 0; i < word.length; i++) grid[y + i][x] = word[i]
				break
			case Directions.UP_RIGHT:
				for (let i = 0; i < word.length; i++) grid[y - i][x + i] = word[i]
				break
			case Directions.UP_LEFT:
				for (let i = 0; i < word.length; i++) grid[y - i][x - i] = word[i]
				break
			case Directions.DOWN_RIGHT:
				for (let i = 0; i < word.length; i++) grid[y + i][x + i] = word[i]
				break
			case Directions.DOWN_LEFT:
				for (let i = 0; i < word.length; i++) grid[y + i][x - i] = word[i]
				break
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
		return grid
	}

	let shuffle = (array: any[]): any[] => {
		let j: number, x: number, i: number
		for (i = array.length - 1; i > 0; i--) {
			j = Math.round(Math.random() * (i + 1))
			x = array[i]
			array[i] = array[j]
			array[j] = x
		}
		return array.filter((elem) => elem != undefined)
	}

	let fillGrid = (): boolean => {
		if (iterations > ITERATIONS_LIMIT) throw Error("Max number of Iterations")
		const backtrackMatrixCopy = copyMatrix(grid)
		const possibilites = shuffle(getPossibilities())
		if (getEmptyCoordinates().length <= finalWordLength && getEmptyCoordinates().length >= 4) return true
		for (let possibility of possibilites) {
			const maxWordLength = getMaximumWordLength(possibility)
			const { words, wordPath } = pickWord(maxWordLength, possibility)

			for (let word of words) {
				console.log(`Inserted: ${getInsertedWords()}`)
				console.log(iterations)
				iterations++
				grid = addWordToGrid(grid, word, possibility)
				insertedWords.push({ word: word, wordPath: wordPath })
				if (fillGrid()) return true
				grid = copyMatrix(backtrackMatrixCopy)
				insertedWords.pop()
			}
		}
		return false
	}

	let validityCheck = (): void => {
		// TODO: Remove all the words that don't fit inside the grid
		if (!areThereEnoughWordsToInsert()) throw new Error("Not enough words to insert")
	}

	let validateOptions = (): boolean => {
		return true
	}

	let areThereEnoughWordsToInsert = (): boolean => {
		// Enough IFF Number of cells - Number of letters in all the words <= Maximum length of final word
		const wordList = getListOfWords()
		return wordList.length === 0 ? false : cols * rows - wordList.map((elem) => elem.length).reduce((a, b) => a + b) <= finalWordLength
	}

	let create = (): { grid: string[][]; insertedWords: { word: string; wordPath: Point[] }[]; finalWord: string; finalWordPath: Point[] } => {
		validityCheck()
		let gridFilled = false
		let finalWord = ""
		let finalWordPath = []
		try {
			gridFilled = fillGrid()
		} catch {
			clear()
			return create()
		}
		if (!gridFilled) throw new Error("Not enough words to insert")
		let { finalWord: calculatedFinalWord, finalWordPath: calculatedFinalWordPath } = insertLastWord()
		finalWord = calculatedFinalWord
		finalWordPath = calculatedFinalWordPath

		return { grid: grid, insertedWords: insertedWords, finalWord: finalWord, finalWordPath: finalWordPath }
	}

	let clear = () => {
		grid = emptyMatrix()
		insertedWords = []
		choices = new Map()
		iterations = 0
	}

	let insertLastWord = (): { finalWord: string; finalWordPath: Point[] } => {
		const emptyCoordinates: Point[] = getEmptyCoordinates()
		const finalWordArray: string[] = wordOccurrencies.get(emptyCoordinates.length)
		if (finalWordArray.length === 0 && finalWordLength !== 0) {
			throw new Error("Cannot find a final word")
			//TODO: if a final words doesn't exist, backtrack
		}
		const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
		for (let i = 0; i < finalWord.length; i++) {
			const { x, y } = emptyCoordinates[i]
			grid[y][x] = finalWord[i]
		}
		return { finalWord: finalWord, finalWordPath: emptyCoordinates }
	}

	//-------- Modify Settings ---------

	let addWordsToFind = (words: string[]) => {
		for (let word of words) {
			addWordToFind(word)
		}
	}

	let addWordToFind = (word: string) => {
		if (wordOccurrencies.get(word.length) !== undefined) wordOccurrencies.set(word.length, [...wordOccurrencies.get(word.length), word])
		else wordOccurrencies.set(word.length, [word])
	}

	let removeWordsToFind = (words: string[]) => {
		for (let word of words) {
			removeWordToFind(word)
		}
	}

	let removeWordToFind = (word: string) => {
		for (let elem of wordOccurrencies) {
			if (wordOccurrencies.get(elem[0]) !== undefined) {
				wordOccurrencies.set(
					elem[0],
					wordOccurrencies.get(elem[0]).filter((elem) => elem != word)
				)
			}
		}
	}

	//------ Getters ---------

	let getWordPath = (wordToFind: string): Point[] => {
		for (let { word, wordPath } of insertedWords) {
			if (word === wordToFind) return wordPath
		}
		return []
	}

	let getInsertedWords = (): string[] => {
		let insertedWordsArray: string[] = []
		for (let { word } of insertedWords) insertedWordsArray.push(word)
		return insertedWordsArray
	}

	let getGrid = (): string[][] => {
		return copyMatrix(grid)
	}

	let getListOfWords = (): string[] => {
		let wordList = []
		for (let elem of wordOccurrencies) wordList = wordList.concat(wordOccurrencies.get(elem[0]))
		return wordList
	}

	return { create, clear, getWordPath, getGrid, getInsertedWords, addWordToFind, addWordsToFind, getListOfWords, removeWordToFind, removeWordsToFind }
}

export default WordFind
