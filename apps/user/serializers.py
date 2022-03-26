from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from rest_framework import serializers

from apps.user.models import User
from apps.user.utils import suggest_username


class AuthenticateUserSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64, trim_whitespace=False)
    password = serializers.CharField(max_length=64)

    def validate(self, attrs):
        super().validate(attrs)

        user = authenticate(
            request=self.context.get('request'),
            username=attrs['email'], password=attrs['password']
        )

        if user is None:
            msg = 'Invalid email and or password'
            raise serializers.ValidationError(msg, code='invalid_credentials')

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'avatar', 'display_name', 'email', 'is_email_verified',
            'is_phone_verified', 'gender', 'specialization',
            'type', 'age', 'appointment_duration', 'rating', 'id',
            'address', 'dob'
        )
        read_only_fields = ('is_email_verified', 'is_phone_verified')


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(required=True, max_length=64)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, max_length=64)
    password = serializers.CharField(required=True, max_length=64)

    default_error_messages = {
        'invalid_old_password': 'Old password is invalid'
    }

    def validate_old_password(self, password):
        if not check_password(password, self.instance.password):
            raise serializers.ValidationError(self.error_messages['invalid_old_password'])

        return password

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance


class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    default_error_messages = {
        'invalid_email': 'Provided email is not associated with any profile.'
    }

    def validate_email(self, email):
        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user is None:
            raise serializers.ValidationError(self.error_messages['invalid_email'])

        return existing_user

    def create(self, validated_data):
        return validated_data['email']


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, max_length=64)


class CreateUserSerializer(serializers.ModelSerializer):
    default_error_messages = {
        'email_collision': 'A user with with given email already exists.',
    }

    class Meta:
        model = User
        fields = ('type', 'email', 'display_name', 'password', 'gender')

    def validate_email(self, email):
        email = User.objects.normalize_email(email)
        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user is not None:
            raise serializers.ValidationError(
                self.error_messages['email_collision'],
                code='email_collision'
            )

        return email

    def create(self, validated_data):
        if 'username' not in validated_data:
            validated_data['username'] = suggest_username(validated_data['email'])

        return User.objects.create_user(**validated_data)


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'avatar', 'display_name')
 
