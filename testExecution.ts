import WordFind from "./src/wordfind"

// const wordFind = WordFind()
// const puzzle = wordFind.create()
// console.log(puzzle)
// const { insertedWords } = puzzle
// console.log(wordFind.getWordPath(insertedWords[0].word))
// wordFind.addWordToFind("dajonemega")
// console.log(wordFind.getListOfWords().includes("dajonemega"))
// wordFind.removeWordToFind("dajonemega")
// console.log(wordFind.getListOfWords().includes("dajonemega"))
// console.log(wordFind.getGrid())
// wordFind.addWordToFind("mag")
// console.log(wordFind.getListOfWords().includes("mag"))

const wordFind = WordFind()
const allWords = wordFind.getListOfWords()
wordFind.removeWordsToFind(allWords)
// //Now there are no words to find
// wordFind.addWordToFind("daje")
// wordFind.addWordToFind("dadadsd")

wordFind.create()
