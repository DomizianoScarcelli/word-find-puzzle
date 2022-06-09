from pathlib import Path
FILE_NAME = "word_list.txt"
absolute_path = Path.joinpath(Path(__file__).parent, FILE_NAME)
with open(absolute_path) as f:
    words = f.read().replace("\t", "").splitlines()
    for word in words.copy():
        if len(word) < 4:
            words.remove(word)
new_file = Path.joinpath(Path(__file__).parent, "long_word_list.txt")
with open (new_file, "x") as f:
    words_string = "\n".join(words)
    f.write(words_string)