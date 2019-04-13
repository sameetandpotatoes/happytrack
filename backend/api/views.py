from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
import json
from .utils import restrict_function, interaction_get_schema, interaction_post_schema, summary_get_schema
from . import utils
from . import models
import jsonschema
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from django.core import serializers
from django.conf import settings

def validate(instance, schema, *args, **kwargs):
    try:
        jsonschema.validate(instance, schema, *args, **kwargs)
        return None
    except jsonschema.exceptions.ValidationError as e:
        return HttpResponseBadRequest(str(e))

SESSION_TOKEN_KEY = 'auth-token'
SESSION_USER_KEY = 'user-id'

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
        args = {'fields' : 'id,name,email', }
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
    Logs an interaction

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
        description: optional(str), # Any additional information
    }

    Output:
    {
        logger_id: int, # Who was logging
        loggee_id: int, # Who was logged
    }
    """

    try:
        json_body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    if request.method == 'GET':
        ret = validate(json_body, interaction_get_schema)
        if ret is not None:
            return ret
        logger_id = request.session[SESSION_USER_KEY]
        base = models.LogEntry.objects.filter(logger_id=logger_id)
        if 'from' in json_body:
            base = base.filter(created_at__ge=json_body['from'])
        if 'to' in json_body:
            base = base.filter(created_at__lt=json_body['to'])
        string = serializers.serialize('json', base.all())
        return HttpResponse(string, content_type='application/json', status=200)
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
        entry.other_loggable_text = json_body.get('description', '')
        entry.save()
        ret = json.dumps(dict(logger_id=entry.logger_id, loggee_id = entry.loggee_id))
        return HttpResponse(json.dumps(ret), content_type='application/json', status=200)


@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def friends(request):
    """
    Get:
    Retrieves all friends for logged in users

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
    Empty Body

    """

    try:
        json_body = json.loads(request.body)
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
        return HttpResponse(status=200)


@csrf_exempt
@restrict_function(allowed=['GET'])
def summary(request):
    """
    Get:
    Returns a list of recommendations

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
    # TODO: What should this look like?
    return HttpResponse(status=501)

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
        Recommendation
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
        json_body = json.loads(request.body)
    except json.decoder.JSONDecodeError as e:
        return HttpResponseBadRequest(str(e))

    if request.method == 'GET':
        ret = validate(json_body, recommendation_get_schema)
        if ret is not None:
            return ret

        return HttpResponse(status=501)

    elif request.method == 'POST':
        ret = validate(json_body, recommendation_post_schema)
        if ret is not None:
            return ret

        return HttpResponse(status=501)
