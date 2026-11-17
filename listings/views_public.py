"""Public pages. Every query uses Listing.active (is_active=True)."""

from decimal import Decimal

from django.db.models import Count, Q
from django.shortcuts import render

from .models import Listing, Neighborhood, PriceRange, PropertyType

BAND = Decimal("50000")
TYPE_ORDER = ["Ranch", "Tudor", "Split-Entry", "Townhome", "Condominium"]
HOOD_AREA = {
    "Benson": "North-central Omaha",
    "Downtown": "Central Omaha",
    "Happy Hollow": "Midtown Omaha",
    "Rockbrook": "West Omaha",
}


def ordered_types():
    """Home types in the order the case lists them; any type Carlos adds later goes last."""
    rank = {name: i for i, name in enumerate(TYPE_ORDER)}
    return sorted(PropertyType.objects.all(), key=lambda t: (rank.get(t.name, 99), t.name))


def _cards():
    return Listing.active.select_related(
        "property_type", "neighborhood", "current_status"
    ).prefetch_related("photos").order_by("-is_featured", "-date_created", "-pk")


def _search_options():
    return {
        "hoods": Neighborhood.objects.all(),
        "types": ordered_types(),
        "bands": PriceRange.objects.all(),
    }


def home(request):
    listings = _cards()
    featured = listings.filter(is_featured=True).first()
    hoods = Neighborhood.objects.annotate(
        n=Count("listing", filter=Q(listing__is_active=True))
    ).order_by("name")
    for h in hoods:
        h.area = HOOD_AREA.get(h.name, "Omaha")
    return render(request, "public/home.html", {
        "featured": featured,
        "listings": listings[:12],
        "total": listings.count(),
        "hood_cards": hoods,
        **_search_options(),
    })


def listing_list(request):
    """US-05 browse page. The three filters (US-10 to US-12) are plain GET parameters.

    Search logging for the report (US-21, US-22) is not wired yet.
    """
    listings = _cards()
    ptype = request.GET.get("type", "")
    hood = request.GET.get("hood", "")
    band = request.GET.get("band", "")
    chosen_band = None
    if ptype:
        listings = listings.filter(property_type__name=ptype)
    if hood:
        listings = listings.filter(neighborhood__name=hood)
    if band:
        chosen_band = PriceRange.objects.filter(pk=band).first() if band.isdigit() else None
        if chosen_band:
            # Lower bound included, upper excluded (D2).
            listings = listings.filter(
                price__gte=chosen_band.lower_value, price__lt=chosen_band.upper_value
            )
    return render(request, "public/listing_list.html", {
        "listings": listings,
        "filters": {"type": ptype, "hood": hood, "band": band},
        "chosen_band": chosen_band,
        "filtered": bool(ptype or hood or chosen_band),
        **_search_options(),
    })
