from django.db import models
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver

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
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    )

    start_time = models.TimeField()
    end_time = models.TimeField()
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(choices=DAYS, max_length=15)


class PatientAppointment(models.Model):
    STATUS = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    status = models.CharField(max_length=20, choices=STATUS, default='PENDING')
    time = models.DateTimeField()


class DoctorRating(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_ratings')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_rating')
    appointment = models.ForeignKey(PatientAppointment, on_delete=models.CASCADE, blank=True, null=True)
    rating = models.DecimalField(decimal_places=1, max_digits=4)
    description = models.TextField(null=True, blank=True)


@receiver(post_save, sender=DoctorRating)
def my_handler(sender, instance, **kwargs):
    rating = DoctorRating.objects.filter(doctor=instance.doctor).aggregate(Avg('rating')) or 0
    instance.doctor.rating = rating['rating__avg']
    instance.doctor.save()
