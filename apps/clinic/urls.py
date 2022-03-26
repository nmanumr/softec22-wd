from django.urls import path

from apps.clinic import views

app_label = 'clinic'
urlpatterns = [
    path('doctors/search/', views.SearchDoctorApiView.as_view()),
    path('doctors/', views.ListDoctorApiView.as_view()),
    path('doctors/<pk>/', views.RetrieveDoctorApiView.as_view()),
    path('patient/<pk>/', views.RetrievePatientApiView.as_view()),
    path('appointments/', views.ListCreateAppointmentAPIView.as_view()),
    path('appointments/<pk>/', views.RetrieveUpdateDestroyAppointmentsAPIView.as_view()),
]
