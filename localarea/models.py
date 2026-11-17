"""Local area page content (US-23, US-24)."""

from django.conf import settings
from django.db import models


class LocalAreaCategory(models.Model):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        db_table = "LOCAL_AREA_CATEGORY"
        verbose_name_plural = "local area categories"

    def __str__(self):
        return self.name


class LocalAreaEntry(models.Model):
    category = models.ForeignKey(LocalAreaCategory, on_delete=models.PROTECT, related_name="entries")
    title = models.CharField(max_length=120)
    description = models.TextField()
    web_link = models.URLField(max_length=255)
    is_active = models.BooleanField(default=True)
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "LOCAL_AREA_ENTRY"
        verbose_name_plural = "local area entries"

    def __str__(self):
        return self.title
