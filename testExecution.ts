import WordFind from "./src/wordfind"
const wordFind = WordFind()
const puzzle = wordFind.create()
console.log(puzzle)
const { insertedWords } = puzzle
console.log(wordFind.getWordPath(insertedWords[0].word))
