from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    email = models.CharField(max_length=512)
    has_generic_recs = models.BooleanField(default=False)

    def __str__(self):
        return 'Person("{}")'.format(self.name)

class Friend(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    user = models.ForeignKey('User', on_delete=models.CASCADE)

    def __str__(self):
        return 'Person("{}")'.format(self.name)


class LogEntry(models.Model):
    REACTION_CHOICES = (
        ('HA', 'Happy'),
        ('NE', 'Neutral'),
        ('TI', 'Tired'),
        ('AN', 'Angry'),
        ('SA', 'Sad'),
    )

    TIME_CHOICES = (
        ('NA', 'Not Applicable'),
        ('MO', 'Morning'),
        ('AF', 'Afternoon'),
        ('EV', 'Evening'),
    )

    SOCIAL_CHOICES = (
        ('NA', 'Not Applicable'),
        ('AC', 'Academic'),
        ('SO', 'Social'),
        ('OC', 'Other'),
        ('WO', 'Work'),
    )

    MEDIUM_CHOICES = (
        ('NA', 'Not Applicable'),
        ('IP', 'In Person'),
        ('ON', 'Online'),
        ('PH', 'Over The Phone'),
    )

    CONTENT_CHOICES = (
        ('NA', 'Not Applicable'),
        ('SM', 'Small Talk'),
        ('OP', 'One Personal'),
        ('BP', 'Both Personal'),
    )

    id = models.AutoField(primary_key=True)
    reaction = models.CharField(max_length=2, choices=REACTION_CHOICES)
    # Who is logged about
    loggee = models.ForeignKey('Friend', models.SET_NULL, related_name='loggee_person', null=True)
    logger = models.ForeignKey('User', models.CASCADE, related_name='logger_person')

    time_of_day = models.CharField(max_length=2, choices=TIME_CHOICES)
    social_context = models.CharField(max_length=2, choices=SOCIAL_CHOICES)
    interaction_medium = models.CharField(max_length=2, choices=MEDIUM_CHOICES)
    content_class = models.CharField(max_length=2, choices=CONTENT_CHOICES)
    other_loggable_text = models.CharField(max_length=512, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    from_fb = models.BooleanField(default=False)
    fb_id = models.CharField(max_length=512)

class Recommendation(models.Model):
    id = models.AutoField(primary_key=True)
    RECOMMENDATION_CHOICES = (
        ('PO', 'Positive'),
        ('NE', 'Negative'),
        ('AV', 'Avoidance'),
        ('GE', 'Generic'),
    )
    rec_typ = models.CharField(max_length=2, choices=RECOMMENDATION_CHOICES)
    recommendation = models.CharField(max_length=128)
    rec_description = models.CharField(max_length=512, default='')
    recommend_person = models.ForeignKey('User', models.CASCADE, related_name='recommend_person')
    about_person = models.ForeignKey('Friend', models.SET_NULL, related_name='about_person', null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def feedback(self):
        feedback = None
        try:
            feedback = RecommendationFeedback.objects.get(rec=self)
            return { "id": feedback.id, "feedback_typ": feedback.feedback_typ }
        except RecommendationFeedback.DoesNotExist:
            return feedback

class RecommendationFeedback(models.Model):
    FEEDBACK_CHOICES = (
        ('WO', 'Worked'),
        ('DW', 'Doesn\'t Work')
    )

    id = models.AutoField(primary_key=True)
    rec = models.ForeignKey('Recommendation', models.CASCADE, related_name='tied_recommendation')
    feedback_typ = models.CharField(max_length=2, choices=FEEDBACK_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
