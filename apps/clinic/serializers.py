from rest_framework import serializers

from apps.user.models import User
from apps.clinic import models


class PatientHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PatientHistory
        fields = (
            'type', 'title', 'date', 'description'
        )


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'avatar', 'display_name', 'email',
            'is_email_verified', 'is_phone_verified',
            'gender', 'appointment_duration'
        )
        read_only_fields = ('display_name', 'is_email_verified', 'is_phone_verified')


class PatientWithHistorySerializer(serializers.ModelSerializer):
    patient_history_set = PatientHistorySerializer(many=True)

    class Meta:
        model = User
        fields = (
            'avatar', 'display_name', 'email', 'gender',
            'patient_history_set'
        )

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar', 'display_name', 'email', 'gender')


class RatingSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = models.DoctorRating
        fields = ('patient', 'rating', 'description')


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()
    patient = PatientSerializer()

    class Meta:
        model = models.PatientAppointment
        fields = ('doctor', 'patient', 'time', 'accepted')
