try:
    import matplotlib
    matplotlib.use("TkAgg")
    import matplotlib.pyplot as plt
except ImportError as e:
    import matplotlib
    import matplotlib.pyplot as plt
    # macOS needs TkAgg I think, but Linux doesn't
    # we can also just do apt-get install python-tk then it should work
    pass

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
from . import recommender

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


def apply_filters(filt):
    if not filt:
        return {}

    ret = dict()
    # Filters are in the form key1,v1,v2...|key2...
    for filter_s in filt.split('|'):
        key, *rest = filter_s.split(',')
        ret[key + '__in'] = rest

    return ret

def create_mapping(lamb, almost_dict):
    diction = dict(almost_dict)
    return lambda x: diction[lamb(x)]

def organize_data(logs, viz_type):
    if viz_type == 'wordcloud':
        log_text = [x.other_loggable_text or "" for x in logs]
        aggregation = ''.join(log_text) + 'happy'
        return aggregation

    if viz_type == 'react':
        sel = create_mapping(lambda x: x.reaction, models.LogEntry.REACTION_CHOICES)
    elif viz_type == 'people':
        sel = lambda x: x.loggee.name
    elif viz_type == 'time':
        sel = create_mapping(lambda x: x.time_of_day, models.LogEntry.TIME_CHOICES)
    elif viz_type == 'context':
        sel = create_mapping(lambda x: x.social_context, models.LogEntry.SOCIAL_CHOICES)
    elif viz_type == 'medium':
        sel = create_mapping(lambda x: x.interaction_medium, models.LogEntry.MEDIUM_CHOICES)
    elif viz_type == 'content_class':
        sel = create_mapping(lambda x: x.content_class, models.LogEntry.CONTENT_CHOICES)

    groups = recommender.group_list_by_sel(logs, sel)
    aggregation = {k: len(v) for k, v in groups.items()}

    return aggregation

def gen_image(aggregation, viz_type):
    if viz_type == 'word':
        viz_data = charts.interaction_word_data_string(logs, 'Word cloud')

    labels = []
    vals = []
    for k, v in aggregation.items():
        labels.append(k)
        vals.append(v)
    xs = list(range(len(labels)))

    plt.clf()
    plt.bar(xs, vals)
    plt.xticks(xs, labels)
    plt.title("Custom Visualization")
    plt.xlabel(viz_type.replace('_', ' ').title())
    plt.ylabel('Num Interactions')
    ax = plt.gca()
    ax.set_xticklabels(labels, rotation = 45, ha="right")
    plt.tight_layout()

    return pyplot_to_base64()

def perform_viz_request(person_id, params):
    filters = dict(logger_id=person_id)

    from_date = params.get('from')
    if from_date:
        filters['created_at_gte'] = from_date

    to_date = params.get('to')
    if to_date:
        filters['created_at_lte'] = to_date

    filt_dj = apply_filters(params.get('filters', ''))
    final_filts = {**filters, **filt_dj}

    # Now we have all the filters, grab all the logs
    # no need to be too efficient
    logs = models.LogEntry.objects.filter(**final_filts).all()
    viz_type = params['field']
    aggregation = organize_data(logs, viz_type)
    viz_data = gen_image(aggregation, viz_type)

    return viz_data

