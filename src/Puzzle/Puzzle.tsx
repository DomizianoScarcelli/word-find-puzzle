import { useEffect, useState } from "react"
import { convertMatrixTo1D, getCoordinatesFromIndex, getIndexFromCoordinates, pickRandomColor } from "./puzzleHelper"
import { Background, Grid, InsertedWordSquare, Letter, Square, SubTitle, Title, VerticalList, Word } from "./style"
import { useWordFind } from "./useWordFind"

export default function Puzzle() {
	const wordFind = useWordFind()
	const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
	const [isDragging, setDragging] = useState<boolean>(false)
	const [grid, setGrid] = useState<string[]>([])
	const [N, setN] = useState<number>(0)
	const [wordsFound, setWordsFound] = useState<string[]>([])
	const [wordsFoundMap, setWordsFoundMap] = useState<Map<number[], string>>(new Map())

	useEffect(() => {
		try {
			const { grid: matrix } = wordFind.create()
			console.log(wordFind.getInsertedWords())
			setN(matrix.length)
			setGrid(convertMatrixTo1D(matrix))
		} catch {
			//TODO: maybe find a better way to solve this problem. The code appears to be running twice and so it causes an exception (maybe with useCallback)
		}
	}, [])

	const handleMouseDown = (index: number) => {
		setDragging(true)
		setSelectedIndexes([index])
	}
	const handleMouseUp = () => {
		setDragging(false)
		setSelectedIndexes([])
		checkSelectedWord()
	}

	const handleMouseMove = (index: number) => {
		if (isDragging) {
			selectValidLetters(selectedIndexes[0], index)
		}
	}

	const checkSelectedWord = () => {
		let word = ""
		let listOfIndexes: number[] = []
		selectedIndexes.forEach((index) => {
			word += grid[index]
			listOfIndexes.push(index)
		})
		if (wordFind.getInsertedWords().includes(word)) {
			setWordsFound([...wordsFound, word])
			setWordsFoundMap((map) => map.set(selectedIndexes, pickRandomColor()))
			console.log(wordsFoundMap)
		}
	}

	const selectValidLetters = (startIndex: number, endIndex: number): void => {
		const { x: startX, y: startY } = getCoordinatesFromIndex(startIndex, N)
		const { x: endX, y: endY } = getCoordinatesFromIndex(endIndex, N)
		const tempSelectedIndexes = []
		if (startX !== endX && startY !== endY) {
			// Diagonal
			if (startX < endX) {
				if (startY < endY) {
					// DOWNRIGHT
					for (let i = 0; i <= endX - startX; i++) {
						tempSelectedIndexes.push(getIndexFromCoordinates(startX + i, startY + i, N))
					}
					setSelectedIndexes(tempSelectedIndexes)
				} else {
					//UPRIGHT
					for (let i = 0; i <= endX - startX; i++) {
						tempSelectedIndexes.push(getIndexFromCoordinates(startX + i, startY - i, N))
					}
					setSelectedIndexes(tempSelectedIndexes)
				}
			} else {
				if (startY < endY) {
					//UPLEFT, N
					for (let i = 0; i <= startX - endX; i++) {
						tempSelectedIndexes.push(getIndexFromCoordinates(startX - i, startY + i, N))
					}
					setSelectedIndexes(tempSelectedIndexes)
				} else {
					//DOWNLEFT
					for (let i = 0; i <= startX - endX; i++) {
						tempSelectedIndexes.push(getIndexFromCoordinates(startX - i, startY - i, N))
					}
					setSelectedIndexes(tempSelectedIndexes)
				}
			}
		}
		if (startX === endX && startY !== endY) {
			// Vertical
			if (startY < endY) {
				//DOWN
				for (let i = startY; i <= endY; i++) {
					tempSelectedIndexes.push(getIndexFromCoordinates(startX, i, N))
				}
				setSelectedIndexes(tempSelectedIndexes)
			} else {
				//UP
				for (let i = startY; i >= endY; i--) {
					tempSelectedIndexes.push(getIndexFromCoordinates(startX, i, N))
				}
				setSelectedIndexes(tempSelectedIndexes)
			}
		}
		if (startX !== endX && startY === endY) {
			// Horizontal
			if (startX < endX) {
				//RIGHT
				for (let i = startX; i <= endX; i++) {
					tempSelectedIndexes.push(getIndexFromCoordinates(i, startY, N))
				}
				setSelectedIndexes(tempSelectedIndexes)
			} else {
				//LEFT
				for (let i = startX; i >= endX; i--) {
					tempSelectedIndexes.push(getIndexFromCoordinates(i, startY, N))
				}
				setSelectedIndexes(tempSelectedIndexes)
			}
		}
	}

	const handleSolvedPuzzle = () => {}

	return (
		<>
			<Title>
				WordSearch Puzzle <SubTitle> by Domiziano Scarcelli</SubTitle>
			</Title>
			<Background>
				<Grid letters={N}>
					{grid.map((letter, index) => (
						<Letter key={index} onMouseMove={() => handleMouseMove(index)} onMouseDown={() => handleMouseDown(index)} onMouseUp={() => handleMouseUp()}>
							{letter.toUpperCase()}
							{Array.from(wordsFoundMap.entries()).map(([wordIndexes, color]) =>
								wordIndexes.map((wordIndex) => wordIndex === index && <InsertedWordSquare indexes={wordIndexes} index={index} color={color} N={N} />)
							)}
							{selectedIndexes.map((wordIndex) => wordIndex === index && <Square selectedIndexes={selectedIndexes} index={index} N={N} />)}
						</Letter>
					))}
				</Grid>

				<VerticalList>
					{wordFind.getInsertedWords().map((word) => (
						<Word word={word} wordsFound={wordsFound}>
							{word}
						</Word>
					))}
				</VerticalList>
			</Background>
		</>
	)
}
