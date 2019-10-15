# Import CSV module, used to read excuses
import csv
# Import random, used to select excuse
import random

def load_excuses():
    excuses = []

    with open('excuses.txt') as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        for row in readCSV:
            excuses.append(str(row))
    return(excuses)

def random_excuse(excuses):
    excuse = str(random.choice(excuses))[1:-1]
    return(excuse)
