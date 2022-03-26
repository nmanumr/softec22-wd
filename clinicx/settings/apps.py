import os

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'phonenumber_field',

    'apps.token',
    'apps.user',
    'apps.clinic',
]

PHONENUMBER_DEFAULT_REGION = 'US'
