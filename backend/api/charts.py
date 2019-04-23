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

plt.style.use('bmh')
logger = logging.getLogger(__name__)

# if this changes, i'm losing it
DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', "Wednesday", 'Thursday', 'Friday', 'Saturday']

def colors_from_intensities(ys):
    from_color = np.array([52.9, 80.8, 92.2]) / 100
    to_color = np.array([0, 20, 40]) / 100

    colors = np.array(ys)
    colors -= colors.min()
    color_sum = colors.max()
    if color_sum != 0:
        colors = colors / color_sum
        colors = [from_color * (1-i) + to_color * i for i in colors]
    else:
        colors = [to_color for _ in ys]

    return colors

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
    ax.axis('off')

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
    colors = colors_from_intensities(ys)

    plt.bar(xs, ys, color=colors)
    plt.xticks(xs, DAYS_OF_THE_WEEK)
    plt.title(title)
    plt.xlabel('Day of the Week')
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    plt.gca().xaxis.grid(False)
    return pyplot_to_base64()

def interaction_context_data_string(logs, title):
    contexts = utils.valid_values_for_enum((models.LogEntry.SOCIAL_CHOICES))
    contexts_map = dict(models.LogEntry.SOCIAL_CHOICES)
    reacc_map = dict(models.LogEntry.REACTION_CHOICES)
    social_map = dict(models.LogEntry.SOCIAL_CHOICES)

    first_agg = recommender.group_list_by_sel(logs, lambda l: reacc_map[l.reaction])

    plt.clf()
    keys = sorted(first_agg.keys())
    sub_keys = sorted(list(social_map.keys()))
    xs = list(range(len(sub_keys)))
    bottom = np.zeros_like(xs)

    reacc_order = list(first_agg.keys())
    for reacc in reacc_order:
        sub_logs = first_agg[reacc]
        counts = _counts_by_getter(sub_logs, lambda l: l.social_context)

        ys = [counts.get(cont, 0) for cont in sub_keys]
        plt.bar(xs, ys, bottom=bottom, label=reacc)
        bottom += np.array(ys)

    plt.xticks(xs, [social_map[k] for k in sub_keys])
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.legend()
    plt.tight_layout()
    plt.gca().xaxis.grid(False)
    return pyplot_to_base64()

def interaction_time_data_string(logs, title):
    """
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
    plt.gca().xaxis.grid(False)
    plt.tight_layout()
    return pyplot_to_base64()
    """

    contexts = utils.valid_values_for_enum((models.LogEntry.SOCIAL_CHOICES))
    contexts_map = dict(models.LogEntry.SOCIAL_CHOICES)
    reacc_map = dict(models.LogEntry.REACTION_CHOICES)
    interaction_map = dict(models.LogEntry.MEDIUM_CHOICES)
    time_map = dict(models.LogEntry.TIME_CHOICES)

    first_agg = recommender.group_list_by_sel(logs, lambda l: interaction_map[l.interaction_medium])

    plt.clf()
    keys = sorted(first_agg.keys())
    sub_keys = sorted(list(time_map.keys()))
    xs = np.arange(len(sub_keys)) * 2
    width = .35
    colors = np.array([
        [205,224,241],
        [190,26,9],
        [0,105,253],
        [255,114,0],
    ]) / 255.0

    for i, reacc in enumerate( keys ):
        sub_logs = first_agg[reacc]
        counts = _counts_by_getter(sub_logs, lambda l: l.time_of_day)

        ys = [counts.get(cont, 0) for cont in sub_keys]
        plt.bar(xs + i * width, ys, width, label=reacc, color=colors[i])

    ax = plt.gca()
    ax.set_xticks(xs + width * (len(keys) // 2))
    ax.set_xticklabels([time_map[k] for k in sub_keys])
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.legend()
    ax.xaxis.grid(False)
    plt.tight_layout()
    return pyplot_to_base64()




def interaction_person_data_string(logs, title):
    friends_count = _counts_by_getter(logs, lambda l: l.loggee.name)
    friends = list(friends_count.keys())

    from_color = np.array([52.9, 80.8, 92.2]) / 100
    to_color = np.array([0, 20, 40]) / 100
    plt.clf()
    xs = list(range(len(friends)))
    ys = np.array( [friends_count[friend] for friend in friends] )
    colors = colors_from_intensities(ys)

    plt.bar(xs, ys, color=colors)
    plt.xticks(xs, friends)
    plt.title(title)
    plt.xlabel("Friend")
    plt.ylabel('Num Interactions')
    ax = plt.gca()
    ax.set_xticklabels(friends, rotation = 45, ha="right")

    plt.tight_layout()
    plt.gca().xaxis.grid(False)
    return pyplot_to_base64()


def interaction_weekly(user_id, title):
    all_logs = models.LogEntry.objects.filter(logger_id=user_id).all()
    log_dict = recommender.logs_by_week(all_logs)

    days = list(sorted(log_dict.keys()))
    if len(days) == 1:
        return None

    plt.clf()

    reacc_map = dict(models.LogEntry.REACTION_CHOICES)
    reaccs = list(sorted(reacc_map.keys()))
    y_datum_t = []
    for week in days:
        sub_logs = log_dict[week]

        friends_count = _counts_by_getter(sub_logs, lambda l: l.reaction)
        ys = [friends_count.get(key, 0) for key in reaccs]
        y_datum_t.append(ys)

    y_datum = np.array(y_datum_t).T
    for ys, reacc in zip(y_datum, reaccs):
        plt.plot(days, ys, label=reacc_map[reacc], linestyle='--', marker='o',)

    plt.title(title)
    plt.xlabel("Date")
    plt.ylabel("Num Interaction")
    plt.legend()
    plt.tight_layout()
    return pyplot_to_base64()



def interaction_word_data_string(logs, title):
    plt.clf()
    texts = []
    for log in logs:
        texts.append(log.other_loggable_text or "")
    text = ' '.join(texts)
    if not text:
        return None
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

def organize_data(logs, viz_type, agg_type=None):
    if viz_type == 'word':
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

    if agg_type in (None, 'sum'):
        aggregation = {k: len(v) for k, v in groups.items()}
    elif agg_type in 'week_avg':
        aggregation = dict()
        for k, v in groups.items():
            log_week = recommender.logs_by_week(v)
            vals = [len(sub_lis) for sub_lis in log_week.values()]
            vals_arr = np.array(vals)
            aggregation[k] = (vals_arr.mean(), vals_arr.std())
    else:
        log_week = recommender.logs_by_week(logs)
        dates = sorted(log_week.keys())
        aggregation = defaultdict(lambda: [])
        for date in dates:
            for k, v in groups.items():
                log_week = recommender.logs_by_week(v)
                vals = [len(sub_lis) for sub_lis in log_week.values()]
                aggregation[k].append(len(log_week.get(date, [])))
        return (dates, aggregation)

    return aggregation

def gen_image(aggregation, viz_type, agg_type=None):
    if viz_type == 'word':
        wordcloud(aggregation)
        plt.title("Word Cloud")
        return pyplot_to_base64()
    elif agg_type == 'week_time':
        dates, aggregation = aggregation
        keys = list(aggregation.keys())
        data = np.array([aggregation[k] for k in keys])
        for i, ys in enumerate(data):
            plt.plot(dates, ys, label=keys[i], linestyle='--', marker='o',)

        plt.xlabel('Date')
        plt.ylabel('Num Interactions')
        plt.title('Week over week interaction')
        plt.legend()
        return pyplot_to_base64()

    plt.clf()
    viz_name = viz_type.replace('_', ' ').title()
    if agg_type == 'week_avg':
        vals = []
        yerr = []
        labels = sorted(aggregation.keys())
        for k in labels:
            vals.append(aggregation[k][0])
            yerr.append(aggregation[k][1])
        xs = list(range(len(labels)))
        colors = colors_from_intensities(vals)
        plt.bar(xs, vals, color=colors, yerr=yerr)
        plt.title("{} Bar Chart (One bar is one standard deviation)".format(viz_name))
    else:
        vals = []
        labels = sorted(aggregation.keys())
        for k in labels:
            vals.append(aggregation[k])
        xs = list(range(len(labels)))
        colors = colors_from_intensities(vals)
        plt.bar(xs, vals, color=colors)
        plt.title("{} Bar Chart".format(viz_name))

    plt.xticks(xs, labels)
    plt.xlabel(viz_type.replace('_', ' ').title())
    plt.ylabel('Num Interactions')
    ax = plt.gca()
    ax.set_xticklabels(labels, rotation = 45, ha="right")
    ax.xaxis.grid(False)
    plt.tight_layout()

    return pyplot_to_base64()

def perform_viz_request(person_id, params):
    filters = dict(logger_id=person_id)

    from_date = params.get('from')
    if from_date:
        filters['created_at__gte'] = from_date

    to_date = params.get('to')
    if to_date:
        filters['created_at__lte'] = to_date

    filt_dj = apply_filters(params.get('filters', ''))
    final_filts = {**filters, **filt_dj}
    # Now we have all the filters, grab all the logs
    # no need to be too efficient
    logs = models.LogEntry.objects.filter(**final_filts).all()
    viz_type = params['field']
    agg_type = params.get('aggregation')
    aggregation = organize_data(logs, viz_type, agg_type=agg_type)
    viz_data = gen_image(aggregation, viz_type, agg_type=agg_type)

    return viz_data

