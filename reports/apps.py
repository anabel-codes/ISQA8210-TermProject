from django.apps import AppConfig


class ReportsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "reports"

    def ready(self):
        """Register the authentication audit receivers once Django has loaded the application."""
        from . import signals  # noqa: F401  (connects the login and logout receivers)
