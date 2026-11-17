"""Log every log in and log out with who and when (US-01, US-02, course NFR on login tracking)."""

from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver

from .audit import record, who


@receiver(user_logged_in, dispatch_uid="ck_audit_login")
def log_login(sender, request, user, **kwargs):
    record(user, "login", "Account", user.pk, f"{who(user)} logged in")


@receiver(user_logged_out, dispatch_uid="ck_audit_logout")
def log_logout(sender, request, user, **kwargs):
    if user is not None:  # logging out with no session sends user=None
        record(user, "logout", "Account", user.pk, f"{who(user)} logged out")
