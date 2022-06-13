"use strict";
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
    var gridVersioning = {
        info: [
            {
                grid: Array(cols).fill(Array(rows).fill("")),
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
                if (grid[y][x] === "")
                    coordinates.push([x, y]);
            }
        }
        return coordinates;
    };
    var getPossibilities = function () {
        var possibilities = [];
        for (var _i = 0, _a = getEmptyCoordinates(); _i < _a.length; _i++) {
            var coordinates_1 = _a[_i];
            for (var direction in Directions) {
                possibilities.push([coordinates_1[0], coordinates_1[1], direction]);
            }
        }
        return possibilities;
    };
    var pickRandomValues = function () {
        var possibilities = getPossibilities();
        var random = Math.round(Math.random() * possibilities.length);
        var coordinates = possibilities[random];
        var maxWordLength = getMaximumWordLength(coordinates);
        return [maxWordLength, coordinates];
    };
    var getMaximumWordLength = function (coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var direction = coordinates[2];
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
        var x = coordinates[0];
        var y = coordinates[1];
        var direction = coordinates[2];
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
        var random = Math.round(Math.random() * matchingWords.length);
        var word = matchingWords[random];
        return word;
    };
    return { rows: rows, cols: cols, getEmptyCoordinates: getEmptyCoordinates, getPossibilities: getPossibilities, pickRandomValues: pickRandomValues, pickWord: pickWord };
})();
var values = WordFind.pickRandomValues();
var maxWordLength = values[0];
var coordinates = values[1];
console.log(WordFind.pickWord(maxWordLength, coordinates));
