from datetime import datetime, timedelta

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

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return serializers.CreateAppointmentSerializer
        return serializers.AppointmentSerializer

    def get_queryset(self):
        if self.request.user.type == 'doctor':
            return models.PatientAppointment.objects.filter(doctor=self.request.user.id)
        elif self.request.user.type == 'patient':
            return models.PatientAppointment.objects.filter(patient=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class RetrieveUpdateDestroyAppointmentsAPIView(GenericAPIView, RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.AppointmentSerializer
    queryset = models.PatientAppointment


class ListDoctorApiView(GenericAPIView, ListCreateAPIView):
    serializer_class = serializers.DoctorSerializer

    def get_queryset(self):
        return models.User.objects.filter(type='doctor')


class SearchDoctorApiView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('query', None)
        doctors = models.User.objects.filter(type='doctor')

        if query is not None:
            doctors = doctors.filter(Q(display_name__icontains=query) | Q(specialization__icontains=query))

        doctors = doctors[:20]

        return serializers.DoctorSerializer(doctors, many=True).data


class ListCreateClinicTiming(GenericAPIView):
    serializer_class = serializers.ListCreateClinicTiming

    def get(self, request, *args, **kwargs):
        queryset = models.ClinicTime.objects.filter(doctor=self.request.user)
        serializer = self.serializer_class(queryset, many=True)
        return serializer.data

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=self.request.user)
        return serializer.data


class ListCreateDoctorRating(GenericAPIView, ListCreateAPIView):
    serializer_class = serializers.RatingSerializer

    def get_queryset(self):
        return models.DoctorRating.objects.filter(doctor=self.kwargs['pk'])


class ListDoctorAvailableTimes(GenericAPIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        date = datetime.strptime(self.request.GET['date'], '%Y-%m-%d')
        start_date = date.replace(hour=8, minute=0)
        end_date = date.replace(hour=17, minute=0)

        def create_date_ranges(start, end, **interval):
            start_ = start
            while start_ < end:
                end_ = start_ + timedelta(**interval)
                yield start_
                start_ = end_

        times = list(create_date_ranges(start_date, end_date, minutes=30))

        appointments = models.PatientAppointment.objects\
            .filter(doctor=self.kwargs.get('pk'))\
            .filter(time__range=(date, date + timedelta(days=1)))

        appointments_times = [ap.time.time() for ap in appointments]

        return [
            datetime.strftime(t, '%H:%M:00')
            for t in times
            if t.time() not in appointments_times
        ]


class ListCreateHistoryApiView(GenericAPIView, ListCreateAPIView):
    serializer_class = serializers.PatientHistorySerializer

    def get_queryset(self):
        return models.PatientHistory.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class RetrieveUpdateDestroyHistoryAPIView(GenericAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PatientHistorySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return models.PatientHistory.objects.filter(patient=self.request.user)
