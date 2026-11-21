"""Admin views under /manage/ (dashboard, US-01 landing page, US-03 add listing)."""

from django.contrib import messages
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Count, Q, Sum
from django.shortcuts import redirect, render

from accounts.mixins import admin_required
from reports.audit import record
from reports.models import AuditLog

from .forms import ListingForm
from .models import Listing, ListingStatus, Neighborhood, PriceRange, PropertyType

PER_PAGE = (10, 25, 50)
SORTS = {
    "new": ("-date_created", "Newest first"),
    "old": ("date_created", "Oldest first"),
    "updated": ("-date_updated", "Recently changed"),
    "updated_old": ("date_updated", "Least recently changed"),
    "price_hi": ("-price", "Price, high to low"),
    "price_lo": ("price", "Price, low to high"),
    "addr": ("street_address", "Address, A to Z"),
    "addr_desc": ("-street_address", "Address, Z to A"),
}
# Column header -> (ascending key, descending key). Clicking a header toggles between them.
HEADER_SORTS = {
    "property": ("addr", "addr_desc"),
    "price": ("price_lo", "price_hi"),
    "changed": ("updated_old", "updated"),
}


def status_counts():
    """Count active listings by status and report the separate hidden-listing total."""
    rows = Listing.objects.filter(is_active=True).values("current_status__name").annotate(n=Count("id"))
    counts = {r["current_status__name"]: r["n"] for r in rows}
    return {
        "active": sum(counts.values()),
        "available": counts.get(ListingStatus.AVAILABLE, 0),
        "pending": counts.get(ListingStatus.PENDING, 0),
        "sold": counts.get(ListingStatus.SOLD, 0),
        "hidden": Listing.objects.filter(is_active=False).count(),
    }


@admin_required
def dashboard(request):
    """Overview with real counts. Not a story (D15); the sales and search charts come later."""
    counts = status_counts()
    recent = (
        AuditLog.objects.exclude(action__in=["login", "logout"])
        .select_related("administrator")[:6]
    )
    latest = Listing.objects.filter(is_active=True).select_related(
        "property_type", "neighborhood", "current_status", "price_range"
    )[:10]
    featured = Listing.active.filter(is_featured=True).select_related("neighborhood").first()
    on_site = Listing.objects.filter(is_active=True)
    sold = on_site.filter(current_status__name=ListingStatus.SOLD).aggregate(v=Sum("price"))["v"] or 0
    pending = on_site.filter(current_status__name=ListingStatus.PENDING).aggregate(v=Sum("price"))["v"] or 0
    money = {
        "sold": sold,
        "pending": pending,
        "sold_pct": round(sold / (sold + pending) * 100, 1) if sold + pending else 0,
    }
    return render(request, "manage/dashboard.html", {
        "counts": counts,
        "recent": recent,
        "latest": latest,
        "hoods": Neighborhood.objects.all(),
        "types": PropertyType.objects.all(),
        "statuses": [ListingStatus.AVAILABLE, ListingStatus.PENDING, ListingStatus.SOLD],
        "bands": PriceRange.objects.all(),
        "featured": featured,
        "money": money,
        "nav": "dashboard",
    })


@admin_required
def admin_listing_list(request):
    """Handle protected GET listing search, whitelisted sorting, filters and pagination."""
    tab = "hidden" if request.GET.get("tab") == "hidden" else "active"
    qs = Listing.objects.select_related("property_type", "neighborhood", "current_status")
    qs = qs.filter(is_active=(tab == "active"))

    q = request.GET.get("q", "").strip()
    hood = request.GET.get("hood", "")
    ptype = request.GET.get("type", "")
    status = request.GET.get("status", "")
    band = request.GET.get("band", "")
    sort = request.GET.get("sort", "new")
    if sort not in SORTS:
        sort = "new"
    if q:
        qs = qs.filter(
            Q(street_address__icontains=q) | Q(zip_code__startswith=q) | Q(neighborhood__name__icontains=q)
        )
    if band.isdigit():
        qs = qs.filter(price_range_id=int(band))
    if hood:
        qs = qs.filter(neighborhood__name=hood)
    if ptype:
        qs = qs.filter(property_type__name=ptype)
    if status:
        qs = qs.filter(current_status__name=status)
    qs = qs.order_by(SORTS[sort][0], "-pk")

    try:
        per = int(request.GET.get("per", PER_PAGE[0]))
    except ValueError:
        per = PER_PAGE[0]
    per = per if per in PER_PAGE else PER_PAGE[0]
    page = Paginator(qs, per).get_page(request.GET.get("page"))

    keep = request.GET.copy()
    keep.pop("page", None)
    nosort = keep.copy()
    nosort.pop("sort", None)
    heads = {}
    for name, (asc, desc) in HEADER_SORTS.items():
        nxt = desc if sort == asc else asc
        heads[name] = {
            "sort": nxt,
            "state": "ascending" if sort == asc else "descending" if sort == desc else "none",
        }
    return render(request, "manage/listing_list.html", {
        "page": page,
        "tab": tab,
        "counts": status_counts(),
        "filters": {"q": q, "hood": hood, "type": ptype, "status": status, "band": band, "sort": sort, "per": per},
        "filtered": bool(q or hood or ptype or status or band.isdigit()),
        "bands": PriceRange.objects.all(),
        "heads": heads,
        "hoods": Neighborhood.objects.all(),
        "types": PropertyType.objects.all(),
        "statuses": [ListingStatus.AVAILABLE, ListingStatus.PENDING, ListingStatus.SOLD],
        "sorts": [(k, v[1]) for k, v in SORTS.items()],
        "per_page": PER_PAGE,
        "keep": keep.urlencode(),
        "keep_nosort": nosort.urlencode(),
        "nav": "listings",
    })


@admin_required
def listing_create(request):
    """Render the protected form on GET; validate POST and atomically save the owner, Available status and audit event."""
    form = ListingForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        listing = form.save(commit=False)
        listing.current_status = ListingStatus.objects.get(name=ListingStatus.AVAILABLE)
        listing.administrator = request.user
        listing.last_modified_by = request.user
        with transaction.atomic():
            listing.save()
            record(
                request.user, "created", "Listing", listing.pk,
                f"Added {listing.street_address} at ${listing.price:,.0f}",
            )
        messages.success(request, "Listing saved. It is on the public site as Available.")
        return redirect("listings_admin:list")
    if request.method == "POST" and form.errors:
        messages.error(request, "The listing was not saved. Check the marked fields and try again.")
    return render(request, "manage/listing_form.html", {
        "form": form,
        "nav": "add",
        "type_names": {str(t.pk): t.name for t in PropertyType.objects.all()},
        "hood_names": {str(h.pk): h.name for h in Neighborhood.objects.all()},
    })
