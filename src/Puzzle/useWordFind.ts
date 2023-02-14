import { useState } from "react"
import WordFind from "../WordSearch/src/wordfind"
import type { WordFindOptions } from "../WordSearch/src/wordfind"

export const useWordFind = (options?: WordFindOptions) => {
	const [wordFind, setWordFind] = useState(WordFind(options))
	return wordFind
}
