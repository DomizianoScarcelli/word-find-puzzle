"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wordOccurrencies = require("../word_occurrencies.json");
var Directions;
(function (Directions) {
    Directions["RIGHT"] = "RIGHT";
    Directions["LEFT"] = "LEFT";
    Directions["UP"] = "UP";
    Directions["DOWN"] = "DOWN";
    Directions["UP_RIGHT"] = "UP_RIGHT";
    Directions["UP_LEFT"] = "UP_LEFT";
    Directions["DOWN_RIGHT"] = "DOWN_RIGHT";
    Directions["DOWN_LEFT"] = "DOWN_LEFT";
})(Directions || (Directions = {}));
var WordFind = (() => {
    let rows = 10, cols = 10;
    let finalWordLenght = 8;
    let emptyMatrix = () => {
        let grid = [];
        for (let y = 0; y < rows; y++) {
            let row = [];
            for (let x = 0; x < cols; x++) {
                row.push("");
            }
            grid.push(row);
        }
        return grid;
    };
    let gridVersioning = {
        info: [
            {
                grid: emptyMatrix(),
                insertedWords: [],
            },
        ],
        push: (gridInfo) => {
            gridVersioning.info.push(gridInfo);
        },
        pop: () => {
            return gridVersioning.info[-1];
        },
    };
    let getEmptyCoordinates = () => {
        const grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        let coordinates = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x] == "")
                    coordinates.push([x, y]);
            }
        }
        return coordinates;
    };
    let getPossibilities = () => {
        const possibilities = [];
        for (let coordinates of getEmptyCoordinates()) {
            for (let direction in Directions) {
                possibilities.push({ x: coordinates[0], y: coordinates[1], direction: direction });
            }
        }
        return possibilities;
    };
    let pickRandomValues = () => {
        const possibilities = getPossibilities();
        const random = Math.round(Math.random() * possibilities.length);
        const coordinates = possibilities[random];
        const maxWordLength = getMaximumWordLength(coordinates);
        return startRecursiveWordPicking(maxWordLength, coordinates, possibilities);
    };
    let getMaximumWordLength = (coordinates) => {
        const { x, y, direction } = coordinates;
        switch (direction) {
            case Directions.RIGHT:
                return cols - x;
            case Directions.LEFT:
                return x + 1;
            case Directions.UP:
                return y + 1;
            case Directions.DOWN:
                return rows - y;
            case Directions.UP_RIGHT:
                return Math.min(y + 1, cols - x);
            case Directions.UP_LEFT:
                return Math.min(y + 1, x + 1);
            case Directions.DOWN_RIGHT:
                return Math.min(rows - y, cols - y);
            case Directions.DOWN_LEFT:
                return Math.min(rows - y, x + 1);
            default:
                throw Error(`Direction ${direction} doesn't exist`);
        }
    };
    let getWordPath = (maxLength, coordinates) => {
        let wordPath = [];
        const { x, y, direction } = coordinates;
        switch (direction) {
            case Directions.RIGHT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y]);
                }
                return wordPath;
            case Directions.LEFT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y]);
                }
                return wordPath;
            case Directions.UP:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x, y - i]);
                }
                return wordPath;
            case Directions.DOWN:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x, y + i]);
                }
                return wordPath;
            case Directions.UP_RIGHT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y - i]);
                }
                return wordPath;
            case Directions.UP_LEFT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y - i]);
                }
                return wordPath;
            case Directions.DOWN_RIGHT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y + i]);
                }
                return wordPath;
            case Directions.DOWN_LEFT:
                for (let i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y + i]);
                }
                return wordPath;
            default:
                throw Error(`Direction ${direction} doesn't exist`);
        }
    };
    let pickWord = (maxLength, coordinates) => {
        const grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        let wordList = [];
        for (let length = 4; length <= maxLength; length++) {
            wordList = wordList.concat(wordOccurrencies[`${length}`]);
        }
        const wordPath = getWordPath(maxLength, coordinates);
        let regex = "";
        for (let point of wordPath) {
            let x = point[0];
            let y = point[1];
            if (grid[y][x] !== "")
                regex += grid[y][x];
            else
                regex += ".";
        }
        const compiledRegex = new RegExp(regex);
        const matchingWords = wordList.filter((word) => compiledRegex.test(word));
        if (matchingWords.length === 0)
            return "";
        const random = Math.round(Math.random() * matchingWords.length);
        const word = matchingWords[random];
        return word;
    };
    let startRecursiveWordPicking = (maxLength, coordinates, possibilities) => {
        const word = pickWord(maxLength, coordinates);
        if (word === "") {
            possibilities.filter((coordinate) => coordinate !== coordinates);
            if (possibilities.length === 0) {
                gridVersioning.pop();
                return pickRandomValues();
            }
            const newCoordinates = possibilities[Math.round(Math.random() * possibilities.length)];
            const newMaxWordLength = getMaximumWordLength(newCoordinates);
            return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities);
        }
        else {
            gridVersioning.info.push({
                grid: [...gridVersioning.info[gridVersioning.info.length - 1].grid],
                insertedWords: [...gridVersioning.info[gridVersioning.info.length - 1].insertedWords, word],
            });
            return { word, coordinates };
        }
    };
    let fillGrid = () => {
        const grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        let { word, coordinates } = pickRandomValues();
        let { x, y, direction } = coordinates;
        switch (direction) {
            case Directions.RIGHT:
                for (let i = 0; i < word.length; i++) {
                    grid[y][x + i] = word[i];
                }
                break;
            case Directions.LEFT:
                for (let i = 0; i < word.length; i++) {
                    grid[y][x - i] = word[i];
                }
                break;
            case Directions.UP:
                for (let i = 0; i < word.length; i++) {
                    grid[y - i][x] = word[i];
                }
                break;
            case Directions.DOWN:
                for (let i = 0; i < word.length; i++) {
                    grid[y + i][x] = word[i];
                }
                break;
            case Directions.UP_RIGHT:
                for (let i = 0; i < word.length; i++) {
                    grid[y - i][x + i] = word[i];
                }
                break;
            case Directions.UP_LEFT:
                for (let i = 0; i < word.length; i++) {
                    grid[y - i][x - i] = word[i];
                }
                break;
            case Directions.DOWN_RIGHT:
                for (let i = 0; i < word.length; i++) {
                    grid[y + i][x + i] = word[i];
                }
                break;
            case Directions.DOWN_LEFT:
                for (let i = 0; i < word.length; i++) {
                    grid[y + i][x - i] = word[i];
                }
                break;
            default:
                throw Error(`Direction ${direction} doesn't exist`);
        }
        let occupiedCoordinates = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x] !== "")
                    occupiedCoordinates.push([x, y]);
            }
        }
        console.log("Empty coordinates: " + getEmptyCoordinates().length);
        console.log("Occupied coordinates : " + occupiedCoordinates.length);
        console.log("Differenza vuote - occupate: " + (getEmptyCoordinates().length - occupiedCoordinates.length));
        console.log(grid);
        if (rows * cols - occupiedCoordinates.length > finalWordLenght)
            fillGrid();
        else
            return { grid: grid, insertedWords: gridVersioning.info[gridVersioning.info.length - 1].insertedWords };
    };
    return { rows, cols, getEmptyCoordinates, getPossibilities, pickRandomValues, pickWord, fillGrid };
})();
const values = WordFind.fillGrid();
//# sourceMappingURL=wordfind.js.map