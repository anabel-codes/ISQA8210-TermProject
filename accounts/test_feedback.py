"""Message delivery to the management UI, including the no-JavaScript fallback."""

from django.contrib import messages
from django.shortcuts import redirect
from django.test import TestCase, override_settings
from django.urls import path

from ckrealestate.urls import urlpatterns as application_urls

from .tests import AdminAccountsMixin


def queue_feedback(request):
    """Provide a test-only HTTP flow that queues every supported message level."""
    for level in (messages.SUCCESS, messages.ERROR, messages.WARNING, messages.INFO):
        messages.add_message(request, level, f"Feedback {level}: <script>alert('x')</script>")
    return redirect("listings_admin:dashboard")


urlpatterns = [path("test-feedback/", queue_feedback)] + application_urls


@override_settings(ROOT_URLCONF=__name__)
class ManagementFeedbackTests(AdminAccountsMixin, TestCase):
    def test_login_queues_a_success_message_for_the_dashboard(self):
        response = self.client.post("/manage/login/", {"username": "janet", "password": "Test-pass-456"}, follow=True)
        self.assertContains(response, 'data-level="success"')
        self.assertContains(response, "Welcome back, Janet.")

    def test_all_message_levels_render_safely_and_have_a_plain_html_fallback(self):
        self.client.force_login(self.janet)
        response = self.client.get("/test-feedback/", follow=True)
        for level in ("success", "error", "warning", "info"):
            self.assertContains(response, f'data-level="{level}"')
        self.assertContains(response, 'class="server-notices"')
        self.assertContains(response, "&lt;script&gt;")
        self.assertNotContains(response, "<script>alert('x')</script>")

    def test_messages_are_consumed_once(self):
        self.client.force_login(self.janet)
        self.client.get("/test-feedback/", follow=True)
        self.assertNotContains(self.client.get("/manage/"), "Feedback 25:")
