import * as wordOccurrencies from "../data/example_word_occurrencies.json"

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

// class Coordinates{
// 	public x: number
// 	public y: number
// 	public direction: Directions

// 	constructor(x: number, y: number, direction: Directions) {
// 		this.x = x
// 		this.y = y
// 		this.direction = direction
// 	}
// }

class WordFind {
	private rows: number
	private cols: number
	private finalWordLength: number
	private grid: string[][]
	private wordsToFind: string[]

	constructor(rows: number, cols: number) {
		this.rows = rows
		this.cols = cols
		this.finalWordLength = 8
		this.grid = this.emptyMatrix()
		this.wordsToFind = []
	}

	private emptyMatrix(): string[][]{
		let grid = []
		for (let y = 0; y < this.rows; y++) {
			let row = []
			for (let x = 0; x < this.cols; x++) {
				row.push("")
			}
			grid.push(row)
		}
		return grid
	}

	private copyMatrix(matrix: any[][]): any[][]{
		return JSON.parse(JSON.stringify(matrix))
	}

	private getEmptyCoordinates(): Point[] {
		let coordinates: Point[] = []
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				if (this.grid[y][x] === "") coordinates.push({ x: x, y: y })
			}
		}
		return coordinates
	}

	private getPossibilities(): Coordinates[] {
		let possibilities = []
		for (let { x, y } of this.getEmptyCoordinates()) {
			for (let direction in Directions) {
				const coordinates: Coordinates = { x: x, y: y, direction: Directions[direction as keyof typeof Directions] }
				possibilities.push(coordinates)
			}
		}
		return possibilities
	}

	private pickRandomValues(): { maxWordLength: number; coordinates: Coordinates; possibilites: Coordinates[] } {
		const possibilities = this.getPossibilities()
		if (possibilities.length === 0) {
			// this.grid = gridVersioning.pop()
			return this.pickRandomValues()
		} else {
			const random: number = Math.floor(Math.random() * possibilities.length)
			const coordinates: Coordinates = possibilities[random]
			const maxWordLength: number = this.getMaximumWordLength(coordinates)
			return { maxWordLength: maxWordLength, coordinates: coordinates, possibilites: possibilities }
		}
	}

	private getMaximumWordLength(coordinates: Coordinates): number {
		const { x, y, direction } = coordinates
		switch (direction) {
			case Directions.RIGHT:
				return this.cols - x
			case Directions.LEFT:
				return x + 1
			case Directions.UP:
				return y + 1
			case Directions.DOWN:
				return this.rows - y
			case Directions.UP_RIGHT:
				return Math.min(y + 1, this.cols - x)
			case Directions.UP_LEFT:
				return Math.min(y + 1, x + 1)
			case Directions.DOWN_RIGHT:
				return Math.min(this.rows - y, this.cols - y)
			case Directions.DOWN_LEFT:
				return Math.min(this.rows - y, x + 1)
			default:
				throw Error(`Direction ${direction} doesn't exist`)
		}
	}

	private getCompatibleWordPath(maxLength: number, coordinates: Coordinates): Point[] {
		let wordPath: Point[] = []
		const { x, y, direction } = coordinates
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

	private pickWord(maxLength: number, coordinates: Coordinates): { word: string; wordPath: Point[] } {
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) {
			wordList = wordList.concat(wordOccurrencies[`${length}` as keyof typeof wordOccurrencies])
		}
		const wordPath = this.getCompatibleWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let { x, y } of wordPath) {
			if (this.grid[y][x] !== "") regex += this.grid[y][x]
			else regex += "."
		}
		const compiledRegex: RegExp = new RegExp(regex)
		let regexExaminatedWord = []
		if (examinatedWords.get(regex) !== undefined) regexExaminatedWord = examinatedWords.get(regex)
		const matchingWords: string[] = wordList.filter((word) => compiledRegex.test(word) && !regexExaminatedWord.includes(word) && !gridVersioning.getInsertedWords().includes(word))

		if (matchingWords.length === 0) return { word: "", wordPath: [] }
		const random = Math.floor(Math.random() * matchingWords.length)
		const word = matchingWords[random]
		examinatedWords.set(regex, [...regexExaminatedWord, word])
		return { word: word, wordPath: wordPath }
	}

	 // TODO: there's a BIG bug in here
	 private recursiveWordPicking(maxLength: number, coordinates: Coordinates, possibilities: Coordinates[]): { word: string; coordinates: Coordinates }{
		const { word, wordPath } = this.pickWord(maxLength, coordinates)
		if (word !== "") {
			possibilities = possibilities.filter((coordinate) => !compareCoordinates(coordinate, coordinates))
			for (let newCoordinates of possibilities) {
				const newMaxWordLength: number = this.getMaximumWordLength(newCoordinates)
				const { word: newWord, wordPath: newWordPath } = pickWord(newMaxWordLength, newCoordinates)
				if (newWord !== "") {
					this.grid = this.addWordToGrid(this.grid, newWord, newCoordinates)
					gridVersioning.push(grid, newWord, newWordPath, newCoordinates)
					return { word: newWord, coordinates: newCoordinates }
				}
			}
			console.log("Backtracking")
			this.grid = gridVersioning.pop()
			const { maxWordLength: newMaxWordLength, coordinates: newCoordinates, possibilites: backtrackPossibilities } = pickRandomValues()
			return recursiveWordPicking(newMaxWordLength, newCoordinates, backtrackPossibilities)
		} else {
			this.grid = addWordToGrid(grid, word, coordinates)
			gridVersioning.push(grid, word, wordPath, coordinates)
			return { word, coordinates }
		}
	 }
	private addWordToGrid(grid: string[][], word: string, coordinates: Coordinates): string[][] {
		let { x, y, direction } = coordinates

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
		return grid
	}

	private fillGrid(): { grid: string[][]; insertedWords: string[]; finalWord: string }{
		while (this.getEmptyCoordinates().length > this.finalWordLength) {
			const { maxWordLength, coordinates: firstCoordinates, possibilites } = this.pickRandomValues()
			this.recursiveWordPicking(maxWordLength, firstCoordinates, possibilites)
		}

		return { grid: grid, insertedWords: gridVersioning.getInsertedWords(), finalWord: insertLastWord() }
	}

	private insertLastWord = (): string => {
		//TODO: if doesn't exist a final word, backtrack
		const emptyCoordinates: Point[] = getEmptyCoordinates()
		const finalWordArray: string[] = wordOccurrencies[`${emptyCoordinates.length}` as keyof typeof wordOccurrencies]
		const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
		for (let i = 0; i < finalWord.length; i++) {
			const { x, y } = emptyCoordinates[i]
			grid[y][x] = finalWord[i]
		}
		return finalWord
	}

	private getWordPath(wordToFind: string): Point[]{
		for (let { word, wordPath } of this.wordsToFind) {
			if (wordToFind === word) return wordPath
		}
		return [{ x: -1, y: -1 }]
	}

	private wordHint(wordToFind: string): Point {
		return this.getWordPath(wordToFind)[0]
	}
}


	let compareCoordinates = (c1: Coordinates, c2: Coordinates): boolean => {
		return c1.x === c2.x && c1.y === c2.y && c1.direction === c2.direction
	}

	

	// let gridVersioning: GridInfo = {
	// 	info: [
	// 		{
	// 			grid: emptyMatrix(),
	// 			insertedWords: [],
	// 		},
	// 	],
	// 	push: (grid: string[][], word: string, wordPath: Point[], regex: string): void => {
	// 		const info: GridInfo["info"][0] = {
	// 			grid: copyMatrix(grid),
	// 			insertedWords: [
	// 				...gridVersioning.getLatestVersion().insertedWords,
	// 				{
	// 					word: word,
	// 					wordPath: wordPath,
	// 				},
	// 			],
	// 		}
	// 		gridVersioning.info.push(info)
	// 	},
	// 	pop: (): GridInfo["info"][0] => {
	// 		if (gridVersioning.getLength() > 1) gridVersioning.info.pop()
	// 		return gridVersioning.getGrid()
	// 	},
	// 	getGrid: (): string[][] => {
	// 		return copyMatrix(gridVersioning.getLatestVersion().grid)
	// 	},
	// 	getLatestVersion: (): GridInfo["info"][0] => {
	// 		return gridVersioning.info[gridVersioning.getLength() - 1]
	// 	},
	// 	getInsertedWords: (): string[] => {
	// 		if (gridVersioning.getLength() === 0) return []
	// 		let words = []
	// 		for (let { word } of gridVersioning.getLatestVersion().insertedWords) {
	// 			words.push(word)
	// 		}

	// 		return words
	// 	},
	// 	getLength: (): number => {
	// 		return gridVersioning.info.length
	// 	},
	// }

	// let grid = gridVersioning.getGrid()

	

	

	

	

	


	

	

	

	return { fillGrid, getWordPath, wordHint }
})()

export default WordFind

console.log(WordFind.fillGrid())
