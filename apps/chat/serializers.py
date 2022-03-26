from rest_framework import serializers

from apps.chat import models


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Participant
        fields = ('display_name',)

    def save(self, **kwargs):
        user = None
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user

        kwargs.setdefault('user', user)
        return super().save(**kwargs)
