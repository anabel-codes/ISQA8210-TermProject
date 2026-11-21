"""Only website administrators may start a management session."""

from django.contrib.auth.forms import AuthenticationForm

from .mixins import is_administrator


class AdministratorAuthenticationForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
        if not is_administrator(user):
            raise self.get_invalid_login_error()
