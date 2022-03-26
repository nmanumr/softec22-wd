from django.db import models

from apps.user.models import User


class PatientHistory(models.Model):
    HISTORY_TYPE = (
        ('disease', 'Major Disease'),
        ('surgery', 'Surgery'),
        ('allergy', 'Allergy'),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=HISTORY_TYPE)
    title = models.CharField(max_length=255)
    date = models.DateTimeField(null=True, blank=True)

    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title


class ClinicTime(models.Model):
    DAYS = (
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
        ('sun', 'Sunday'),
    )

    start_time = models.TimeField()
    end_time = models.TimeField()
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(choices=DAYS, max_length=4)


class PatientAppointment(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    time = models.DateTimeField()
