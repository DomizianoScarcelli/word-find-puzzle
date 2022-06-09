// Global state
let mouseDown = false
document.body.onmousedown = () => {
	mouseDown = true
}
document.body.onmouseup = () => {
	mouseDown = false
}

let permanentlyActivatedNodes = []
let puzzle = createWordGrid()
let wordList = puzzle[1]
let activatedNodes = []

function createPuzzle() {
	const grid = puzzle[0]
	renderWordGrid(grid)
	const letters = document.querySelectorAll(".letter")
	setupListeners(letters)
}

function createWordGrid() {
	return [
		[
			["C", "A", "N", "E", "A", "Z", "A", "A", "A"],
			["A", "A", "A", "A", "A", "A", "A", "A", "A"],
			["A", "A", "A", "A", "A", "M", "A", "A", "A"],
			["A", "A", "A", "A", "A", "P", "A", "A", "A"],
			["A", "A", "A", "A", "A", "A", "A", "A", "A"],
			["A", "A", "A", "A", "A", "A", "A", "A", "A"],
			["A", "A", "A", "A", "B", "A", "A", "A", "A"],
			["A", "A", "A", "A", "A", "A", "A", "A", "A"],
			["A", "A", "A", "A", "A", "A", "A", "A", "A"],
		],
		["CANE", "ZAMPA"],
	]
}

function renderWordGrid(wordGrid) {
	const grid = document.querySelector(".grid")
	for (let y = 0; y < wordGrid.length; y++) {
		const nodeRow = document.createElement("div")
		nodeRow.className = "row"
		for (let x = 0; x < wordGrid[y].length; x++) {
			const nodeLetter = document.createElement("div")
			nodeLetter.className = "letter"
			nodeLetter.id = `${y},${x}`
			nodeLetter.innerHTML = wordGrid[y][x]
			nodeRow.appendChild(nodeLetter)
		}
		grid.appendChild(nodeRow)
	}
}

function activateNode(node) {
	if (!permanentlyActivatedNodes.includes(node)) {
		activatedNodes.push(node)
	}
	validatedNodes = validateActivatedNodes(activatedNodes)
	validatedNodes.forEach((activatedNode) => (activatedNode.className = "letter activated"))
}

function deactivateNodes(nodes) {
	if (wordList.includes(getWord(activatedNodes)) || wordList.includes(getWord(activatedNodes).split("").reverse().join(""))) {
		activatedNodes.forEach((node) => permanentlyActivatedNodes.push(node))
		permanentlyActivatedNodes.forEach((node) => {
			node.className = "letter activated"
		})
	}
	nodes.forEach((node) => {
		if (!permanentlyActivatedNodes.includes(node)) {
			node.className = "letter"
		}
		activatedNodes = []
	})
}

function setupListeners(nodes) {
	nodes.forEach((node) => {
		node.addEventListener("mouseenter", () => {
			if (mouseDown) {
				activateNode(node)
			}
		})
	})
	document.body.addEventListener("mouseup", () => deactivateNodes(nodes))
}

function getCoordinates(node) {
	x = parseInt(node.id.split(",")[1])
	y = parseInt(node.id.split(",")[0])
	return [y, x]
}

function getWord(activatedNodes) {
	return activatedNodes.map((node) => node.innerHTML).join("")
}

function validateActivatedNodes(activatedNodes) {
	let resultArray = []
	if (activatedNodes.length < 2) return activatedNodes
	currX = getCoordinates(activatedNodes[0])[1]
	currY = getCoordinates(activatedNodes[0])[0]
	nextX = getCoordinates(activatedNodes[1])[1]
	nextY = getCoordinates(activatedNodes[1])[0]

	console.log(currX + 1, nextX)

	//Horizontal word
	if (nextY === currY && (nextX === currX + 1 || nextX === currX - 1)) {
		for (let activatedNode of activatedNodes) {
			if (getCoordinates(activatedNode)[0] == currY) {
				resultArray.push(activatedNode)
			}
		}
	}

	//Vertical word
	if (nextX === currX && (nextY === currY + 1 || nextY === currY - 1)) {
		for (let activatedNode of activatedNodes) {
			if (getCoordinates(activatedNode)[1] == currX) {
				resultArray.push(activatedNode)
			}
		}
	}

	//Diagonal word
	//TODO: currY = currY + 1 and currX = currX + 1 or -1

	return resultArray
}

createPuzzle()
