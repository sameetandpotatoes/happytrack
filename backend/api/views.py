from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import json
from .utils import restrict_function, interaction_get_schema, interaction_post_schema, summary_get_schema
from . import models
import jsonschema
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from django.core import serializers

def validate(instance, schema, *args, **kwargs):
    try:
        jsonschema.validate(instance, schema, *args, **kwargs)
        return None
    except jsonschema.exceptions.ValidationError as e:
        return HttpResponseBadRequest(str(e))

@csrf_exempt
@restrict_function(allowed=['GET', 'POST'])
def interaction(request):
    json_body = json.loads(request.body)
    if request.method == 'GET':
        ret = validate(json_body, interaction_get_schema)
        if ret is not None:
            return ret
        base = models.LogEntry.objects.filter(logger_id=json_body['logger_id'])
        print(models.LogEntry.objects.all())
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

        # TODO: Refactor code
        entry.loggee_id = json_body['loggee_id']
        loggee_uuid = json_body['loggee_id']
        if isinstance(loggee_uuid, int):
            entry.loggee_id = loggee_uuid
        else:
            person = models.Person()
            person.name = loggee_uuid
            person.save()
            entry.loggee_id = person.id

        entry.logger_id = json_body['logger_id']
        logger_uuid = json_body['logger_id']
        if isinstance(logger_uuid, int):
            entry.logger_id = logger_uuid
        else:
            person = models.Person()
            person.name = logger_uuid
            person.save()
            entry.logger_id = person.id


        entry.time_of_day = json_body['time']
        entry.social_context = json_body['social']
        entry.interaction_medium = json_body['medium']
        entry.other_loggable_text = json_body.get('description', '')
        entry.save()
        ret = json.dumps(dict(logger_id=entry.logger_id, loggee_id = entry.loggee_id))
        return HttpResponse(json.dumps(ret), content_type='application/json', status=200)


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
