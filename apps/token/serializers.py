from rest_framework import serializers

from apps.token.models import AccessToken


class AccessTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessToken
        fields = ('access_token', 'expires_at')
