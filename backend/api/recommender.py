import copy

from .models import User, Friend, Recommendation, LogEntry
from collections import defaultdict
from sklearn.ensemble import RandomForestClassifier
import datetime

IN_PERSON_REC_DESC = (
    "In-person interactions allow for more control "
    "over the interaction, like body language "
    "and other visual cues. Online and over-the-phone "
    "interactions should be used once a good relationship "
    "is already built."
)

GENERALLY_POSITIVE_REC_DESC = (
    "Looks like your interactions with "
    "this friend are typically positive - "
    "try to have more of them!"
)

DIFFERENT_TIME_REC_DESC = (
    "It's okay to be tired! "
    "Talk to this friend when you feel more awake, "
    "like after your morning coffee."
)

GENERALLY_NEGATIVE_REC_DESC = (
    "If this friend makes you feel angry, "
    "it's a good idea to re-evaluate your "
    "relationship or the context around "
    "interactions that make you angry."
)

AVOID_REC_DESC = (
    "People that make you feel sad "
    "shouldn't be in your life, "
    "it's that simple!"
)

SPREAD_INTERACTIONS_REC_DESC = (
    "Concentrating all of your interactions "
    "in one part of the day makes it easier "
    "for negative ones to ruin your day "
    "and harder ones to positively influence your "
    "day. Remember: some people need their "
    "coffee in the morning!"
)

AVOID_SMALL_REC_DESC = (
    "Studies have shown that having more small talk "
    "than not has a negative impact on happiness "
    "and interaction quality. Focus on having more "
    "substantive conversations, especially with this "
    "friend."
)

LAUGH_REC_DESC = (
    "Starting a conversation with an authentic friendly "
    "smile creates a friendly and open look that invites "
    "contact. If the other person smiles back, "
    "then you've already started a form of contact!"
)

COMPL_REC_DESC = (
    "Starting a conversation  with a compliment "
    "is usually more interesting than  a remark "
    "about the weather. "
    "Pick any feature that actually interests you, "
    "otherwise it won't come off as genuine. "
    "Feel free to continue on the topic if they show "
    "interest!"
)

BODY_LANGUAGE_REC_DESC = (
    "You can create an 'understanding' "
    "without using words by mirroring "
    "the other person's body attitude. "
    "This typically makes relating much "
    "easier."
)

EVALUATE_REC_DESC = (
    "Remember to evaluate reactions from "
    "the other person and regarding verbal "
    "or non-verbal communication. "
    "You should also express what "
    "you have understood from their behavior."
)

HUMOR_REC_DESC = (
    "Humor creates an open and conversational "
    "atmosphere, but remember not to joke at "
    "the expense of other people and respect "
    "any other sentiments. "
)

OPEN_UP_REC_DESC = (
    "You're not a reporter! The more you show "
    "yourself, the more interested they become. "
    "A good conversation involves being interested "
    "in the other person as well as opening up. "
    "Opening up makes it easier for others to "
    "relate to you, but make sure you're authentic."
)

def _create_and_save_recommendation(rec, friend_id=None):
    r = Recommendation()
    r.rec_typ = rec['rec_type']
    r.recommendation = rec['recommendation']
    r.rec_description = rec['rec_description']
    r.recommend_person_id = rec['recommend_person']

    if friend_id:
        r.about_person = Friend.objects.get(id=friend_id)
    r.save()
    return r

def _check_in_person_recommendations(logs, user_id):
    in_person = len([None for log in logs if log.interaction_medium == 'IP'])
    if len(logs) != 0:
        in_person_frac = in_person / len(logs) * 100
    else:
        in_person_frac = 0

    if in_person_frac < 50:
        rec = dict(
            rec_type = 'PO',
            recommendation = "Try to have more in-person interactions.",
            rec_description = IN_PERSON_REC_DESC,
            recommend_person = user_id,
        )

        return _create_and_save_recommendation(rec)
    return None


def _check_time_fairness(logs, user_id):
    morning = 0
    afternoon = 0
    evening = 0

    for log in logs:
        if log.time_of_day == 'MO':
            morning += 1
        elif log.time_of_day == 'AF':
            afternoon += 1
        elif log.time_of_day == 'EV':
            evening += 1

    if len(logs) != 0:
        morning_frac = morning / len(logs) * 100
        afternoon_frac = afternoon / len(logs) * 100
        evening_frac = evening / len(logs) *  100
    else:
        morning_frac = 0
        afternoon_frac = 0
        evening_frac = 0

    if morning_frac > 50 or afternoon_frac > 50 or evening_frac > 50:
        rec = dict(
            rec_type = 'PO',
            recommendation = "Spread your interactions throughout the day.",
            rec_description = SPREAD_INTERACTIONS_REC_DESC,
        )
        return _create_and_save_recommendation(rec)
    return None


def _count_reactions(logs):
    reactions = defaultdict(lambda: { # key is friend ID
        'Happy': 0,
        'Neutral': 0,
        'Tired': 0,
        'Angry': 0,
        'Sad': 0,
        'total': 0,
    })

    for log in logs:
        reactions[log.loggee][LogEntry.REACTION_DICT[log.reaction]] += 1
        reactions[log.loggee]['total'] += 1

    return dict(reactions)


def _save_generic_recommendations(logs, user_id):
    rec_type = 'GE'

    user = User.objects.get(id=user_id)
    generic_recs = []

    laugh_rec = dict(
        recommendation = "Laugh and smile when starting an interaction.",
        rec_description = LAUGH_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )

    generic_recs.append(_create_and_save_recommendation(laugh_rec))


    compl_rec = dict(
        recommendation = "Start with a compliment",
        rec_description = COMPL_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )

    generic_recs.append(_create_and_save_recommendation(compl_rec))

    body_rec = dict(
        recommendation = "Use body language.",
        rec_description = BODY_LANGUAGE_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )


    _create_and_save_recommendation(body_rec)
    generic_recs.append(body_rec)

    eval_rec = dict(
        recommendation = "Evaluate and Understand",
        rec_description = EVALUATE_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )

    generic_recs.append(_create_and_save_recommendation(eval_rec))

    humor_rec = dict(
        recommendation = "Use humor!",
        rec_description = HUMOR_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )

    generic_recs.append(_create_and_save_recommendation(humor_rec))

    open_rec = dict(
        recommendation = "Open up.",
        rec_description = OPEN_UP_REC_DESC,
        recommend_person = user_id,
        rec_type = rec_type
        )

    generic_recs.append(_create_and_save_recommendation(open_rec))

    user.has_generic_recs = True
    user.save()
    return generic_recs


def _count_small_talk(logs):
    small_talk = defaultdict(lambda: {'small': 0, 'long': 0}) # key is friend ID
    count_small_talk = 0

    for log in logs:
        if log.content_class == 'SM':
            count_small_talk += 1
            # TODO: need to handle null case
            small_talk[log.loggee]['small'] += 1
        else:
            small_talk[log.loggee]['long'] += 1
    return small_talk, count_small_talk

def _recommended_this_week(user_id):
    base = Recommendation.objects.filter(recommend_person_id=user_id)
    today = datetime.date.today()
    day_idx = (today.weekday() + 1) % 7 # MON = 0, SUN = 6 -> SUN = 0 .. SAT = 6
    sun = today - datetime.timedelta(day_idx)
    base = base.filter(created_at__gte=sun)
    return base.all()

def recommendations_from_logs(logs, user_id):
    # Don't regenerate recommendations if we already have recommendations
    has_generated = _recommended_this_week(user_id)
    if len(has_generated) != 0:
        return has_generated

    rec_list = list()

    user = User.objects.get(id=user_id)
    # First store some generic recommendations
    if not user.has_generic_recs:
        recs = _save_generic_recommendations(logs, user_id)
        rec_list.extend(recs)

    # Check if they have the right amount of in person
    # interactions
    rec = _check_in_person_recommendations(logs, user_id)
    if rec:
        rec_list.append(rec)

    # Make sure interactions are not a majority in any
    # category
    rec = _check_time_fairness(logs, user_id)
    if rec:
        rec_list.append(rec)

    reactions = _count_reactions(logs)

    small_talk, count_small_talk = _count_small_talk(logs)

    for friend in reactions:
        name = friend.name
        total = reactions[friend]['total']

        r = dict(recommend_person= user_id,)

        if (reactions[friend]['Happy']/total * 100) > 50:
            r['rec_type'] = 'PO'
            r["recommendation"] = "Spend more time with {}.".format(name)
            r["rec_description"] = GENERALLY_POSITIVE_REC_DESC
            _create_and_save_recommendation(r, friend_id=friend.id)
            rec_list.append(r)
        elif (reactions[friend]['Tired']/total * 100) > 10:
            r['rec_type'] = 'PO'
            r["recommendation"] = "Talk to {} at different times.".format(name)
            r["rec_description"] = DIFFERENT_TIME_REC_DESC
            _create_and_save_recommendation(r, friend_id=friend.id)
            rec_list.append(r)
        elif (reactions[friend]['Angry']/total * 100) > 10:
            r['rec_type'] = 'NE'
            r["recommendation"] = "Talk to {} less.".format(name)
            r["rec_description"] = GENERALLY_NEGATIVE_REC_DESC
            _create_and_save_recommendation(r, friend_id=friend.id)
            rec_list.append(r)
        elif (reactions[friend]['Sad']/total * 100) > 10:
            r['rec_type'] = 'AV'
            r["recommendation"] = "Avoid talking to {}.".format(name)
            r["rec_description"] = AVOID_REC_DESC
            _create_and_save_recommendation(r, friend_id=friend.id)
            rec_list.append(r)

    for friend in small_talk:
        name = friend.name
        small_frac = small_talk[friend]['small']/(small_talk[friend]['small'] + small_talk[friend]['long']) * 100

        if small_frac > 50:
            small_talk_rec = dict(
                recommend_person=user_id,
                rec_type='AV',
                recommendation="Avoid small talk with {}.".format(name),
                rec_description=AVOID_SMALL_REC_DESC,
                )

            _create_and_save_recommendation(small_talk_rec, friend_id=friend.id)
            rec_list.append(small_talk_rec)

    return dict(data=rec_list)

def recommendations_from_ml(logs, user_id, from_dt=None, to_dt=None):
    # All the setup recommendations should be good
    person_classifier = RandomForestClassifier(n_estimators=3)
    reacts = _count_reactions(logs)
    # Data format is going to be by week
    # [friend_id, happy_perc, neutral_perc, angry_perc, sad_perc, academic_perc, social_perc, work_perc, ip_perc, online_perc, phone_perc]
    # y is going to be one-hot good recommendation dose


