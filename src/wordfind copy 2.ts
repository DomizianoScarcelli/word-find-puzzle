import * as wordOccurrencies from "../data/word_occurrencies.json"

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

	let finalWordLength: number = 6

	let choices: Map<String, String[]> = new Map()

	let copyMatrix = (matrix: string[][]): string[][] => {
		return JSON.parse(JSON.stringify(matrix))
	}

	let compareCoordinates = (c1: Coordinates, c2: Coordinates): boolean => {
		return c1.x === c2.x && c1.y === c2.y && c1.direction === c2.direction
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
	let insertedWords: string[] = []

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

	//TODO: big bug as always
	let pickWord = (maxLength: number, coordinates: Coordinates): { words: string[]; wordPath: Point[] } => {
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) wordList = wordList.concat(wordOccurrencies[`${length}` as keyof typeof wordOccurrencies])
		const wordPath = getCompatibleWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let { x, y } of wordPath) {
			if (grid[y][x] !== "") regex += grid[y][x]
			else regex += ".?"
		}
		// const choice = { coordinates: coordinates, regex: regex }
		// const visitedWords = choices.has(JSON.stringify(choice)) ? choices.get(JSON.stringify(choice)) : []
		const visitedWords = []
		const matchingWords: string[] = wordList.filter((word) => new RegExp(regex).test(word) && !insertedWords.includes(word) && !visitedWords.includes(word))
		// choices.set(JSON.stringify(choice), [...visitedWords, ...matchingWords])
		if (matchingWords.length === 0) return { words: [], wordPath: [] }
		return { words: shuffle(matchingWords).filter((word) => word != undefined), wordPath: wordPath }
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
		var j, x, i
		for (i = array.length - 1; i > 0; i--) {
			j = Math.round(Math.random() * (i + 1))
			x = array[i]
			array[i] = array[j]
			array[j] = x
		}
		return array
	}

	let fillGrid = (): { grid: string[][]; insertedWords: string[] } | boolean => {
		const backtrackMatrixCopy = copyMatrix(grid)
		const backtrackInsertedWordCopy = [...insertedWords]
		const possibilites = shuffle(getPossibilities()).filter((possibility) => possibility != undefined)
		if (getEmptyCoordinates().length <= finalWordLength) return true
		for (let possibility of possibilites) {
			const maxWordLength = getMaximumWordLength(possibility)
			const { words } = pickWord(maxWordLength, possibility)
			if (words.length !== 0) {
				for (let word of words) {
					console.log(`Inserted: ${insertedWords}`)
					grid = addWordToGrid(grid, word, possibility)
					insertedWords.push(word)

					if (fillGrid()) return { grid: grid, insertedWords: insertedWords }
					grid = copyMatrix(backtrackMatrixCopy)
					insertedWords.pop()
				}
			}
		}
		return false
	}

	let pprint = (grid) => {
		console.log("------------")
		grid.forEach((row) => {
			let string = ""
			row.forEach((element) => {
				string += element
			})
			console.log(string)
		})
		console.log("------------")
	}

	// let insertLastWord = (): string => {
	// 	//TODO: if doesn't exist a final word, backtrack
	// 	const emptyCoordinates: Point[] = getEmptyCoordinates()
	// 	const finalWordArray: string[] = wordOccurrencies[`${emptyCoordinates.length}` as keyof typeof wordOccurrencies]
	// 	const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
	// 	for (let i = 0; i < finalWord.length; i++) {
	// 		const { x, y } = emptyCoordinates[i]
	// 		grid[y][x] = finalWord[i]
	// 	}
	// 	return finalWord
	// }

	// let getWordPath = (wordToFind: string): Point[] => {
	// 	for (let { word, wordPath } of gridVersioning.getLatestVersion().insertedWords) {
	// 		if (wordToFind === word) return wordPath
	// 	}
	// 	return [{ x: -1, y: -1 }]
	// }

	// let wordHint = (wordToFind: string): Point => {
	// 	return getWordPath(wordToFind)[0]
	// }

	return { fillGrid }
})()

export default WordFind

console.log(WordFind.fillGrid())
