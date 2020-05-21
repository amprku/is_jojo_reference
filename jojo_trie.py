import os
import re
import string
from pprint import pprint
from collections import defaultdict
import time

class Trie:

    def __init__(self):
        self.path = {}
        self.value = None
        self.value_valid = False

    def __setitem__(self, key, value):
        head = key[0]
        if head in self.path:
            node = self.path[head]
        else:
            node = Trie()
            self.path[head] = node

        if len(key) > 1:
            remains = key[1:]
            node.__setitem__(remains, value)
        else:
            node.value = value
            node.value_valid = True

    def __delitem__(self, key):
        head = key[0]
        if head in self.path:
            node = self.path[head]
            if len(key) > 1:
                remains = key[1:]
                node.__delitem__(remains)
            else:
                node.value_valid = False
                node.value = None
            if len(node) == 0:
                del self.path[head]

    def __getitem__(self, key):
        head = key[0]
        if head in self.path:
            node = self.path[head]
        else:
            raise KeyError(key)
        if len(key) > 1:
            remains = key[1:]
            try:
                return node.__getitem__(remains)
            except KeyError:
                raise KeyError(key)
        elif node.value_valid:
            return node.value
        else:
            raise KeyError(key)

    def __contains__(self, key):
        try:
            self.__getitem__(key)
        except KeyError:
            return False
        return True

    def __len__(self):
        n = 1 if self.value_valid else 0
        for k in self.path.keys():
            n = n + len(self.path[k])
        return n

    def get(self, key, default=None):
        try:
            return self.__getitem__(key)
        except KeyError:
            return default

    def nodeCount(self):
        n = 0
        for k in self.path.keys():
            n = n + 1 + self.path[k].nodeCount()
        return n

    def keys(self, prefix=[]):
        return self.__keys__(prefix)

    def __keys__(self, prefix=[], seen=[]):
        result = []
        if self.value_valid:
            isStr = True
            val = ""
            for k in seen:
                if type(k) != str or len(k) > 2:
                    isStr = False
                    break
                else:
                    val += k
            if isStr:
                result.append(val)
            else:
                result.append(prefix)
        if len(prefix) > 0:
            head = prefix[0]
            prefix = prefix[1:]
            if head in self.path:
                nextpaths = [head]
            else:
                nextpaths = []
        else:
            nextpaths = self.path.keys()
        for k in nextpaths:
            nextseen = []
            nextseen.extend(seen)
            nextseen.append(k)
            result.extend(self.path[k].__keys__(prefix, nextseen))
        return result

    def __iter__(self):
        for k in self.keys():
            yield k
        raise StopIteration

    def __add__(self, other):
        result = Trie()
        result += self
        result += other
        return result

    def __sub__(self, other):
        result = Trie()
        result += self
        result -= other
        return result

    def __iadd__(self, other):
        for k in other:
            self[k] = other[k]
        return self

    def __isub__(self, other):
        for k in other:
            del self[k]
        return self

    def __str__(self):
        answer = []
        for k in self.keys():
            answer.append("  t[%s] => %s" % (k, self[k]))
        return ' '.join(answer)

# these subs all have this in them right before the text, makes it easy to figure out what is worth adding.
SPLIT_STRING = ',0000,0000,0000,,'
SUB_DIR = 'sub_repo'

# only put lowercase ignore values
IGNORE_LIST = ['sign','sfx', 'signtop', 'sign bot', 'signbot']

trie = Trie()


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

unique_words =[]

# testing var
records = 0

# CONSTRUCT THE TRIE
# open each file
for file in all_files:
    # record the current episode
    part = file[19]
    episode = file.split(' - ')[1].split('_')[0].lstrip('0')

    # look at each line in the file
    with open(f'{SUB_DIR}\\{file}', 'r') as r:
        lines = r.readlines()
        for line in lines:
            # only focus on dialogue strings
            if SPLIT_STRING in line and records < 100:

                stats, sentence = line.split(SPLIT_STRING)

                # put stats (left values) in their locations.
                _, start_time, end_time, meta, character = stats.split(',')

                # remove wack characters from original sentence.
                sentence = sentence.split('}')[-1]
                sentence = sentence.replace('\\N', ' ')
                sentence = sentence.replace('\n', '')

                cleaned = re.sub(r'[^\w\s\']', '', sentence)
                words = cleaned.split()
                for word in words:
                    if word not in unique_words:
                        unique_words.append(word)

                trie[words[0]] = (None, {'paths': [sentence]})
                for i in range(1, len(words)):
                    if words[i] not in trie:
                        trie[words[i-1]] = (words[i], {'paths': [sentence]})
                    else:
                        print(trie)
                        trie[words[i]][1]['paths'].append(sentence)
                    records += 1

print(trie)
print(trie.keys())