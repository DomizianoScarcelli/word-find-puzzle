"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var wordOccurrencies = require("../word_occurrencies.json");
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
var WordFind = (function () {
    var rows = 10, cols = 10;
    var finalWordLenght = 8;
    var emptyMatrix = function () {
        var grid = [];
        for (var y = 0; y < rows; y++) {
            var row = [];
            for (var x = 0; x < cols; x++) {
                row.push("");
            }
            grid.push(row);
        }
        return grid;
    };
    var gridVersioning = {
        info: [
            {
                grid: emptyMatrix(),
                insertedWords: []
            },
        ],
        push: function (gridInfo) {
            gridVersioning.info.push(gridInfo);
        },
        pop: function () {
            return gridVersioning.info[-1];
        }
    };
    var getEmptyCoordinates = function () {
        var grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        var coordinates = [];
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                if (grid[y][x] == "")
                    coordinates.push([x, y]);
            }
        }
        return coordinates;
    };
    var getPossibilities = function () {
        var possibilities = [];
        for (var _i = 0, _a = getEmptyCoordinates(); _i < _a.length; _i++) {
            var coordinates = _a[_i];
            for (var direction in Directions) {
                possibilities.push({ x: coordinates[0], y: coordinates[1], direction: direction });
            }
        }
        return possibilities;
    };
    var pickRandomValues = function () {
        var possibilities = getPossibilities();
        var random = Math.floor(Math.random() * possibilities.length);
        var coordinates = possibilities[random];
        var maxWordLength = getMaximumWordLength(coordinates);
        return startRecursiveWordPicking(maxWordLength, coordinates, possibilities);
    };
    var getMaximumWordLength = function (coordinates) {
        var x = coordinates.x, y = coordinates.y, direction = coordinates.direction;
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
                throw Error("Direction ".concat(direction, " doesn't exist"));
        }
    };
    var getWordPath = function (maxLength, coordinates) {
        var wordPath = [];
        var x = coordinates.x, y = coordinates.y, direction = coordinates.direction;
        switch (direction) {
            case Directions.RIGHT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y]);
                }
                return wordPath;
            case Directions.LEFT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y]);
                }
                return wordPath;
            case Directions.UP:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x, y - i]);
                }
                return wordPath;
            case Directions.DOWN:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x, y + i]);
                }
                return wordPath;
            case Directions.UP_RIGHT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y - i]);
                }
                return wordPath;
            case Directions.UP_LEFT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y - i]);
                }
                return wordPath;
            case Directions.DOWN_RIGHT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x + i, y + i]);
                }
                return wordPath;
            case Directions.DOWN_LEFT:
                for (var i = 0; i < maxLength; i++) {
                    wordPath.push([x - i, y + i]);
                }
                return wordPath;
            default:
                throw Error("Direction ".concat(direction, " doesn't exist"));
        }
    };
    var pickWord = function (maxLength, coordinates) {
        var grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        var wordList = [];
        for (var length_1 = 4; length_1 <= maxLength; length_1++) {
            wordList = wordList.concat(wordOccurrencies["".concat(length_1)]);
        }
        var wordPath = getWordPath(maxLength, coordinates);
        var regex = "";
        for (var _i = 0, wordPath_1 = wordPath; _i < wordPath_1.length; _i++) {
            var point = wordPath_1[_i];
            var x = point[0];
            var y = point[1];
            if (grid[y][x] !== "")
                regex += grid[y][x];
            else
                regex += ".";
        }
        var compiledRegex = new RegExp(regex);
        var matchingWords = wordList.filter(function (word) { return compiledRegex.test(word); });
        if (matchingWords.length === 0)
            return "";
        var random = Math.floor(Math.random() * matchingWords.length);
        var word = matchingWords[random];
        return word;
    };
    var startRecursiveWordPicking = function (maxLength, coordinates, possibilities) {
        var word = pickWord(maxLength, coordinates);
        if (word === "") {
            possibilities = possibilities.filter(function (coordinate) { return coordinate !== coordinates; });
            if (possibilities.length === 0) {
                //Backtracking
                if (gridVersioning.info.length > 0)
                    gridVersioning.pop();
                return pickRandomValues();
            }
            var newCoordinates = possibilities[Math.floor(Math.random() * possibilities.length)];
            var newMaxWordLength = getMaximumWordLength(newCoordinates);
            return startRecursiveWordPicking(newMaxWordLength, newCoordinates, possibilities);
        }
        else {
            gridVersioning.info.push({
                grid: __spreadArray([], gridVersioning.info[gridVersioning.info.length - 1].grid, true),
                insertedWords: __spreadArray(__spreadArray([], gridVersioning.info[gridVersioning.info.length - 1].insertedWords, true), [word], false)
            });
            return { word: word, coordinates: coordinates };
        }
    };
    var fillGrid = function () {
        var grid = gridVersioning.info[gridVersioning.info.length - 1].grid;
        var _a = pickRandomValues(), word = _a.word, coordinates = _a.coordinates;
        console.log(word);
        var x = coordinates.x, y = coordinates.y, direction = coordinates.direction;
        switch (direction) {
            case Directions.RIGHT:
                for (var i = 0; i < word.length; i++) {
                    grid[y][x + i] = word[i];
                }
                break;
            case Directions.LEFT:
                for (var i = 0; i < word.length; i++) {
                    grid[y][x - i] = word[i];
                }
                break;
            case Directions.UP:
                for (var i = 0; i < word.length; i++) {
                    grid[y - i][x] = word[i];
                }
                break;
            case Directions.DOWN:
                for (var i = 0; i < word.length; i++) {
                    grid[y + i][x] = word[i];
                }
                break;
            case Directions.UP_RIGHT:
                for (var i = 0; i < word.length; i++) {
                    grid[y - i][x + i] = word[i];
                }
                break;
            case Directions.UP_LEFT:
                for (var i = 0; i < word.length; i++) {
                    grid[y - i][x - i] = word[i];
                }
                break;
            case Directions.DOWN_RIGHT:
                for (var i = 0; i < word.length; i++) {
                    grid[y + i][x + i] = word[i];
                }
                break;
            case Directions.DOWN_LEFT:
                for (var i = 0; i < word.length; i++) {
                    grid[y + i][x - i] = word[i];
                }
                break;
            default:
                throw Error("Direction ".concat(direction, " doesn't exist"));
        }
        var occupiedCoordinates = [];
        for (var y_1 = 0; y_1 < rows; y_1++) {
            for (var x_1 = 0; x_1 < cols; x_1++) {
                if (grid[y_1][x_1] !== "")
                    occupiedCoordinates.push([x_1, y_1]);
            }
        }
        console.log("Occupied coordinates : " + occupiedCoordinates.length);
        console.log("Differenza totali - occupate: " + (rows * cols - occupiedCoordinates.length));
        if (rows * cols - occupiedCoordinates.length > finalWordLenght)
            return fillGrid();
        else
            return { grid: grid, insertedWords: gridVersioning.info[gridVersioning.info.length - 1].insertedWords };
    };
    var insertLastWord = function () { };
    return { fillGrid: fillGrid };
})();
var values = WordFind.fillGrid();
console.log(values);
