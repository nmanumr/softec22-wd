import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField

from apps.user.managers import UserManager, EmailVerificationManager
from spa.ext.soft_delete import SoftDeleteModel


class User(SoftDeleteModel, AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField(blank=True, null=True)
    avatar = models.ImageField(upload_to='user_avatars', blank=True, null=True)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    date_joined = None

    objects = UserManager()

    @property
    def display_name(self):
        return self.get_full_name() or self.username

    def __str__(self):
        return self.display_name


class EmailVerification(models.Model):
    email = models.EmailField(db_index=True)
    verification_token = models.CharField(max_length=64, unique=True)

    dispatched_at = models.DateTimeField(null=True, blank=True, default=None)
    verified_at = models.DateTimeField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = EmailVerificationManager()

    def __str__(self):
        return f'verification for {self.email}'

    @property
    def confirmed(self):
        return self.verified_at is not None

    @property
    def key_expired(self):
        if self.dispatched_at is None:
            return False

        expiration_date = self.dispatched_at + datetime.timedelta(days=settings.EMAIL_VERIFICATION_EXPIRE_DAYS)
        return expiration_date <= timezone.now()

    def verify(self):
        if not self.key_expired and not self.confirmed:
            self.verified_at = timezone.now()
            self.save(update_fields=['verified_at'])
            return True

        return False
