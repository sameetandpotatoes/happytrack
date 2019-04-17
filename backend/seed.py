# Run with `python3 manage.py shell <seed.py`
def generate_person(name, email, num_friends, num_logs):
    from api import models, recommender
    from faker import Faker
    import random
    import datetime
    import logging

    def chooser_factory(enum):
        vals = [x[0] for x in enum]
        return random.choice(vals)

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
    today = datetime.date.today()
    day_idx = (today.weekday() + 1) % 7 # MON = 0, SUN = 6 -> SUN = 0 .. SAT = 6
    prev_sun = today - datetime.timedelta(7+day_idx)
    day_choices = list(range(7))
    # Generate the logs
    logs = []
    for _ in range(num_logs):
        friend_obj = random.choice(friends)
        bout_a_week = prev_sun + datetime.timedelta(days=random.choice(day_choices))
        le = models.LogEntry()
        le.reaction = chooser_factory(models.LogEntry.REACTION_CHOICES)
        le.other_loggable_text = fake.paragraph()
        le.logger = person
        le.loggee = friend_obj
        le.time_of_day = chooser_factory(models.LogEntry.TIME_CHOICES)
        le.social_context = chooser_factory(models.LogEntry.SOCIAL_CHOICES)
        le.content_class = chooser_factory(models.LogEntry.CONTENT_CHOICES)
        le.interaction_medium = chooser_factory(models.LogEntry.MEDIUM_CHOICES)
        other_loggable_text = fake.paragraph()
        le.save()
        le.created_at=bout_a_week
        le.save()
        logs.append(le)

    # Generate recommendations according to the logic
    recommender.recommendations_from_logs(logs, person.id)

generate_person('Bhuvan Venkatesh', 'bvenkat2@illinois.edu', 5, 10)
generate_person('Lenny Pitt', 'lpitt2@illinois.edu', 15, 50)
