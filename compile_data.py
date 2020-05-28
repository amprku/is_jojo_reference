import os
import re
import string
from pprint import pprint

# these subs all have this in them right before the text, makes it easy to figure out what is worth adding.
SPLIT_STRING = ',0000,0000,0000,,'
SUB_DIR = 'sub_repo'

# only put lowercase ignore values
IGNORE_LIST = ['sign','sfx', 'signtop', 'sign bot', 'signbot']


all_files = os.listdir(SUB_DIR)
organized_data = []

full_names = {
    # wack shortened name fixes
    'dop': 'Doppio',
    'dopp': 'Doppio',
    'nara': 'Narancia',
    'nar': 'Narancia',
    'naran': 'Narancia',
    'ghia': 'Ghirga',
    'koi': 'Koichi',
    'oku': 'Okuyasu',
    'jose': 'Josuke',
    'josu': 'Josuke',
    'kakyo': 'Kakyoin',
    'haya': 'Hayato',
    'gio': 'Giorno',
    'jean': 'Polnareff',
    'pol': 'Polnareff',
    'roha':'Rohan',
    'shig':'Shigechi',
    'ange':'Angelo',
    'dia':'Diavolo',

    'boin':'Boingo',
    'hol':'Hol Horse',

    # stand name fixes
    'act': 'Stand: Echoes',



}

# does not include part 1 characters
jojo_dict = {
    '2': 'Jotaro',
    '3': 'Jotaro',
    '4': 'Josuke',
    '5': 'Giorno',
    '6': 'Jolyne'
}

def get_actual_part(season, episode):
    if int(season) == 2:
        return 3

    if int(season) == 1:
        if int(episode) > 9:
            return 2

    return int(season)


def get_jojo_name(part, episode):
    # Have to do this bullshit because of Johnathon and Joseph sharing a part
    if part == '1':
        if int(episode) < 10:
            return 'Johnathon'
        else:
            return 'Joseph'
    else:
        return jojo_dict.get(part)

def get_full_name(name):
    if full_names.get(name):
        return full_names[name]
    else:
        return name.capitalize()


def name_convert(character, part, episode, **kwargs):
    if character == 'Default': return ''
    if character.lower() == 'jojo': return get_jojo_name(part, episode)
    else:return get_full_name(character.lower())

def raw(text):
    # return the text cleaned and formatted.

    # remove wack characters from original sentence.
    text = text.lower()
    text = text.split('}')[-1]
    text = text.replace('\\N', ' ')
    text = text.replace('\n', '')
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text

# setup data
for file in all_files:
    season = file[19]
    episode = file.split(' - ')[1].split('_')[0].lstrip('0')
    with open(f'{SUB_DIR}/{file}', 'r', errors='ignore') as r:
        lines = r.readlines()

        for line in lines:

            if SPLIT_STRING in str(line):
                try:
                    stats, sentence = line.split(SPLIT_STRING)

                    # remove wack characters from original sentence.
                    sentence = sentence.split('}')[-1]
                    sentence = sentence.replace('\\N', ' ')
                    sentence = sentence.replace('\n', '')

                    # put stats (left values) in their locations.
                    _, start_time, end_time, meta, character = stats.split(',')

                    raw_sentence = raw(sentence)

                    if character.lower() not in IGNORE_LIST:
                        if not character and len(organized_data) > 1 and int(season) >= 3:
                            organized_data[-1]['sentence'] += f' {sentence}'
                        else:
                            current = {
                                'sentence': sentence.capitalize(),
                                'raw': raw_sentence,
                                'season': season,
                                'episode': episode,
                                'part': get_actual_part(season, episode),
                                'time_stamp':start_time,
                                'minutes':start_time.split(':')[1],
                                'seconds':start_time.split(':')[2].split('.')[0],
                                'character': character
                            }
                            current['character'] = name_convert(**current)
                            organized_data.append(current)
                except Exception as e:
                    print('parse error', e)


def get_all_phrases_strings(phrase, limit=100):
    answers = []
    for item in organized_data:
        raw_string = item['sentence'].lower().strip(string.punctuation)
        if phrase.lower() in raw_string and len(answer) < limit:
            answers.append(
                f'{name_convert(**item)} said \'{item["sentence"]}\' at {item["minutes"]}:{item["seconds"]} in season {item["part"] } episode {item["episode"]}')
    return answers


def get_all_phrase_data(phrase):
    answers = []
    def contains_word(s, w):
        return (' ' + w + ' ') in (' ' + s + ' ')

    for item in organized_data:
        if contains_word(item['raw'], raw(phrase)):
            answers.append(item)

    return answers




if __name__ == '__main__':
    phrase = input()
    answers = get_all_phrases_strings(phrase)
    if not answers:
        print('NO NO NO \nthis is not a jojo reference.\nNO NO NO')
    else:
        print('YES YES YES')
        print(f'This phrase was mentioned {len(answers)} times.')
        print('YES YES YES')

        print('Do you want to print them out')
        resp = input()
        if resp.lower() == 'y':
            for answer in answers:
                print(answer)
