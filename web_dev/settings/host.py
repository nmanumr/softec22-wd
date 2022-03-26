import os

DEFAULT_HTTP_PROTOCOL = os.getenv('HTTP_PROTOCOL', 'http')
SITE_DOMAIN = os.getenv('SITE_DOMAIN', 'localhost:8080')
PUBLIC_URL = '{}://{}'.format(DEFAULT_HTTP_PROTOCOL, SITE_DOMAIN)

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    SITE_DOMAIN,
]
