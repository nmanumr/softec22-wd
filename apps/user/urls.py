from django.urls import path

from apps.user import views

app_label = 'user'
urlpatterns = [
    path('authenticate/', views.AuthenticateUserView.as_view()),
    path('password/', views.ChangePasswordView.as_view()),
    path('forget/', views.ForgetPasswordView.as_view()),
    path('reset/', views.ResetPasswordView.as_view()),

    # User Profile
    path('current/', views.UserProfileView.as_view()),

    # Signup
    path('create/', views.CreateAccountView.as_view()),
    path('verify-email/', views.EmailVerificationView.as_view()),

    path('all/', views.PublicProfileListView.as_view()),
    path('<username>/', views.PublicProfileView.as_view()),
]
