from csv import DictReader
from pathlib import Path
import json
import random
import re
import numpy as np

ROWS = 10
COLS = 10
grid = [["" for _ in range(COLS)] for _ in range(ROWS)]
empty_coordinates = {(x, y) for x in range(COLS) for y in range(ROWS)}
occupied_coordinates = set()
words_to_find = []
old_grid = grid.copy()


with open("/Users/dov/dovsync/Coding Projects/Crucipuzzle/word_occurrencies.json") as json_file:
    occurrencies = json.load(json_file)


# directions = ["RIGHT", "LEFT", "UP", "DOWN",
#               "UP_RIGHT", "UP_LEFT", "DOWN_RIGHT", "DOWN_LEFT"]

directions = ["RIGHT", "LEFT", "UP", "DOWN"]


def populate_grid(grid):
    old_grid = grid.copy()
    print(f"Grid Checker: {grid == old_grid}")
    random_direction = random.choice(directions)
    random_x, random_y = random.choice(
        list(empty_coordinates.difference(occupied_coordinates)))
    if len(empty_coordinates) - len(occupied_coordinates) <= 10:
        print("Finito!")
        return old_grid

    print(random_direction, random_x, random_y)
    if "RIGHT":
        max_word_length = COLS - random_x
        if not max_word_length >= 4:
            
            return populate_grid(old_grid)

        word = pick_word(max_word_length, random_x,
                         random_y, random_direction, grid)
        if word == "":
            return populate_grid(old_grid)
        for i, letter in enumerate(word):
            grid[random_y][random_x+i] = letter
    elif "LEFT":
        max_word_length = random_x + 1
        if not max_word_length >= 4:
            
            return populate_grid(old_grid)

        word = pick_word(max_word_length, random_x,
                         random_y, random_direction, grid)
        for i, letter in enumerate(word):
            grid[random_y][random_x-i] = letter
    elif "UP":
        max_word_length = ROWS - random_y
        if not max_word_length >= 4:
            
            return populate_grid(old_grid)

        word = pick_word(max_word_length, random_x,
                         random_y, random_direction, grid)
        for i, letter in enumerate(word):
            grid[random_y-i][random_x] = letter

    elif "DOWN":
        max_word_length = random_y + 1
        if not max_word_length >= 4:
            
            return populate_grid(old_grid)

        word = pick_word(max_word_length, random_x,
                         random_y, random_direction, grid)
        for i, letter in enumerate(word):
            grid[random_y+i][random_x] = letter

    elif "UP_RIGHT":
        pass
    elif "UP_LEFT":
        pass
    elif "DOWN_RIGHT":
        pass
    elif "DOWN_LEFT":
        pass
    print(np.matrix(grid))
    if len(empty_coordinates) - len(occupied_coordinates) > 10:
        return populate_grid(grid)
    return grid


# TODO: too many words inside words_to_find
def pick_word(max_word_length, x, y, direction, grid):
    word_list = []
    for length in range(4, max_word_length+1):
        word_list += occurrencies[str(length)]
    if direction == "RIGHT":
        word_path = {(x+i, y) for i in range(1, max_word_length)}
    elif direction == "UP":
        word_path = {(x, y-1) for i in range(1, max_word_length)}
    elif direction == "LEFT":
        word_path = {(x-1, y) for i in range(1, max_word_length)}
    elif direction == "DOWN":
        word_path = {(x, y-1) for i in range(1, max_word_length)}
    print(f"Word path: {word_path}")
    # conflicts = {}
    regex = ""
    for point in word_path:
        if point in occupied_coordinates:
            print(f"POINT {point}")
            # conflicts[point] = grid[point[1]][point[0]]
            regex += grid[point[1]][point[0]]
        else:
            regex += "."
    # print(f"Conflicts: {conflicts}")
    regex = re.compile(regex)
    print(f"Regex: {regex}")
    re_matching_words = list(filter(regex.match, word_list))
    # print(f"Matching words: {re_matching_words}")
    if len(re_matching_words) == 0:
        return ""
    word = random.choice(re_matching_words)
    for point in word_path:
        occupied_coordinates.add(point)
    words_to_find.append(word)
    return word


full_grid = populate_grid(grid)
print(full_grid, words_to_find)
