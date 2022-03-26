from django.contrib import admin

from . import models


@admin.register(models.PatientAppointment)
class AppointmentAdmin(admin.ModelAdmin):
    pass
