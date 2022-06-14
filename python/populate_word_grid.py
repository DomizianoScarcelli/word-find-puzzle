from pathlib import Path
import json
import random
import re
import timeit


ROWS = 10
COLS = 10
grid = [["" for _ in range(COLS)] for _ in range(ROWS)]
empty_coordinates = {(x, y) for x in range(COLS) for y in range(ROWS)}
words_to_find = []

with open(Path.joinpath(Path(__file__).parent.parent, 'word_occurrencies.json')) as json_file:
    occurrencies = json.load(json_file)



directions = ["RIGHT", "LEFT", "UP", "DOWN",
              "UP_RIGHT", "UP_LEFT", "DOWN_RIGHT", "DOWN_LEFT"]

grid_versioning = [[row[:] for row in grid]]


def pick_random_values(grid):
    possibilities = [(x, y, direction) for x in range(COLS) for y in range(
        ROWS) for direction in directions if grid[y][x] == ""]
    random_x, random_y, random_direction = random.choice(possibilities)
    max_word_length = get_maximux_word_length(
        random_x, random_y, random_direction)
    return make_choice(max_word_length, random_x, random_y,
                       random_direction, grid, possibilities)


def populate_grid(grid):
    word, x, y, direction = pick_random_values(grid)
    #print(np.matrix(grid))
    #print(words_to_find)
    if direction == "RIGHT":
        for i, letter in enumerate(word):
            grid[y][x+i] = letter
    elif direction == "LEFT":
        for i, letter in enumerate(word):
            grid[y][x-i] = letter
    elif direction == "UP":
        for i, letter in enumerate(word):
            grid[y-i][x] = letter
    elif direction == "DOWN":
        for i, letter in enumerate(word):
            grid[y+i][x] = letter
    elif direction == "UP_RIGHT":
        for i, letter in enumerate(word):
            grid[y-i][x+i] = letter
    elif direction == "UP_LEFT":
        for i, letter in enumerate(word):
            grid[y-i][x-i] = letter
    elif direction == "DOWN_RIGHT":
        for i, letter in enumerate(word):
            grid[y+i][x+i] = letter
    elif direction == "DOWN_LEFT":
        for i, letter in enumerate(word):
            grid[y+i][x-i] = letter
    new_occupied_coordinates = [(x, y) for y in range(
        len(grid)) for x in range(len(grid[y])) if grid[y][x] != ""]
    FINAL_WORD_LENGTH = 5
    if len(empty_coordinates) - len(new_occupied_coordinates) > FINAL_WORD_LENGTH:
        populate_grid(grid)
    else:
        insert_last_word(grid)
    return grid

def insert_last_word(grid):
    final_empty_spaces =  [(x, y) for x in range(COLS) for y in range(
        ROWS)if grid[y][x] == ""]
    final_word = random.choice(occurrencies[str(len(final_empty_spaces))])
    for i in range(len(final_empty_spaces)):
        x, y = final_empty_spaces[i]
        grid[y][x] = final_word[i]

def get_maximux_word_length(x, y, direction):
    if direction == "RIGHT":
        return COLS - x
    elif direction == "LEFT":
        return x + 1
    elif direction == "UP":
        return y + 1
    elif direction == "DOWN":
        return ROWS - y
    elif direction == "UP_RIGHT":
        return min(y+1, COLS-x)
    elif direction == "UP_LEFT":
        return min(y+1, x+1)
    elif direction == "DOWN_RIGHT":
        return min(ROWS-y, COLS-x)
    elif direction == "DOWN_LEFT":
        return min(ROWS-y, x+1)


def make_choice(length, random_x, random_y, random_direction, grid, possibilities):
    word = pick_word(length, random_x,
                     random_y, random_direction, grid)
    if word == "":
        possibilities.remove((random_x, random_y, random_direction))
        if possibilities == []:
            return backtrack()
        else:
            new_random_x, new_random_y, new_random_direction = random.choice(
                possibilities)
            new_max_word_length = get_maximux_word_length(
                new_random_x, new_random_y, new_random_direction)
            return make_choice(new_max_word_length, new_random_x, new_random_y,
                               new_random_direction, grid, possibilities)
    else:
        words_to_find.append(word)
        if grid != grid_versioning[-1]:
            grid_versioning.append([row[:] for row in grid])           
        return (word, random_x, random_y, random_direction)


def backtrack():
    if len(grid_versioning) > 1:
        grid_versioning.pop(-1)
    if len(words_to_find) > 0:
        words_to_find.pop(-1)
    #print("BACKTRACKING!")
    return pick_random_values(grid_versioning[-1])


def pick_word(max_word_length, x, y, direction, grid):
    word_list = []
    for length in range(4, max_word_length+1):
        word_list += occurrencies[str(length)]
    if direction == "RIGHT":
        word_path = [(x+i, y) for i in range(max_word_length)]
    elif direction == "LEFT":
        word_path = [(x-i, y) for i in range(max_word_length)]
    elif direction == "UP":
        word_path = [(x, y-i) for i in range(max_word_length)]
    elif direction == "DOWN":
        word_path = [(x, y+i) for i in range(max_word_length)]
    elif direction == "UP_RIGHT":
        word_path = [(x+i, y-i) for i in range(max_word_length)]
    elif direction == "UP_LEFT":
        word_path = [(x-i, y-i) for i in range(max_word_length)]
    elif direction == "DOWN_RIGHT":
        word_path = [(x+i, y+i) for i in range(max_word_length)]
    elif direction == "DOWN_LEFT":
        word_path = [(x-i, y+i) for i in range(max_word_length)]
    regex = ""
    for point in word_path:
        if grid[point[1]][point[0]] != "":
            regex += grid[point[1]][point[0]]
        else:
            regex += "."
    regex = re.compile(regex)
    re_matching_words = set(filter(regex.match, word_list))
    if len(re_matching_words) == 0:
        return ""
    word = random.choice(list(re_matching_words))
    return word


start = timeit.default_timer()
fails = 0
NUMBER_OF_PUZZLES = 100
for i in range(1, NUMBER_OF_PUZZLES + 1):
    progress = f'[{"=" * round((i/10))}{" " * (round(NUMBER_OF_PUZZLES/10) - round((i/10)))}] {(round(i/NUMBER_OF_PUZZLES*100 ,3))}% \tTime elapsed: {round(timeit.default_timer() - start, 2)}s'
    print(progress, end="\r")
    try:
        full_grid = populate_grid([["" for _ in range(COLS)] for _ in range(ROWS)])
        words_to_find.clear()
    except:
        fails += 1

stop = timeit.default_timer()

print('Time: ', stop - start)
print('Avg time: ', (stop - start)/1000)
print(f'Fail probability: {(fails/1000)*100}%')
