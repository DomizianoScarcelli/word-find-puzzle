from pathlib import Path
import json
ROOT = Path(__file__).parent.parent

def filter_and_parse_words(file_name):
    absolute_path = Path.joinpath(ROOT, "data", file_name)
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

def filter_and_parse_words_dictionary(file_name, filter_file_name):
    main_file_path = Path.joinpath(ROOT, 'data', file_name)
    filter_file_path = Path.joinpath(ROOT, 'data', filter_file_name)
    with open(main_file_path) as f1, open(filter_file_path) as f2:
        words = f1.read().replace("\t", "").splitlines()
        filter_words = f2.read().replace("\t", "").splitlines()
        for word in words.copy():
            if len(word) < 4 or len(word) > 10 or word in filter_words:
                words.remove(word)
    max_word_length = len(max(words, key=len))
    occurencies = {length: [word for word in words if len(word) == length] for length in range(1, max_word_length+1)}
    return occurencies

def save_dictionary_as_json(dictionary):
    with open("example_word_occurrencies.json", "x") as f:
        json.dump(dictionary, f)
    return 

dictionary = filter_and_parse_words_dictionary("corncob_lowercase.txt", "en-offensive-words.txt")
save_dictionary_as_json(dictionary)


