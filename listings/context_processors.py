"""Values every public page needs: office contact details for the header drawer and footer."""

from django.conf import settings

from siteprofile.models import SiteProfile

PLACEHOLDER = {"email": "[Office email]", "phone": "[Office phone]", "hours": "[Office hours]"}


def site(request):
    extra = {}
    if request.path.startswith("/manage/") and request.user.is_authenticated:
        from .models import Listing

        extra["sb_count"] = Listing.objects.filter(is_active=True).count()
    profile = SiteProfile.load()
    office = dict(PLACEHOLDER)
    if profile:
        office.update(email=profile.email, phone=profile.phone)
    elif getattr(settings, "OFFICE_EMAIL", "") and "example" not in settings.OFFICE_EMAIL:
        office["email"] = settings.OFFICE_EMAIL
    return {"office": office, **extra}
