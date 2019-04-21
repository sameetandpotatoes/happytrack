from django.http import HttpResponse
from . import models
import datetime
from django.utils.timezone import get_current_timezone

def round_to_sun(dt):
    day_idx = (dt.weekday() + 1) % 7 # MON = 0, SUN = 6 -> SUN = 0 .. SAT = 6
    sun = dt - datetime.timedelta(day_idx)
    return sun

def last_sunday():
    today_date = datetime.date.today().timetuple()[:6]
    today = get_current_timezone().localize(datetime.datetime(*today_date))

    return round_to_sun(today)

class restrict_function(object):
    def __init__(self, allowed=None):
        if allowed is None:
            self.allowed = list()
        else:
            self.allowed = allowed

    def __call__(self, func):
        def wrapped_f(*args):
            request = args[0]
            if request.method not in self.allowed:
                return HttpResponse("Invalid request verb {}".format(request.method), status=400)
            else:
                return func(*args)
        return wrapped_f

def valid_values_for_enum(enum):
    choices = [x[1] for x in enum]
    return choices

def any_of_enum(enum):
    vals = valid_values_for_enum(enum)
    return [{'type': 'string', 'pattern': x} for x in vals]

interaction_get_schema = {
    "type": "object",
    "properties": {
        'from': {
            'type': 'string',
            'format': 'date-time',
        },
        'to': {
            'type': 'string',
            'format': 'date-time',
        }
    },
}

interaction_post_schema = {
    "type": "object",
    "properties": {
        'reaction': {
            'anyOf': any_of_enum(models.LogEntry.REACTION_CHOICES),
        },
        'time': {
            'anyOf': any_of_enum(models.LogEntry.TIME_CHOICES),
        },
        'social': {
            'anyOf': any_of_enum(models.LogEntry.SOCIAL_CHOICES),
        },
        'medium': {
            'anyOf': any_of_enum(models.LogEntry.MEDIUM_CHOICES),
        },
        'content': {
            'anyOf': any_of_enum(models.LogEntry.CONTENT_CHOICES),
        },
        'loggee_id': {
            'anyOf': [
                { 'type': 'number', },
                { 'type': 'string', },
            ],
        },
        'description': {
            'type': 'string',
            'maxLength': 512,
        },
    },
    "required": ["reaction", "time",
                 "social", "medium",
                 "content", "loggee_id"],
}

summary_get_schema = {
    "type": "object",
    "properties": {
        'from': {
            'type': 'string',
            'format': 'date-time',
        },
        'to': {
            'type': 'string',
            'format': 'date-time',
        },
    },
}

recommendation_get_schema = {
    "type": "object",
    "properties": {
        'from': {
            'type': 'string',
            'format': 'date-time',
        },
        'to': {
            'type': 'string',
            'format': 'date-time',
        },
    },
}

recommendation_post_schema = {
    "type": "object",
    "properties": {
        "feedback_id": {
            'type': 'number',
        },
        'feedback': {
            'anyOf': any_of_enum(models.RecommendationFeedback.FEEDBACK_CHOICES),
        },
    },
    "required": ["feedback_id", "feedback"],
}

login_post_schema = {
    "type": "object",
    "properties": {
        "token": {
            'type': 'string',
        },
    },
    'required': ['token'],
}

friend_post_schema = {
    "type": "object",
    "properties": {
        "name": {
            'type': 'string',
        },
    },
    'required': ['name'],
}

email_get_schema = {
    "type": "object",
    "properties": {

    }
}
