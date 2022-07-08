//Test the speed of n iteration of the algorithm
const WordFind = require("../src/wordfind")
describe("Execution performance", () => {
	test("Performance of 100 wordfind puzzle creation", () => {
		const NUMBER_OF_TESTS = 100
		const initialTime = performance.now()
		Array(NUMBER_OF_TESTS).forEach((_) => {
			const partialInitialTime = performance.now()
			WordFind().create()
			const partialFinalTime = performance.now()
			expect((partialFinalTime - partialInitialTime) / (1000 * 1)).toBeLessThan(100)
		})
		const finalTime = performance.now()
		const totalTime = finalTime - initialTime
		const average = totalTime / NUMBER_OF_TESTS
		expect(average).toBeLessThan(50)
	})
})

//TODO: Test if a random generated wordfind puzzle is solvable
