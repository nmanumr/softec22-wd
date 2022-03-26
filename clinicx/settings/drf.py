REST_FRAMEWORK = {
    'NON_FIELD_ERRORS_KEY': 'request',
    'DEFAULT_RENDERER_CLASSES': (
        'clinicx.core.renderers.CamelCaseJSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'clinicx.core.parsers.CamelCaseJSONParser',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.token.authentication.AccessTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 25
}


def configure_drf(settings):
    if settings['DEBUG']:
        # Render API response as Browsable API Response in development environment
        REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] += (
            'rest_framework.renderers.BrowsableAPIRenderer',
        )
