DEFAULT_FROM_EMAIL = 'no-reply@stocks-alert.com'

EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = '/tmp/emails/'
