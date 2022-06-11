from pathlib import Path
import json
import random
import re
from turtle import back
import numpy as np
import time

ROWS = 10
COLS = 10
grid = [["" for _ in range(COLS)] for _ in range(ROWS)]
empty_coordinates = {(x, y) for x in range(COLS) for y in range(ROWS)}
words_to_find = []
examinated_words = set()


with open("/Users/dov/dovsync/Coding Projects/Crucipuzzle/word_occurrencies.json") as json_file:
    occurrencies = json.load(json_file)


# directions = ["RIGHT", "LEFT", "UP", "DOWN",
#               "UP_RIGHT", "UP_LEFT", "DOWN_RIGHT", "DOWN_LEFT"]

directions = ["RIGHT", "LEFT", "UP", "DOWN"]

grid_versioning = [[row[:] for row in grid], [row[:] for row in grid]]


def populate_grid(grid):
    occupied_coordinates = [(x, y) for y in range(len(grid))
                            for x in range(len(grid[y])) if grid[y][x] != ""]
    if len(empty_coordinates) - len(occupied_coordinates) <= 10:
        # print("Finito!")
        return grid

    possibilities = [(x, y, direction) for x in range(COLS) for y in range(
        ROWS) for direction in directions if grid[y][x] == ""]
    random_x, random_y, random_direction = random.choice(possibilities)
    max_word_length = get_maximux_word_length(
        random_x, random_y, random_direction)
    word, x, y, direction = make_choice(max_word_length, random_x, random_y,
                                        random_direction, grid, possibilities)
    # time.sleep(0.3)
    print(np.matrix(grid))
    #print(f"Chosen word: {word}")
    #print(f"Chosen word starting point: {x,y, direction}")
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
        pass
    elif direction == "UP_LEFT":
        pass
    elif direction == "DOWN_RIGHT":
        pass
    elif direction == "DOWN_LEFT":
        pass
    # #print(np.matrix(grid))
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
    if word == "" or word in examinated_words:
        possibilities.remove((random_x, random_y, random_direction))
        if possibilities == []:
            backtrack()
        else:
            new_random_x, new_random_y, new_random_direction = random.choice(
                possibilities)
            new_max_word_length = get_maximux_word_length(
                new_random_x, new_random_y, new_random_direction)
            return make_choice(new_max_word_length, new_random_x, new_random_y,
                               new_random_direction, grid, possibilities)
    else:
        grid_versioning.append([row[:] for row in grid])
        return (word, random_x, random_y, random_direction)


def backtrack():
    if len(grid_versioning) > 1:
        grid_versioning.pop(-1)
    if len(words_to_find) > 0:
        last_word_inserted = words_to_find.pop(-1)
        examinated_words.add(last_word_inserted)  # TODO: not useful
    populate_grid(grid_versioning[-1])


def pick_word(max_word_length, x, y, direction, grid):
    word_list = []
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
    regex = ""
    for point in word_path:
        if grid[point[1]][point[0]] != "":
            regex += grid[point[1]][point[0]]
        else:
            regex += "."
    regex = re.compile(regex)
    re_matching_words = list(filter(regex.match, word_list))
    if len(re_matching_words) == 0:
        return ""
    word = random.choice(re_matching_words)
    return word


full_grid = populate_grid(grid)
print(full_grid, words_to_find)
