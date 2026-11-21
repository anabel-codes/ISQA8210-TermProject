"""Shared guard for every admin view: login required and never cached (US-01, US-02)."""

from functools import wraps

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core.exceptions import PermissionDenied
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache


@method_decorator(never_cache, name="dispatch")
class AdminRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    """Use on class-based admin views."""

    def test_func(self):
        return is_administrator(self.request.user)


def is_administrator(user):
    return user.is_authenticated and user.is_active and (
        user.is_superuser or user.groups.filter(name="Administrators").exists()
    )


def admin_required(view_func):
    """Use on function-based admin views."""
    @wraps(view_func)
    def guarded(request, *args, **kwargs):
        if not is_administrator(request.user):
            raise PermissionDenied
        return view_func(request, *args, **kwargs)

    return never_cache(login_required(guarded))
