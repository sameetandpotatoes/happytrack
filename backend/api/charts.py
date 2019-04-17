try:
    import matplotlib
    matplotlib.use("TkAgg")
except ImportError as e:
    # macOS needs TkAgg I think, but Linux doesn't
    # we can also just do apt-get install python-tk then it should work
    pass

import matplotlib.pyplot as plt
from io import BytesIO
import base64
from . import utils
from . import models
plt.style.use('ggplot')
import logging
from collections import defaultdict
import calendar
from os import path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import os

from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

logger = logging.getLogger(__name__)

# if this changes, i'm losing it
DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', "Wednesday", 'Thursday', 'Friday', 'Saturday']

def wordcloud(text):
    alice_coloring=None
    stopwords = set(STOPWORDS)
    stopwords.add("said")

    wc = WordCloud(
        background_color="white",
        max_words=2000,
        mask=alice_coloring,
        stopwords=stopwords,
        max_font_size=40,
        random_state=42)
    # generate word cloud
    wc.generate(text)

    # show
    fig, ax = plt.subplots(1, 1)
    ax.imshow(wc, interpolation="bilinear")
    ax.grid(False)
    ax.set_xticks([])
    ax.set_yticks([])

def _counts_by_getter(logs, key_getter):
    ret = defaultdict(lambda: 0)
    for log in logs:
        key = key_getter(log)
        ret[key] += 1
    return dict(ret)

def pyplot_to_base64():
    figfile = BytesIO()
    plt.savefig(figfile, format='png')
    figfile.seek(0)  # rewind to beginning of file
    raw_data = figfile.getvalue()
    figdata_png = base64.b64encode(raw_data)
    return figdata_png.decode('utf-8')

def interaction_day_data_string(logs, title):
    plt.clf()
    xs = list(range(len(DAYS_OF_THE_WEEK)))
    counts = {calendar.day_name[k]: v for k, v in _counts_by_getter(logs, lambda l: l.created_at.weekday()).items()}
    ys = [counts.get(day, 0) for day in DAYS_OF_THE_WEEK]
    plt.bar(xs, ys)
    plt.xticks(xs, DAYS_OF_THE_WEEK)
    plt.title(title)
    plt.xlabel('Day of the Week')
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_context_data_string(logs, title):
    contexts = utils.valid_values_for_enum((models.LogEntry.SOCIAL_CHOICES))
    contexts_map = dict(models.LogEntry.SOCIAL_CHOICES)

    counts = {contexts_map[k]: v
              for k, v in _counts_by_getter(logs, lambda l: l.social_context).items()
              }
    plt.clf()
    xs = list(range(len(contexts)))
    ys = [counts.get(cont, 0) for cont in contexts]
    plt.bar(xs, ys)
    plt.xticks(xs, contexts)
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_time_data_string(logs, title):
    times = utils.valid_values_for_enum((models.LogEntry.TIME_CHOICES))
    contexts_map = dict(models.LogEntry.TIME_CHOICES)

    counts = {contexts_map[k]: v
              for k, v in _counts_by_getter(logs, lambda l: l.time_of_day).items()
              }
    plt.clf()
    xs = list(range(len(times)))
    ys = [counts.get(cont, 0) for cont in times]
    plt.bar(xs, ys)
    plt.xticks(xs, times)
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()


def interaction_person_data_string(logs, title):
    friends_count = _counts_by_getter(logs, lambda l: l.loggee.name)
    friends = list(friends_count.keys())

    plt.clf()
    xs = list(range(len(friends)))
    plt.bar(xs, [friends_count[friend] for friend in friends])
    plt.xticks(xs, friends)
    plt.title(title)
    plt.xlabel("Friend")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_word_data_string(logs, title):
    plt.clf()
    texts = []
    for log in logs:
        texts.append(log.other_loggable_text or "")
    text = ' '.join(texts) + 'happy'
    wordcloud(text)
    return pyplot_to_base64()
