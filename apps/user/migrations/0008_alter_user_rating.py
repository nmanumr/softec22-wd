# Generated by Django 3.2.7 on 2022-03-26 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_user_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='rating',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]