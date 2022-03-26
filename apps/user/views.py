from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from django.utils.http import int_to_base36, base36_to_int
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from apps.token.models import AccessToken
from apps.token.serializers import AccessTokenSerializer
from apps.user import postman
from apps.user.models import EmailVerification, User
from apps.user.request_identity import RequestIdentity
from apps.user.serializers import (
    AuthenticateUserSerializer, UserProfileSerializer, EmailVerificationSerializer, ChangePasswordSerializer,
    ForgetPasswordSerializer, ResetPasswordSerializer, CreateUserSerializer, PublicProfileSerializer
)
from clinicx.core.views import GenericAPIView, CreateAPIViewEx


def generate_access_token(user):
    access_token = AccessToken.objects.create(owner=user)
    return AccessTokenSerializer(instance=access_token).data


class AuthenticateUserView(GenericAPIView):
    serializer_class = AuthenticateUserSerializer
    permission_classes = ()

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        return generate_access_token(user)


class CreateAccountView(CreateAPIViewEx, GenericAPIView):
    permission_classes = ()
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return generate_access_token(user)


class UserProfileView(UpdateAPIView, GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def get(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return serializer.data


class EmailVerificationView(GenericAPIView):
    permission_classes = ()
    serializer_class = EmailVerificationSerializer
    token_generator = default_token_generator

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        verification_token = serializer.validated_data['token']
        email_verification = EmailVerification.objects.filter(verification_token=verification_token).first()
        if email_verification is None:
            raise ValidationError(
                'Invalid email verification token.',
                code='email_verification_invalid_token'
            )

        if not email_verification.verify():
            raise ValidationError(
                'Email verification token expired',
                code='email_verification_token_expired'
            )

        user = User.objects.get(email=email_verification.email)
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified', 'updated_at'])

        return {
            'uid': int_to_base36(user.id),
            'token': self.token_generator.make_token(user)
        }


class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data, instance=self.request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save()


class ForgetPasswordView(GenericAPIView):
    permission_classes = ()
    serializer_class = ForgetPasswordSerializer
    token_generator = default_token_generator

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        uid = int_to_base36(user.id)
        recovery_token = self.token_generator.make_token(user)
        password_reset_url = f'{request.tenant.public_url}/reset?uid={uid}&token={recovery_token}'

        request_identity = RequestIdentity.from_request(request)
        postman.send_password_reset_email(user, password_reset_url, request_identity)


class ResetPasswordView(GenericAPIView):
    permission_classes = ()
    serializer_class = ResetPasswordSerializer
    token_generator = default_token_generator

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        try:
            user = User.objects.get(id=base36_to_int(validated_data['uid']))
        except (ValueError, User.DoesNotExist):
            raise ValidationError('Malfunctioned request', 'malfunctioned_request')

        if not self.token_generator.check_token(user, validated_data['token']):
            raise ValidationError('Password reset token expired', 'password_reset_token_expired')

        user.set_password(validated_data['password'])
        user.save()

        return generate_access_token(user)


class PublicProfileView(RetrieveAPIView, GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PublicProfileSerializer
    lookup_field = 'username'

    def get_queryset(self):
        return User.objects.all()


class PublicProfileListView(ListAPIView, GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PublicProfileSerializer

    def get_queryset(self):
        # TODO: filter only the user with a public watchlist
        return User.objects.filter(~Q(username=self.request.user.username))
