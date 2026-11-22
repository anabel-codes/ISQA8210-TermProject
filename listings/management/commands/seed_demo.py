"""Add the prototype's 11 sample listings so the pages have something to show while developing.

Local use only: python manage.py seed_demo
Never run this on the live site. Real listings are added by Carlos and Janet.
"""

from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

from listings.models import Listing, ListingStatus, Neighborhood, PropertyType

HOOD_LL = {
    "Benson": (41.2853, -96.0031),
    "Downtown": (41.2587, -95.9378),
    "Happy Hollow": (41.2664, -95.9887),
    "Rockbrook": (41.2386, -96.0752),
}
FEATURES = {
    "Ranch": ["Single-level living", "Attached garage", "Finished basement", "Fenced backyard", "Central air"],
    "Tudor": ["Original woodwork", "Fireplace", "Detached garage", "Mature trees", "Full basement"],
    "Split-Entry": ["Two living levels", "Lower-level family room", "Attached garage", "Fenced backyard"],
    "Townhome": ["Attached garage", "Private patio", "Central air", "Laundry room", "Walk to shops"],
    "Condominium": ["Elevator", "Secure entry", "Assigned parking", "In-unit laundry", "Walk to restaurants"],
}
# street, type, status, hood, zip, price, beds, baths, sqft, featured
SAMPLES = [
    ("4812 Underwood Avenue", "Tudor", "Available", "Happy Hollow", "68132", 425000, 4, "2.5", 2640, True),
    ("6107 Maple Street", "Ranch", "Available", "Benson", "68104", 289000, 3, "2", 1450, False),
    ("1450 Jones Street, Unit 4", "Condominium", "Available", "Downtown", "68102", 315000, 2, "2", 1180, False),
    ("10230 Rockbrook Road", "Townhome", "Pending", "Rockbrook", "68124", 368000, 3, "2.5", 1820, False),
    ("5021 Izard Street", "Tudor", "Available", "Happy Hollow", "68132", 409500, 3, "2", 2100, False),
    ("2416 South 108th Street", "Ranch", "Available", "Rockbrook", "68144", 334000, 3, "2", 1640, False),
    ("1101 Harney Street, Unit 7B", "Condominium", "Available", "Downtown", "68102", 259000, 1, "1", 860, False),
    ("6320 Binney Street", "Townhome", "Available", "Benson", "68104", 274900, 2, "1.5", 1300, False),
    ("118 North 52nd Street", "Ranch", "Pending", "Happy Hollow", "68132", 438000, 4, "3", 2380, False),
    ("5914 Military Avenue", "Tudor", "Available", "Benson", "68104", 352000, 4, "2", 2050, False),
    ("11815 Poppleton Avenue", "Split-Entry", "Available", "Rockbrook", "68144", 298500, 4, "2", 1960, False),
]


class Command(BaseCommand):
    help = "Add 11 sample listings for local development (never on the live site)."

    def handle(self, *args, **options):
        """Add fictional development listings for a local database while preserving existing addresses."""
        call_command("seed_lookups", stdout=self.stdout)
        admin = User.objects.filter(username="carlos").first() or User.objects.filter(is_superuser=True).first()
        if not admin:
            raise CommandError("Run create_admins (or createsuperuser) first, so the listings have an owner.")
        made = 0
        for i, (street, ptype, status, hood, zip_code, price, beds, baths, sqft, featured) in enumerate(SAMPLES, 1):
            if Listing.objects.filter(street_address=street).exists():
                continue
            lat, lng = HOOD_LL[hood]
            Listing.objects.create(
                street_address=street, zip_code=zip_code, price=Decimal(price),
                description=(
                    f"<p>{street} is a {beds}-bedroom {ptype.lower()} in {hood}. "
                    "This is sample text from the prototype so the pages have something to show.</p>"
                ),
                features=FEATURES[ptype], latitude=Decimal(f"{lat + i * 0.0007:.6f}"),
                longitude=Decimal(f"{lng - i * 0.0006:.6f}"),
                bedrooms=beds, bathrooms=Decimal(baths), square_feet=sqft,
                garage_spaces=1 if ptype == "Condominium" else 2, year_built=1922 + (i * 7) % 80,
                property_type=PropertyType.objects.get(name=ptype),
                neighborhood=Neighborhood.objects.get(name=hood),
                current_status=ListingStatus.objects.get(name=status),
                is_featured=featured and not Listing.objects.filter(is_featured=True).exists(),
                administrator=admin, last_modified_by=admin,
            )
            made += 1
        self.stdout.write(self.style.SUCCESS(f"Added {made} sample listings."))
