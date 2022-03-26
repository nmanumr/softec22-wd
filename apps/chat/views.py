from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.functional import cached_property
from rest_framework.exceptions import NotAuthenticated

from apps.chat import serializers, models
from apps.chat.permissions import ChatRoomOwnerPermission
from clinicx.core.views import GenericAPIView


class GenericChatAPIView(GenericAPIView):
    header = 'HTTP_X_CHAT_TOKEN'
    permission_classes = ()
    authentication_classes = ()

    @cached_property
    def access_token(self):
        access_token = self.request.META.get(self.header, '')
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf8')

        if not access_token:
            raise NotAuthenticated()

        try:
            token = models.ChatAccessToken.objects.select_related('chat_room').get(access_token=access_token)
        except models.ChatAccessToken.DoesNotExist:
            raise NotAuthenticated()

        token.last_accessed = timezone.now()
        token.save(update_fields=['last_accessed'])
        return token

    @cached_property
    def chat_room(self):
        return self.access_token.chat_room


class CreateChatRoomAPIView(GenericChatAPIView):
    serializer_class = serializers.ParticipantSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        participant = serializer.save()
        chat_room = models.ChatRoom.objects.create(owner=participant)
        token = models.ChatAccessToken.objects.create(participant=participant, chat_room=chat_room)

        return {
            'roomId': chat_room.public_id,
            'participantId': participant.public_id,
            'participantName': participant.display_name,
            'token': token.access_token
        }


class RequestJoinChatRoomAPIView(GenericChatAPIView):
    serializer_class = serializers.ParticipantSerializer

    def post(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        chat_room = get_object_or_404(models.ChatRoom.objects.select_related('owner'), public_id=self.kwargs['id'])
        participant = serializer.save()

        join_request = models.JoinRequest.objects.create(chat_room=chat_room, participant=participant)
        chat_room.owner.notify({
            'type': 'new_participant',
            'requestId': join_request.public_id,
            'displayName': participant.display_name
        })

        return {
            'requestId': join_request.public_id,
            'participantId': join_request.participant.public_id,
            'participantName': join_request.participant.display_name,
        }


class GenericJoinRequestAPIView(GenericChatAPIView):
    permission_classes = (ChatRoomOwnerPermission,)

    @cached_property
    def join_request(self):
        return get_object_or_404(
            models.JoinRequest.objects.select_related('participant'),
            chat_room=self.chat_room,
            public_id=self.kwargs['id'],
            accepted_at__isnull=True,
            rejected_at__isnull=True,
        )


class AcceptJoinRequestAPIView(GenericJoinRequestAPIView):
    def post(self, request, **kwargs):
        self.join_request.accepted_at = timezone.now()
        self.join_request.save()

        token = models.ChatAccessToken.objects.create(
            chat_room_id=self.join_request.chat_room_id,
            participant_id=self.join_request.participant_id,
        )

        self.join_request.participant.notify(
            {
                'type': 'accepted',
                'token': token.access_token,
            },
            channel_pattern='request-{}'
        )


class RejectJoinRequestAPIView(GenericJoinRequestAPIView):
    def post(self, request, **kwargs):
        self.join_request.rejected_at = timezone.now()
        self.join_request.save()

        self.join_request.participant.notify(
            {
                'type': 'rejected',
            },
            channel_pattern='request-{}'
        )
