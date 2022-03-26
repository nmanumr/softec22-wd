import logging

from django.http import HttpResponse, HttpResponseServerError

from spa.core.checks import HEALTH_CHECKS

logger = logging.getLogger(__name__)


def liveness(request):
    return HttpResponse('OK')


def readiness(request):
    try:
        for health_check in HEALTH_CHECKS:
            health_check()
    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError('db: cannot connect to database.')

    return HttpResponse('OK')
