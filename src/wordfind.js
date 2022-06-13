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
            var coordinates = _a[_i];
            for (var direction in Directions) {
                possibilities.push([coordinates[0], coordinates[1], direction]);
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
        return 10;
    };
    return { rows: rows, cols: cols, getEmptyCoordinates: getEmptyCoordinates, getPossibilities: getPossibilities, pickRandomValues: pickRandomValues };
})();
console.log(WordFind.pickRandomValues());
