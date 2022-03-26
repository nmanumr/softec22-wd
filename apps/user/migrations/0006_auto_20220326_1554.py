# Generated by Django 3.2.7 on 2022-03-26 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_user_displayname'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='age',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='specialization',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]