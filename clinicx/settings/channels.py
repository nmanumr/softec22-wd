def configure_channels(settings):
    settings['CHANNEL_LAYERS'] = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [(settings['REDIS_HOST'], settings['REDIS_PORT'])],
            },
        },
    }
