import os
from pathlib import Path

from clinicx.utils.parser import parse_bool

DEBUG = parse_bool(os.getenv('DJANGO_DEBUG'), False)
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '<fake-secret-key>')
BASE_DIR = str(Path(__file__).resolve().parent.parent.parent)

WSGI_APPLICATION = 'clinicx.wsgi.application'
ROOT_URLCONF = 'clinicx.urls'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = False
TIME_ZONE = os.getenv('TIME_ZONE', 'UTC')
