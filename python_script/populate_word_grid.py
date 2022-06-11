from csv import DictReader
from pathlib import Path
import json
import random
import re
from turtle import back
import numpy as np

ROWS = 10
COLS = 10
grid = [["" for _ in range(COLS)] for _ in range(ROWS)]
empty_coordinates = {(x, y) for x in range(COLS) for y in range(ROWS)}
# occupied_coordinates = set()
# occupied_coordinates_versioning = [occupied_coordinates.copy()]
words_to_find = []


with open("/Users/dov/dovsync/Coding Projects/Crucipuzzle/word_occurrencies.json") as json_file:
    occurrencies = json.load(json_file)


# directions = ["RIGHT", "LEFT", "UP", "DOWN",
#               "UP_RIGHT", "UP_LEFT", "DOWN_RIGHT", "DOWN_LEFT"]

directions = ["RIGHT", "LEFT", "UP", "DOWN"]

grid_versioning = [[row[:] for row in grid], [row[:] for row in grid]]


def populate_grid(grid):
    print(f"Grid Checker: {[row[:] for row in grid] == grid_versioning[-1]}")
    # random_direction = random.choice(directions)
    # random_x, random_y = random.choice(
    #     list([(x,y) for y in range(len(grid)) for x in range(len(grid[y])) if grid[y][x] == ""]))
    occupied_coordinates = [(x, y) for y in range(len(grid))
                            for x in range(len(grid[y])) if grid[y][x] != ""]
    if len(empty_coordinates) - len(occupied_coordinates) <= 10:
        print("Finito!")
        return grid

    possibilities = [(x, y, direction) for x in range(COLS) for y in range(
        ROWS) for direction in directions if grid[y][x] == ""]
    random_x, random_y, random_direction = random.choice(possibilities)
    # print(f"Possibilities: {possibilities}")
    if random_direction == "RIGHT":
        max_word_length = COLS - random_x
        word, x, y, direction = make_choice(max_word_length, random_x, random_y,
                                            random_direction, grid, possibilities)
        print(f"Chosen word: {word}")
        for i, letter in enumerate(word):
            grid[y][x+i] = letter
    elif random_direction == "LEFT":
        max_word_length = random_x + 1
        word, x, y, direction = make_choice(max_word_length, random_x, random_y,
                                            random_direction, grid, possibilities)
        for i, letter in enumerate(word):
            grid[y][x-i] = letter
    elif random_direction == "UP":
        max_word_length = random_y + 1
        word, x, y, direction = make_choice(max_word_length, random_x, random_y,
                                            random_direction, grid, possibilities)
        for i, letter in enumerate(word):
            grid[y-i][x] = letter
    elif random_direction == "DOWN":
        max_word_length = ROWS - random_y
        word, x, y, direction = make_choice(max_word_length, random_x, random_y,
                                            random_direction, grid, possibilities)
        for i, letter in enumerate(word):
            grid[y+i][x] = letter

    elif random_direction == "UP_RIGHT":
        pass
    elif random_direction == "UP_LEFT":
        pass
    elif random_direction == "DOWN_RIGHT":
        pass
    elif random_direction == "DOWN_LEFT":
        pass
    # print(np.matrix(grid))
    words_to_find.append(word)
    new_occupied_coordinates = [(x, y) for y in range(
        len(grid)) for x in range(len(grid[y])) if grid[y][x] != ""]
    if len(empty_coordinates) - len(new_occupied_coordinates) > 10:
        populate_grid(grid)
    return grid


def get_maximux_word_length(x, y, direction):
    if direction == "RIGHT":
        return COLS - x
    elif direction == "LEFT":
        return x + 1
    elif direction == "UP":
        return y + 1
    elif direction == "DOWN":
        return ROWS - y


def make_choice(length, random_x, random_y, random_direction, grid, possibilities):
    word = pick_word(length, random_x,
                     random_y, random_direction, grid)
    if word == "":
        possibilities.remove((random_x, random_y, random_direction))
        if possibilities == []:
            backtrack()
        else:
            new_random_x, new_random_y, new_random_direction = random.choice(
                possibilities)
            return make_choice(get_maximux_word_length(new_random_x, new_random_y, new_random_direction), new_random_x, new_random_y,
                                new_random_direction, grid, possibilities)
    else:
        grid_versioning.append([row[:] for row in grid])
        return (word, random_x, random_y, random_direction)


def backtrack():
    if len(grid_versioning) > 1:
        grid_versioning.pop(-1)
    print(f"Words to find before backtrack: {words_to_find}")
    if len(words_to_find) > 0:
        words_to_find.pop(-1)
    print(f"Words to find after backtrack: {words_to_find}")

    populate_grid(grid_versioning[-1])


def pick_word(max_word_length, x, y, direction, grid):
    word_list = []
    # print(f"Max word length: {max_word_length}")
    for length in range(4, max_word_length+1):
        word_list += occurrencies[str(length)]
    if direction == "RIGHT":
        word_path = {(x+i, y) for i in range(max_word_length)}
    elif direction == "UP":
        word_path = {(x, y-i) for i in range(max_word_length)}
    elif direction == "LEFT":
        word_path = {(x-i, y) for i in range(max_word_length)}
    elif direction == "DOWN":
        word_path = {(x, y+i) for i in range(max_word_length)}
    # print(f"Word path: {word_path}")
    # conflicts = {}
    regex = ""
    for point in word_path:
        x, y = point
        # print(f"Considered point: {point}")
        # print(f"Considered direction: {direction}")
        if grid[y][x] != "":
            # print(f"POINT {point}")
            # conflicts[point] = grid[point[1]][point[0]]
            print(np.matrix(grid))
            regex += grid[y][x]
        else:
            regex += "."
    # print(f"Conflicts: {conflicts}")
    regex = re.compile(regex)
    # print(f"Regex: {regex}")
    re_matching_words = list(filter(regex.match, word_list))
    # print(f"Matching words: {re_matching_words}")
    if len(re_matching_words) == 0:
        return ""
    word = random.choice(re_matching_words)
    # for point in word_path
    #     occupied_coordinates.add(point)
    return word


full_grid = populate_grid(grid)
print(full_grid, words_to_find)
