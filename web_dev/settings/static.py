import os

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

FILE_UPLOAD_HANDLERS = (
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler'
)

AWS_S3_USE_SSL = True
AWS_DEFAULT_ACL = None
AWS_S3_SECURE_URLS = True
AWS_S3_REGION_NAME = 'us-east-1'
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'


def configure_static(settings):
    settings['STATIC_ROOT'] = os.path.join(settings['BASE_DIR'], 'static')
    settings['MEDIA_ROOT'] = os.path.join(settings['BASE_DIR'], 'media')

    if AWS_STORAGE_BUCKET_NAME:
        settings['DEFAULT_FILE_STORAGE'] = 'storages.backends.s3boto3.S3Boto3Storage'
