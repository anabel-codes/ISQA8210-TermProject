"""Marketing stock photography must stay separate from property photos."""

from io import StringIO

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase

from .models import Listing, ListingPhoto, ListingStatus, Neighborhood, PropertyType


class PhotographyTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_lookups", stdout=StringIO())

    def test_home_and_login_offer_both_real_day_and_night_photographs(self):
        for url in ("/", "/manage/login/"):
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertContains(response, 'class="estate-day"')
                self.assertContains(response, 'class="estate-night"')
                self.assertContains(response, "img/estates/day")
                self.assertContains(response, "img/estates/night")
                self.assertNotContains(response, 'id="sky"')
                self.assertNotContains(response, 'data-art="')

    def test_credit_page_explains_stock_use_and_names_each_photographer(self):
        response = self.client.get("/photo-credits/")
        for name in ("Zac Gudakov", "Ryan Liu", "Marco Bianchetti"):
            self.assertContains(response, name)
        self.assertContains(response, "different properties")
        self.assertContains(response, "https://unsplash.com/license")

    def test_real_property_photo_is_preserved_when_available(self):
        user = User.objects.create_user("photographer")
        listing = Listing.objects.create(
            street_address="Real listing photo test", zip_code="68132", price=250000,
            description="A description used only in a disposable test database.",
            bedrooms=3, bathrooms=2, square_feet=1500, features=["Deck"],
            property_type=PropertyType.objects.first(), neighborhood=Neighborhood.objects.first(),
            current_status=ListingStatus.objects.get(name="Available"), administrator=user, last_modified_by=user,
        )
        photo = ListingPhoto.objects.create(listing=listing, image_file="listings/real-cover.jpg", display_order=1, alternative_text="Actual property exterior")
        response = self.client.get("/listings/")
        self.assertContains(response, photo.image_file.url)
        self.assertContains(response, "Actual property exterior")
        self.assertNotContains(response, "Stock photo. Property photos pending.")

    def test_unphotographed_listing_is_explicitly_labeled_as_stock(self):
        user = User.objects.create_user("owner")
        Listing.objects.create(
            street_address="Stock fallback test", zip_code="68132", price=250000,
            description="A description used only in a disposable test database.",
            bedrooms=3, bathrooms=2, square_feet=1500, features=["Deck"],
            property_type=PropertyType.objects.first(), neighborhood=Neighborhood.objects.first(),
            current_status=ListingStatus.objects.get(name="Available"), administrator=user, last_modified_by=user,
        )
        self.assertContains(self.client.get("/listings/"), "Stock photo. Property photos pending.")
