from django.urls import path

from . import views_public

app_name = "public"

urlpatterns = [
    path("", views_public.home, name="home"),
    path("listings/", views_public.listing_list, name="listing_list"),
    path("photo-credits/", views_public.photo_credits, name="photo_credits"),
]
