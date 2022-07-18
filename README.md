# Word find puzzle generator

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
