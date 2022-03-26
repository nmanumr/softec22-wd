from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from apps.clinic import serializers, models
from clinicx.core.views import GenericAPIView


class RetrieveDoctorApiView(GenericAPIView, RetrieveAPIView):
    serializer_class = serializers.DoctorSerializer

    def get_queryset(self):
        return models.User.objects.filter(type='doctor')


class RetrievePatientApiView(GenericAPIView, RetrieveAPIView):
    serializer_class = serializers.DoctorSerializer

    def get_queryset(self):
        return models.User.objects.filter(type='patient')


class ListCreateAppointmentAPIView(GenericAPIView, ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.AppointmentSerializer

    def get_queryset(self):
        return models.PatientAppointment.objects.filter(doctor=self.kwargs['id'])

