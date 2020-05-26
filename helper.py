"""
    Script to help make source data better, do common actions, etc.
"""

import os
import re
import json
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
    for file in compile_data.all_files[::-1]:
        file = f'./sub_repo/{file}'

        if 'JoJo3' in file:
            episode_numbers = file.split(' - ')[1].split('_')[0]
            current_episode = int(episode_numbers.lstrip('0'))
            actual_episode = str(current_episode + 24)
            new_name = file.replace(str(episode_numbers), actual_episode)
            print(f'I wouldve made {file} become {new_name}')

        if 'JoJo2' in file:
            new_name = file.replace('JoJo2', 'JoJo3')
            print(f'I wouldve made {file} become {new_name}')
            # os.rename(file, new_name)

        if 'JoJo1' in file and int(file.split(' - ')[1].split('_')[0].lstrip('0')) > 9:
            new_name = file.replace('JoJo1', 'JoJo2')
            print(f'I wouldve made {file} become {new_name}')


def write_compiled_data_to_json(filename):
    result = {'data': compile_data.organized_data}
    with open(f'{filename}.json', 'w') as f:
        f.write(json.dumps(result))

import string

def raw(text):
    # return the text cleaned and formatted.

    # remove wack characters from original sentence.
    text = text.split('}')[-1]
    text = text.replace('\\N', ' ')
    text = text.replace('\n', '')
    text = text.translate(str.maketrans('', '', string.punctuation))

    return text

