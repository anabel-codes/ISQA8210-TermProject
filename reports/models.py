"""Search log (US-10 to US-12, US-21, US-22) and audit log (US-20)."""

from django.conf import settings
from django.db import models


class SearchLog(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    property_type = models.ForeignKey(
        "listings.PropertyType", null=True, blank=True, on_delete=models.SET_NULL
    )
    neighborhood = models.ForeignKey(
        "listings.Neighborhood", null=True, blank=True, on_delete=models.SET_NULL
    )
    price_range = models.ForeignKey(
        "listings.PriceRange", null=True, blank=True, on_delete=models.SET_NULL
    )
    is_completed = models.BooleanField(default=False)  # definition agreed with Paul (D5)

    class Meta:
        db_table = "SEARCH_LOG"


class AuditLog(models.Model):
    administrator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_time = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=30)  # created, price_changed, featured_set, ...
    entity_name = models.CharField(max_length=40)  # "Listing", "SiteProfile", "LocalAreaEntry"
    entity_id = models.PositiveIntegerField()
    change_summary = models.TextField()

    class Meta:
        db_table = "AUDIT_LOG"
        ordering = ["-date_time"]
