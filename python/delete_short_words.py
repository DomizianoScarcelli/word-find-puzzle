from pathlib import Path
import json
ROOT = Path(__file__).parent.parent

# FILE_NAME = "word_list.txt"
# absolute_path = Path.joinpath(Path(__file__).parent, FILE_NAME)
# with open(absolute_path) as f:
#     words = f.read().replace("\t", "").splitlines()
#     for word in words.copy():
#         if len(word) < 4:
#             words.remove(word)
# new_file = Path.joinpath(Path(__file__).parent, "long_word_list.txt")
# with open (new_file, "x") as f:
#     words_string = "\n".join(words)
#     f.write(words_string)

def filter_and_parse_words():
    FILE_NAME = "words.txt"
    absolute_path = Path.joinpath(ROOT, "data", FILE_NAME)
    with open(absolute_path) as f:
        words = f.read().replace("\t", "").splitlines()
        for word in words.copy():
            if len(word) < 4:
                words.remove(word)
    new_file = Path.joinpath(Path(__file__).parent, "array_of_words.txt")
    with open (new_file, "x") as f:
        words_string = "[" 
        for word in words:
            words_string += f"'{word}', "
        words_string += "]"
        f.write(words_string)
    return 

def filter_and_parse_words_dictionary():
    FILE_NAME = "words.txt"
    path = Path.joinpath(ROOT, 'data', FILE_NAME)
    with open(path) as f:
        words = f.read().replace("\t", "").splitlines()
        for word in words.copy():
            if len(word) < 4:
                words.remove(word)
    max_word_length = len(max(words, key=len))
    occurencies = {length: [word for word in words if len(word) == length] for length in range(1, max_word_length+1)}
    return occurencies

def save_dictionary_as_json(dictionary):
    with open("word_occurrencies.json", "x") as f:
        json.dump(dictionary, f)
    return 

dictionary = filter_and_parse_words_dictionary()
save_dictionary_as_json(dictionary)


