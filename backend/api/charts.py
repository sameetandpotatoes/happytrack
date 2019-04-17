import matplotlib.pyplot as plt
from io import BytesIO
import base64
from . import utils
from . import models
import pygal
plt.style.use('ggplot')
import logging

logger = logging.getLogger(__name__)

# if this changes, i'm losing it
DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', "Wednesday", 'Thursday', 'Friday', 'Saturday']

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
    plt.bar(xs, [101 for _ in DAYS_OF_THE_WEEK])
    plt.xticks(xs, DAYS_OF_THE_WEEK)
    plt.title(title)
    plt.xlabel('Day of the Week')
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_context_data_string(logs, title):

    contexts = utils.valid_values_for_enum((models.LogEntry.SOCIAL_CHOICES))

    plt.clf()
    xs = list(range(len(contexts)))
    plt.bar(xs, [101 for _ in contexts])
    plt.xticks(xs, contexts)
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_person_data_string(logs, title):
    friends = ['Bob', 'Joel']

    plt.clf()
    xs = list(range(len(friends)))
    plt.bar(xs, [101 for _ in friends])
    plt.xticks(xs, friends)
    plt.title(title)
    plt.xlabel("Friend")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()

def interaction_word_data_string(logs, title):
    plt.clf()
    contexts = ['bob']

    xs = list(range(len(contexts)))
    plt.bar(xs, [101 for _ in contexts])
    plt.xticks(xs, contexts)
    plt.title(title)
    plt.xlabel("Social Context")
    plt.ylabel('Num Interactions')
    plt.tight_layout()
    return pyplot_to_base64()
