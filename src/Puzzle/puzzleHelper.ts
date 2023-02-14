export const pickRandomColor = () => {
	var letters = "0123456789ABCDEF"
	var color = "#"
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

export const convertMatrixTo1D = (matrix: string[][]): string[] => {
	let array: string[] = []
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[0].length; x++) {
			array.push(matrix[y][x])
		}
	}
	return array
}

export const calculateBorderRadius = (selectedIndexes: number[], currentIndex: number, N: number): string => {
	const direction = getDirection(selectedIndexes[0], selectedIndexes[1], N)
	const BORDER_RADIUS: number = 30
	const borderTemplate = (topLeft: boolean, topRight: boolean, bottomRight: boolean, bottomLeft: boolean): string =>
		`${topLeft ? BORDER_RADIUS : 0}px ${topRight ? BORDER_RADIUS : 0}px ${bottomRight ? BORDER_RADIUS : 0}px ${bottomLeft ? BORDER_RADIUS : 0}px`
	const isFirstIndex = (): boolean => currentIndex === selectedIndexes[0]
	const isLastIndex = (): boolean => currentIndex === selectedIndexes[selectedIndexes.length - 1]
	if (direction.includes("RIGHT") || direction === "DOWN") {
		if (isFirstIndex()) return borderTemplate(true, false, false, true)
		if (isLastIndex()) return borderTemplate(false, true, true, false)
	}
	if (direction.includes("LEFT") || direction === "UP") {
		if (isFirstIndex()) return borderTemplate(false, true, true, false)
		if (isLastIndex()) return borderTemplate(true, false, false, true)
	}
	return "0px"
}

export const calculateRotation = (selectedIndexes: number[], N: number): string => {
	const direction = getDirection(selectedIndexes[0], selectedIndexes[1], N)
	switch (direction) {
		case "UPLEFT":
		case "DOWNRIGHT":
			return "rotate(45deg);"
		case "UPRIGHT":
		case "DOWNLEFT":
			return "rotate(-45deg);"
		case "UP":
		case "DOWN":
			return "rotate(90deg);"
	}
	return "none"
}

export const getDirection = (currentIndex: number, nextIndex: number, N: number): string => {
	const { x: currX, y: currY } = getCoordinatesFromIndex(currentIndex, N)
	const { x: nextX, y: nextY } = getCoordinatesFromIndex(nextIndex, N)
	if (nextX === currX + 1) {
		if (nextY === currY) return "RIGHT"
		if (nextY === currY + 1) return "DOWNRIGHT"
		if (nextY === currY - 1) return "UPRIGHT"
	}
	if (nextX === currX - 1) {
		if (nextY === currY) return "LEFT"
		if (nextY === currY + 1) return "DOWNLEFT"
		if (nextY === currY - 1) return "UPLEFT"
	}

	if (nextX === currX) {
		if (nextY === currY) return "STILL"
		if (nextY === currY + 1) return "DOWN"
		if (nextY === currY - 1) return "UP"
	}
	return "NODIRECTION"
}

export const getCoordinatesFromIndex = (index: number, N: number): { x: number; y: number } => {
	return { y: Math.floor(index / N), x: index % N }
}

export const getIndexFromCoordinates = (x: number, y: number, N: number): number => {
	return y * N + x
}
