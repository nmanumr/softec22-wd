import os

from clinicx.utils.parser import parse_bool

CELERY_TASK_ALWAYS_EAGER = parse_bool(os.getenv('CELERY_TASK_ALWAYS_EAGER'), False)
# CELERY_TASK_SERIALIZER = 'pickle'
# CELERY_RESULT_SERIALIZER = 'pickle'
# CELERY_ACCEPT_CONTENT = ['pickle']


def configure_celery(settings):
    settings['CELERY_BROKER_URL'] = f'redis://{settings["REDIS_HOST"]}:{settings["REDIS_PORT"]}/0'
    settings['CELERY_RESULT_BACKEND'] = f'redis://{settings["REDIS_HOST"]}:{settings["REDIS_PORT"]}?db=0'