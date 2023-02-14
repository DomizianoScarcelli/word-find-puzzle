import { Directions } from "./wordfind"

type Coordinates = {
	x: number
	y: number
	direction: Directions
}

type Point = {
	x: number
	y: number
}

type WordFindOptions = {
	cols?: number
	rows?: number
	finalWordLength?: number
	wordsToFind?: string[] //TODO: implementation
	iterationLimit?: number
	//TODO: add optional final phrase instead of final word length
}

export type { Coordinates, Point, WordFindOptions }
