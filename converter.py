import os

current_directory = os.getcwd()
filename = "valid-wordle-words.txt"

file_path = os.path.join(current_directory, filename)
output_file_path = os.path.join(current_directory, 'output.txt')

f = open(file_path, "r")

words = f.read().split("\n")

output  = ''

for word in words:
    outword = '['
    for char in word:
        outword += "'" + char.capitalize() + "'" + ','
    output += outword[:-1] + "], "

output_file = open(output_file_path, 'w')

output_file.write(output)

print(output)