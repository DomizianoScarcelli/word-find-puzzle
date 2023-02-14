# Word search puzzle generator

![Home](https://github.com/DomizianoScarcelli/word-find-puzzle/blob/main/github_assets/home.png)

Click [HERE](https://wordsearchgenerator.netlify.app/) for the demo

This simple Web App generates a word search puzzle from a list of the most common (not offensive) english words.

The module that's used under the hood is defined in the src/WordSearch folder, and it's capable of getting custom words and custom settings, such as the number of rows and columns of the grid.

The module is written in Typescript and it's tested using [Jest](https://github.com/facebook/jest).

## How the puzzle generation works:

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
