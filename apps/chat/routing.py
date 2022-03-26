from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/room/<id>', consumers.ChatRoomConsumer),
    path('ws/participant/<id>', consumers.ParticipantConsumer),
    path('ws/request/<id>', consumers.JoinRequestConsumer),
]
