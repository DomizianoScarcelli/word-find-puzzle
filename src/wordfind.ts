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

	// let checkMatrixEquality = (matrix1: string[][], matrix2: string[][]): { result: boolean; counter: number } => {
	// 	let counter = 0
	// 	for (let y = 0; y < rows; y++) {
	// 		for (let x = 0; x < cols; x++) {
	// 			if (matrix1[y][x] !== matrix2[y][x]) counter++
	// 		}
	// 	}
	// 	return { result: counter == 0, counter: counter }
	// }

	let gridVersioning: GridInfo = {
		info: [
			{
				grid: emptyMatrix(),
				insertedWords: [],
			},
		],
		push: (grid: string[][], word: string, wordPath: Point[]): void => {
			const info: GridInfo["info"][0] = {
				grid: JSON.parse(JSON.stringify(grid)),
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
			return JSON.parse(JSON.stringify(gridVersioning.getLatestVersion().grid))
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

	let pendingGrid = gridVersioning.getGrid()

	let getEmptyCoordinates = (): Point[] => {
		let coordinates: Point[] = []
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (pendingGrid[y][x] == "") coordinates.push({ x: x, y: y })
			}
		}
		return coordinates
	}

	let getPossibilities = (): Coordinates[] => {
		//TODO: Do not add already visited possibilities
		const possibilities = []
		for (let { x, y } of getEmptyCoordinates()) {
			for (let direction in Directions) {
				const coordinates: Coordinates = { x: x, y: y, direction: Directions[direction] }
				possibilities.push(coordinates)
			}
		}
		return possibilities
	}

	let pickRandomValues = (): { word: string; coordinates: Coordinates } => {
		const possibilities = getPossibilities()
		// console.log(`Possibilities: ${possibilities.length}`)
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
		let wordList: string[] = []
		for (let length = 4; length <= maxLength; length++) {
			wordList = wordList.concat(wordOccurrencies[`${length}`])
		}
		const wordPath: Point[] = getCompatibleWordPath(maxLength, coordinates)
		let regex: string = ""
		for (let { x, y } of wordPath) {
			if (pendingGrid[y][x] !== "") regex += pendingGrid[y][x]
			else regex += "."
		}
		const compiledRegex: RegExp = new RegExp(regex)
		const matchingWords: string[] = wordList.filter((word) => compiledRegex.test(word))
		// console.log(`Matching words: ${matchingWords.length}`)
		if (matchingWords.length === 0) return { word: "", wordPath: [] }
		const random = Math.floor(Math.random() * matchingWords.length)
		const word = matchingWords[random]
		return { word: word, wordPath: wordPath }
	}

	let startRecursiveWordPicking = (maxLength: number, coordinates: Coordinates, possibilities: Coordinates[]): { word: string; coordinates: Coordinates } => {
		const { word, wordPath } = pickWord(maxLength, coordinates)
		if (word === "") {
			possibilities = possibilities.filter((coordinate) => coordinate !== coordinates)
			for (let newCoordinates of possibilities) {
				const newMaxWordLength: number = getMaximumWordLength(newCoordinates)
				return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities)
			}
			// console.log(`Grid length: ${gridVersioning.getLength()}`)
			console.log("Backtracking")
			pendingGrid = gridVersioning.pop()
			return pickRandomValues()
		} else {
			gridVersioning.push(pendingGrid, word, wordPath)
			return { word, coordinates }
		}
	}

	let fillGrid = (): { grid: string[][]; insertedWords: string[]; finalWord: string } => {
		while (getEmptyCoordinates().length > finalWordLenght) {
			let { word, coordinates }: { word: string; coordinates: Coordinates } = pickRandomValues()
			// console.log(word)
			let { x, y, direction }: { x: number; y: number; direction: Directions } = coordinates
			switch (direction) {
				case Directions.RIGHT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y][x + i] = word[i]
					}
					break
				case Directions.LEFT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y][x - i] = word[i]
					}
					break
				case Directions.UP:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y - i][x] = word[i]
					}
					break
				case Directions.DOWN:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y + i][x] = word[i]
					}
					break
				case Directions.UP_RIGHT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y - i][x + i] = word[i]
					}
					break
				case Directions.UP_LEFT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y - i][x - i] = word[i]
					}
					break
				case Directions.DOWN_RIGHT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y + i][x + i] = word[i]
					}
					break
				case Directions.DOWN_LEFT:
					for (let i = 0; i < word.length; i++) {
						pendingGrid[y + i][x - i] = word[i]
					}
					break
				default:
					throw Error(`Direction ${direction} doesn't exist`)
			}
		}

		let finalWord = insertLastWord()

		return { grid: pendingGrid, insertedWords: gridVersioning.getInsertedWords(), finalWord: finalWord }
	}

	let insertLastWord = (): string => {
		//TODO: if doesn't exist a final word, backtrack
		const emptyCoordinates: Point[] = getEmptyCoordinates()
		const finalWordArray: string[] = wordOccurrencies[`${emptyCoordinates.length}`]
		const finalWord: string = finalWordArray[Math.floor(Math.random() * finalWordArray.length)]
		// console.log(emptyCoordinates)
		// console.log(finalWord)
		for (let i = 0; i < finalWord.length; i++) {
			const { x, y } = emptyCoordinates[i]
			pendingGrid[y][x] = finalWord[i]
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
