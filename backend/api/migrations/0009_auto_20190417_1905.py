# Generated by Django 2.1.7 on 2019-04-17 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20190416_1644'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recommendationfeedback',
            name='feedback_typ',
            field=models.CharField(choices=[('WO', 'Worked'), ('DW', "Doesn't Work")], max_length=2),
        ),
    ]