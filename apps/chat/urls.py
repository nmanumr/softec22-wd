from django.urls import path

from . import views

app_name = 'accounts'
urlpatterns = [
    path('room', views.CreateChatRoomAPIView.as_view()),
    path('rooms/<id>/join', views.RequestJoinChatRoomAPIView.as_view()),

    path('requests/<id>/accept', views.AcceptJoinRequestAPIView.as_view()),
    path('requests/<id>/reject', views.RejectJoinRequestAPIView.as_view()),
]
