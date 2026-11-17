"""Shared guard for every admin view: login required and never cached (US-01, US-02)."""

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache


@method_decorator(never_cache, name="dispatch")
class AdminRequiredMixin(LoginRequiredMixin):
    """Use on class-based admin views."""


def admin_required(view_func):
    """Use on function-based admin views."""
    return never_cache(login_required(view_func))
