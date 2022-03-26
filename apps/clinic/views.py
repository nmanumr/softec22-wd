from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

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


# fix timing issues
class ListCreateAppointmentAPIView(GenericAPIView, ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.AppointmentSerializer

    def get_queryset(self):
        return models.PatientAppointment.objects.filter(doctor=self.kwargs['id'])


class RetrieveUpdateDestroyAppointmentsAPIView(GenericAPIView, RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.AppointmentSerializer
    queryset = models.PatientAppointment


class SearchDoctorApiView(GenericAPIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        query = request.GET.get('query', None)
        doctors = models.User.objects.filter(type='doctor')

        if query is not None:
            doctors = doctors.filter(Q(displayName__icontains=query) | Q(specialization__icontains=query))

        doctors = doctors[:20]

        return serializers.DoctorSerializer(doctors, many=True).data
