from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/room/<id>', consumers.UserConsumer),
]
