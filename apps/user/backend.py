from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Permission
from django.db.models import Q

from apps.user.models import User


class AuthBackend(ModelBackend):
    supports_anonymous_user = False
    supports_inactive_user = False

    def authenticate(self, request, username=None, password=None, **kwargs):
        import logging
        user = User.objects.filter(Q(username=username) | Q(email__iexact=username)).first()
        if not user or not password or not check_password(password, user.password):
            logging.info(user)
            return  # Invalid username/email and password combination

        return user

    def get_user(self, user_id):
        return User.objects.filter(id=user_id).first()

    def has_perm(self, user_obj, perm, obj=None):
        if isinstance(perm, Permission):
            perm = f'{perm.content_type.app_label}.{perm.codename}'

        return super().has_perm(user_obj, perm, obj=obj)
