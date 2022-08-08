# Word find puzzle generator

-   [Word find puzzle generator](#word-find-puzzle-generator)
-   [Getting started](#getting-started)
-   [Settings](#settings)
-   [Puzzle creation algorithm](#puzzle-creation-algorithm)
-   [Methods](#methods)
    -   [`create()`](#create)
    -   [`clear()`](#clear)
-   [Getters](#getters)
    -   [`getWordPath(word)`](#getwordpathword)
    -   [`getGrid()`](#getgrid)
    -   [`getInsertedWords()`](#getinsertedwords)
    -   [`getListOfWords()`](#getlistofwords)
-   [Change settings](#change-settings)
    -   [`setGridSize(rows, cols)`](#setgridsizerows-cols)
    -   [`addWordToFind()`](#addwordtofind)
    -   [`addWordsToFind()`](#addwordstofind)
    -   [`removeWordToFind()`](#removewordtofind)
    -   [`removeWordsToFind()`](#removewordstofind)

This library can generate a word find (also known as word search) puzzle of any dimension from a set of words.

The library is written in Typescript and it's tested using [Jest](https://github.com/facebook/jest).

# Getting started

To create a new generator

```typescript
import WordFind from "WORDFIND_PATH"
const wordFind = WordFind()
```

To create a new grid with the standard settings just do

```javascript
const puzzleObject = wordFind.create()
```

To see all the public methods: [Methods](#methods)

# Settings

Inside the settings it's possible to edit:

-   The rows and columns of the grid
-   The maximum length of the final word
-   The words that have to be added inside the grid

To see how to change the settings: [Change settings](#change-settings)

# Puzzle creation algorithm

The algorithm for the puzzle creation is the following:

A Possibility is a vector of three elements, that describes the coordinates and orientation of a word, for example (1, 2, "Right") describes a word that starts at coordinates (1,2) and it's written from left to right.

Everytime a word has to be places onto the grid, a list of Possibilites is generated, that indicates all the possible Possibilities that are present inside of the grid. This list is then random shuffled in order to get everytime a new outcome from a single set of words to insert.

The first Possibility of the list is inspected, and from it it's calculated the maximum lenght that a word can be for it to fit in that position and with a specific orientation.

Then a word is picked using a picking algorithm, that is described as following:

-   It generates a compatible path where the word will fit in
-   It generates a regex that has a dot if there is no letter in the coordinates of the compatible path, and has the corrispondent letter otherwise. For example if the compatible path is [(0,0), (0,1), (0,2), (0,3)] and all the spaces are empty except for the coordinate (0,1) that contains the letter "m", the generated regex will be ".m.."
-   From the list of word, it picks a word that is compatible with the regex, that has not been inserted in the grid yet.

The picked word is then inserted inside of the grid, following the compatible path that has been calculated previously.

Everytime the word picking algorithm doesn't find a word that fits, and the puzzle is not complete yet, the algorithm backtracks to the previous configurations, and tries again with a new random possibility.

Before any word is inserted, it's defined a maximum length for the final word, that will be the word that is formed by the letters that remains when all other words are found.

When the grid has a number of empty cells that matches the maximum length of this word, the word picking algorithm stops and a random final word that is compatible with the maximum word lenght is inserted, and the puzzle is completed.

# Methods

## `create()`

The `create()` method is used to create a puzzle with the current settings.

It returns an array object with the following structure:

```typescript
{
    grid: string[][];
    insertedWords:
    [
        {
            word: string;
            wordPath: Point[]
        }
    ]
    finalWord: string;
    finalWordPath: Point[]
}
```

-   `grid`: the puzzle grid
-   `insertedWords`: A list of object that describes the words inserted into the puzzle grid
    -   `word`: the inserted word
    -   `wordPath`: a list of coordinates (`x, y`) that describes the location of every letter of the word
-   `finalWord`: the hidden word inside of the grid, that can be found only when all the other word inside `insertedWord` are found. It's the solution of the puzzle.
-   `finalWordPath`: a list of coordinates (`x, y`) that describes the location of every letter of the `finalWord`

## `clear()`

Clears the puzzle grid but leaves the settings as they are.

# Getters

## `getWordPath(word)`

Returns the list of coordinates `(x,y)` that describe the location inside the grid of the input word.

## `getGrid()`

Returns the puzzle grid in the current state.

## `getInsertedWords()`

Returns the list words that current are inserted inside the puzzle grid.

## `getListOfWords()`

Returns the list of words that can be inserted inside the puzzle grid.

# Change settings

## `setGridSize(rows, cols)`

Changes the columns and rows of the grid.

## `addWordToFind()`

Adds the input word inside the list of words that can be added inside the puzzle grid.

## `addWordsToFind()`

Same as [addWordToFind](#addwordtofind) but takes a word list in input.

## `removeWordToFind()`

Removes the input word from the list of words that can be added inside the puzzle grid.

## `removeWordsToFind()`

Same as [removeWordToFind](#removewordtofind) but takes a word list in input.
