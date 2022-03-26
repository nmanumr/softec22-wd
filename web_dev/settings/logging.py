import os

from spa.utils.parser import parse_bool

LOG_SQL_QUERIES = parse_bool(os.getenv('LOG_SQL_QUERIES'), False)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(levelname)s] %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '[%(levelname)s] %(asctime)s - %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.templates': {
            'level': 'WARNING',
        },

        # Silence SuspiciousOperation.DisallowedHost exception ('Invalid
        # HTTP_HOST' header messages). Set the handler to 'null' so we don't
        # get those annoying emails.
        'django.security.DisallowedHost': {
            'handlers': ['null'],
            'propagate': False,
        },
    }
}

if LOG_SQL_QUERIES:
    LOGGING['loggers']['django.db.backends'] = {
        'level': 'DEBUG',
        'handlers': ['console'],
        'propagate': False,
    }

sys_log_dirs = [
    '/var/run/syslog'  # Mac Syslog
    '/dev/log'  # Linux Syslog
]

syslog_path = None
for log_path in sys_log_dirs:
    if os.path.exists(log_path):
        syslog_path = log_path

if syslog_path:
    LOGGING['handlers']['syslog'] = {
        'class': 'logging.handlers.SysLogHandler',
        'address': syslog_path,
        'facility': 16,
        'formatter': 'verbose',
    }
