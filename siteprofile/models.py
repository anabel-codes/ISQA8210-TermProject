"""Broker profile shown on /about/ (US-17). A single row."""

from django.conf import settings
from django.db import models


class SiteProfile(models.Model):
    broker_name = models.CharField(max_length=100)
    biography = models.TextField()
    portrait_image_file = models.ImageField(upload_to="profile/", blank=True)
    office_address = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    website = models.URLField(max_length=255, blank=True)
    email = models.EmailField(max_length=254)
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "SITE_PROFILE"

    def __str__(self):
        return self.broker_name

    @classmethod
    def load(cls):
        return cls.objects.first()
