import base64
import hashlib
import hmac
import json
import time
import urllib.parse

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

from apps.chat import models


class AbstractChatConsumer(AsyncWebsocketConsumer):
    public_id = None
    group_name = None
    group_name_format = None

    def get_access_token_queryset(self):
        return models.ChatAccessToken.objects.all()

    async def get_access_token(self):
        query_params = urllib.parse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = query_params.get('token')
        if token is None:
            return

        return await sync_to_async(self.get_access_token_queryset().filter(access_token=token[0]).first)()

    def is_authorized(self, access_token):
        return access_token is not None

    async def connect(self):
        self.public_id = self.scope['url_route']['kwargs']['id']
        self.group_name = self.group_name_format.format(self.public_id)

        access_token = await self.get_access_token()
        if self.is_authorized(access_token):
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            await self.post_connect(access_token)
        else:
            await self.close()

    async def post_connect(self, access_token):
        pass

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)


class ChatRoomConsumer(AbstractChatConsumer):
    participation = None
    group_name_format = 'room-{}'
    supported_event_types = (
        'offer',
        'answer',
        'candidate',
    )

    def get_access_token_queryset(self):
        return super().get_access_token_queryset().select_related('chat_room', 'participant')

    def is_authorized(self, access_token):
        return access_token and access_token.chat_room.public_id == self.public_id

    async def post_connect(self, access_token):
        self.participation = await sync_to_async(access_token.record_participation)()

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'joined',
                'participantId': access_token.participant.public_id,
                'participantName': access_token.participant.display_name,
            }
        )

    async def disconnect(self, close_code):
        await sync_to_async(self.participation.mark_left)()
        await super().disconnect(close_code)

    async def receive(self, text_data=None, bytes_data=None):
        event = json.loads(text_data)
        if event['type'] in self.supported_event_types:
            await self.channel_layer.group_send(
                self.group_name,
                event
            )

    async def offer(self, event):
        await self.send(text_data=json.dumps(event))

    async def answer(self, event):
        await self.send(text_data=json.dumps(event))

    async def joined(self, event):
        await self.send(text_data=json.dumps(event))

    async def candidate(self, event):
        await self.send(text_data=json.dumps(event))


class ParticipantConsumer(AbstractChatConsumer):
    group_name_format = 'participant-{}'

    async def post_connect(self, access_token):
        username = str(int(time.time()) + settings.TURN_OTP_EXPIRY).encode()
        password = base64.b64encode(hmac.new(settings.TURN_SECRET, msg=username, digestmod=hashlib.sha1).digest())

        await self.send(text_data=json.dumps({
            'type': 'CREDENTIALS',
            'credentials': {
                'urls': settings.TURN_SERVER_URL,
                'username': username.decode('utf8'),
                'credential': password.decode('utf8')
            }
        }))

    def get_access_token_queryset(self):
        return super().get_access_token_queryset().select_related('participant')

    def is_authorized(self, access_token):
        return access_token and access_token.participant.public_id == self.public_id

    async def new_participant(self, event):
        await self.send(text_data=json.dumps({
            'type': 'NEW_PARTICIPANT',
            'object': {
                'requestId': event['requestId'],
                'displayName': event['displayName']
            }
        }))


class JoinRequestConsumer(AbstractChatConsumer):
    group_name_format = 'request-{}'

    def is_authorized(self, access_token):
        return True

    async def accepted(self, event):
        token = event['token']
        await self.send(text_data='ACCEPTED:{}'.format(token))

    async def rejected(self, event):
        await self.send(text_data='REJECTED')
