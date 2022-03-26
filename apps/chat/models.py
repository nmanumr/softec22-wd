import binascii
import os

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from apps.user.models import User
from clinicx.ext.public_model import PublicModel
from clinicx.ext.soft_delete import SoftDeleteModel


class AbstractAccessToken(models.Model):
    ACCESS_TOKEN_BYTES = 16
    access_token = models.CharField(max_length=ACCESS_TOKEN_BYTES * 2, db_index=True)

    last_accessed = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def generate_access_token(self):
        return binascii.hexlify(os.urandom(self.ACCESS_TOKEN_BYTES)).decode()

    def save(self, **kwargs):
        if not self.last_accessed:
            self.last_accessed = timezone.now()

        if not self.access_token:
            self.access_token = self.generate_access_token()

        super().save(**kwargs)


class Participant(PublicModel, SoftDeleteModel):
    display_name = models.CharField(max_length=255)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def notify(self, message, channel_pattern='participant-{}'):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(channel_pattern.format(self.public_id), message)


class ChatRoom(PublicModel, SoftDeleteModel):
    owner = models.ForeignKey('Participant', on_delete=models.CASCADE, related_name='+')

    allow_new_participant = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Participation(SoftDeleteModel):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)

    left_at = models.DateTimeField(null=True, blank=True)
    rejoined_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @cached_property
    def is_active(self):
        return self.left_at is None or self.rejoined_at is not None

    def mark_left(self):
        self.left_at = timezone.now()
        self.save(update_fields=['left_at', 'updated_at'])


class JoinRequest(PublicModel):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True, blank=True)
    participant = models.ForeignKey(Participant, on_delete=models.SET_NULL, null=True, blank=True)

    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ChatAccessToken(SoftDeleteModel, AbstractAccessToken):
    ACCESS_TOKEN_BYTES = 64
    access_token = models.CharField(max_length=128, unique=True)

    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)

    def record_participation(self):
        participation = Participation.objects \
            .filter(chat_room_id=self.chat_room_id, participant_id=self.participant_id) \
            .first()

        if participation is None:
            Participation.objects.create(
                chat_room_id=self.chat_room_id,
                participant_id=self.participant_id
            )
        else:
            participation.rejoined_at = timezone.now()
            participation.save(update_fields=['rejoined_at', 'updated_at'])

        return participation
