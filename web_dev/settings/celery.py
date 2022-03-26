import os

from spa.utils.parser import parse_int, parse_bool

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = parse_int(os.getenv('RABBITMQ_PORT'), 5672)
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'spa')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD')

CELERY_TASK_ALWAYS_EAGER = parse_bool(os.getenv('CELERY_TASK_ALWAYS_EAGER'), False)
CELERY_TASK_SERIALIZER = 'pickle'
CELERY_RESULT_SERIALIZER = 'pickle'
CELERY_ACCEPT_CONTENT = ['pickle']
CELERY_BROKER_URL = f'pyamqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}:{RABBITMQ_PORT}//'


def configure_celery(settings):
    settings['CELERY_RESULT_BACKEND'] = f'redis://{settings["REDIS_HOST"]}:{settings["REDIS_PORT"]}?db=0'
