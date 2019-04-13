import copy

from .models import User, Friend, Recommendation
from collections import defaultdict

def _create_and_save_recommendation(rec, friend_id=None):
    r = Recommendation()
    r.rec_typ = rec['rec_type']
    r.recommendation = rec['recommendation']
    r.rec_description = rec['rec_description']
    r.recommend_person = User.objects.get(id=rec['recommend_person'])
    if friend_id:
        r.about_person = Friend.objects.get(id=friend_id)
    r.save()

def recommendations_from_logs(logs, user_id):
    recommendations = {
        "data": []
    }
    r = {
        "recommend_person": user_id
    }
    # TODO: do we always want to deliver generic recommendations?
    if len(logs) == 0:
        r['rec_type'] = "GE"

        r["recommendation"] = "Laugh and smile when starting an interaction."
        r["rec_description"] = (
            "Starting a conversation with an authentic friendly "
            "smile creates a friendly and open look that invites "
            "contact. If the other person smiles back, "
            "then you've already started a form of contact!"
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))

        r["recommendation"] = "Start with a compliment."
        r["rec_description"] = (
            "Starting a conversation  with a compliment "
            "is usually more interesting than  a remark "
            "about the weather. "
            "Pick any feature that actually interests you, "
            "otherwise it won't come off as genuine. "
            "Feel free to continue on the topic if they show "
            "interest!"
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))

        r["recommendation"] = "Use body language."
        r["rec_description"] = (
            "You can create an 'understanding' "
            "without using words by mirroring "
            "the other person's body attitude. "
            "This typically makes relating much "
            "easier."
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))

        r["recommendation"] = "Evaluate and understand."
        r["rec_description"] = (
            "Remember to evaluate reactions from "
            "the other person and regarding verbal "
            "or non-verbal communication. "
            "You should also express what "
            "you have understood from their behavior."
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))

        r["recommendation"] = "Use humor!"
        r["rec_description"] = (
            "Humor creates an open and conversational "
            "atmosphere, but remember not to joke at "
            "the expense of other people and respect "
            "any other sentiments. "
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))

        r["recommendation"] = "Open up."
        r["rec_description"] = (
            "You're not a reporter! The more you show "
            "yourself, the more interested they become. "
            "A good conversation involves being interested "
            "in the other person as well as opening up. "
            "Opening up makes it easier for others to "
            "relate to you, but make sure you're authentic."
        )
        _create_and_save_recommendation(r)
        recommendations['data'].append(copy.deepcopy(r))
    else:
        total_logs = len(logs)
        in_person = 0
        online = 0
        over_the_phone = 0

        small_talk = defaultdict(lambda: {'small': 0, 'long': 0}) # key is friend ID
        count_small_talk = 0

        reactions = defaultdict(lambda: { # key is friend ID
            'Happy': 0,
            'Neutral': 0,
            'Tired': 0,
            'Angry': 0,
            'Sad': 0,
            'total': 0,
        })

        morning = 0
        afternoon = 0
        evening = 0

        for log in logs:
            if log.interaction_medium == 'IP':
                in_person += 1
            elif log.interaction_medium == 'ON':
                online += 1
            elif log.interaction_medium == 'PH':
                over_the_phone += 1

            if log.content_class == 'SM':
                count_small_talk += 1
                # TODO: need to handle null case
                small_talk[log.loggee]['small'] += 1
            else:
                small_talk[log.loggee]['long'] += 1
            
            reactions[log.loggee][log.reaction] += 1
            reactions[log.loggee]['total'] += 1

            if log.time_of_day == 'MO':
                morning += 1
            elif log.time_of_day == 'AF':
                afternoon += 1
            elif log.time_of_day == 'EV':
                evening += 1

        in_person_frac = in_person / total_logs * 100
        if in_person_frac < 50:
            r['rec_type'] = 'PA'
            r["recommendation"] = "Try to have more in-person interactions."
            r["rec_description"] = (
                "In-person interactions allow for more control "
                "over the interaction, like body language "
                "and other visual cues. Online and over-the-phone "
                "interactions should be used once a good relationship "
                "is already built."
            )
            _create_and_save_recommendation(r)
            recommendations['data'].append(copy.deepcopy(r))
        for friend in reactions:
            name = friend.name
            total = reactions[friend]['total']
            if (reactions[friend]['Happy']/total * 100) > 50:
                r['rec_type'] = 'PO'
                r["recommendation"] = "Spend more time with {}.".format(name)
                r["rec_description"] = (
                    "Looks like your interactions with "
                    "this friend are typically positive - "
                    "try to have more of them!"
                )
                _create_and_save_recommendation(r)
                recommendations['data'].append(copy.deepcopy(r))
            elif (reactions[friend]['Tired']/total * 100) > 10:
                r['rec_type'] = 'PO'
                r["recommendation"] = "Talk to {} different times.".format(name)
                r["rec_description"] = (
                    "It's okay to be tired! "
                    "Talk to this friend when you feel more awake, "
                    "like after your morning coffee."
                )
                _create_and_save_recommendation(r)
                recommendations['data'].append(copy.deepcopy(r))
            elif (reactions[friend]['Angry']/total * 100) > 10:
                r['rec_type'] = 'NE'
                r["recommendation"] = "Talk to {} less.".format(name)
                r["rec_description"] = (
                    "If this friend makes you feel angry, "
                    "it's a good idea to re-evaluate your "
                    "relationship or the context around "
                    "interactions that make you angry."
                )
                _create_and_save_recommendation(r)
                recommendations['data'].append(copy.deepcopy(r))
            elif (reactions[friend]['Sad']/total * 100) > 10:
                r['rec_type'] = 'AV'
                r["recommendation"] = "Avoid talking to {}.".format(name)
                r["rec_description"] = (
                    "People that make you feel sad "
                    "shouldn't be in your life, "
                    "it's that simple!"
                )
                _create_and_save_recommendation(r)
                recommendations['data'].append(copy.deepcopy(r))
        for friend in small_talk:
            name = friend.name
            small_frac = small_talk[friend]['small']/(small_talk[friend]['small'] + small_talk[friend]['long']) * 100
            if small_frac > 50:
                r['rec_type'] = 'AV'
                r["recommendation"] = "Avoid small talk with {}.".format(name)
                r["rec_description"] = (
                    "Studies have shown that having more small talk "
                    "than not has a negative impact on happiness "
                    "and interaction quality. Focus on having more "
                    "substantive conversations, especially with this "
                    "friend."
                )
                _create_and_save_recommendation(r)
                recommendations['data'].append(copy.deepcopy(r))
        morning_frac = morning / total_logs * 100
        afternoon_frac = afternoon / total_logs * 100
        evening_frac = evening / total_logs *  100
        if morning_frac > 50 or afternoon_frac > 50 or evening_frac > 50:
            r['rec_type'] = 'PO'
            r["recommendation"] = "Spread your interactions throughout the day."
            r["rec_description"] = (
                "Concentrating all of your interactions "
                "in one part of the day makes it easier "
                "for negative ones to ruin your day "
                "and harder ones to positively influence your "
                "day. Remember: some people need their "
                "coffee in the morning!"
            )
            _create_and_save_recommendation(r)
            recommendations['data'].append(copy.deepcopy(r))

    return recommendations
