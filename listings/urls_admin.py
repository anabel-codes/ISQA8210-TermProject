from django.urls import path

from . import views_admin

app_name = "listings_admin"

# Mounted at /manage/ (see ckrealestate/urls.py). Login and logout live in accounts.urls.
urlpatterns = [
    path("", views_admin.dashboard, name="dashboard"),
    path("listings/", views_admin.admin_listing_list, name="list"),
    path("listings/new/", views_admin.listing_create, name="create"),
]
