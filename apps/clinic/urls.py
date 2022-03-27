from django.urls import path

from apps.clinic import views

app_label = 'clinic'
urlpatterns = [
    path('doctors/search/', views.SearchDoctorApiView.as_view()),
    path('doctors/', views.ListDoctorApiView.as_view()),
    path('doctors/<pk>/', views.RetrieveDoctorApiView.as_view()),
    path('doctors/<pk>/rating/', views.ListCreateDoctorRating.as_view()),
    path('doctors/<pk>/times/', views.ListDoctorAvailableTimes.as_view()),

    path('patient/<pk>/', views.RetrievePatientApiView.as_view()),
    path('patient/<pk>/history/', views.ListCreateHistoryApiView.as_view()),
    path('patient/history/<pk>', views.RetrieveUpdateDestroyHistoryAPIView.as_view()),

    path('timings/', views.ListCreateClinicTiming.as_view()),
    path('appointments/', views.ListCreateAppointmentAPIView.as_view()),
    path('appointments/<pk>/', views.RetrieveUpdateDestroyAppointmentsAPIView.as_view()),
]
