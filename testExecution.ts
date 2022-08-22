import WordFind from "./src/wordfind"

const testPerformances = (iterationLimit, numberOfTests) => {
	const time1 = performance.now()
	for (let count = 0; count < numberOfTests; count++) {
		const wordFind = WordFind({ iterationLimit: iterationLimit })
		const { grid, insertedWords } = wordFind.create()
		wordFind.clear()
	}
	const time2 = performance.now()
	return (time2 - time1) / numberOfTests
}

// let testResults: { iterations: number; time: number }[] = []

// for (let i = 15; i < 150; i += 5) {
// 	testResults.push({ iterations: i, time: testPerformances(i, 200) })
// }

// console.log(JSON.stringify(testResults))

const testHowManyIterations = (numberOfTests) => {
	let iterationSum = 0
	let iterationMap: Map<number, number> = new Map()
	for (let count = 0; count < numberOfTests; count++) {
		const wordFind = WordFind({ rows: 11, cols: 11, iterationLimit: 500 })
		const { iterations } = wordFind.create()
		iterationMap.set(iterations, iterationMap.get(iterations)! + 1 || 1)
		iterationSum += iterations
		wordFind.clear()
	}
	const averageIterations = iterationSum / numberOfTests
	console.log(averageIterations)
	return iterationMap
}

// console.log(testHowManyIterations(15))

console.log(testPerformances(30, 750))
