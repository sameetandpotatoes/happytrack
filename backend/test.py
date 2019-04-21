# coding: utf-8

from api import models
from api import utils
from api import recommender
from pprint import pprint
logs = models.LogEntry.objects.filter(logger_id=135).all()
recommender.recommendations_from_ml(logs, 135)
