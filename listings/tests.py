"""US-03 Add a New Property Listing."""

from io import StringIO
from unittest.mock import patch

from django.contrib.auth.models import Group, User
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from reports.models import AuditLog

from .models import Listing, ListingStatus, Neighborhood, PriceRange, PropertyType

CREATE = reverse("listings_admin:create")
PUBLIC_LIST = reverse("public:listing_list")


class US03AddListingTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_lookups", stdout=StringIO())
        cls.janet = User.objects.create_user("janet", password="Test-pass-456")
        cls.janet.groups.add(Group.objects.get_or_create(name="Administrators")[0])

    def setUp(self):
        self.client.login(username="janet", password="Test-pass-456")

    def valid_data(self, **overrides):
        data = {
            "street_address": "4812 Underwood Avenue",
            "zip_code": "68132",
            "price": "425,000",
            "property_type": PropertyType.objects.get(name="Tudor").pk,
            "neighborhood": Neighborhood.objects.get(name="Happy Hollow").pk,
            "bedrooms": "4",
            "bathrooms": "2.5",
            "garage_spaces": "2",
            "square_feet": "2340",
            "lot_size": "7800",
            "year_built": "1928",
            "description": "<p>A brick Tudor two blocks from Memorial Park, with the original woodwork.</p>",
            "features": "Fireplace; Fenced backyard; Detached garage",
            "latitude": "41.266400",
            "longitude": "-95.988700",
        }
        data.update(overrides)
        return data

    def test_ac1_valid_listing_is_saved_available_and_linked_to_me(self):
        response = self.client.post(CREATE, self.valid_data())
        self.assertRedirects(response, reverse("listings_admin:list"))
        listing = Listing.objects.get()
        self.assertEqual(listing.current_status.name, ListingStatus.AVAILABLE)
        self.assertEqual(listing.administrator, self.janet)
        self.assertEqual(listing.last_modified_by, self.janet)
        self.assertEqual(listing.price_range, PriceRange.objects.get(lower_value=400000))
        self.assertEqual(listing.features, ["Fireplace", "Fenced backyard", "Detached garage"])
        self.assertEqual((listing.city, listing.state), ("Omaha", "NE"))
        self.assertEqual(str(listing.latitude), "41.266400")

    def test_ac1_adding_a_listing_is_recorded_in_the_activity_log(self):
        self.client.post(CREATE, self.valid_data())
        row = AuditLog.objects.get(action="created")
        self.assertEqual((row.administrator, row.entity_name), (self.janet, "Listing"))
        self.assertEqual(row.entity_id, Listing.objects.get().pk)

    def test_ac1_new_listing_appears_among_public_listings(self):
        self.client.post(CREATE, self.valid_data())
        self.assertContains(self.client.get(PUBLIC_LIST), "4812 Underwood Avenue")

    def test_ac2_each_missing_required_field_is_flagged_and_nothing_saved(self):
        required = [
            "street_address", "zip_code", "price", "property_type", "neighborhood",
            "bedrooms", "bathrooms", "square_feet", "description", "features",
        ]
        for name in required:
            with self.subTest(field=name):
                response = self.client.post(CREATE, self.valid_data(**{name: ""}))
                self.assertEqual(response.status_code, 200)
                self.assertIn(name, response.context["form"].errors)
                self.assertEqual(Listing.objects.count(), 0)

    def test_description_is_cleaned_of_scripts(self):
        self.client.post(CREATE, self.valid_data(
            description="<p>Lovely house near the park with a big yard.</p><script>alert(1)</script>"
            '<a href="javascript:alert(1)">x</a>'
        ))
        saved = Listing.objects.get().description
        self.assertNotIn("<script", saved)
        self.assertNotIn("javascript:", saved)
        self.assertIn("<p>Lovely house", saved)

    def test_short_description_and_bad_features_are_rejected(self):
        response = self.client.post(CREATE, self.valid_data(description="<p>Too short.</p>", features="; x ;"))
        self.assertIn("description", response.context["form"].errors)
        self.assertIn("features", response.context["form"].errors)
        self.assertEqual(Listing.objects.count(), 0)

    def test_plain_text_description_becomes_paragraphs(self):
        self.client.post(CREATE, self.valid_data(description="First paragraph about the house.\n\nSecond one about the yard."))
        self.assertEqual(Listing.objects.get().description.count("<p>"), 2)

    def test_map_pin_is_optional(self):
        self.client.post(CREATE, self.valid_data(latitude="", longitude=""))
        self.assertIsNone(Listing.objects.get().latitude)

    def test_bad_zip_and_zero_price_are_rejected(self):
        response = self.client.post(CREATE, self.valid_data(zip_code="6813", price="0"))
        errors = response.context["form"].errors
        self.assertIn("zip_code", errors)
        self.assertIn("price", errors)
        self.assertEqual(Listing.objects.count(), 0)

    def test_anonymous_post_is_redirected_and_creates_nothing(self):
        self.client.logout()
        response = self.client.post(CREATE, self.valid_data())
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse("accounts:login"), response.url)
        self.assertEqual(Listing.objects.count(), 0)

    def test_price_band_edges_follow_d2(self):
        self.client.post(CREATE, self.valid_data(price="350000"))
        self.assertEqual(Listing.objects.get().price_range.lower_value, 350000)

    def test_nonfinite_prices_show_field_errors_instead_of_crashing(self):
        for price in ("NaN", "sNaN", "Infinity", "-Infinity"):
            with self.subTest(price=price):
                response = self.client.post(CREATE, self.valid_data(price=price))
                self.assertEqual(response.status_code, 200)
                self.assertIn("price", response.context["form"].errors)
        self.assertEqual(Listing.objects.count(), 0)

    def test_listing_rolls_back_if_audit_write_fails(self):
        with patch("listings.views_admin.record", side_effect=RuntimeError("audit unavailable")):
            with self.assertRaises(RuntimeError):
                self.client.post(CREATE, self.valid_data())
        self.assertEqual(Listing.objects.count(), 0)

    def test_validation_rejects_out_of_range_house_fields(self):
        for name, value in {
            "price": "999", "zip_code": "6813x", "bedrooms": "21", "bathrooms": "2.3",
            "square_feet": "99", "lot_size": "99", "year_built": "1799", "garage_spaces": "11",
        }.items():
            with self.subTest(field=name):
                response = self.client.post(CREATE, self.valid_data(**{name: value}))
                self.assertEqual(response.status_code, 200)
                self.assertIn(name, response.context["form"].errors)
        self.assertEqual(Listing.objects.count(), 0)

    def test_post_cannot_spoof_owner_status_or_featured_flag(self):
        self.client.post(CREATE, self.valid_data(
            administrator="9999", last_modified_by="9999", is_featured="on", is_active="",
            current_status=ListingStatus.objects.get(name=ListingStatus.SOLD).pk,
        ))
        listing = Listing.objects.get()
        self.assertEqual(listing.administrator, self.janet)
        self.assertEqual(listing.current_status.name, ListingStatus.AVAILABLE)
        self.assertTrue(listing.is_active)
        self.assertFalse(listing.is_featured)


class SeedLookupsTests(TestCase):
    def test_seed_is_idempotent(self):
        call_command("seed_lookups", stdout=StringIO())
        call_command("seed_lookups", stdout=StringIO())
        self.assertEqual(PropertyType.objects.count(), 5)
        self.assertEqual(PriceRange.objects.count(), 20)
        self.assertEqual(PriceRange.objects.order_by("lower_value").first().name, "Under $50,000")
        self.assertEqual(PriceRange.objects.order_by("lower_value").last().upper_value, 1000000)


class PublicPagesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_lookups", stdout=StringIO())
        cls.carlos = User.objects.create_user("carlos", password="x-Test-pass-1", first_name="Carlos")
        available = ListingStatus.objects.get(name="Available")

        def make(street, price, ptype, hood, active=True):
            return Listing.objects.create(
                street_address=street, zip_code="68132", price=price, description="<p>Sample</p>",
                features=["Deck"], bedrooms=3, bathrooms=2, square_feet=1500,
                property_type=PropertyType.objects.get(name=ptype),
                neighborhood=Neighborhood.objects.get(name=hood), current_status=available,
                is_active=active, administrator=cls.carlos, last_modified_by=cls.carlos,
            )

        make("1 Ranch Road", 300000, "Ranch", "Benson")
        make("2 Tudor Lane", 350000, "Tudor", "Happy Hollow")
        make("3 Hidden Court", 320000, "Ranch", "Benson", active=False)

    def test_home_and_listings_show_only_active_listings(self):
        for url in (reverse("public:home"), PUBLIC_LIST):
            with self.subTest(url=url):
                html = self.client.get(url).content.decode()
                self.assertIn("1 Ranch Road", html)
                self.assertNotIn("3 Hidden Court", html)

    def test_filters_by_type_neighborhood_and_price_range(self):
        band = PriceRange.objects.get(lower_value=350000)
        html = self.client.get(PUBLIC_LIST, {"band": band.pk}).content.decode()
        self.assertIn("2 Tudor Lane", html)  # $350,000 sits in $350k to $400k (D2)
        self.assertNotIn("1 Ranch Road", html)
        html = self.client.get(PUBLIC_LIST, {"type": "Ranch", "hood": "Benson"}).content.decode()
        self.assertIn("1 Ranch Road", html)
        self.assertNotIn("2 Tudor Lane", html)


class AdminListingTableTests(TestCase):
    """Search, price band filter and sortable headers on /manage/listings/."""

    @classmethod
    def setUpTestData(cls):
        call_command("seed_lookups", stdout=StringIO())
        cls.janet = User.objects.create_user("janet", password="Test-pass-456")
        cls.janet.groups.add(Group.objects.get_or_create(name="Administrators")[0])
        avail = ListingStatus.objects.get(name=ListingStatus.AVAILABLE)
        tudor = PropertyType.objects.get(name="Tudor")
        for street, hood, price in [
            ("100 Alpha Street", "Benson", 120000),
            ("200 Beta Street", "Rockbrook", 420000),
            ("300 Gamma Street", "Rockbrook", 260000),
        ]:
            Listing.objects.create(
                street_address=street, zip_code="68100", price=price, property_type=tudor,
                neighborhood=Neighborhood.objects.get(name=hood), bedrooms=3, bathrooms=2,
                square_feet=1500, description="<p>Sample listing text that is long enough.</p>",
                current_status=avail, administrator=cls.janet, last_modified_by=cls.janet,
            )

    def setUp(self):
        self.client.login(username="janet", password="Test-pass-456")
        self.url = reverse("listings_admin:list")

    def streets(self, response):
        return [l.street_address for l in response.context["page"]]

    def test_search_matches_neighborhood(self):
        r = self.client.get(self.url, {"q": "rockbrook"})
        self.assertEqual(sorted(self.streets(r)), ["200 Beta Street", "300 Gamma Street"])

    def test_price_band_filter(self):
        band = PriceRange.objects.get(lower_value=400000)
        r = self.client.get(self.url, {"band": band.pk})
        self.assertEqual(self.streets(r), ["200 Beta Street"])
        self.assertTrue(r.context["filtered"])

    def test_header_sort_by_price_and_address(self):
        r = self.client.get(self.url, {"sort": "price_lo"})
        self.assertEqual(self.streets(r)[0], "100 Alpha Street")
        r = self.client.get(self.url, {"sort": "addr_desc"})
        self.assertEqual(self.streets(r)[0], "300 Gamma Street")

    def test_header_link_toggles_direction(self):
        r = self.client.get(self.url, {"sort": "price_lo"})
        self.assertEqual(r.context["heads"]["price"]["sort"], "price_hi")
        self.assertEqual(r.context["heads"]["price"]["state"], "ascending")
        self.assertContains(r, 'aria-sort="ascending"')

    def test_unknown_sort_falls_back(self):
        self.assertEqual(self.client.get(self.url, {"sort": "nope"}).status_code, 200)

    def test_band_dropdown_and_reset_button_render(self):
        r = self.client.get(self.url)
        self.assertContains(r, 'id="lBand"')
        self.assertContains(r, 'aria-label="Clear filters"')


class DashboardTableTests(AdminListingTableTests):
    """The dashboard's Newest listings table carries the filter form and row data."""

    def test_dashboard_has_filter_form_and_row_data(self):
        r = self.client.get(reverse("listings_admin:dashboard"))
        for marker in ('id="dashFilter"', 'id="tSearch"', 'id="tBand"', 'id="tStatus"', 'id="tReset"', 'data-key="price"'):
            self.assertContains(r, marker)
        self.assertContains(r, 'data-hood="Rockbrook"')
        self.assertEqual(len(r.context["latest"]), 3)
