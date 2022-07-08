import WordFind from "../src/wordfind"

//Test the speed of n iteration of the algorithm
describe("Execution performance", () => {
	test.skip("Performance of 50 wordfind puzzle creation", () => {
		const NUMBER_OF_TESTS = 50
		const initialTime = performance.now()
		for (let index = 0; index < NUMBER_OF_TESTS; index++) {
			const partialInitialTime = performance.now()
			WordFind().create()
			const partialFinalTime = performance.now()
			expect((partialFinalTime - partialInitialTime) / (1000 * 1)).toBeLessThan(15)
		}
		const finalTime = performance.now()
		const totalTime = (finalTime - initialTime) / (1000 * 1)
		const average = totalTime / NUMBER_OF_TESTS
		expect(average).toBeLessThan(5)
	})
})

//TODO: Test if a random generated wordfind puzzle is solvable
describe("Puzzle creation", () => {
	test.skip("A created puzzle is solvable", () => {})
})
