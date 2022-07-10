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

describe("Getters and setters", () => {
	test("Get list of words to find", () => {
		//TODO: define a method that clears the list of words to use in order to make this test
	})
	test("Add new words to find", () => {
		const wordFind = WordFind()
		const wordsToFind: string[] = []
		let partialWord: string = ""
		for (let i = 0; i < 100; i++) {
			partialWord += "a"
			wordsToFind.push(partialWord)
		}
		for (let word of wordsToFind) wordFind.addWordToFind(word)
		const wordFind2 = WordFind()
		wordFind2.addWordsToFind(wordsToFind)
		let partialLength = 1
		for (let word of wordsToFind) {
			expect(word.length === partialLength).toBeTruthy()
			expect(wordFind.getListOfWords().includes(word)).toBeTruthy()
			expect(wordFind2.getListOfWords().includes(word)).toBeTruthy()
			partialLength += 1
		}
	})
	test("Remove words to find", () => {
		const wordFind = WordFind()
		const wordFind2 = WordFind()
		const wordsToAdd: string[] = []
		let partialWord: string = ""
		for (let i = 0; i < 100; i++) {
			partialWord += "a"
			wordsToAdd.push(partialWord)
		}
		for (let word of wordsToAdd) wordFind.addWordToFind(word)
		wordFind2.addWordsToFind(wordsToAdd)
		for (let word of wordsToAdd) wordFind.removeWordToFind(word)
		wordFind2.removeWordsToFind(wordsToAdd)
		for (let word of wordsToAdd) {
			expect(wordFind.getListOfWords().includes(word)).toBeFalsy()
			expect(wordFind2.getListOfWords().includes(word)).toBeFalsy()
		}
	})
})
