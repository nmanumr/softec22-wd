import json
import urllib.parse

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from apps.token.models import AccessToken


class AbstractChatConsumer(AsyncWebsocketConsumer):
    device_id = None
    group_name = None
    group_name_format = 'dev-{}'
    device = None
    supported_event_types = (
        'joined', 'offer', 'answer', 'candidate',
    )

    async def is_authorized(self, access_token):
        raise NotImplemented()

    async def connect(self):
        self.device_id = self.scope['url_route']['kwargs']['id']
        self.group_name = self.group_name_format.format(self.device_id)

        query_params = urllib.parse.parse_qs(self.scope['query_string'].decode('utf8'))
        token = query_params.get('token')
        token = token if type(token) is not list else token[0]
        if await self.is_authorized(token):
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            await self.post_connect()
        else:
            await self.close("UNAUTHORIZED")

    async def post_connect(self):
        pass

    async def post_disconnect(self):
        pass

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.post_disconnect()

    async def receive(self, text_data=None, bytes_data=None):
        event = json.loads(text_data)
        if event['type'] in self.supported_event_types:
            await self.channel_layer.group_send(
                self.group_name,
                event
            )

    async def offer(self, event):
        await self.send(text_data=json.dumps(event))

    async def joined(self, event):
        await self.send(text_data=json.dumps(event))

    async def answer(self, event):
        await self.send(text_data=json.dumps(event))

    async def candidate(self, event):
        await self.send(text_data=json.dumps(event))

    async def recording_start(self, event):
        await self.send(text_data=json.dumps(event))

    async def recording_stop(self, event):
        await self.send(text_data=json.dumps(event))

    async def recording_status_ping(self, event):
        await self.send(text_data=json.dumps(event))

    async def recording_status_pong(self, event):
        await self.send(text_data=json.dumps(event))


class UserConsumer(AbstractChatConsumer):
    async def get_access_token(self, token):
        if token is None:
            return

        return await sync_to_async(AccessToken.objects.select_related('owner').filter(access_token=token).first)()

    async def is_authorized(self, token):
        access_token = await self.get_access_token(token)
        return await sync_to_async(access_token.owner.devices.filter(public_id=self.device_id).count)() == 1

    async def post_connect(self):
        await self.send(text_data=json.dumps({'type': 'joined'}))
