"""Admin form for adding a listing (US-03). Photos come with US-04.

Validation rules follow BLUEPRINT section 13, US-03. The browser checks the same
rules first (static/js/admin.js), but this form is what decides.
"""

import datetime
import re
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation

import nh3
from django import forms
from django.utils.html import strip_tags

from .models import Listing

ZIP_RE = re.compile(r"^\d{5}$")
RICH_TAGS = {"p", "br", "strong", "em", "b", "i", "u", "ol", "ul", "li", "a"}
RICH_ATTRS = {"a": {"href"}}
FEATURE_SEPARATOR = ";"
REQUIRED = {
    "street_address": "Enter the street address, for example 4812 Underwood Avenue.",
    "neighborhood": "Pick the neighborhood.",
    "zip_code": "Enter the five-digit ZIP code.",
    "property_type": "Pick the home type.",
    "bedrooms": "Enter the number of bedrooms, from 0 to 20.",
    "bathrooms": "Enter bathrooms in halves, for example 2 or 2.5.",
    "square_feet": "Enter the finished square feet, at least 100.",
    "features": "Add at least one feature, for example Fireplace or Fenced backyard.",
    "price": "Enter the asking price, at least $1,000.",
    "description": "Write at least a few sentences (40 characters or more).",
}
SIX_PLACES = Decimal("0.000001")


def clean_rich_text(html):
    """Keep only the formatting the editor offers (D12). Links open safely."""
    return nh3.clean(html or "", tags=RICH_TAGS, attributes=RICH_ATTRS, link_rel="noopener noreferrer")


def plain_length(html):
    return len(" ".join(strip_tags(html or "").split()))


class ListingForm(forms.ModelForm):
    price = forms.CharField(label="Price", help_text="Commas are fine, for example 425,000.")
    features = forms.CharField(
        label="Features",
        help_text="Separate features with a semicolon, for example: Fireplace; Fenced backyard.",
    )

    class Meta:
        model = Listing
        fields = [
            "street_address",
            "neighborhood",
            "zip_code",
            "latitude",
            "longitude",
            "property_type",
            "bedrooms",
            "bathrooms",
            "square_feet",
            "lot_size",
            "year_built",
            "garage_spaces",
            "features",
            "price",
            "description",
        ]
        labels = {
            "street_address": "Street address",
            "zip_code": "ZIP code",
            "property_type": "Home type",
            "square_feet": "Finished size",
            "lot_size": "Lot size",
            "garage_spaces": "Garage spaces",
            "year_built": "Year built",
        }
        widgets = {
            "description": forms.Textarea(attrs={"rows": 8}),
            "latitude": forms.HiddenInput(),
            "longitude": forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["neighborhood"].empty_label = "Pick a neighborhood"
        self.fields["property_type"].empty_label = "Pick a home type"
        self.fields["garage_spaces"].initial = 0
        self.fields["garage_spaces"].required = False
        for name, message in REQUIRED.items():
            self.fields[name].error_messages["required"] = message
        if isinstance(self.initial.get("features"), list):
            self.initial["features"] = f"{FEATURE_SEPARATOR} ".join(self.initial["features"])

    def clean_street_address(self):
        value = " ".join(self.cleaned_data["street_address"].split())
        if len(value) < 5:
            raise forms.ValidationError("Enter the full street address, like 4812 Underwood Avenue.")
        return value

    def clean_price(self):
        raw = (self.cleaned_data.get("price") or "").replace(",", "").replace("$", "").strip()
        try:
            value = Decimal(raw)
        except InvalidOperation:
            raise forms.ValidationError("Enter the price as a number, like 425,000.")
        if not value.is_finite():
            raise forms.ValidationError("Enter the price as a number, like 425,000.")
        if value < 1000:
            raise forms.ValidationError("Enter the asking price, at least $1,000.")
        if value > 50_000_000:
            raise forms.ValidationError("That price looks too high. Check the number of zeros.")
        return value.quantize(Decimal("1"))

    def clean_zip_code(self):
        value = self.cleaned_data["zip_code"].strip()
        if not ZIP_RE.match(value):
            raise forms.ValidationError("Use 5 digits, like 68132.")
        return value

    def clean_bedrooms(self):
        value = self.cleaned_data["bedrooms"]
        if value is not None and value > 20:
            raise forms.ValidationError("Enter 0 to 20 bedrooms.")
        return value

    def clean_bathrooms(self):
        value = self.cleaned_data["bathrooms"]
        if value is not None and ((value * 2) % 1 != 0 or not 0 <= value <= 20):
            raise forms.ValidationError("Use whole or half baths, like 2 or 2.5.")
        return value

    def clean_square_feet(self):
        value = self.cleaned_data["square_feet"]
        if value is not None and value < 100:
            raise forms.ValidationError("Enter the finished size, at least 100 sqft.")
        return value

    def clean_lot_size(self):
        value = self.cleaned_data.get("lot_size")
        if value is not None and value < 100:
            raise forms.ValidationError("Enter the lot size in square feet, or leave it blank.")
        return value

    def clean_year_built(self):
        value = self.cleaned_data.get("year_built")
        this_year = datetime.date.today().year
        if value is not None and not (1800 <= value <= this_year):
            raise forms.ValidationError(f"Enter a year between 1800 and {this_year}, or leave it blank.")
        return value

    def clean_garage_spaces(self):
        value = self.cleaned_data.get("garage_spaces")
        if value is None:
            return 0
        if value > 10:
            raise forms.ValidationError("Enter 0 to 10 garage spaces.")
        return value

    def clean_features(self):
        raw = self.cleaned_data.get("features") or ""
        items, seen = [], set()
        for part in raw.replace("\n", FEATURE_SEPARATOR).split(FEATURE_SEPARATOR):
            item = " ".join(part.split())
            if item and item.lower() not in seen:
                seen.add(item.lower())
                items.append(item)
        if not items:
            raise forms.ValidationError("Add at least one feature, like Fireplace.")
        if len(items) > 20:
            raise forms.ValidationError("Keep it to 20 features or fewer.")
        bad = [i for i in items if not 2 <= len(i) <= 60]
        if bad:
            raise forms.ValidationError("Each feature needs 2 to 60 characters.")
        return items

    def clean_description(self):
        html = clean_rich_text(self.cleaned_data.get("description"))
        if "<" not in html:  # plain text from a browser without the editor
            paragraphs = [p.strip() for p in html.split("\n\n") if p.strip()]
            html = "".join(f"<p>{p}</p>" for p in paragraphs)
        if plain_length(html) < 40:
            raise forms.ValidationError("Write at least 40 characters so buyers know what the house is like.")
        return html

    def _clean_coord(self, name, limit):
        value = self.cleaned_data.get(name)
        if value is None:
            return None
        if not -limit <= value <= limit:
            raise forms.ValidationError("That map pin is off the map. Click the map again.")
        return value.quantize(SIX_PLACES, rounding=ROUND_HALF_UP)

    def clean_latitude(self):
        return self._clean_coord("latitude", 90)

    def clean_longitude(self):
        return self._clean_coord("longitude", 180)

    def clean(self):
        data = super().clean()
        if (data.get("latitude") is None) != (data.get("longitude") is None):
            data["latitude"] = data["longitude"] = None
        return data
