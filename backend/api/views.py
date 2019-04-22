from django.db import connection
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from django.core import serializers
from django.conf import settings
from django.core.mail import send_mail
from django.template import loader

from django.core.mail import EmailMessage
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import facebook

import logging

import json
import jsonschema
import datetime

from .utils import restrict_function, interaction_get_schema, interaction_post_schema, summary_get_schema, email_get_schema
from . import utils
from . import models
from . import recommender
from . import charts

from sklearn.ensemble import RandomForestClassifier

# Get an instance of a logger
logger = logging.getLogger(__name__)

def validate(instance, schema, *args, **kwargs):
    try:
        jsonschema.validate(instance, schema, *args, **kwargs)
        return None
    except jsonschema.exceptions.ValidationError as e:
        return HttpResponseBadRequest(str(e))

SESSION_TOKEN_KEY = 'auth-token'
SESSION_USER_KEY = 'user-id'

ML_SPLIT_THRESHOLD = 10

@csrf_exempt
@restrict_function(allowed=['POST'])
def login(request):
    """
    Logs into the backend of the app

    Input
    {
        token: str
    }

    Output:
    Empty Body

    """

    try:
        json_body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    ret = validate(json_body, utils.login_post_schema)
    if ret is not None:
        return ret

    # Validate token
    token = json_body['token']
    request.session[SESSION_TOKEN_KEY] = token
    if settings.DEBUG:
        name = 'Lenny'
        email = 'lpitt2@illinois.edu'
    else:
        graph = facebook.GraphAPI(token)
        args = dict(
            fields='id,name,email',
            )
        profile = graph.get_object('me', **args)
        name = profile['name']
        email = profile['email']

    m, created = models.User.objects.get_or_create(
        email=email,
    )
    m.name = name
    m.save()

    # Store in session
    request.session[SESSION_USER_KEY] = str(m.id)
    return HttpResponse(status=200)

@csrf_exempt
@restrict_function(allowed=['POST'])
def logout(request):
    """
    Get:
    Logs out of the backend of the app

    Input:
    Ignored

    Output:
    Empty Body

    """

    request.session[SESSION_TOKEN_KEY] = ''
    request.session[SESSION_USER_KEY] = ''
    return HttpResponse(status=200)

@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def interaction(request):
    """
    Get:
    Gets an interaction

    Input:
    {
        from: optional(str, date)
        to: optional(str, date)
    }

    Output:
    [
      Logs
    ]

    ====

    Post:
    Post changes in interaction

    Input:
    {
        loggee_id: int, # Who is getting logged
        time: str, # Time of data
        social: str, # Social context
        medium: str, # Medium
        content: str, # social content
        description: optional(str), # Any additional information
    }

    Output:
    {
        success: bool
    }
    """

    try:
        json_body = json.loads(request.body or '{}')
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    if request.method == 'GET':
        ret = validate(json_body, interaction_get_schema)
        if ret is not None:
            return ret
        logger_id = request.session[SESSION_USER_KEY]
        base = models.LogEntry.objects.filter(logger_id=logger_id).prefetch_related()
        if 'from' in json_body:
            base = base.filter(created_at__ge=json_body['from'])
        if 'to' in json_body:
            base = base.filter(created_at__lt=json_body['to'])
        string = serializers.serialize('json', base.all())

        interaction_json = {
            "interactions": []
        }
        for it in base:
            interaction_json['interactions'].append({
                "id": it.id,
                "reaction": it.get_reaction_display(),
                "loggee": it.loggee.name,
                "logger": it.logger.name,
                "time_of_day": it.get_time_of_day_display(),
                "social_context": it.get_social_context_display(),
                "interaction_medium": it.get_interaction_medium_display(),
                "content_class": it.get_content_class_display(),
                "other_loggable_text": it.other_loggable_text,
                "created_at": it.created_at
            })
        return JsonResponse(interaction_json, status=200)
    elif request.method == 'POST':
        ret = validate(json_body, interaction_post_schema)
        if ret is not None:
            return ret
        entry = models.LogEntry()
        entry.reaction = json_body['reaction']

        entry.loggee_id = int(json_body['loggee_id'])
        entry.logger_id = int(request.session[SESSION_USER_KEY])
        entry.time_of_day = json_body['time']
        entry.social_context = json_body['social']
        entry.interaction_medium = json_body['medium']
        entry.content_class = json_body['content']
        entry.other_loggable_text = json_body.get('description', '')
        entry.save()
        return JsonResponse({"success": "true"}, status=200)

@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def friends(request):
    """
    Get:
    Retrieves all friends for logged in user

    Input:
    Empty Body

    Output:
    {
        friends:
        [
            Friends
        ]
    }

    ====

    Post:
    Adds a friend

    Input:
    {
        name: str,
    }

    Output:
    {
        friend: Friend
    }

    """

    try:
        json_body = json.loads(request.body or '{}')
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    if request.method == 'GET':
        user = models.User.objects.get(id=request.session[SESSION_USER_KEY])
        query_result = models.Friend.objects.filter(user=user)
        result = [(f.name, f.id) for f in query_result]
        return JsonResponse({"friends": result}, status=200)
    elif request.method == 'POST':
        ret = validate(json_body, utils.friend_post_schema)
        if ret is not None:
            return ret
        user = models.User.objects.get(id=request.session[SESSION_USER_KEY])
        m, created = models.Friend.objects.get_or_create(
            user=user,
            name=json_body['name'],
        )
        m.save()
        return JsonResponse({"friend": (m.name, m.id)}, status=200)

@csrf_exempt
@restrict_function(allowed=['GET'])
def summary(request):
    """
    Get:
    Returns weekly summary

    Input:
    {
        from: optional(str, date)
        to: optional(str, date)
    }

    Output:
    [
        Summary
    ]

    """

    try:
        json_body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    ret = validate(json_body, summary_get_schema)
    if ret is not None:
        return ret
    response = {
        "interactions": [],
        "recommendations": []
    }
    user_id = request.session[SESSION_USER_KEY]
    base = models.LogEntry.objects.filter(logger_id=user_id)
    if 'from' in json_body:
        base = base.filter(created_at__ge=json_body['from'])
    if 'to' in json_body:
        base = base.filter(created_at__lt=json_body['to'])
    for interaction in base:
        interaction_json = {
            "reaction": interaction.reaction,
            "loggee": interaction.loggee.name,
            "time_of_day": interaction.time_of_day,
            "social_context": interaction.social_context,
            "interaction_medium": interaction.interaction_medium,
            "other_loggable_text": interaction.other_loggable_text,
            "created_at": interaction.created_at,
            "updated_at": interaction.updated_at,
        }
        response['interactions'].append(interaction_json)
    return JsonResponse(response, status=200)

@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def recommendation(request):
    """
    Get:
    Returns a list of recommendations

    Input:
    {
        from: optional(str),
        to: optional(str),
    }

    Output:
    [
        Recommendations
    ]

    ===

    Input:
    {
        feedback_id: int,
        feedback: str,
    }

    Output:
    Empty Body

    Post:
    Updates a piece of feedback for piece of recommendation
    """

    try:
        json_body = json.loads(request.body or '{}')
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    if request.method == 'GET':
        ret = validate(json_body, utils.recommendation_get_schema)
        if ret is not None:
            return ret
        user_id = request.session[SESSION_USER_KEY]
        base = models.LogEntry.objects.filter(logger_id=user_id)
        if 'from' in json_body:
            base = base.filter(created_at__ge=json_body['from'])
        if 'to' in json_body:
            base = base.filter(created_at__lt=json_body['to'])
        logs = list(base)
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT COUNT(*) FROM api_recommendationfeedback WHERE
            id IN (SELECT id FROM api_recommendation WHERE recommend_person_id = %s) AND feeedback_typ = 'WO'
            """,
            [user_id]
        )
        feedback_count = cursor.fetchone()[0]

        if feedback_count < ML_SPLIT_THRESHOLD:
            recs = recommender.recommendations_from_logs(logs, user_id)
        else:
            recs = recommender.recommendations_from_ml(logs, user_id, from_dt=json_body['from'], to_dt=json_body['to'])

        safe_recs = dict(
            data=[
                {
                    "id": rec.id,
                    "rec_typ": rec.rec_typ,
                    "recommendation": rec.recommendation,
                    "rec_description": rec.rec_description,
                    "feedback": rec.feedback
                }
                for rec in recs
            ]
        )

        return JsonResponse(safe_recs, status=200)

    elif request.method == 'POST':
        ret = validate(json_body, utils.recommendation_post_schema)
        if ret is not None:
            return ret
        try:
            recommendation = models.Recommendation.objects.get(id=json_body['feedback_id'])
        except models.Recommendation.DoesNotExist as e:
            return HttpResponseBadRequest("Recommendation with ID {} does not exist.".format(json_body['feedback_id']))
        feedback = models.RecommendationFeedback()
        feedback.rec = recommendation
        feedback.feedback_typ = json_body['feedback']
        feedback.save()
        return HttpResponse(status=200)

@csrf_exempt
@restrict_function(allowed=['GET'])
def email(request):
    """
    Get:
    Debug Endpoint: Sends an email

    {
        'from': optional(date),
        'to': optional(date),
    }
    """
    try:
        json_body = json.loads(request.body or '{}')
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    ret = validate(json_body, email_get_schema)
    if ret is not None:
        return ret

    # logger_id = request.session[SESSION_USER_KEY]

    # TODO: REMOVE THIS
    logger_id = 73
    base = models.LogEntry.objects.filter(logger_id=logger_id)
    if 'from' in json_body or 'to' in json_body:
        if 'from' in json_body:
            base = base.filter(created_at__ge=json_body['from'])
        if 'to' in json_body:
            base = base.filter(created_at__lt=json_body['to'])
    else:
        sun = utils.last_sunday()
        prev_sun = sun - datetime.timedelta(7)
        base = base.filter(created_at__lt=sun)
        base = base.filter(created_at__gte=prev_sun)
        from_datetime = prev_sun.strftime("%m/%d/%y")
        to_datetime = sun.strftime("%m/%d/%y")

    log_objs = list(base.all())
    template = loader.get_template('email.html')

    freq_png = charts.interaction_day_data_string(log_objs, 'Interaction Frequency {} - {}'.format(from_datetime, to_datetime))
    context_png = charts.interaction_context_data_string(log_objs, 'Social Frequency {} - {}'.format(from_datetime, to_datetime))
    time_png = charts.interaction_time_data_string(log_objs, 'Time Frequency {} - {}'.format(from_datetime, to_datetime))
    person_png = charts.interaction_person_data_string(log_objs, 'Person Frequency {} - {}'.format(from_datetime, to_datetime))
    word_png = charts.interaction_word_data_string(log_objs, 'Word Frequency {} - {}'.format(from_datetime, to_datetime))

    context = dict(
        week_start = from_datetime,
        week_end = to_datetime,
        frequency_embed = freq_png,
        social_embed = context_png,
        time_embed = time_png,
        person_embed = person_png,
        word_embed = word_png
    )

    rendered_html = template.render(context)
    return HttpResponse(rendered_html, status=200)

