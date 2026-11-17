# CK Real Estate Website: Build Blueprint

ISQA 8210 Term Project · Team 3 · Version 2.0 · November 13, 2026
Author of this blueprint: Twumasi Adomako (frontend, interface design, Kanban)
Client: Carlos Kosala, Broker (second administrator: Janet) · Product Owner: Paul van Vliet

This file is the single source of truth for building the site in Claude Code. Drop it at the root of the repo as `BLUEPRINT.md`. Claude Code should read it before every work session. Section 17 gives a ready `CLAUDE.md`, and section 18 gives the prompts to paste for each stage.

Sources this blueprint is built from:
- The term project case (Carlos Kosala and CK Real Estate)
- The team's final ranked user stories (24 stories, approved by Paul)
- Cole's data model (`ISQA_8210_Data_Model.sql` and the dbdiagram ERD, 11 tables plus the built-in user table)
- The Sprint 2 assignment and Paul's answer: "build stories 1 through 3"
- **The clickable prototype** (public site plus admin area, published as a private claude.ai artifact, version 33). It replaces the Design canvas "CK Real Estate Mockups" as the design reference. The canvas boards are kept only as history.

---

## What changed in version 2.0

Version 1.0 described a square-cornered, serif design drawn on 11 canvas boards. The team then built a full clickable prototype and checked it line by line against the case, the 24 stories and Paul's decisions. This version brings the blueprint in line with that prototype.

| Area | Version 1.0 | Version 2.0 |
|---|---|---|
| Design reference | 11 canvas boards | Prototype pages (section 9). The HTML, CSS and JS are the markup reference |
| Fonts | Playfair Display and Inter | Bricolage Grotesque (headings) and Figtree (body) |
| Shape | Square corners, no shadows | Rounded corners (10 to 24 px), soft shadows, lifted cards, light and dark mode |
| Listing fields | No features field | `features` list (case: "a list of general real estate features/attributes"), optional map pin (`latitude`, `longitude`), description stored as cleaned HTML |
| Editing a listing | Full edit form | Price, status, featured and hidden only. Photos can be replaced. Every other attribute is fixed once saved (case: "the other attributes do of course not change") |
| Photo 4 | Any photo | Any photo, and a floor plan is allowed as one of the four |
| Public search | Type, neighborhood, price | Same three filters only. The extra address and bedroom filters were removed |
| Price ranges | $50k bands up to $2M | $50k bands from $0 to $1M (20 bands) |
| Search report | Three bar groups | All home types, all neighborhoods and all 20 price ranges (zero rows included), a by-day chart, a neighborhood map, CSV and print |
| Activity log | Listing and content changes | Also every log in and log out (course requirement: track user login with date and time) |
| Admin area | Listings, add, report, log | Dashboard, All listings, Add listing, Manage listing, Replace photos, Featured home, Search report, Activity log, Local area links, Profile and contact |
| Removed | | Saved homes and recently viewed, "Sell with CK" form, mortgage calculator, reviews and testimonials, drawn nearby-places map, generated floor plan section |
| Libraries | None | Tom Select, Quill, DOMPurify, FilePond, Leaflet, flatpickr, IMask (section 3) |
| Admin templates folder | `templates/admin/` | `templates/manage/`, because a `templates/admin/` folder overrides Django's own admin templates |

**Files in the repo this version replaces.** `docs/design/DESIGN_DIRECTION.md` (v2 design notes) and the v2 canvas boards are kept in `docs/archive/` for the record. `designs/ck-mockup-v3/` (Lato and Instrument Serif, 3 px corners) was an alternative direction and is not the build reference. The build reference is `prototype/` plus the mockup screenshots in `docs/design/mockups/v3/`.

---

## Contents

1. Project snapshot
2. Scope and sprint plan
3. Tech stack and constraints
4. Repository layout and Git workflow
5. Local setup (Windows and Mac)
6. Data model as Django models
7. Seed data
8. URL, view and template map
9. Screens, stories and prototype pages
10. Design system (tokens, logo, components)
11. Illustrations and photo stand-ins
12. Site copy and the /humanizer step
13. Story build cards
14. Testing strategy
15. Email (inquiries are emailed, never stored)
16. Deploying to PythonAnywhere
17. Suggested CLAUDE.md
18. Claude Code prompts, stage by stage
19. Open decisions
20. Definition of done and Sprint 2 hand-in checklist
21. Inspiration and references

---

## 1. Project snapshot

| Item | Value |
|---|---|
| Product | Public website for CK Real Estate, plus an admin area for Carlos and Janet |
| Public visitors can | See the featured home, browse active listings, search by home type, neighborhood and $50,000 price range, open a listing with its 4 photos, features and a map, ask about a listing or request a showing (emailed to the office), read Carlos's profile and email him, contact the office, read local area links |
| Admins can | Log in and out, see a dashboard, add listings with features and exactly 4 photos, replace photos, change price and status, hide (deactivate) sold listings and show them again, pick the one featured home, run the monthly search report, read the activity log (changes plus log ins and log outs), edit the profile and the local area links |
| Never stored | Visitor inquiries. They go out by email only (Paul confirmed that VISITOR_INQUIRY, PRICE_HISTORY and STATUS_HISTORY are not needed) |
| Never deleted | Listings. `is_active = False` hides them from the public |
| Never changed after saving | Address, type, neighborhood, rooms, size, description, features, map pin. Only the price, status, featured flag, hidden flag and photos change |
| Brand colors | White `#FFFFFF`, CK Red `#75000E`, Black `#000000` (plus tints, section 10) |
| Look | Light and dark mode, rounded corners, soft shadows, Bricolage Grotesque and Figtree |
| Hosting | PythonAnywhere free tier, SQLite |
| Repo | `anabel-codes/ISQA8210-TermProject`, one branch per member |

Team roles for Sprint 2:

| Person | Sprint 2 role |
|---|---|
| Gage Heithold | Scrum Master |
| Twumasi Adomako | Frontend, wireframes, mockups, prototype, Kanban board, minutes |
| Cole Beiermann | Data model owner |
| Anabel Diaz | Stories and backlog (Sprint 1 Scrum Master) |
| Jake Madison | Sprint 3 Scrum Master |
| Ethan Vincent | Final sprint Scrum Master |

The developer assignments for each story are the team's call. Record them in the backlog's Task Owner column.

---

## 2. Scope and sprint plan

Strict rank order. No MoSCoW. A lower rank is built first.

| Rank | ID | Story | Points | Sprint |
|---|---|---|---|---|
| 1 | US-01 | Administrator Log In | 2 | Sprint 2 (required) |
| 2 | US-02 | Administrator Log Out | 1 | Sprint 2 (required) |
| 3 | US-03 | Add a New Property Listing | 8 | Sprint 2 (required) |
| 4 | US-04 | Upload New Property Listings (4 photos to a listing) | 5 | Sprint 2 (stretch) |
| 5 | US-05 | Browse All Listings | 5 | Sprint 2 (stretch) |
| 6 | US-06 | View Listing Details and Photographs | 5 | Sprint 2 (stretch) |
| 7 | US-07 | Update a Listing's Status | 3 | Sprint 3 |
| 8 | US-08 | Update a Listing's Price | 2 | Sprint 3 |
| 9 | US-09 | Deactivate a Sold Listing (Retain Data) | 3 | Sprint 3 |
| 10 | US-10 | Filter Listings by Home Type | 3 | Sprint 3 |
| 11 | US-11 | Filter Listings by Neighborhood | 3 | Sprint 3 |
| 12 | US-12 | Filter Listings by Price Range | 3 | Sprint 3 |
| 13 | US-13 | View Landing Page with the Feature Property | 3 | Sprint 3 |
| 14 | US-14 | Navigate the Site | 3 | Sprint 3 |
| 15 | US-15 | Select the Weekly Featured Property | 3 | Sprint 3 |
| 16 | US-16 | Contact the Broker About a Specific Listing | 5 | Sprint 3 |
| 17 | US-17 | View Broker Profile and Contact Information | 3 | Backlog |
| 18 | US-18 | Email the Office Directly from the Profile Page | 2 | Backlog |
| 19 | US-19 | Reactivate a Previously Deactivated Listing | 2 | Backlog |
| 20 | US-20 | Record Which Administrator Made Each Change | 5 | Backlog |
| 21 | US-21 | Select a Month for the Search Report | 2 | Backlog |
| 22 | US-22 | Generate the Monthly Visitor Search Report | 8 | Backlog |
| 23 | US-23 | View the Local Area Information | 3 | Backlog |
| 24 | US-24 | Maintain the Local Area Page | 3 | Backlog |

Totals: 24 stories, 85 points. Sprint 2 required: 11 points. Sprint 2 with stretch: 26 points. Sprint 3: 31 points. Backlog: 28 points.

Sprint 2 dates: November 2 to November 23, 2026. Required deliverable: US-01 to US-03 working on PythonAnywhere, with GitHub and live links in the submission.

**Build note.** The shared base layout and the menu (US-14) are needed to show anything. Build a minimal `base.html` in Sprint 2 as scaffolding, and finish US-14's acceptance criteria (the active link and the collapsing phone menu) in Sprint 3. The same applies to `is_active` (US-09): add the field in Sprint 2 because US-05's criteria filter on it, and build the deactivate action in Sprint 3.

---

## 3. Tech stack and constraints

| Layer | Choice | Why |
|---|---|---|
| Language | Python 3.12 or 3.13 (match the version PythonAnywhere offers) | Same version locally and on the server avoids surprises |
| Framework | Django 5.2 LTS | Built-in auth, admin, forms, ORM and test runner |
| Database | SQLite | Free tier, zero setup. Django's ORM keeps a later move to MySQL easy. `JSONField` works on SQLite |
| Images | Pillow (required by `ImageField`) | Photo upload, validation and resizing |
| HTML cleaning | `nh3` | Cleans the rich-text description and bio on the server before saving |
| Front end | Django templates, two hand-written CSS files (`ck.css` public, `admin.css` admin), plain JavaScript, and the vendored libraries below | No build step, so it deploys cleanly on PythonAnywhere |
| Fonts | Google Fonts: Bricolage Grotesque (500 to 800) for headings, Figtree (400 to 700) for body text | Matches the prototype |
| Maps | Leaflet with OpenStreetMap data and CARTO light and dark tiles | Free, no API key, follows the light and dark theme |
| Email | Django `send_mail`. Console backend locally, SMTP on the server | Inquiries are emailed, never stored |
| Tests | Django `TestCase` (`python manage.py test`) | Every acceptance criterion gets a test |
| Hosting | PythonAnywhere free account | Course requirement |

### 3.1 Front-end libraries (admin area, plus Leaflet on the public listing page)

All of them are saved in the repo under `static/vendor/` (no CDN at run time). Each one is optional in the code: if it fails to load, the page falls back to the plain control and keeps working.

| Library | Version | Used for | Files |
|---|---|---|---|
| Tom Select | 2.6.2 | Every dropdown in the admin (filters, form selects, report month). Search inside longer lists. Tag input for listing features. Select2-style without jQuery | `tom-select.complete.min.js`, `tom-select.css` |
| Quill | 2.0.3 | Rich text for the listing description and Carlos's bio (bold, italic, lists, links) | `quill.js`, `quill.snow.css` |
| DOMPurify | 3.4.15 | Cleans Quill's HTML in the browser before it is sent and before it is shown | `purify.min.js` |
| FilePond | 4.32.12 plus plugins | The four listing photos (drop, preview, drag to reorder, type and size checks, max 4) and the round portrait upload | `filepond.min.js`, `filepond.min.css`, plugins: image-preview 4.6.12, file-validate-type 1.2.9, file-validate-size 2.2.8, image-exif-orientation 1.0.11, image-crop 2.0.6 |
| Leaflet | 1.9.4 | Map pin on Add listing, location map on the admin and public listing pages, neighborhood map on the search report | `leaflet/leaflet.js`, `leaflet/leaflet.css`, `leaflet/images/` |
| flatpickr | 4.6.13 | Date sold (status change) and the date range filter on the activity log | `flatpickr.min.js`, `flatpickr.min.css` |
| IMask | 7.6.1 | Price with thousands commas, 5-digit ZIP, phone `(402) 555-0100` | `imask.min.js` |

All are MIT or BSD licensed. Keep their license headers in the files.

The browser-side checks are for convenience only. Django repeats every check on the server: exactly 4 JPEG or PNG photos under 5 MB, price, ZIP, required fields, and `nh3` cleaning of HTML.

Free-tier limits to respect:
- One web app at `<username>.pythonanywhere.com`. It must be renewed from the Web tab before its expiry date, so put a reminder on the team calendar.
- Small disk quota (about 512 MB). Resize uploaded photos (see US-04) and keep the repo free of large files.
- Outbound internet goes through an allowlist. Test SMTP early (section 15). Map tiles load in the visitor's browser, not on the server, so the allowlist does not affect them. The optional address lookup ("Find the address", Nominatim) also runs in the browser.
- No custom domain on free.

Rules for the code:
- Every admin view needs `@login_required` (or `LoginRequiredMixin`).
- Public queries always filter `is_active=True`.
- Never hard-delete a `Listing`.
- Only price, status, featured, hidden and photos change after a listing is saved.
- Clean all rich text with `nh3` on save. Never mark user input `|safe` without it.
- Secrets (`SECRET_KEY`, email password) live in a `.env` file that is never committed.

---

## 4. Repository layout and Git workflow

### Layout

```
ISQA8210-TermProject/
├── BLUEPRINT.md                 ← this file
├── CLAUDE.md                    ← section 17
├── README.md
├── requirements.txt
├── .env.example                 ← names of env vars, no values
├── .gitignore                   ← .env, db.sqlite3, media/, __pycache__/, .venv/
├── manage.py
├── prototype/                   ← the clickable prototype files (read-only design reference)
├── ckrealestate/                ← project package
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/                    ← US-01, US-02 (login, logout, login/logout audit signals)
├── listings/                    ← lookups, Listing, ListingPhoto (US-03 to US-13, US-15, US-19)
│   ├── models.py
│   ├── forms.py
│   ├── views_public.py
│   ├── views_admin.py
│   ├── urls_public.py
│   ├── urls_admin.py
│   ├── management/commands/seed_lookups.py
│   └── tests/
├── inquiries/                   ← US-16, US-18 (forms and email only, no models)
├── siteprofile/                 ← US-17 (SiteProfile)
├── localarea/                   ← US-23, US-24
├── reports/                     ← SearchLog, AuditLog, dashboard numbers (US-20 to US-22)
├── templates/
│   ├── base.html                ← public layout (header, footer, theme toggle)
│   ├── base_admin.html          ← admin shell (side menu, glass top bar)
│   ├── partials/                ← header, footer, listing_card, logo, status_chip, pager, toast
│   ├── public/                  ← home, listing_list, listing_detail, about, contact, local_area
│   ├── manage/                  ← (not admin/: that name overrides Django's own admin templates) login, dashboard, listing_list, listing_form, listing_manage,
│   │                              listing_photos, featured, report, audit_log, local_area, profile_form
│   └── registration/
├── static/
│   ├── css/ck.css               ← public tokens and components (from prototype/styles.css)
│   ├── css/admin.css            ← admin tokens and components (from prototype/admin.css)
│   ├── js/ck.js                 ← public: menu, theme, gallery, card carousel, modals, map
│   ├── js/admin.js              ← admin: shell, tables, dialogs, library setup
│   ├── vendor/                  ← the libraries in section 3.1
│   └── img/                     ← logo.svg, favicon.svg, illustrations
└── media/                       ← uploads (git-ignored)
```

`prototype/` holds the prototype files exactly as published (`CK_Prototype_v33.zip`: the HTML pages, `styles.css`, `app.js`, `admin.css`, `admin.js` and `vendor/`). Unzip it into the repo once. It is read-only: never edit it, copy from it.

### Branches

- `main` is protected and always deployable. Only merged pull requests go in.
- Each member works on their own branch, named after them: `twumasi`, `cole`, `anabel`, `gage`, `jake`, `ethan`. If the repo already uses other names, keep those.
- For a story, either commit on your own branch, or cut a short-lived branch from it such as `twumasi/us-03-add-listing`.
- Daily routine:

```bash
git checkout twumasi
git fetch origin
git merge origin/main          # pick up teammates' merged work first
# ...work, run tests...
git add -A
git commit -m "feat(listings): add listing form with validation (US-03)"
git push origin twumasi
```

- Open a pull request from your branch to `main`. Title it with the story ID. Add one reviewer from the team. All tests must pass before merging.
- Migrations: only one person should create migrations for an app at a time. Announce it in the team chat ("I'm generating listings migrations"). Two members both creating `0002_*.py` is the most common merge conflict on Django teams.
- Commit style: `feat|fix|test|docs|style|chore(scope): message (US-xx)`.

---

## 5. Local setup (Windows and Mac)

Windows (PowerShell):

```powershell
git clone https://github.com/anabel-codes/ISQA8210-TermProject.git
cd ISQA8210-TermProject
git checkout twumasi
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env      # then fill in a SECRET_KEY
python manage.py migrate
python manage.py seed_lookups
python manage.py createsuperuser
python manage.py runserver
```

Mac or Linux: the same steps, using `python3 -m venv .venv` and `source .venv/bin/activate`.

`requirements.txt`:

```
Django>=5.2,<5.3
Pillow>=10.0
python-dotenv>=1.0
nh3>=0.2
```

If the repo is empty, start the project with these commands:

```bash
django-admin startproject ckrealestate .
python manage.py startapp accounts
python manage.py startapp listings
python manage.py startapp inquiries
python manage.py startapp siteprofile
python manage.py startapp localarea
python manage.py startapp reports
```

Settings to add:

```python
# ckrealestate/settings.py (key parts)
from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "django.contrib.humanize",
    "accounts", "listings", "inquiries", "siteprofile", "localarea", "reports",
]

TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"]

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

LOGIN_URL = "accounts:login"
LOGIN_REDIRECT_URL = "listings_admin:dashboard"
LOGOUT_REDIRECT_URL = "accounts:login"

SESSION_COOKIE_HTTPONLY = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG

TIME_ZONE = "America/Chicago"
USE_TZ = True

EMAIL_BACKEND = os.environ.get("DJANGO_EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
OFFICE_EMAIL = os.environ.get("OFFICE_EMAIL", "office@example.com")
```

`.env.example`:

```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=1
OFFICE_EMAIL=
```

---

## 6. Data model as Django models

This section follows Cole's ERD, plus three LISTING fields the prototype needs and Cole should add to the ERD: `features` (decision D10), `latitude` and `longitude` (D11). Django-style field names are used in Python, and `db_table` keeps Cole's table names, so the database matches the ERD in the Sprint 1 and 2 documents.

| Cole's table | Django model | App | First story |
|---|---|---|---|
| ADMINISTRATOR_ACCOUNT | `django.contrib.auth.models.User` (built-in) | auth | US-01 |
| PROPERTY_TYPE | `PropertyType` | listings | US-03 |
| NEIGHBORHOOD | `Neighborhood` | listings | US-03 |
| LISTING_STATUS | `ListingStatus` | listings | US-03 |
| PRICE_RANGE | `PriceRange` | listings | US-03 (set on save), used in US-12 |
| LISTING | `Listing` | listings | US-03 |
| LISTING_PHOTO | `ListingPhoto` | listings | US-04 |
| SEARCH_LOG | `SearchLog` | reports | US-10 |
| AUDIT_LOG | `AuditLog` | reports | US-20 |
| LOCAL_AREA_CATEGORY | `LocalAreaCategory` | localarea | US-23 |
| LOCAL_AREA_ENTRY | `LocalAreaEntry` | localarea | US-23 |
| SITE_PROFILE | `SiteProfile` | siteprofile | US-17 |

ADMINISTRATOR_ACCOUNT columns map to `User` as follows: Username to `username`, First_Name to `first_name`, Last_Name to `last_name`, Email to `email`, Password_Hash to `password`, Is_Active to `is_active`, Date_Joined to `date_joined`, Last_Login to `last_login`. No custom user model is needed.

### listings/models.py

```python
from decimal import Decimal
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
    """A $50,000 band. Lower bound inclusive, upper bound exclusive (see Open Decision D2)."""
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
    features = models.JSONField(default=list, help_text="General features, e.g. ['Fireplace', 'Fenced backyard']")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)    # map pin, optional
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    garage_spaces = models.PositiveSmallIntegerField(default=0)
    square_feet = models.PositiveIntegerField()
    lot_size = models.PositiveIntegerField(null=True, blank=True, help_text="Square feet")
    year_built = models.PositiveSmallIntegerField(null=True, blank=True)

    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.PROTECT)
    price_range = models.ForeignKey(PriceRange, on_delete=models.PROTECT, null=True, blank=True, editable=False)
    current_status = models.ForeignKey(ListingStatus, on_delete=models.PROTECT)

    is_active = models.BooleanField(default=True)      # US-09 soft delete
    is_featured = models.BooleanField(default=False)   # US-15, one at a time

    administrator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                      related_name="listings_created")
    last_modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                         related_name="listings_modified")
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    date_sold = models.DateField(null=True, blank=True)  # US-07

    objects = models.Manager()
    active = ActiveListingManager()

    class Meta:
        db_table = "LISTING"
        ordering = ["-date_created"]
        constraints = [
            models.UniqueConstraint(fields=["is_featured"], condition=Q(is_featured=True),
                                    name="only_one_featured_listing"),
            models.CheckConstraint(condition=Q(price__gt=0), name="listing_price_positive"),
        ]

    def __str__(self):
        return self.street_address

    def save(self, *args, **kwargs):
        # Keep the stored band in step with the price (fixes the stale-band risk in Cole's ERD).
        self.price_range = PriceRange.for_price(self.price)
        super().save(*args, **kwargs)

    # Fields that may change after the listing is saved (case: "the other attributes do of course not change").
    EDITABLE_AFTER_CREATE = ("price", "current_status", "date_sold", "is_featured", "is_active", "last_modified_by")

    @property
    def cover_photo(self):
        return self.photos.order_by("display_order").first()

class ListingPhoto(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos")
    image_file = models.ImageField(upload_to="listings/%Y/%m/")
    display_order = models.PositiveSmallIntegerField()   # 1 to 4
    alternative_text = models.CharField(max_length=150)

    class Meta:
        db_table = "LISTING_PHOTO"
        ordering = ["display_order"]
        constraints = [
            models.UniqueConstraint(fields=["listing", "display_order"], name="one_photo_per_slot"),
            models.CheckConstraint(condition=Q(display_order__gte=1, display_order__lte=4),
                                   name="photo_order_1_to_4"),
        ]
```

Note for Django 5.2: `CheckConstraint` takes `condition=`. Older Django versions used `check=`.

Exactly four photos per listing is enforced in the form (US-04), not the database. This matches Cole's note. A floor plan may be one of the four photos.

### reports/models.py

```python
from django.conf import settings
from django.db import models

class SearchLog(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    property_type = models.ForeignKey("listings.PropertyType", null=True, blank=True, on_delete=models.SET_NULL)
    neighborhood = models.ForeignKey("listings.Neighborhood", null=True, blank=True, on_delete=models.SET_NULL)
    price_range = models.ForeignKey("listings.PriceRange", null=True, blank=True, on_delete=models.SET_NULL)
    is_completed = models.BooleanField(default=False)   # definition agreed with Paul (US-22)

    class Meta:
        db_table = "SEARCH_LOG"

class AuditLog(models.Model):
    administrator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_time = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=30)        # created, photos_replaced, status_changed, price_changed,
                                                    # deactivated, reactivated, featured_set, local_added,
                                                    # local_updated, local_removed, profile_updated, login, logout
    entity_name = models.CharField(max_length=40)   # "Listing", "SiteProfile", "LocalAreaEntry", "Account"
    entity_id = models.PositiveIntegerField()
    change_summary = models.TextField()

    class Meta:
        db_table = "AUDIT_LOG"
        ordering = ["-date_time"]
```

### localarea/models.py

```python
from django.conf import settings
from django.db import models

class LocalAreaCategory(models.Model):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        db_table = "LOCAL_AREA_CATEGORY"
        verbose_name_plural = "local area categories"

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
```

### siteprofile/models.py

```python
from django.conf import settings
from django.db import models

class SiteProfile(models.Model):
    """Single row (singleton)."""
    broker_name = models.CharField(max_length=100)
    biography = models.TextField(help_text="Cleaned HTML from the rich-text editor (nh3)")
    portrait_image_file = models.ImageField(upload_to="profile/", blank=True)
    office_address = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    website = models.URLField(max_length=255, blank=True)
    email = models.EmailField(max_length=254)
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "SITE_PROFILE"

    @classmethod
    def load(cls):
        return cls.objects.first()
```

That makes 14 foreign keys, which matches Cole's ERD. `inquiries` has no models.

---

## 7. Seed data

`listings/management/commands/seed_lookups.py` must be idempotent (safe to run twice). Run it after every fresh migrate and on the server.

```python
from decimal import Decimal
from django.core.management.base import BaseCommand
from listings.models import PropertyType, Neighborhood, ListingStatus, PriceRange

class Command(BaseCommand):
    help = "Create lookup rows for types, neighborhoods, statuses and $50k price bands."

    def handle(self, *args, **opts):
        for n in ["Ranch", "Tudor", "Split-Entry", "Townhome", "Condominium"]:
            PropertyType.objects.get_or_create(name=n)
        for n in ["Benson", "Downtown", "Happy Hollow", "Rockbrook"]:
            Neighborhood.objects.get_or_create(name=n)
        for n in ["Available", "Pending", "Sold"]:
            ListingStatus.objects.get_or_create(name=n)
        step = Decimal("50000")
        low = Decimal("0")
        while low < Decimal("1000000"):   # 20 ranges, $0 to $1M (D6)
            high = low + step
            PriceRange.objects.get_or_create(
                lower_value=low, upper_value=high,
                defaults={"name": f"${low:,.0f} to ${high:,.0f}"},
            )
            low = high
        self.stdout.write(self.style.SUCCESS("Lookups seeded."))
```

The five home types and four neighborhoods are the ones named in the case. Carlos can add more rows later. Price ranges run in $50,000 steps from $0 to $1,000,000 (decision D6), and the first one is shown as "Under $50,000".

Admin accounts (US-01): create two users, `carlos` and `janet`, in a `Administrators` group. Neither needs `is_superuser` for the site's own admin pages. Keep one team superuser for the Django `/django-admin/` site.

```bash
python manage.py shell -c "from django.contrib.auth.models import User, Group; g,_=Group.objects.get_or_create(name='Administrators'); [ (lambda u: (u.set_password('CHANGE-ME'), u.save(), u.groups.add(g)))(User.objects.get_or_create(username=n, defaults={'first_name':f})[0]) for n,f in [('carlos','Carlos'),('janet','Janet')] ]"
```

Give the real passwords to Carlos and Janet privately. They should change them on first use.

Sample listings for local development: `python manage.py seed_demo` adds the prototype's 11 sample homes (run `create_admins` first). Never run it on the live site.

---

## 8. URL, view and template map

Public (namespace `public`):

| URL | View | Template | Stories | Prototype page |
|---|---|---|---|---|
| `/` | `home` | `public/home.html` | US-13, US-14, US-05 to US-12 | `index.html` |
| `/listings/` | `listing_list` (GET filters `type`, `hood`, `band`) | `public/listing_list.html` | US-05, US-10, US-11, US-12 | `index.html#listings` |
| `/listings/<int:pk>/` | `listing_detail` | `public/listing_detail.html` | US-06 | `property.html` |
| `/listings/<int:pk>/ask/` | `listing_inquiry` (POST, "Contact Carlos" or "Request a showing") | redirects back with a message | US-16 | `property.html` modals |
| `/about/` | `broker_profile` | `public/about.html` | US-17 | `about.html` |
| `/about/contact/` | `general_inquiry` (POST) | redirects back with a message | US-18 | `about.html#write` |
| `/contact/` | `contact` (same general form plus office details and FAQ) | `public/contact.html` | US-18 | `contact.html` |
| `/local-area/` | `local_area` | `public/local_area.html` | US-23 | `local.html` |

Admin area (namespace `listings_admin`, prefix `/manage/`, everything `login_required` and `never_cache`). The path is `/manage/` so that it does not collide with Django's `/django-admin/`.

| URL | View | Template | Stories | Prototype page |
|---|---|---|---|---|
| `/manage/login/` | `LoginView` | `manage/login.html` | US-01 | `login.html` |
| `/manage/logout/` | `LogoutView` (POST only) | redirect to login | US-02 | side menu |
| `/manage/` | `dashboard` | `manage/dashboard.html` | (overview, no story) | `admin.html` |
| `/manage/listings/` | `admin_listing_list` (`?tab=active` or `hidden`, filters, sort, paging) | `manage/listing_list.html` | US-07, US-08, US-09, US-15, US-19 | `admin-listings.html` |
| `/manage/listings/new/` | `listing_create` | `manage/listing_form.html` | US-03, US-04 | `admin-add.html` |
| `/manage/listings/<pk>/` | `listing_manage` (read-only details, quick changes, history) | `manage/listing_manage.html` | US-07, US-08, US-09, US-15, US-19, US-20 | `admin-listing.html?id=` |
| `/manage/listings/<pk>/photos/` | `listing_photos` (replace or reorder the 4 photos only) | `manage/listing_photos.html` | US-04 | `admin-add.html?edit=` |
| `/manage/listings/<pk>/status/` | POST (status, date sold, optional hide now) | redirect | US-07, US-09 | status dialog |
| `/manage/listings/<pk>/price/` | POST | redirect | US-08 | price dialog |
| `/manage/listings/<pk>/deactivate/` | POST, Sold listings only, plus a confirm dialog | redirect | US-09 | confirm dialog |
| `/manage/listings/<pk>/reactivate/` | POST, sets Available | redirect | US-19 | confirm dialog |
| `/manage/listings/<pk>/feature/` | POST, Available listings only | redirect | US-15 | confirm dialog |
| `/manage/featured/` | `featured` (current pick, eligible homes, history) | `manage/featured.html` | US-15 | `admin-featured.html` |
| `/manage/report/` | `search_report` (`?month=2026-10`, `&format=csv`) | `manage/report.html` | US-21, US-22 | `admin-report.html` |
| `/manage/activity/` | `audit_log` (read only, filters, `?listing=<pk>`, `&format=csv`) | `manage/audit_log.html` | US-20 | `admin-activity.html` |
| `/manage/profile/` | `profile_edit` | `manage/profile_form.html` | US-17 | `admin-profile.html` |
| `/manage/local-area/` | list, add, edit, remove, show or hide entries | `manage/local_area.html` | US-24 | `admin-local.html` |

There is no `/manage/listings/<pk>/edit/` any more. The case says only the price changes after a listing is up, so the full edit form was removed (decision D13).

Django's own `/django-admin/` stays on for the team. Carlos and Janet use `/manage/`.

Logout must be a POST in Django 5. The side-menu "Log out" item is a `<form method="post">` holding a button styled like the other menu items.

---

## 9. Screens, stories and prototype pages

The prototype is a private claude.ai artifact (public site plus admin). Each page is plain HTML, CSS and JavaScript with sample data kept in the browser tab, so it can be clicked through like the real site. Use it as the markup and styling reference. The Django templates replace its sample data with real queries.

### 9.1 Public site (`styles.css`, `app.js`)

| Page | Key components | Stories |
|---|---|---|
| Home (`index.html`) | Header (animated CK logo, menu Home / Listings dropdown / About / Local area / Contact, theme toggle), hero with featured-home badge and the search bar (Neighborhood, Home type, Price range, **Show homes**), quick chips, bold featured-home band, listing grid with type tabs, neighborhood rail, about teaser, steps, local area preview, footer | US-05, US-10 to US-14 |
| Listing card (partial) | Lifted card. Two-photo swipe carousel with a line indicator at the bottom (no arrows), Featured badge top left, type and status chip top right. Below: beds / baths / sqft, then the price (large, red), then the address name, then neighborhood, Omaha, NE, ZIP. The whole card links to the listing | US-05 |
| Listing (`property.html`) | Breadcrumb, status and type tags, price with its range, photo gallery (main photo plus 3 side tiles, the last tile says "See all photos" and opens the lightbox), facts row, description, property details, **Features** list, **Location** map with the pin and full address, side card with **Request a showing** and **Contact Carlos**, similar homes | US-06, US-16 |
| Request a showing (dialog) | Step 1: in person or video, day picker (no Sundays), one-hour time windows. Step 2: name, email, phone, message. Sent by email with a link to the listing | US-16 |
| Contact Carlos (dialog) | Contact form, then an optional showing time. Sent by email with a link to the listing | US-16 |
| About (`about.html`) | Portrait, bio, contact rows with copy buttons, **Email Carlos** form, who we are, how a listing works, the team | US-17, US-18 |
| Contact (`contact.html`) | Office cards, contact form, FAQ | US-18 |
| Local area (`local.html`) | Category chips and four lists: Events, Places to visit, Family activities, Places to eat | US-23 |
| Log in (`login.html`) | Plain "Log in" with username and password, forgot-password panel. No admin wording, no list of who may log in, no back link. Light mode shows a bright morning scene, dark mode a night scene | US-01 |

### 9.2 Admin area (`admin.css`, `admin.js`, `vendor/`)

| Page | Key components | Stories |
|---|---|---|
| Shell (every page) | Full-height side menu (collapses to icons, becomes a drawer on phones, active page shows a full red row), 60% glass top bar with menu toggle, page title, listing search (`/` shortcut), theme toggle, latest-changes bell (3 items plus "See all changes"), account menu (profile, view public site, log out) | US-02, US-14 |
| Dashboard (`admin.html`) | Period selector (Today, This week by default, Last week, Monthly, Quarterly, Yearly), sales at a glance, search report promo, homes-sold and visitor-search gauges, featured card, search activity bars, top searches, listings by status donut, recent activity, listings table. Figures are sample data (decision D15) | overview |
| All listings (`admin-listings.html`) | Counts strip, On the site / Hidden tabs, search, neighborhood, type, status, price and sort filters, bulk hide or show, click-to-change price and status, featured star, row menu, rows per page and paging | US-07, US-08, US-09, US-15, US-19 |
| Add listing (`admin-add.html`) | Five sections: where it is (address, neighborhood, ZIP, map pin with "Find the address"), the house (type, beds, baths, sqft, lot, year, garage, **features tags**), asking price (status fixed to Available), description (rich text), photos (FilePond, exactly 4, a description per photo). Live preview card and a "before you save" checklist. Errors listed at the top with links to each field | US-03, US-04 |
| Replace photos (`admin-add.html?edit=`) | The photos section only. Swap or reorder the four photos and their descriptions | US-04 |
| Manage listing (`admin-listing.html`) | Gallery, status and featured chips, price with its range, description and details marked "Set when the listing was added", features, location map, quick changes (price, status, feature, hide or show, replace photos, view on site), record (added by, last change, date sold, hidden), history | US-07, US-08, US-09, US-15, US-19, US-20 |
| Dialogs | Change price (masked input, range hint, % change), change status (Available / Pending / Sold, date sold calendar, optional "hide now"), confirm hide, show again, feature | US-07, US-08, US-09, US-15, US-19 |
| Featured home (`admin-featured.html`) | Current pick with days featured, list of eligible Available homes with search, history table (from and until dates, picked by) | US-15 |
| Search report (`admin-report.html`) | Month picker with previous and next, KPIs, by home type, by neighborhood, what counts (D5), by price range (all 20), completed searches by day, neighborhood map, CSV, print | US-21, US-22 |
| Activity log (`admin-activity.html`) | Read-only table (when, who, change, item, what changed), filters for who, type of change (including "Log ins and log outs"), when (including a picked date range), search, CSV, paging | US-20 |
| Local area links (`admin-local.html`) | Category tabs, add, edit, remove, Shown / Hidden switch per link | US-24 |
| Profile and contact (`admin-profile.html`) | Round portrait drop area, broker name, bio (rich text), office address, phone, email, website, live preview of the About page, unsaved-changes bar | US-17 |

Fields in the prototype that are not in Cole's ERD: `features`, `latitude`, `longitude` on LISTING (decisions D10 and D11). The dashboard's sample figures (sales value, searches) come from existing tables only (LISTING, SEARCH_LOG, AUDIT_LOG).

---

## 10. Design system

The prototype's `styles.css` (public) and `admin.css` (admin) are the full reference. Copy them into `static/css/ck.css` and `static/css/admin.css` and keep the class names, so the templates can reuse the prototype markup. This section lists what every page relies on.

### 10.1 Tokens

Public site (`ck.css`, top of the file). Dark mode is `:root[data-mode="dark"]`, set from a toggle and remembered in `localStorage` (`ck-mode`).

```css
:root {
  --bg:#FFFFFF; --surface:#FAF5F5; --surface-2:#F3E8EA; --fg:#000000; --muted:#5E4D4F; --line:#E6DADB;
  --accent:#75000E; --on-accent:#FFFFFF; --accent-text:#75000E;   /* CK Red */
  --btn2:#000000; --on-btn2:#FFFFFF;
  --band:#75000E; --on-band:#FFFFFF; --band-muted:#F0CFD4;
  --ok:#1F7A4D; --err:#C0182F;
  --focus:#75000E;                                                  /* input focus border */
  --shadow:0 22px 44px -22px rgba(74,0,9,.38);
  --font-display:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;
  --font-body:"Figtree","Segoe UI",system-ui,sans-serif;
  --r-sm:10px; --r:12px; --r-lg:18px; --r-xl:24px;
  --ease:cubic-bezier(.2,.8,.2,1); --ease-out:cubic-bezier(.16,1,.3,1);
}
:root[data-mode="dark"] {
  --bg:#000000; --surface:#0F0708; --surface-2:#1A0C0F; --fg:#FFFFFF; --muted:#BBA8AB; --line:#2B1A1D;
  --accent:#9A1427; --accent-text:#F08A98; --btn2:#FFFFFF; --on-btn2:#000000; --ok:#5BD49A; --err:#FF6B80;
  --focus:#E5394F;
}
```

Admin (`admin.css`) uses the same red and fonts with its own surfaces:

```css
:root {
  --bg:#F6F0EE; --card:#FFFFFF; --card-2:#FAF5F4; --line:#EFE2E0; --line-2:#E4D3D0;
  --fg:#140407; --muted:#6E5459; --faint:#A08A8E;
  --accent:#75000E; --accent-2:#A0142A; --accent-soft:#F7E4E7; --accent-text:#75000E; --on-accent:#FFFFFF;
  --ink:#1A0A0D; --ok:#1F7A4D; --focus:#75000E;
  --r:24px; --r-sm:14px; --r-xs:10px; --sbw:252px; --sbw-c:84px;
}
:root[data-mode="dark"] {
  --bg:#0B0507; --card:#150A0D; --card-2:#1C0F12; --line:#2A181C; --line-2:#3A2226;
  --fg:#F8ECEE; --muted:#BFA6AB; --accent:#B3122A; --accent-2:#D7354D; --accent-soft:#2C0F15;
  --accent-text:#FF8A9B; --ink:#F8ECEE; --focus:#E5394F;
}
```

### 10.2 Component rules

- **Buttons** are rounded rectangles (12 px radius), never pills. Icon-only buttons are round. Labels never wrap or overflow: `white-space: nowrap` and the button keeps its width.
- **Inputs and selects**: 48 px tall, 12 px radius, 1 px border. When selected, the border turns `--focus` red. No glow or shadow around it. This applies to every input, search box and dropdown on both sides.
- **Cards** (public listing card): white panel (dark panel in dark mode), 1 px border, soft shadow, rises 4 px on hover. Everything that belongs to a listing sits inside its card.
- **Listing card order**: photo carousel (first 2 photos, swipe or drag, line indicator at bottom centre, no arrows), then beds / baths / sqft, then price (large, red), then the address, then neighborhood, Omaha, NE, ZIP. Featured badge top left of the photo, type and status chip top right.
- **Status chips**: Available (soft red), Pending (outlined), Sold (black). The word is always shown, so color is never the only signal.
- **Admin side menu**: active page shows a full row (soft red background, red label, red icon circle, red bar on the left), not just the icon.
- **Dialogs**: centred, rounded, dimmed backdrop, Escape and the X close them. Used for request a showing, contact Carlos, price, status, confirmations and local area links.
- **Tables (admin)**: bold uppercase header band, rows per page (5, 10, 25, 50), paging, empty state with a short hint.
- **Toasts**: dark pill at the bottom centre, about 2.5 s.
- **Motion**: fade-up reveals, count-up numbers, animated logo. Everything respects `prefers-reduced-motion`.
- **Accessibility**: every input has a `<label>`. Icon-only buttons have an `aria-label`. Body text is at least 15 px. Touch targets at least 44 px. Focus is always visible.
- **Responsive**: works from 360 px up. Admin breakpoints at 1360, 1100, 900 (side menu becomes a drawer), 760 and 640 px. No page ever scrolls sideways.

### 10.3 Logo

The mark is a rounded red square holding a white roof line, a chimney and "CK". In the prototype it is animated (the roof draws in, a wisp of smoke rises from the chimney). Static version for `static/img/logo.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="CK Real Estate">
  <rect x="1" y="1" width="38" height="38" rx="11" fill="#75000E"/>
  <rect x="26.4" y="9" width="3.2" height="6" fill="#FFFFFF"/>
  <path d="M8.5 20 L20 10.5 L31.5 20" fill="none" stroke="#FFFFFF" stroke-width="2.8"
        stroke-linecap="round" stroke-linejoin="round"/>
  <text x="20" y="31.5" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif"
        font-size="11.5" font-weight="800" fill="#FFFFFF">CK</text>
</svg>
```

Lockup: the mark on the left. To its right, "CK" in Bricolage Grotesque 800 over "REAL ESTATE" (public) or "ADMIN" (admin) in small spaced capitals. Before Carlos signs off, convert the `<text>` to outlined paths so the logo renders the same without the font. The logo is a proposal until he approves it (decision D7).

---

## 11. Illustrations and photo stand-ins

The prototype has no real photos yet, so it draws its own pictures as inline SVG. They follow the theme (red, white and black, with a night palette in dark mode) and weigh a few kilobytes each.

| Drawing | Where | Notes |
|---|---|---|
| House and condo illustrations | Stand-ins for listing photos 1 to 3 (cards, gallery, lightbox, admin thumbnails) | Houses use the villa drawing, condos use the building drawing. Each listing gets a different seed so they do not look identical |
| Floor plan | Stand-in for photo 4 | Rooms with approximate square feet. Shows that a floor plan can be one of the four photos |
| City skyline and sky | Home hero and page heroes | Decorative, `aria-hidden="true"` |
| Login scene | Log in page | Bright morning in light mode, night buildings in dark mode |
| Portrait placeholder | About page and profile preview | Until Carlos uploads his portrait |

Rules:
- In the real site, listings use Carlos's own photos. The drawings only appear in the prototype and as a fallback when a photo file is missing.
- A drawing must never pass for a real house. The public footer says the listings, prices and pictures are sample content until Carlos adds his own.
- Decorative drawings get `aria-hidden="true"`. Drawings that stand in for a photo get `role="img"` and an `aria-label` such as "Photo 1 of 4812 Underwood Avenue".

---

## 12. Site copy and the /humanizer step

The public text on the site (hero lines, empty states, form helper text, errors, confirmation messages) should read like a person at CK wrote it.

Process:
1. Draft the copy in `content/copy.md`, keyed by screen (one heading per page). The prototype's copy is the first draft.
2. Run `/humanizer` on `content/copy.md` in Claude Code to remove AI-sounding phrasing. Keep facts and placeholders unchanged.
3. Paste the final strings into the templates.
4. Carlos approves his bio, the profile text and the local area entries. His own words beat any rewrite. Use `/humanizer` only on text he asks the team to draft.

Voice: plain, warm, local. Short sentences. No "dream home" clichés, no exclamation marks and no em dashes. Talk to "you". Name neighborhoods. The prototype copy has already been through /humanizer and is the first draft for `content/copy.md`.

Placeholders that must come from Carlos: headshot, bio, office address, phone, email, website, office hours, the full lists of home types and neighborhoods, and the local area links.

---

## 13. Story build cards

Each card gives the acceptance criteria (verbatim from the team's final doc), the build steps, and the tests. "AC" means acceptance criterion. The prototype page to copy is named on each card.

### US-01 Administrator Log In (2 pts, Sprint 2 required)

Story: As an administrator (Carlos or Janet), I want to log in with my own account so that I can access the administrator area and manage the website.

AC:
1. Given I have an administrator account, when I enter a valid username and password, then I reach the administrator area.
2. Given I enter invalid credentials, then I see an error and no administrator pages open.
3. Given I am not logged in, when I try to open an administrator page directly, then I am sent to the login page. (The team doc says "not logged out", which reads as a typo for "not logged in". It is on Gage's cleanup list.)

Build:
- `accounts/urls.py`: `path("manage/login/", LoginView.as_view(template_name="manage/login.html", redirect_authenticated_user=True), name="login")`.
- Template from `login.html`. The page just says "Log in". It never says "admin", never lists who can log in, and has no "back to site" link (security: do not advertise the admin area). The error block shows when `form.non_field_errors` exists, worded generally ("That username and password don't match"). Use `autocomplete="username"` and `autocomplete="current-password"`.
- Land on the dashboard at `/manage/` (`LOGIN_REDIRECT_URL = "listings_admin:dashboard"`).
- Record the log in: a receiver for `django.contrib.auth.signals.user_logged_in` writes an `AuditLog` row (`action="login"`, `entity_name="Account"`, `entity_id=user.pk`, summary "Janet logged in"). This covers the course requirement to track user logins with date and time.
- Create the `Administrators` group and the accounts for Carlos and Janet (section 7).
- NFR: passwords are stored as salted hashes (Django's default PBKDF2). Admin pages are never reachable without a session.

Tests (`accounts/tests/test_login.py`):
- A valid login returns a 302 to `/manage/`, the session holds `_auth_user_id`, and one `AuditLog` row with `action="login"` exists.
- An invalid login returns a 200 that shows the error text, the session has no user, and no login row is written.
- An anonymous GET of `/manage/listings/` returns a 302 to `/manage/login/?next=/manage/listings/`.
- The login page HTML does not contain the word "admin" in visible text.
- Carlos and Janet are separate users with the same group.

### US-02 Administrator Log Out (1 pt, Sprint 2 required)

AC:
1. Given I am logged in, when I select the log out option, then my session ends and I am returned to the login page.
2. Given I have logged out, when I try to access an administrator page directly, then I am sent to the login page.
3. Given I have logged out, when I use the browser to return to a previously viewed administrator page, then administrator functionality is no longer accessible without logging in again.

Build:
- `path("manage/logout/", LogoutView.as_view(), name="logout")`, with `LOGOUT_REDIRECT_URL = "accounts:login"`.
- In `base_admin.html`, "Log out" sits in the side menu and in the account menu, each a `<form method="post" action="{% url 'accounts:logout' %}">{% csrf_token %}<button>Log out</button></form>`.
- AC 3 (back button): add `@never_cache` to every admin view, through a small `AdminRequiredMixin` that combines `LoginRequiredMixin` with never-cache headers.
- Record the log out with a `user_logged_out` receiver (`action="logout"`).

Tests:
- POST to logout returns a 302 to login, the session is flushed, and one `AuditLog` row with `action="logout"` exists.
- After logout, a GET of an admin page returns a 302 to login.
- An admin page response has `Cache-Control` containing `no-store` (or `no-cache`, `must-revalidate`).

### US-03 Add a New Property Listing (8 pts, Sprint 2 required)

AC:
1. Given I am logged in, when I submit the new listing form with all required fields completed, then the listing is saved with status Available, is associated with my account, and appears among the public listings.
2. Given a required field is missing, then the form shows which field to fix and nothing is saved.

Build (prototype: `admin-add.html`):
- Models from section 6: `PropertyType`, `Neighborhood`, `ListingStatus`, `PriceRange`, `Listing`. Add `is_active`, `is_featured`, `features`, `latitude` and `longitude` now.
- `python manage.py makemigrations listings`, then `migrate`, then `seed_lookups`.
- `ListingForm(ModelForm)` with street_address, zip_code, neighborhood, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built, garage_spaces, features, price, description, latitude, longitude. City and state are fixed to Omaha, NE and shown read-only. Status is not on the form: it is forced to Available.
- Features: a tag input (Tom Select with `create: true`), suggestions for the chosen home type first. Posted as a list; at least one is required; each feature is 2 to 60 characters; at most 20.
- Map pin: optional. The pin starts at the middle of the chosen neighborhood; the admin clicks the map or drags the pin, or uses "Find the address" (browser lookup, may be unavailable). Save 6 decimal places.
- Description: Quill rich text (bold, italic, lists, links), posted as HTML. Clean it with `nh3` on save (allowed tags: p, br, strong, em, b, i, u, ol, ul, li, a with href). At least 40 characters of plain text.
- Validation: price at least $1,000 and at most $50,000,000 (the form accepts "425,000" and strips the commas), ZIP matches `^\d{5}$`, bedrooms 0 to 20, bathrooms in half steps, square feet at least 100, lot size blank or at least 100, year built blank or 1800 to this year, garage 0 to 10.
- View `listing_create`: on valid POST, `obj.current_status = Available`, `obj.administrator = obj.last_modified_by = request.user`, save, write an `AuditLog` "created" row, flash "Listing saved. It is on the public site as Available." and redirect to the manage page for that listing.
- Errors: show each next to its field, plus a summary at the top whose items link to the fields. Keep what the admin typed.
- The live preview card and the "before you save" checklist are JavaScript conveniences only.
- AC 1's "appears among the public listings": until US-05 is built, a minimal public `/listings/` page that lists active listings satisfies this.

Tests:
- A valid POST creates one `Listing` with status Available, `administrator` equal to the logged-in user, `price_range` set, and the features list saved.
- For each required field (including features): POST without it gives a 200, the error shows on that field, and `Listing.objects.count()` is unchanged.
- A description with `<script>` is saved without the script tag.
- An anonymous POST is redirected to login, and nothing is created.
- A new listing appears on `/listings/`.

### US-04 Upload Four Photos (5 pts, Sprint 2 stretch)

AC: Given I am creating or editing a listing, when I upload four photos in an accepted format, then all four are saved and display with that listing in the order I set. Given I upload fewer than four or an unsupported file type, then I am told what to fix.

Build (prototype: photos section of `admin-add.html`, and `admin-add.html?edit=` for Replace photos):
- `ListingPhoto` model and migration. Serve media in development with `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` when `DEBUG` is on. On the server, map `/media/` in the Web tab.
- Front end: FilePond with `maxFiles: 4`, `allowReorder: true`, JPEG and PNG only, 5 MB each. Below the photos, one description field per photo (default "Front of the house", "Living room", "Kitchen", "Floor plan"). Photo 1 is the cover. A floor plan is allowed as one of the four.
- Server: four files in display order plus four alt texts (FilePond posts them as files when `storeAsFile: true`). Check type with Pillow, not just the file extension, 5 MB maximum each, exactly 4 on create. Every alt text is required.
- Resize on save to a maximum of 1600 px on the long side at JPEG quality 82, to stay inside the free-tier disk quota. Fix EXIF orientation.
- Save the listing and its photos in `transaction.atomic()` so a failure leaves nothing half-saved.
- "Editing" (decision D13): the only edit allowed is **Replace photos** at `/manage/listings/<pk>/photos/`. It swaps or reorders the four photos and their descriptions. Writes an `AuditLog` "photos_replaced" row.

Tests: four valid images give 4 rows with orders 1 to 4. Three images give an error and nothing saved. A `.gif` or a renamed `.txt` gives an error. A missing alt text gives an error. Reordering on the photos page changes `display_order` and nothing else on the listing. The detail page shows the images in order.

### US-05 Browse All Listings (5 pts, Sprint 2 stretch)

AC: Given I am on the listings page, when the page loads, then I see every active listing with its address, price, status, type, neighborhood, and a photo. Given a listing is deactivated, then it does not appear.

Build (prototype: listing grid on `index.html`): `Listing.active.select_related("property_type", "neighborhood", "current_status").prefetch_related("photos")`. Card partial `partials/listing_card.html` built exactly as section 10.2 describes (first two photos in a swipe carousel, specs, price, address, neighborhood line, whole card is the link). Type tabs above the grid. Paginate at 12 per page. Empty state: "No homes match those filters right now" with a clear-filters link.

Tests: active listings are shown and inactive ones are not. Each card shows the address, price, status, type, neighborhood and the cover image.

### US-06 View Listing Details and Photographs (5 pts, Sprint 2 stretch)

AC: Given I am viewing the listings page, when I select a listing, then I see its address, price, status, description, features, type, neighborhood, and all four photos, plus a way to contact the office about it.

Build (prototype: `property.html`): `get_object_or_404(Listing.active, pk=pk)`. A missing or inactive listing gets a friendly 404 page in the brand style ("This home is no longer listed" with a link to the listings). Gallery: main photo plus 3 side tiles; the last tile reads "See all photos" and opens a full-screen lightbox with all 4. Without JS, all 4 photos still show stacked. Then the facts row, the description (cleaned HTML), property details, the **Features** list from the listing, and the **Location** map (Leaflet, the listing's pin, full address, "Open in a full map" link; if there is no pin, centre on the neighborhood). Side card with **Request a showing** and **Contact Carlos** (US-16), or for Sprint 2 a `mailto:` link until US-16 is built.

Not on this page (removed as outside the case): mortgage calculator, reviews or testimonials, made-up nearby places, generated floor plan section.

Tests: the detail page shows every field, every feature and all 4 images. An inactive listing returns 404. The contact element is present.

### Sprint 3 cards (summary)

| ID | Build in one line | Key test |
|---|---|---|
| US-07 | Status dialog (Available, Pending, Sold) from the listings table, the row menu or the manage page, POST to `/status/`. Sold asks for the date sold (calendar, not in the future) and offers "hide it from the public site now". If the featured home stops being Available it stops being featured | Sold sets `date_sold`, the new status shows publicly, a featured home moved to Pending is no longer featured |
| US-08 | Price dialog with a masked input, the new price range and the % change, POST to `/price/`. Use `update_fields=["price", "price_range", "last_modified_by", "date_updated"]` | Only price (and its range) changes |
| US-09 | "Hide from public site", only for Sold listings, single or in bulk, confirm dialog, then `is_active=False`. Admins still open it from the Hidden tab | The record and photos still exist, the listing is gone from every public URL, a non-Sold listing is refused |
| US-10 to US-12 | Search bar with exactly three filters: Neighborhood, Home type, Price range ($50k ranges from $0 to $1M), and **Show homes**. Write a `SearchLog` row with `is_completed=True` only when at least one filter is chosen and the results page loads (D5) | Filter results are correct, range edges follow D2, one completed row per qualifying search and none for an unfiltered one |
| US-13 | Home view gets `Listing.active.filter(is_featured=True).first()` for the hero badge and the featured band | The page renders with and without a featured listing |
| US-14 | Finish `base.html`: Home, Listings (dropdown), About, Local area, Contact; `aria-current` on the active link; theme toggle; phone drawer that mirrors the desktop menu with a Listings submenu | Every link resolves, and the drawer toggle is present |
| US-15 | Featured page and the star in the listings table, POST to `/feature/`. In `transaction.atomic()`, clear the old flag and set the new one. Only Available, active listings can be featured. The history table is built from `AuditLog` rows with `action="featured_set"` (D1) | After a switch, only one listing is featured, and the history shows the old pick with an end date |
| US-16 | Two dialogs on the listing page. Request a showing: in person or video, a day (no Sundays) and a one-hour window, then name, email, phone (optional), message. Contact Carlos: the contact form, then an optional time. `send_mail` to `OFFICE_EMAIL` with the visitor's details and a link to the listing. Hidden honeypot field. Nothing is saved | `mail.outbox` has 1 message with the listing link, and an invalid email shows an error |

### Backlog cards (summary)

| ID | Build in one line |
|---|---|
| US-17 | `SiteProfile` singleton with the public `/about/` page and `/manage/profile/` edit: round portrait upload (cropped to a square), bio in Quill (cleaned with `nh3`), office address, phone, email, website. Text in [brackets] marks a placeholder still waiting for Carlos |
| US-18 | General contact form on `/about/` and `/contact/` that reuses the inquiry form class with no listing and is emailed only |
| US-19 | "Show again" on the Hidden tab (single or bulk) and on the manage page: `is_active=True` and status back to Available, data and photos unchanged |
| US-20 | `audit()` helper called from every admin write view, plus the login and logout signals. Read-only `/manage/activity/` with filters (who, type of change, today / 7 days / 30 days / this month / picked range), search, paging, CSV. Records are append-only |
| US-21 | Month picker (last 13 months, previous and next buttons), filter on `date_time__year` and `__month`. Default: the last full month |
| US-22 | `SearchLog.objects.filter(is_completed=True, ...)` counted by home type, neighborhood and price range. Show every type, every neighborhood and all 20 ranges, including zero counts. Plus searches by day, a neighborhood map with circles sized by searches, CSV and print |
| US-23 | `/local-area/` grouped by category (`prefetch_related("entries")`), active entries only |
| US-24 | Add, edit and remove entries in `/manage/local-area/`, plus a Shown / Hidden switch (`is_active`). Web links must start with https:// |

---

## 14. Testing strategy

- One test module per story: `listings/tests/test_us03_add_listing.py`. Each test's name quotes the acceptance criterion it covers.
- Use `setUpTestData` for the lookups (call the seed command) and the two admin users.
- For photos, generate in-memory images with Pillow and wrap them in `SimpleUploadedFile`. Put `MEDIA_ROOT` in a temp directory with `override_settings`.
- For email, use Django's `locmem` backend in tests and assert on `mail.outbox`.
- Run `python manage.py test` before every push. Nothing merges to `main` with a failing test.
- Manual demo script for Paul (Sprint 2): log in as Janet, add a listing (showing one validation error first), see it on `/listings/`, open the activity log to show the log in and the new listing, log out, press Back, and get sent to login.
- Paul's Test Case Template is in the project files. Fill one test case per acceptance criterion for the hand-in, reusing the automated tests' names.

---

## 15. Email (inquiries are emailed, never stored)

- Locally: `console.EmailBackend`, which prints the email in the terminal.
- In tests: `locmem`, which Django sets automatically.
- On PythonAnywhere: SMTP. Free accounts can only reach allowlisted hosts. Gmail's SMTP is the usual working choice. Use a dedicated Gmail account for the project, turn on 2-step verification, and create an app password for it. Put the address and app password in `.env` on the server, never in Git.

```python
# settings.py, server values come from .env
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "1") == "1"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER or "noreply@example.com"
```

- Test this early in Sprint 3, before US-16 is built: `python manage.py sendtestemail you@example.com` in a PythonAnywhere Bash console.
- If sending fails, the visitor sees "We couldn't send your message right now. Please call the office at [phone]." Because nothing is stored, the failure must be visible to the visitor. Log it with `logging.exception`.
- Spam protection: a hidden honeypot field (a bot that fills it gets a fake success), plus a minimum time on the page. No CAPTCHA service is needed.

---

## 16. Deploying to PythonAnywhere

First time (whoever owns the PythonAnywhere account):

1. Sign up for a free account. The username becomes the site address, `<username>.pythonanywhere.com`.
2. In a Bash console:

```bash
git clone https://github.com/anabel-codes/ISQA8210-TermProject.git
cd ISQA8210-TermProject
mkvirtualenv ck --python=/usr/bin/python3.12
pip install -r requirements.txt
nano .env          # DJANGO_SECRET_KEY, DJANGO_DEBUG=0, DJANGO_ALLOWED_HOSTS=<username>.pythonanywhere.com, email values
python manage.py migrate
python manage.py seed_lookups
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

3. Web tab, then "Add a new web app", then "Manual configuration", then the same Python version.
4. Set the virtualenv to `/home/<username>/.virtualenvs/ck`.
5. Edit the WSGI file:

```python
import os, sys
path = "/home/<username>/ISQA8210-TermProject"
if path not in sys.path:
    sys.path.insert(0, path)
os.environ["DJANGO_SETTINGS_MODULE"] = "ckrealestate.settings"
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

6. Static files mapping: `/static/` to `/home/<username>/ISQA8210-TermProject/staticfiles`. Media mapping: `/media/` to `/home/<username>/ISQA8210-TermProject/media`.
7. Force HTTPS: on.
8. Reload, open the site, and log in at `/manage/login/`.

Every later deploy (from `main` only):

```bash
cd ~/ISQA8210-TermProject
git pull origin main
workon ck
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
# Web tab, then Reload
```

Notes:
- `db.sqlite3` and `media/` live only on the server and are never pulled from Git. Back them up before risky migrations: `cp db.sqlite3 db.backup.$(date +%F).sqlite3`.
- Add the expiry date shown on the Web tab to the team calendar, and extend before it passes.
- Hand-in links: the GitHub repo URL and `https://<username>.pythonanywhere.com/`.

---

## 17. Suggested CLAUDE.md

Put this at the repo root. Every Claude Code session reads it.

```markdown
# CK Real Estate (ISQA 8210, Team 3)

Read BLUEPRINT.md first. It is the source of truth for scope, models, URLs, design and deploy.
The prototype/ folder is the design reference: copy its markup, classes and CSS, replace its sample data with real queries.

## Stack
Django 5.2, Python 3.12, SQLite, Pillow, nh3. Django templates, static/css/ck.css (public) and static/css/admin.css (admin).
Plain JavaScript plus the vendored libraries in static/vendor/ (Tom Select, Quill, DOMPurify, FilePond, Leaflet, flatpickr, IMask). No build step.

## Rules
- Build stories in rank order (BLUEPRINT section 2). Do not start a story whose lower-ranked stories aren't done.
- Every acceptance criterion gets an automated test. Run `python manage.py test` before saying a task is done.
- Admin views: login_required plus never_cache, using AdminRequiredMixin in accounts/mixins.py.
- Public querysets use Listing.active (is_active=True). Never delete a Listing.
- After a listing is saved, only price, status, featured, is_active and photos may change. There is no full edit form.
- Visitor inquiries are emailed, never saved. Do not create an inquiry model.
- Only one listing can be featured (DB constraint plus an atomic switch), and only an Available one.
- Exactly 4 photos per listing, JPEG or PNG, 5 MB each, an alt text for each, enforced on the server.
- Clean rich text (description, bio) with nh3 on save. Never use |safe on uncleaned input.
- Log every admin change and every log in and log out to AuditLog.
- Use the tokens in ck.css and admin.css. CK Red #75000E, light and dark mode. Buttons are 12 px rounded rectangles (never pills), icon-only buttons are round, input focus is a red border with no glow, labels never overflow their buttons.
- Every input has a label, 44 px minimum touch targets, no sideways scrolling at 360 px.
- Libraries must fail soft: if one does not load, the plain control still works.
- Secrets stay in .env, never in code or commits.
- Migrations: tell the user before creating one, because teammates may be making migrations on other branches.

## Git
- Work on the current member branch (e.g. `twumasi`). Never commit to main directly.
- Commit messages: `feat(listings): ... (US-03)`.
- Before pushing: `git fetch origin && git merge origin/main`, then run tests.

## Commands
- Run: `python manage.py runserver`
- Test: `python manage.py test`
- Seed: `python manage.py seed_lookups`

## Copy
- Public copy lives in content/copy.md. Run /humanizer on it before it goes into templates. No em dashes. Never rewrite Carlos's own words.
```

---

## 18. Claude Code prompts, stage by stage

Paste these one at a time. Wait for the tests to pass before moving on.

**Stage 0: scaffold**
> Read BLUEPRINT.md and CLAUDE.md. Scaffold the Django project exactly as in section 4 (project `ckrealestate`; apps accounts, listings, inquiries, siteprofile, localarea, reports), with settings from section 5, `.env.example`, `.gitignore` and `requirements.txt`. Copy prototype/styles.css to static/css/ck.css, prototype/admin.css to static/css/admin.css and prototype/vendor/ to static/vendor/. Build `templates/base.html` from the prototype's public header and footer and `templates/base_admin.html` from the admin shell (side menu, top bar). Add `static/img/logo.svg` from section 10.3. Run the server and the (empty) test suite. Don't commit yet; show me the file tree.

**Stage 1: US-01 and US-02**
> Implement US-01 and US-02 from BLUEPRINT section 13: login and logout at /manage/, AdminRequiredMixin (login_required plus never_cache), a placeholder dashboard at /manage/, the Administrators group, a management command `create_admins` that makes the carlos and janet users with passwords read from env vars, and the user_logged_in / user_logged_out receivers that write AuditLog rows (create a minimal AuditLog model now). Login template from prototype/login.html. Write every test listed on the cards. Run the tests, then commit on my branch with message "feat(accounts): admin login and logout (US-01, US-02)".

**Stage 2: US-03**
> Implement US-03: the models from section 6 (PropertyType, Neighborhood, ListingStatus, PriceRange, Listing including is_active, is_featured, features, latitude and longitude), migrations, the seed_lookups command from section 7, ListingForm with the validation rules on the card (nh3 for the description), the create view, and the add-listing template from prototype/admin-add.html with Tom Select, Quill, Leaflet and IMask wired up (leave the photos section for US-04). Add a minimal public /listings/ page that lists active listings. Write all US-03 tests. Run them. Commit "feat(listings): add listing (US-03)".

**Stage 3: deploy check**
> Walk me through section 16 to deploy the current main to PythonAnywhere. Give me each Bash command and each Web tab setting in order, and stop after each step so I can confirm.

**Stage 4: stretch, US-04 to US-06** (only after US-01 to US-03 are merged and live)
> Implement US-04 (FilePond photos on the add form plus the Replace photos page), then US-05 (listing card and grid from prototype/index.html), then US-06 (listing page from prototype/property.html with the Features list and the Leaflet map), in that order, one commit each, following their cards. Run the tests after each.

**Copy pass**
> Create content/copy.md with every public string from the templates, grouped by page. Then run /humanizer on it and show me the diff before changing templates.

---

## 19. Open decisions

| # | Question | Owner | Status and answer |
|---|---|---|---|
| D1 | US-15 lists "history kept as rows", but Cole's ERD uses a `Listing_Is_Featured` flag | Cole, Gage | Use the flag. The featured history table on the Featured home page is read from `AuditLog` rows with `action="featured_set"` (start = that row, end = the next one) |
| D2 | Price band edges: is $350,000 in "$300k to $350k" or in "$350k to $400k"? | Paul | Lower bound inclusive, upper exclusive, so $350,000 falls in $350k to $400k |
| D3 | Cole's ERD stores `Listing_Price_Range_ID`, which can go stale | Cole | Keep the column, but always set it in `Listing.save()` from the price |
| D4 | How does an admin find a hidden listing to reactivate (US-19)? | Team | Settled: a "Hidden" tab on All listings |
| D5 | What counts as a "completed search" for US-22? | Paul | Settled: the visitor chose at least one filter, pressed "Show homes" and the results page loaded. Shown on the report page |
| D6 | Full lists of home types and neighborhoods, and the price ceiling | Carlos, team | Settled for now: 5 types (Ranch, Tudor, Split-Entry, Townhome, Condominium), 4 neighborhoods (Benson, Downtown, Happy Hollow, Rockbrook), 20 price ranges from $0 to $1M. Carlos can still add types or neighborhoods |
| D7 | Logo approval | Carlos | The animated rounded-square mark (section 10.3) is a proposal |
| D8 | US-09 AC says "history remain stored", but no history tables exist | Gage, Anabel | Change the AC wording to "record and photos remain stored" |
| D9 | US-16 task "Create Visitor Inquiry model" and US-18 "reuses the inquiry model" conflict with email-only | Gage, Anabel | Remove the model task. US-18 reuses the form class |
| D10 | The case asks for "a list of general real estate features/attributes", but the ERD has no field for it | Cole | Add `features` (JSONField list) to LISTING. Required, at least one |
| D11 | Map pin for the listing page and report map | Cole, Paul | Add optional `latitude` and `longitude` to LISTING. Without them the map centres on the neighborhood |
| D12 | Description and bio are rich text | Team | Store cleaned HTML (nh3 on the server, DOMPurify in the browser). Existing plain text is shown as paragraphs |
| D13 | Case says only the price changes; US-04 says photos can be uploaded "when creating or editing" | Paul | Proposed: no full edit form; a Replace photos page only. Ask Paul to confirm |
| D14 | 32 photos per listing (bird's-eye, 360 views) | Paul | Not taken: the case says 4 photos. The gallery can show more later without redesign if Paul approves |
| D15 | Dashboard figures | Team | Sample data in the prototype. The real dashboard counts from LISTING (sold, pending, by status), SEARCH_LOG (searches by period and filter) and AUDIT_LOG (recent activity). It is not a story; build it after the backlog if time allows |
| D16 | Map tiles and address lookup | Team | CARTO tiles and the Nominatim lookup load in the browser. Check they load on the live site; the map and pin still work without them |

---

## 20. Definition of done and Sprint 2 hand-in checklist

A story is done when:
- [ ] Every acceptance criterion passes in an automated test
- [ ] The UI matches its prototype page (layout, tokens, states, light and dark mode)
- [ ] It works at 390 px width with no sideways scrolling
- [ ] It is merged to `main` through a reviewed pull request
- [ ] It is deployed and checked on PythonAnywhere
- [ ] The Kanban card is moved to Done, with actual hours entered in the backlog

Sprint 2 submission (50 pts):
- [ ] Cost-benefit analysis (template in the project files), 10 pts
- [ ] Product backlog on the Canvas template (`Sprint2_Product_Backlog.xlsx`), 5 pts
- [ ] Interface designs, at least mockup level: the clickable prototype (public site and admin), shared by link with screenshots in the hand-in, 10 pts
- [ ] US-01 to US-03 built, with the GitHub link and the PythonAnywhere link, 20 pts
- [ ] Meeting minutes, Gantt, Kanban screenshot, retrospective, 5 pts
- [ ] Peer evaluation submitted

---

## 21. Inspiration and references

| Reference | What we took | Where it shows |
|---|---|---|
| "Garnet" real estate template (html.laralink.com/xproperty), adapted in an earlier artifact | The base layout, animations and UI patterns for the public site. Parts that did not fit CK were removed and the content rewritten for Carlos | Every public page |
| Dribbble "RealtyHub" dashboard | Card layout, period selector, gauges, bars, donut and table style, restyled in CK colors | Admin dashboard and shell |
| Zillow listing page | Two buttons that open step-by-step dialogs (request a showing, contact), and the price-first card | Listing page dialogs, listing cards |
| Four TikTok videos supplied by the team | Could not be opened automatically (TikTok blocks it). Add screenshots and notes here if they are still wanted | |

Ideas used across the site: a bold featured-home band, quick filter chips, a sticky contact bar on phones, a calm dark mode, and lifted cards that keep each listing's details together.
