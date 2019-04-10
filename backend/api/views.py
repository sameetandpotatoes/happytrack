from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
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
    json_body = json.loads(request.body)
    ret = validate(json_body, utils.login_posts_schema)
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
    request.session[SESSION_USER_KEY] = m.id

@csrf_exempt
@restrict_function(allowed=['POST'])
def logout(request):
    token = request.session['token']
    # Invalidate token

    # Clear session
    request.session['token'] = ''
    request.session['id'] = ''

@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def interaction(request):
    json_body = json.loads(request.body)
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
        entry.logger_id = int(request.session['id'])
        entry.time_of_day = json_body['time']
        entry.social_context = json_body['social']
        entry.interaction_medium = json_body['medium']
        entry.other_loggable_text = json_body.get('description', '')
        entry.save()
        ret = json.dumps(dict(logger_id=entry.logger_id, loggee_id = entry.loggee_id))
        return HttpResponse(json.dumps(ret), content_type='application/json', status=200)

@csrf_exempt
@restrict_function(allowed=['GET'])
def me(request):
    json_body = json.loads(request.body)
    string = serializers.serialize('json', base.all())
    return HttpResponse(string, content_type='application/json', status=200)


@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def friends(request):
    json_body = json.loads(request.body)
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        pass


@restrict_function(allowed=['GET'])
def summary(request):
    json_body = json.loads(request.body)
    ret = validate(json_body, summary_get_schema)
    if ret is not None:
        return ret
    # TODO: What should this look like?

@restrict_function(allowed=['GET', 'POST'])
def recommendation(request):
    json_body = json.loads(request.body)
    if request.method == 'GET':
        ret = validate(json_body, interaction_get_schema)
        if ret is not None:
            return ret
    elif request.method == 'POST':
        ret = validate(json_body, interaction_get_schema)
        if ret is not None:
            return ret
