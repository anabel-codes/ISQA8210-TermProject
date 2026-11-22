"""Session endpoints for the site's management area."""

from django.contrib import messages
from django.contrib.auth.views import LoginView


class AdministratorLoginView(LoginView):
    def form_valid(self, form):
        """Start the authenticated session, then queue a welcome toast for the dashboard."""
        response = super().form_valid(form)
        user = form.get_user()
        messages.success(self.request, f"Welcome back, {user.first_name or user.username}.")
        return response
