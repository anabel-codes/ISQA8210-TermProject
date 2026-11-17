from django.contrib.auth import views as auth_views
from django.urls import path

app_name = "accounts"

# LoginView already sends never-cache headers. LogoutView is POST only in Django 5.
urlpatterns = [
    path(
        "login/",
        auth_views.LoginView.as_view(
            template_name="manage/login.html", redirect_authenticated_user=True
        ),
        name="login",
    ),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]
