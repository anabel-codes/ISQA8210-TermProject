from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("django-admin/", admin.site.urls),  # team only; Carlos and Janet use /manage/
    path("manage/", include("accounts.urls")),
    path("manage/", include("listings.urls_admin")),
    path("", include("listings.urls_public")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
