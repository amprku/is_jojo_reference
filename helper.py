"""
    Script to help make source data better, do common actions, etc.
"""

import os
import compile_data

def replace_bad_name(bad_name, replacement):
    for file in compile_data.all_files:
        file = f'./sub_repo/{file}'
        # read input file
        fin = open(file, "rt")
        # read file contents to string
        data = fin.read()
        # replace all occurrences of the required string
        data = data.replace(bad_name, replacement)
        # close the input file
        fin.close()
        # open the input file in write mode
        fin = open(file, "wt")
        # overrite the input file with the resulting data
        fin.write(data)
        # close the file
        fin.close()

def fix_part_numbers():
    for file in compile_data.all_files:
        file = f'./sub_repo/{file}'
        if 'JoJo2' in file:
            new_name = file.replace('JoJo2', 'JoJo3')
            os.rename(file, new_name)

replace_bad_name('â€', '')