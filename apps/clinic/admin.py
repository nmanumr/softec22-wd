from django.contrib import admin

from . import models


@admin.register(models.PatientAppointment)
class AppointmentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DoctorRating)
class DoctorRatingAdmin(admin.ModelAdmin):
    pass
