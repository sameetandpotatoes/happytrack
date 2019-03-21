from django.http import HttpResponse

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
        'logger_id': {
            'type': 'number',
        },
        'from': {
            'type': 'string',
            'format': 'date-time',
        },
        'to': {
            'type': 'string',
            'format': 'date-time',
        }
    },
    'required': ['logger_id'],
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
        'loggee_id': {
            'anyOf': [
                { 'type': 'number', },
                { 'type': 'string', },
            ],
        },
        'logger_id': {
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
                 'social', 'medium',
                 'loggee_id', 'logger_id'],
}

summary_get_schema = {
    "type": "object",
    "properties": {
        'logger_id': {
            'type': 'number',
        },
    },
    'required': ['logger_id'],
}

recommendation_get_schema = {
    "type": "object",
    "properties": {
        "logger_id": {
            'type': 'number',
        },
    },
}

recommendation_post_schema = {
    "type": "object",
    "properties": {
        "logger_id": {
            'type': 'number',
        },
        "feedback_id": {
            'type': 'number',
        },
        'feedback': {
            'anyOf': any_of_enum(models.RecommendationFeedback.FEEDBACK_CHOICES),
        },
    },
}
