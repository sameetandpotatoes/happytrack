# Run with `python3 manage.py shell -c "exec(open('seed.py').read(), globals())"`

import pytz
from api import models, recommender, utils
from faker import Faker
import random
import datetime
import logging
from django.utils import timezone
from collections import defaultdict
from django.utils.timezone import get_current_timezone

logger = logging.getLogger(__name__)

def chooser_factory(enum):
    vals = [x[0] for x in enum]
    return random.choice(vals)

def gen_random_logs_starting(starting_dt, person, friends, num_logs):
    logger.info("Generating logs for {} on {}".format(person.name, starting_dt.strftime("%m/%d/%y")))
    start_sunday = utils.round_to_sun(starting_dt)

    fake = Faker()

    # Generate the logs
    logs = []
    day_choices = list(range(7))
    for _ in range(num_logs):
        friend_idx = random.randint(0, len(friends)-1)
        friend_obj = friends[friend_idx]
        bout_a_week = starting_dt + datetime.timedelta(days=random.choice(day_choices))
        le = models.LogEntry()
        flip = random.random() < .1
        if flip:
            check = friend_idx > len(friends) // 2
        else:
            check = friend_idx <= len(friends) // 2

        # Add some randomness
        if check:
            le.reaction = random.choice(['HA', 'NE'])
        else:
            le.reaction = random.choice(['AN', 'SA'])

        le.other_loggable_text = random.choice(["", fake.paragraph()])
        le.logger = person
        le.loggee = friend_obj
        le.time_of_day = chooser_factory(models.LogEntry.TIME_CHOICES)
        le.social_context = chooser_factory(models.LogEntry.SOCIAL_CHOICES)
        le.content_class = chooser_factory(models.LogEntry.CONTENT_CHOICES)
        le.interaction_medium = chooser_factory(models.LogEntry.MEDIUM_CHOICES)
        other_loggable_text = fake.paragraph()
        le.save()
        le.created_at = bout_a_week
        le.save()
        logs.append(le)
    return logs


def dispositions_by_friend(person):
    all_logs = models.LogEntry.objects.filter(logger_id=person.id)
    disposition = defaultdict(lambda: defaultdict(lambda: 0))
    for log in all_logs:
        disposition[log.loggee_id][log.reaction] += 1

    for loggee in disposition.keys():
        per = disposition[loggee]
        tot = sum(per.values())
        for reacc in per.keys():
            per[reacc] /= tot

    return dict(disposition)

def promote_rec(rec, rec_to_promote, assigned_dt):
    rec_feed = models.RecommendationFeedback()
    rec_feed.rec = rec
    if rec.rec_typ == rec_to_promote:
        rec_feed.feedback_typ = 'WO'
    else:
        rec_feed.feedback_typ = 'DW'
    rec_feed.save()
    rec_feed.created_at = assigned_dt
    rec_feed.save()

def feedback_by_disposition(person, assigned_dt, from_dt=None):
    logger.info("Giving feedback for {} on {}".format(person.name, assigned_dt.strftime("%m/%d/%y")))
    # Generate some feedback according to the rules
    # If happy + neutral > .5 Positive reinforce
    # If angry + neutral > .5 Negative reinforce
    # If sad + neutral > .5 Avoid Reinforce
    # Else Generic Reinforce

    disp = dispositions_by_friend(person)
    base = models.Recommendation.objects.filter(recommend_person_id=person.id)
    if from_dt:
        base = base.filter(created_at__gte=from_dt)

    for rec in base.all():
        if rec.about_person_id is None:
            continue
        person_disp = disp[rec.about_person_id]
        happy = person_disp['HA']
        neutral = person_disp['NE']
        angry = person_disp['AN']
        sad = person_disp['SA']

        if happy + neutral > .5:
            promote_rec(rec, 'PO', assigned_dt)
        elif angry + neutral > .5:
            promote_rec(rec, 'NE', assigned_dt)
        elif sad + neutral > .5:
            promote_rec(rec, 'AV', assigned_dt)
        else:
            promote_rec(rec, 'GE', assigned_dt)

def print_all_recs(person):
    print([i.created_at.strftime("%m/%d/%y") for i in models.Recommendation.objects.filter(recommend_person_id=person.id)])

def generate_person(name, email, num_friends, num_logs):
    fake = Faker()

    # Save the newbie
    person = models.User()
    person.name = name
    person.email = email
    person.save()

    logger = logging.getLogger(__name__)
    logger.info('Created person {} id {}'.format(person.name, person.id))

    # Give em some friends
    friends = []
    for _ in range(num_friends):
        friend = models.Friend()
        friend.name = fake.name()
        friend.user = person
        friend.save()
        friends.append(friend)

    today_date = datetime.date.today().timetuple()[:6]
    today = get_current_timezone().localize(datetime.datetime(*today_date))
    sun = utils.round_to_sun(today)
    prev_sun = sun - datetime.timedelta(7)
    two_sun = prev_sun - datetime.timedelta(7)
    three_sun = two_sun - datetime.timedelta(7)

    # Generate the whole shebang for one week
    three_sun_logs = gen_random_logs_starting(three_sun, person, friends, num_logs)

    # Generate recommendations according to the logic
    recommender.recommendations_from_logs(three_sun_logs, person.id)

    # Change them to the right "date", they'll gen'd on Monday
    lil_after_sun = three_sun + datetime.timedelta(1)
    logger.info("For person {} changing recommend dates to {}".format(person.name, lil_after_sun.strftime("%m/%d/%y")))
    base = models.Recommendation.objects.filter(recommend_person_id=person.id)
    for rec in base.all():
        rec.created_at = lil_after_sun
        rec.save()

    feedback_by_disposition(person, lil_after_sun)

    # Generate the whole shebang for two weeks
    two_sun_logs = gen_random_logs_starting(two_sun, person, friends, num_logs)

    # Generate recommendations according to the logic
    recommender.recommendations_from_logs(two_sun_logs, person.id)

    # Change them to the right "date", they'll gen'd on Monday
    lil_after_sun = two_sun + datetime.timedelta(1)
    logger.info("For person {} changing recommend dates to {}".format(person.name, lil_after_sun.strftime("%m/%d/%y")))
    base = models.Recommendation.objects.filter(recommend_person_id=person.id).filter(created_at__gt=three_sun + datetime.timedelta(1))

    for rec in base.all():
        rec.created_at = lil_after_sun
        rec.save()

    feedback_by_disposition(person, lil_after_sun, from_dt=three_sun + datetime.timedelta(1))

    # Now just gen'ed the logs
    sun_logs = gen_random_logs_starting(prev_sun, person, friends, num_logs)

    # Generate recommendations according to the logic
    recommender.recommendations_from_logs(sun_logs, person.id)

    # Change them to the right "date", they'll gen'd on Monday
    lil_after_sun = prev_sun + datetime.timedelta(1)
    base = models.Recommendation.objects.filter(recommend_person_id=person.id).filter(created_at__gt=two_sun + datetime.timedelta(1))

    for rec in base.all():
        rec.created_at = lil_after_sun
        rec.save()


# TODO change username based on who's testing the app
generate_person('Bhuvan Venkatesh', 'bhuvan.venkatesh21@gmail.com', 15, 50)
# generate_person('Sameet Sapra', 'sameetandpotatoes@gmail.com', 5, 10)
generate_person('Lenny Pitt', 'lpitt2@illinois.edu', 5, 10)
