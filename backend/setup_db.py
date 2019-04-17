import requests
import random
import sys

friends = {
    "friends": [
        [
            "billy",
            1
        ],
        [
            "jessica",
            2
        ],
        [
            "catherine",
            3
        ],
        [
            "destiny",
            4
        ],
        [
            "raquel",
            5
        ],
        [
            "sarai",
            6
        ],
        [
            "fae",
            7
        ],
        [
            "holly",
            8
        ],
        [
            "lydia",
            9
        ],
        [
            "neda",
            10
        ],
        [
            "mireya",
            11
        ],
        [
            "anglea",
            12
        ],
        [
            "kami",
            13
        ],
        [
            "claire",
            14
        ],
        [
            "theresa",
            15
        ],
        [
            "hershel",
            16
        ],
        [
            "ira",
            17
        ],
        [
            "mary",
            18
        ],
        [
            "kirby",
            19
        ],
        [
            "donnell",
            20
        ],
        [
            "ernesto",
            21
        ],
        [
            "ezra",
            22
        ],
        [
            "dalton",
            23
        ]
    ]
}

reactions = ['Happy', 'Neutral', 'Tired', 'Angry', 'Sad']
times = ['Morning', 'Afternoon', 'Evening']
social = ['Academic', 'Social', 'Other', 'Work']
medium = ['In Person', 'Online', 'Over The Phone']
content = ['Small Talk', 'One Personal', 'Both Personal']

BASE_URL = 'http://127.0.0.1:8000/api/'

s = requests.Session()
r = s.post('http://127.0.0.1:8000/api/login/', json={"token": "lenny-token"})

# good friends, positive interactions
for name, fid in friends["friends"][:3]:
    payload = {
        "reaction": "Happy",
        "time": random.choice(times),
        "social":random.choice(social),
        "medium": random.choice(medium),
        "loggee_id": fid,
        "content": random.choice(content[1:]),
        "description": "Asked advice from {}".format(name)
    }
    r = s.post('http://127.0.0.1:8000/api/interaction/', json=payload)
    if r.status_code != 200:
        print("Failed")

for name, fid in friends["friends"][:3]:
    payload = {
        "reaction": "Happy",
        "time": random.choice(times),
        "social":"Social",
        "medium": "In Person",
        "loggee_id": fid,
        "content": random.choice(content[1:]),
        "description": "Had dinner with {}".format(name)
    }
    r = s.post('http://127.0.0.1:8000/api/interaction/', json=payload)
    if r.status_code != 200:
        print("Failed")

for name, fid in friends["friends"][:3]:
    payload = {
        "reaction": "Neutral",
        "time": random.choice(times),
        "social":random.choice(social),
        "medium": "Online",
        "loggee_id": fid,
        "content": random.choice(content[1:]),
        "description": "Chatted with {}".format(name)
    }
    r = s.post('http://127.0.0.1:8000/api/interaction/', json=payload)
    if r.status_code != 200:
        print("Failed")

# bad friends, negative interactions, "they need their morning coffee"
for _ in range(10):
    for name, fid in friends["friends"][3:5]:
        payload = {
            "reaction": random.choice(reactions[2:]),
            "time": "Morning",
            "social":random.choice(['Academic', 'Work']),
            "medium": random.choice(medium[:2]),
            "loggee_id": fid,
            "content": "Small Talk",
            "description": "Briefly talked to {}".format(name)
        }
        r = s.post('http://127.0.0.1:8000/api/interaction/', json=payload)
        if r.status_code != 200:
            print("Failed")

# random extra data
for _ in range(10):
    for name, fid in friends["friends"][5:]:
        payload = {
            "reaction": random.choice(reactions),
            "time": random.choice(times),
            "social":random.choice(social),
            "medium": random.choice(medium),
            "loggee_id": fid,
            "content": "Small Talk",
            "description": "Chatted with {}".format(name)
        }
        r = s.post('http://127.0.0.1:8000/api/interaction/', json=payload)
        if r.status_code != 200:
            print("Failed")