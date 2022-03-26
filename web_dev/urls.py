from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from spa.core import health

urlpatterns = [
    # Health Checks
    path('liveness', health.liveness),
    path('readiness', health.readiness),

    path('admin/', admin.site.urls),

    path('api/user/', include('apps.user.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
