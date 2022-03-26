import binascii
import os

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from spa.ext.soft_delete import SoftDeleteModel


class AccessToken(SoftDeleteModel):
    ACCESS_TOKEN_BYTES = 16
    access_token = models.CharField(max_length=ACCESS_TOKEN_BYTES * 2, unique=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    expires_at = models.DateTimeField(null=True, blank=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def generate_access_token(self):
        return binascii.hexlify(os.urandom(self.ACCESS_TOKEN_BYTES)).decode()

    def save(self, **kwargs):
        if not self.access_token:
            self.access_token = self.generate_access_token()

        super().save(**kwargs)

    @cached_property
    def is_expired(self):
        return self.expires_at and self.expires_at < timezone.now()
