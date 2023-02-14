import styled from "styled-components"
import { calculateBorderRadius, calculateRotation } from "./puzzleHelper"

export const Background = styled.div`
	display: flex;
	flex-direction: row;
	background-color: "f5cac3";
	justify-content: center;
	align-items: center; ;
`

export const Grid = styled.div<{ letters: number }>`
	${(props) => `
	display: grid;

	grid-template-rows: repeat(${props.letters}, 3.5vw);
	grid-template-columns: repeat(${props.letters}, 3.5vw);

	grid-row-gap: 5px;
	grid-column-gap: 5px;
	`}
`

export const Letter = styled.div`
	position: relative;
	font-size: 30px;
	user-select: none;
	cursor: pointer;
	display: grid;
	place-items: center;
`

export const Square = styled.div<{ selectedIndexes: number[]; index: number; N: number }>`
	${(props) =>
		`position: absolute;
		z-index: -1;
		width: 120px;
		height: 60px;
		border-radius: ${calculateBorderRadius(props.selectedIndexes, props.index, props.N)}; 
		background-color: ${props.selectedIndexes.includes(props.index) ? "purple" : "none"};
		transform: ${calculateRotation(props.selectedIndexes, props.N)}`}
`

export const InsertedWordSquare = styled.div<{ indexes: number[]; index: number; color: string; N: number }>`
	${(props) => `position: absolute;
	z-index: -${props.indexes.length}; //TODO: map it to the position of the word in the list 
	width: 120px;
	height: 60px;
	border-radius: ${calculateBorderRadius(props.indexes, props.index, props.N)}; 
	background-color: ${props.color};
	transform: ${calculateRotation(props.indexes, props.N)}`}
`

export const VerticalList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	font-size: 22px;
	text-transform: uppercase;
	padding-left: 3rem;
`

export const Word = styled.div<{ word: string; wordsFound: string[] }>`
	${(props) => `text-decoration: ${props.wordsFound.includes(props.word) ? "line-through" : ""}`}
`

export const Title = styled.div`
	display: flex;
	color: purple;
	font-size: 22px;
	font-weight: bold;
	justify-content: center;
	padding-top: 1rem;
	padding-bottom: 3rem;
`

export const SubTitle = styled.div`
	font-size: 18px;
	font-weight: normal;
	padding-top: 0.2rem;
`
