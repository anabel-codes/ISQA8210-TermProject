"""Listing lookups, listings and their photos (BLUEPRINT section 6).

Table names follow Cole's ERD through ``db_table``.
"""

from django.conf import settings
from django.db import models
from django.db.models import Q


class PropertyType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "PROPERTY_TYPE"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Neighborhood(models.Model):
    name = models.CharField(max_length=80, unique=True)

    class Meta:
        db_table = "NEIGHBORHOOD"
        ordering = ["name"]

    def __str__(self):
        return self.name


class ListingStatus(models.Model):
    AVAILABLE, PENDING, SOLD = "Available", "Pending", "Sold"
    name = models.CharField(max_length=20, unique=True)

    class Meta:
        db_table = "LISTING_STATUS"
        verbose_name_plural = "listing statuses"

    def __str__(self):
        return self.name


class PriceRange(models.Model):
    """A $50,000 band. Lower bound inclusive, upper bound exclusive (Open Decision D2)."""

    name = models.CharField(max_length=80, unique=True)
    lower_value = models.DecimalField(max_digits=12, decimal_places=2)
    upper_value = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "PRICE_RANGE"
        ordering = ["lower_value"]

    def __str__(self):
        return self.name

    @classmethod
    def for_price(cls, price):
        return cls.objects.filter(lower_value__lte=price, upper_value__gt=price).first()


class ActiveListingManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class Listing(models.Model):
    street_address = models.CharField(max_length=120)
    city = models.CharField(max_length=60, default="Omaha")
    state = models.CharField(max_length=2, default="NE")
    zip_code = models.CharField(max_length=10)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(help_text="Cleaned HTML from the rich-text editor (nh3)")
    features = models.JSONField(
        default=list, help_text="General features, e.g. ['Fireplace', 'Fenced backyard'] (D10)"
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)  # map pin (D11)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    garage_spaces = models.PositiveSmallIntegerField(default=0)
    square_feet = models.PositiveIntegerField()
    lot_size = models.PositiveIntegerField(null=True, blank=True, help_text="Square feet")
    year_built = models.PositiveSmallIntegerField(null=True, blank=True)

    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.PROTECT)
    price_range = models.ForeignKey(
        PriceRange, on_delete=models.PROTECT, null=True, blank=True, editable=False
    )
    current_status = models.ForeignKey(ListingStatus, on_delete=models.PROTECT)

    is_active = models.BooleanField(default=True)  # US-09 soft delete
    is_featured = models.BooleanField(default=False)  # US-15, one at a time

    administrator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="listings_created"
    )
    last_modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="listings_modified"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    date_sold = models.DateField(null=True, blank=True)  # US-07

    objects = models.Manager()
    active = ActiveListingManager()

    # The case: only the price changes once a listing is up (D13). These are the only
    # fields later stories may change; there is no full edit form.
    EDITABLE_AFTER_CREATE = (
        "price", "current_status", "date_sold", "is_featured", "is_active", "last_modified_by",
    )

    class Meta:
        db_table = "LISTING"
        ordering = ["-date_created"]
        constraints = [
            models.UniqueConstraint(
                fields=["is_featured"],
                condition=Q(is_featured=True),
                name="only_one_featured_listing",
            ),
            models.CheckConstraint(condition=Q(price__gt=0), name="listing_price_positive"),
        ]

    def __str__(self):
        return self.street_address

    def save(self, *args, **kwargs):
        # Keep the stored band in step with the price (fixes the stale-band risk, D3).
        self.price_range = PriceRange.for_price(self.price)
        super().save(*args, **kwargs)

    @property
    def art_seed(self):
        """Seed for the stand-in drawing shown until the listing has photos."""
        return self.pk * 977 + 13

    @property
    def cover_photo(self):
        return self.photos.order_by("display_order").first()


class ListingPhoto(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos")
    image_file = models.ImageField(upload_to="listings/%Y/%m/")
    display_order = models.PositiveSmallIntegerField()  # 1 to 4
    alternative_text = models.CharField(max_length=150)

    class Meta:
        db_table = "LISTING_PHOTO"
        ordering = ["display_order"]
        constraints = [
            models.UniqueConstraint(fields=["listing", "display_order"], name="one_photo_per_slot"),
            models.CheckConstraint(
                condition=Q(display_order__gte=1, display_order__lte=4),
                name="photo_order_1_to_4",
            ),
        ]

    def __str__(self):
        return f"{self.listing} photo {self.display_order}"
