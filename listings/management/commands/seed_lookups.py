"""Create the lookup rows. Safe to run more than once (BLUEPRINT section 7)."""

from decimal import Decimal

from django.core.management.base import BaseCommand

from listings.models import ListingStatus, Neighborhood, PriceRange, PropertyType

PROPERTY_TYPES = ["Ranch", "Tudor", "Split-Entry", "Townhome", "Condominium"]
NEIGHBORHOODS = ["Benson", "Downtown", "Happy Hollow", "Rockbrook"]
STATUSES = [ListingStatus.AVAILABLE, ListingStatus.PENDING, ListingStatus.SOLD]
BAND = Decimal("50000")
CEILING = Decimal("1000000")  # 20 ranges, $0 to $1M (D6)


def band_name(low, high):
    return f"Under ${high:,.0f}" if low == 0 else f"${low:,.0f} to ${high:,.0f}"


class Command(BaseCommand):
    help = "Create lookup rows for types, neighborhoods, statuses and $50k price bands."

    def handle(self, *args, **options):
        for name in PROPERTY_TYPES:
            PropertyType.objects.get_or_create(name=name)
        for name in NEIGHBORHOODS:
            Neighborhood.objects.get_or_create(name=name)
        for name in STATUSES:
            ListingStatus.objects.get_or_create(name=name)
        low = Decimal("0")
        while low < CEILING:
            high = low + BAND
            band, _ = PriceRange.objects.get_or_create(
                lower_value=low, upper_value=high, defaults={"name": band_name(low, high)}
            )
            if band.name != band_name(low, high):
                band.name = band_name(low, high)
                band.save(update_fields=["name"])
            low = high
        # Older seeds went up to $2M. Drop those bands unless a row still points at one.
        stale = PriceRange.objects.filter(lower_value__gte=CEILING)
        removed = 0
        for band in stale:
            if not band.listing_set.exists() and not band.searchlog_set.exists():
                band.delete()
                removed += 1
        if removed:
            self.stdout.write(f"Removed {removed} price ranges above $1,000,000.")
        self.stdout.write(self.style.SUCCESS("Lookups seeded."))
