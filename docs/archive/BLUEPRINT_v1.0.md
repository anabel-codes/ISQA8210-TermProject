# CK Real Estate Website: Build Blueprint

ISQA 8210 Term Project · Team 3 · Version 1.0 · November 7, 2026
Author of this blueprint: Twumasi Adomako (frontend, interface design, Kanban)
Client: Carlos Kosala, Broker (second administrator: Janet) · Product Owner: Paul van Vliet

This file is the single source of truth for building the site in Claude Code. Drop it at the root of the repo as `BLUEPRINT.md`. Claude Code should read it before every work session. Section 17 gives a ready `CLAUDE.md`, and section 18 gives the prompts to paste for each stage.

Sources this blueprint is built from:
- The team's final ranked user stories (24 stories, approved by Paul)
- Cole's data model (`ISQA_8210_Data_Model.sql` and the dbdiagram ERD, 11 tables plus the built-in user table)
- The Sprint 2 assignment and Paul's answer: "build stories 1 through 3"
- The Design canvas "CK Real Estate Mockups" (11 boards)

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
9. Screens, stories and canvas boards
10. Design system (tokens, logo, components)
11. 3D "anatomy" building graphics
12. Site copy and the /humanizer step
13. Story build cards
14. Testing strategy
15. Email (inquiries are emailed, never stored)
16. Deploying to PythonAnywhere
17. Suggested CLAUDE.md
18. Claude Code prompts, stage by stage
19. Open decisions
20. Definition of done and Sprint 2 hand-in checklist
21. Inspiration board (TikTok references)

---

## 1. Project snapshot

| Item | Value |
|---|---|
| Product | Public website for CK Real Estate, plus an admin area for Carlos and Janet |
| Public visitors can | See the featured home, browse active listings, filter by home type, neighborhood and $50,000 price band, view a listing with 4 photos, email the office about a listing, read Carlos's profile, email the office, read local area links |
| Admins can | Log in and out, add listings with exactly 4 photos, change status and price, hide (deactivate) and bring back listings, pick the one featured home, run a monthly search report, read the activity (audit) log, edit the profile and local area links |
| Never stored | Visitor inquiries. They go out by email only (Paul confirmed that VISITOR_INQUIRY, PRICE_HISTORY and STATUS_HISTORY are not needed) |
| Never deleted | Listings. `is_active = False` hides them from the public |
| Brand colors | White `#FFFFFF`, CK Red `#75000E`, Black `#000000` |
| Hosting | PythonAnywhere free tier, SQLite |
| Repo | `anabel-codes/ISQA8210-TermProject`, one branch per member |

Team roles for Sprint 2:

| Person | Sprint 2 role |
|---|---|
| Gage Heithold | Scrum Master |
| Twumasi Adomako | Frontend, wireframes, mockups, Kanban board, minutes |
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
| Database | SQLite | Free tier, zero setup. Django's ORM keeps a later move to MySQL easy |
| Images | Pillow (required by `ImageField`) | Photo upload and validation |
| Front end | Django templates, one hand-written CSS file, a small amount of plain JavaScript (menu toggle, photo gallery) | No build step, so it deploys cleanly on PythonAnywhere |
| Fonts | Google Fonts: Playfair Display (600, 700), Inter (400, 500, 600, 700) | Matches the mockups |
| Email | Django `send_mail`. Console backend locally, SMTP on the server | Inquiries are emailed, never stored |
| Tests | Django `TestCase` (`python manage.py test`) | Every acceptance criterion gets a test |
| Hosting | PythonAnywhere free account | Course requirement |

Free-tier limits to respect:
- One web app at `<username>.pythonanywhere.com`. It must be renewed from the Web tab before its expiry date, so put a reminder on the team calendar.
- Small disk quota (about 512 MB). Resize uploaded photos (see US-04) and keep the repo free of large files.
- Outbound internet goes through an allowlist. Test SMTP early (section 15).
- No custom domain on free.

Rules for the code:
- Every admin view needs `@login_required` (or `LoginRequiredMixin`).
- Public queries always filter `is_active=True`.
- Never hard-delete a `Listing`.
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
├── ckrealestate/                ← project package
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/                    ← US-01, US-02 (login, logout)
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
├── reports/                     ← SearchLog, AuditLog (US-20 to US-22)
├── templates/
│   ├── base.html                ← public layout
│   ├── base_admin.html          ← admin layout with black side menu
│   ├── partials/                ← header, footer, listing_card, logo, status_chip, anatomy_svg
│   ├── public/                  ← home, listing_list, listing_detail, broker, local_area
│   ├── admin/                   ← login, listing_list, listing_form, report, audit_log
│   └── registration/
├── static/
│   ├── css/ck.css               ← tokens and components (section 10)
│   ├── js/ck.js                 ← menu toggle, gallery
│   └── img/                     ← logo.svg, favicon.svg, anatomy/*.svg
└── media/                       ← uploads (git-ignored)
```

### Branches

- `main` is protected and always deployable. Only merged pull requests go in.
- Each member works on their own branch. The repo uses `<name>-development`: `twumasi-development`, `cole-development`, `anabel-development`, `gage-development`, `jake-development`, `ethan-development`. Use those names wherever this file says `twumasi`.
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
LOGIN_REDIRECT_URL = "listings_admin:list"
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

This section follows Cole's ERD. Django-style field names are used in Python, and `db_table` keeps Cole's table names, so the database matches the ERD in the Sprint 1 and 2 documents.

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
    description = models.TextField()
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

Exactly four photos per listing is enforced in the form (US-04), not the database. This matches Cole's note.

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
    action = models.CharField(max_length=30)        # created, updated, status_changed, price_changed,
                                                    # deactivated, reactivated, featured_set, ...
    entity_name = models.CharField(max_length=40)   # "Listing", "SiteProfile", "LocalAreaEntry"
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
        for n in ["Ranch", "Tudor", "Townhome", "Condominium"]:
            PropertyType.objects.get_or_create(name=n)
        for n in ["Benson", "Downtown", "Happy Hollow", "Rockbrook"]:
            Neighborhood.objects.get_or_create(name=n)
        for n in ["Available", "Pending", "Sold"]:
            ListingStatus.objects.get_or_create(name=n)
        step = Decimal("50000")
        low = Decimal("0")
        while low < Decimal("2000000"):
            high = low + step
            PriceRange.objects.get_or_create(
                lower_value=low, upper_value=high,
                defaults={"name": f"${low:,.0f} to ${high:,.0f}"},
            )
            low = high
        self.stdout.write(self.style.SUCCESS("Lookups seeded."))
```

The home types and neighborhoods are the examples given in the data model. Confirm the full lists with Carlos and add more rows as needed. The $2,000,000 ceiling is a placeholder for the same conversation.

Admin accounts (US-01): create two users, `carlos` and `janet`, in a `Administrators` group. Neither needs `is_superuser` for the site's own admin pages. Keep one team superuser for the Django `/django-admin/` site.

```bash
python manage.py shell -c "from django.contrib.auth.models import User, Group; g,_=Group.objects.get_or_create(name='Administrators'); [ (lambda u: (u.set_password('CHANGE-ME'), u.save(), u.groups.add(g)))(User.objects.get_or_create(username=n, defaults={'first_name':f})[0]) for n,f in [('carlos','Carlos'),('janet','Janet')] ]"
```

Give the real passwords to Carlos and Janet privately. They should change them on first use.

---

## 8. URL, view and template map

Public (namespace `public`):

| URL | View | Template | Stories | Canvas board |
|---|---|---|---|---|
| `/` | `home` | `public/home.html` | US-13, US-14 | 02 Home |
| `/listings/` | `listing_list` (GET filters `type`, `hood`, `band`) | `public/listing_list.html` | US-05, US-10, US-11, US-12 | 03 Browse |
| `/listings/<int:pk>/` | `listing_detail` | `public/listing_detail.html` | US-06 | 04 Listing |
| `/listings/<int:pk>/ask/` | `listing_inquiry` (POST) | redirects back with a message | US-16 | 04 Listing |
| `/about/` | `broker_profile` | `public/broker.html` | US-17 | 05 About Carlos |
| `/about/contact/` | `general_inquiry` (POST) | redirects back with a message | US-18 | 05 About Carlos |
| `/local-area/` | `local_area` | `public/local_area.html` | US-23 | 06 Local area |

Admin area (namespace `listings_admin`, prefix `/manage/`, everything `login_required`). The path is `/manage/` so that it does not collide with Django's `/django-admin/`.

| URL | View | Template | Stories | Board |
|---|---|---|---|---|
| `/manage/login/` | `LoginView` | `admin/login.html` | US-01 | 07 |
| `/manage/logout/` | `LogoutView` (POST only) | redirect to login | US-02 | 08 sidebar |
| `/manage/listings/` | `admin_listing_list` (`?tab=active` or `hidden`) | `admin/listing_list.html` | US-07, US-08, US-09, US-15, US-19 | 08 |
| `/manage/listings/new/` | `listing_create` | `admin/listing_form.html` | US-03, US-04 | 09 |
| `/manage/listings/<pk>/edit/` | `listing_update` | `admin/listing_form.html` | US-04, US-07, US-08 | 09 |
| `/manage/listings/<pk>/status/` | POST | redirect | US-07 | 08 |
| `/manage/listings/<pk>/price/` | POST | redirect | US-08 | 08 |
| `/manage/listings/<pk>/deactivate/` | POST plus a confirm page | redirect | US-09 | 08 |
| `/manage/listings/<pk>/reactivate/` | POST | redirect | US-19 | 08 |
| `/manage/listings/<pk>/feature/` | POST | redirect | US-15 | 08 |
| `/manage/report/` | `search_report` (`?month=2026-10`) | `admin/report.html` | US-21, US-22 | 10 |
| `/manage/activity/` | `audit_log` (read only) | `admin/audit_log.html` | US-20 | 10 |
| `/manage/profile/` | `profile_edit` | `admin/profile_form.html` | US-17 | (reuses form style) |
| `/manage/local-area/` | list, add, edit, remove entries | `admin/local_area_*.html` | US-24 | (reuses form style) |

Django's own `/django-admin/` stays on for the team. Carlos and Janet use `/manage/`.

Logout must be a POST in Django 5. The sidebar "Log out" in the mockup is a `<form method="post">` holding a button that is styled like the outline button.

---

## 9. Screens, stories and canvas boards

The Design canvas "CK Real Estate Mockups" has 11 boards. Each one is a full-color mockup at desktop width, and board 11 shows phone width.

| Board | Screen | Key components | Stories |
|---|---|---|---|
| 01 | Brand sheet | Logo lockups, palette, type, buttons, status chips, form field, anatomy icon | All |
| 02 | Home | Header and nav, hero with exploded 3D house, quick search, featured home band, "New on the market" cards, broker teaser, footer | US-13, US-14, US-15 |
| 03 | Browse | Filter panel (type, neighborhood checkboxes, $50k band), active filter chips, result count, card grid, empty state | US-05, US-10, US-11, US-12 |
| 04 | Listing details | Breadcrumb, 4-photo gallery (1 large and 3 thumbs), status and featured chips, key facts row, description, "Anatomy of the house" panel (optional), inquiry form with sent state | US-06, US-16 |
| 05 | About Carlos | Portrait, bio, contact facts, black contact form | US-17, US-18 |
| 06 | Local area | Red band header, four category columns with links | US-23 |
| 07 | Admin log in | Split black and white layout, error state | US-01 |
| 08 | Admin listings | Black sidebar, signed-in name, log out, success toast, Active and Hidden tabs, table with featured radio, inline price, status select, Edit and Hide | US-02, US-07, US-08, US-09, US-15, US-19 |
| 09 | Add listing | Two fieldsets (house details, four photo slots), live price band hint, "3 of 4 photos" error, disabled Save | US-03, US-04 |
| 10 | Report and activity log | Month picker, three bar groups, CSV button, read-only log table | US-20, US-21, US-22 |
| 11 | Mobile | Home, browse and listing at 390 px, sticky "Ask about this home" bar | US-14 (responsive) |

When a teammate needs a screen, point them to the board number.

Fields in the mockups that are not in Cole's ERD: none. The "Anatomy" panel reuses existing listing fields (bedrooms, bathrooms, lot size, year built), and its roof line is free text in the description until the team decides otherwise.

---

## 10. Design system

> **Superseded by v2 (November 7, 2026).** The current design system is [`docs/design/DESIGN_DIRECTION.md`](docs/design/DESIGN_DIRECTION.md): same three colors (White `#FFFFFF`, CK Red `#75000E`, Black `#000000`), new type, radius, glass, cards, gallery, admin shell and anatomy panel, based on the four TikTok references and five ThemeForest templates. `static/css/ck.css` follows v2. The v1 notes below are kept for history.

### 10.1 Tokens (`static/css/ck.css`, top of the file)

```css
:root {
  /* Brand */
  --ck-red: #75000E;
  --ck-red-dark: #4A0009;    /* shadow side of the roof only */
  --ck-black: #000000;
  --ck-white: #FFFFFF;
  /* Helpers (tints of the palette) */
  --ck-tint: #F7F2F2;        /* surfaces, photo placeholders */
  --ck-border: #D9CFCF;
  --ck-muted: #4A4A4A;       /* secondary text, 8.9:1 on white */

  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  --fs-xs: 0.75rem; --fs-sm: 0.875rem; --fs-md: 1rem; --fs-lg: 1.125rem;
  --fs-xl: 1.5rem; --fs-2xl: 2.25rem; --fs-3xl: 2.75rem; --fs-hero: clamp(2.25rem, 5vw, 3.75rem);

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  --space-6: 32px; --space-7: 48px; --space-8: 64px;

  --container: 1200px;
  --radius: 0;               /* square corners everywhere */
  --border-strong: 1.5px solid var(--ck-black);
  --tap: 44px;               /* minimum touch target */
}

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-body); color: var(--ck-black); background: var(--ck-white); line-height: 1.6; }
h1, h2, h3 { font-family: var(--font-display); line-height: 1.1; margin: 0; }
a { color: var(--ck-red); }
a:hover { color: var(--ck-black); }
:focus-visible { outline: 3px solid var(--ck-red); outline-offset: 2px; }
.container { max-width: var(--container); margin: 0 auto; padding: 0 var(--space-5); }
.eyebrow { font-size: var(--fs-sm); font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--ck-red); }
.visually-hidden { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
```

### 10.2 Components

```css
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 24px;
       font: 600 var(--fs-md) var(--font-body); border: 2px solid var(--ck-red); background: var(--ck-red);
       color: var(--ck-white); text-decoration: none; cursor: pointer; }
.btn:hover { background: var(--ck-black); border-color: var(--ck-black); color: var(--ck-white); }
.btn--outline { background: var(--ck-white); color: var(--ck-red); }
.btn--outline:hover { background: var(--ck-red); color: var(--ck-white); }
.btn--dark { background: var(--ck-black); border-color: var(--ck-black); }
.btn[disabled] { opacity: .55; cursor: not-allowed; }

.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field label { font-size: var(--fs-sm); font-weight: 600; }
.field input, .field select, .field textarea { min-height: 48px; padding: 0 14px; border: var(--border-strong);
       font: 400 var(--fs-md) var(--font-body); background: var(--ck-white); border-radius: 0; }
.field textarea { padding: 12px 14px; }
.field .error { color: var(--ck-red); font-size: var(--fs-sm); font-weight: 600; }
.field--invalid input { border-color: var(--ck-red); }

.alert { background: var(--ck-tint); border-top: 3px solid var(--ck-red); padding: 12px 14px; }
.toast { background: var(--ck-black); color: var(--ck-white); padding: 14px 18px; }

.chip { display: inline-block; padding: 6px 12px; font-size: var(--fs-xs); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.chip--available { background: var(--ck-white); border: 1.5px solid var(--ck-black); }
.chip--pending   { background: var(--ck-black); color: var(--ck-white); }
.chip--sold, .chip--featured { background: var(--ck-red); color: var(--ck-white); }

.card { display: flex; flex-direction: column; border: 1px solid var(--ck-border); color: inherit; text-decoration: none; }
.card:hover { border-color: var(--ck-black); }
.card__media { aspect-ratio: 4 / 3; background: var(--ck-tint); position: relative; overflow: hidden; }
.card__media img { width: 100%; height: 100%; object-fit: cover; }
.card__body { padding: 18px; display: flex; flex-direction: column; gap: 6px; }
.card__price { font-size: var(--fs-xl); font-weight: 700; color: var(--ck-red); }
.grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-5); }

.site-header { border-bottom: 1px solid var(--ck-border); }
.site-nav a { color: var(--ck-black); text-decoration: none; font-weight: 500; }
.site-nav a[aria-current="page"] { color: var(--ck-red); border-bottom: 2px solid var(--ck-red); }
.site-footer { background: var(--ck-black); color: var(--ck-white); }

.admin-shell { display: flex; flex-wrap: wrap; min-height: 100vh; }
.admin-side { flex: 1 1 240px; max-width: 260px; background: var(--ck-black); color: var(--ck-white); padding: 28px 20px; }
.admin-side a { display: block; padding: 12px 14px; color: var(--ck-white); text-decoration: none; }
.admin-side a[aria-current="page"] { background: var(--ck-red); font-weight: 600; }
.admin-main { flex: 999 1 640px; min-width: 0; padding: 36px 40px; }
.table-wrap { overflow-x: auto; border: 1px solid var(--ck-border); }

@media (max-width: 720px) {
  .site-nav { display: none; }
  .site-nav.is-open { display: flex; flex-direction: column; width: 100%; }
  .menu-toggle { display: inline-flex; }
  .admin-side { max-width: none; }
}
```

Rules:
- Status is told apart by fill and by its word, never by color alone.
- No gradients, no rounded corners, no drop shadows. Black rules and red accents carry the look.
- Every input has a `<label>`. Icon-only buttons have an `aria-label`.
- Body text is at least 16 px.

### 10.3 Logo

Save this as `static/img/logo.svg` and as a partial `templates/partials/logo.html`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="CK Real Estate">
  <rect width="64" height="64" fill="#75000E"/>
  <rect x="42" y="11" width="6" height="11" fill="#FFFFFF"/>
  <path d="M9 29 L32 10 L55 29" fill="none" stroke="#FFFFFF" stroke-width="4.5"/>
  <text x="32" y="53" text-anchor="middle" font-family="Playfair Display, Georgia, serif"
        font-size="24" font-weight="700" fill="#FFFFFF">CK</text>
</svg>
```

Lockup: the mark sits on the left. To its right, "CK" is set in Playfair 700 over "REAL ESTATE" in Inter 600 at 10 to 12 px with 3 to 4 px letter spacing. Variants: reversed (white square, red mark) for red backgrounds, and red on black for the admin sidebar. Before Carlos signs off, convert the `<text>` to outlined paths (in Figma, or Inkscape's "Object to Path") so the logo renders the same without the font. Show Carlos the brand board and get his approval. The logo is a proposal until he approves it.

---

## 11. 3D "anatomy" building graphics

The `/anatomy` skill is now installed (November 7, 2026). Use it to build these figures; the spec below is its brief. Before it was installed, this was a defined asset step: build these graphics as SVG files (hand-coded, or with Claude Code) following this spec. If the team later adds an anatomy skill, give it this section as its brief.

What: isometric (30 degree) house illustrations drawn in the brand palette. They work as a 3D effect without photos or a 3D library, weigh under 5 KB each, and stay sharp at any size.

Files:

| File | Use | Notes |
|---|---|---|
| `static/img/anatomy/house-exploded.svg` | Home hero (board 02) | Roof, upper floor, ground floor and foundation pulled apart with dashed red callout lines and labels |
| `static/img/anatomy/house-assembled.svg` | Placeholder when a listing has no photo yet, favicon-style accents | The single pyramid-roof house from the brand board |
| `static/img/anatomy/house-stack.svg` | "Anatomy of the house" panel on the listing page (board 04) | Three layers without labels; the labels are HTML next to it so they can be translated and read by screen readers |

Geometry, so every drawing matches:
- The base diamond's left corner sits at (60, y), the front corner at (180, y+60) and the right corner at (300, y). Each unit of wall height is 60 px. In a 360-wide viewBox, the roof apex is at (180, y−90).
- Faces: the left wall uses `#F7F2F2`, the right wall `#FFFFFF`, the left roof `#75000E` and the right roof `#4A0009`. Stroke `#000` at 2.5 to 3 px with round joins.
- Windows are black parallelograms. The door is red on the right wall.
- Exploded view: leave a 20 to 40 px gap between layers, with dashed `#75000E` 1.5 px leader lines to labels set in Inter. Labels: ROOF, UPPER FLOOR, GROUND FLOOR, FOUNDATION.
- Accessibility: decorative uses get `aria-hidden="true"`. The hero gets `role="img"` and an `aria-label` that describes the exploded view.

The exact polygons are in the canvas boards 02, 04 and 11. Copy them from there.

Optional motion for Sprint 3 or later, CSS only: on first view, the exploded layers slide together and apart once over 1.2 s, using `transform: translateY` on each `<g>`. Wrap it in `@media (prefers-reduced-motion: no-preference)` so it never plays for visitors who turn motion off.

Listings themselves use Carlos's real photos. The illustrations never stand in for a real house in a way that could mislead a buyer.

---

## 12. Site copy and the /humanizer step

The public text on the site (hero lines, empty states, form helper text, errors, confirmation messages) should read like a person at CK wrote it.

Process:
1. Draft the copy in `content/copy.md`, keyed by screen (one heading per board). The mockups' copy is the first draft.
2. Run `/humanizer` on `content/copy.md` in Claude Code to remove AI-sounding phrasing. Keep facts and placeholders unchanged.
3. Paste the final strings into the templates.
4. Carlos approves his bio, the profile text and the local area entries. His own words beat any rewrite. Use `/humanizer` only on text he asks the team to draft.

Voice: plain, warm, local. Short sentences. No "dream home" clichés and no exclamation marks. Talk to "you". Name neighborhoods.

Placeholders that must come from Carlos: headshot, bio, office address, phone, email, website, office hours, the full lists of home types and neighborhoods, and the local area links.

---

## 13. Story build cards

Each card gives the acceptance criteria (verbatim from the team's final doc), the build steps, and the tests. "AC" means acceptance criterion.

### US-01 Administrator Log In (2 pts, Sprint 2 required)

Story: As an administrator (Carlos or Janet), I want to log in with my own account so that I can access the administrator area and manage the website.

AC:
1. Given I have an administrator account, when I enter a valid username and password, then I reach the administrator area.
2. Given I enter invalid credentials, then I see an error and no administrator pages open.
3. Given I am not logged in, when I try to open an administrator page directly, then I am sent to the login page. (The team doc says "not logged out", which reads as a typo for "not logged in". It is on Gage's cleanup list.)

Build:
- `accounts/urls.py`: `path("manage/login/", LoginView.as_view(template_name="admin/login.html", redirect_authenticated_user=True), name="login")`.
- Template from board 07. Show the error block when `form.non_field_errors` exists. Use `autocomplete="username"` and `autocomplete="current-password"`.
- A placeholder page at `/manage/listings/`, protected with `@login_required`, so AC 1 has somewhere to land until US-03 is built.
- Create the `Administrators` group and the accounts for Carlos and Janet (section 7).
- NFR: passwords are stored as salted hashes (Django's default PBKDF2). Admin pages are never reachable without a session.

Tests (`accounts/tests/test_login.py`):
- A valid login returns a 302 to `/manage/listings/`, and the session holds `_auth_user_id`.
- An invalid login returns a 200 that shows the error text, and the session has no user.
- An anonymous GET of `/manage/listings/` returns a 302 to `/manage/login/?next=/manage/listings/`.
- Carlos and Janet are separate users with the same group.

### US-02 Administrator Log Out (1 pt, Sprint 2 required)

AC:
1. Given I am logged in, when I select the log out option, then my session ends and I am returned to the login page.
2. Given I have logged out, when I try to access an administrator page directly, then I am sent to the login page.
3. Given I have logged out, when I use the browser to return to a previously viewed administrator page, then administrator functionality is no longer accessible without logging in again.

Build:
- `path("manage/logout/", LogoutView.as_view(), name="logout")`, with `LOGOUT_REDIRECT_URL = "accounts:login"`.
- In `base_admin.html`, a sidebar form: `<form method="post" action="{% url 'accounts:logout' %}">{% csrf_token %}<button class="btn btn--outline">Log out</button></form>`.
- AC 3 (back button): add `@never_cache` (or the `cache_control(no_store=True)` decorator) to every admin view, through a small `AdminRequiredMixin` that combines `LoginRequiredMixin` with never-cache headers.

Tests:
- POST to logout returns a 302 to login, and the session is flushed.
- After logout, a GET of an admin page returns a 302 to login.
- An admin page response has `Cache-Control` containing `no-store` (or `no-cache`, `must-revalidate`).

### US-03 Add a New Property Listing (8 pts, Sprint 2 required)

AC:
1. Given I am logged in, when I submit the new listing form with all required fields completed, then the listing is saved with status Available, is associated with my account, and appears among the public listings.
2. Given a required field is missing, then the form shows which field to fix and nothing is saved.

Build:
- Models from section 6: `PropertyType`, `Neighborhood`, `ListingStatus`, `PriceRange`, `Listing`. Add `is_active` and `is_featured` now (they cost nothing and US-05 needs `is_active`).
- `python manage.py makemigrations listings`, then `migrate`, then `seed_lookups`.
- `ListingForm(ModelForm)` with the fields street_address, city, state, zip_code, price, property_type, neighborhood, bedrooms, bathrooms, garage_spaces, square_feet, lot_size, year_built and description. Status is not on the form: it is forced to Available.
- Validation: price above 0 (the form accepts "425,000" and strips the commas), zip code matches `^\d{5}(-\d{4})?$`, bathrooms in half steps, year_built between 1850 and next year.
- View `listing_create`: on valid POST, `obj.current_status = Available`, `obj.administrator = obj.last_modified_by = request.user`, save, flash "Listing added." and redirect to the admin list.
- AC 1's "appears among the public listings": until US-05 is built, a minimal public `/listings/` page that lists active listings (address, price, type, neighborhood) satisfies this. US-05 later turns it into the card grid.
- Template from board 09, house fieldset. Show errors next to each field (`.field--invalid`), plus a summary at the top.
- The price band hint ("Price band is set from this…") can be a small JS line that reads the price input. It is optional.

Tests:
- A valid POST creates one `Listing` with status Available, `administrator` equal to the logged-in user, and `price_range` set.
- For each required field: POST without it gives a 200, the error shows on that field, and `Listing.objects.count()` is unchanged.
- An anonymous POST is redirected to login, and nothing is created.
- A new listing appears on `/listings/`.

### US-04 Upload Four Photos (5 pts, Sprint 2 stretch)

AC: Given I am creating or editing a listing, when I upload four photos in an accepted format, then all four are saved and display with that listing in the order I set. Given I upload fewer than four or an unsupported file type, then I am told what to fix.

Build:
- `ListingPhoto` model and migration. Serve media in development with `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` when `DEBUG` is on. On the server, map `/media/` in the Web tab.
- Four explicit fields, `photo_1` to `photo_4`, plus `alt_1` to `alt_4`, in the same form. That is simpler than a formset and matches board 09.
- Validation: JPEG or PNG only (check with Pillow, not just the file extension), 5 MB maximum each, and exactly 4 on create. On edit, a slot can be replaced or kept.
- Resize on save to a maximum of 1600 px on the long side at JPEG quality 82, to stay inside the free-tier disk quota.
- Save the listing and its photos in `transaction.atomic()` so a failure leaves nothing half-saved.

Tests: four valid images give 4 rows with orders 1 to 4. Three images give an error and nothing saved. A `.gif` or a renamed `.txt` gives an error. The detail page shows the images in order.

### US-05 Browse All Listings (5 pts, Sprint 2 stretch)

AC: Given I am on the listings page, when the page loads, then I see every active listing with its address, price, status, type, neighborhood, and photo. Given a listing is deactivated, then it does not appear.

Build: `Listing.active.select_related("property_type", "neighborhood", "current_status").prefetch_related("photos")`. Card partial `partials/listing_card.html` (boards 02 and 03). Paginate at 12 per page. Show the empty state text from board 03.

Tests: active listings are shown and inactive ones are not. Each card shows the address, price, status, type, neighborhood and the cover image.

### US-06 View Listing Details and Photographs (5 pts, Sprint 2 stretch)

AC: Given I am viewing the listings page, when I select a listing, then I see its address, price, status, description, features, type, neighborhood, and all four photos, plus a way to contact the office about it.

Build: `get_object_or_404(Listing.active, pk=pk)`. A missing or inactive listing gets a friendly 404 page in the brand style ("This home is no longer listed" with a link to Browse). Gallery: the large image plus 3 thumbnail buttons, with a small `ck.js` click-to-swap. Without JS, all 4 photos still show stacked. Contact: the US-16 form, or for Sprint 2 a `mailto:` link to the office address until US-16 is built.

Tests: the detail page shows every field and all 4 images. An inactive listing returns 404. The contact element is present.

### Sprint 3 cards (summary)

| ID | Build in one line | Key test |
|---|---|---|
| US-07 | Status select on the admin list, POST to `/status/`. Set `date_sold = today` when the status becomes Sold, and clear it otherwise | Sold sets `date_sold`, and the new status shows publicly |
| US-08 | Inline price input, POST to `/price/`. Use `update_fields=["price", "price_range", "last_modified_by", "date_updated"]` | Only price (and its band) changes |
| US-09 | "Hide" button opens a confirm page, then `is_active=False`. Admins still open it from the Hidden tab | The record and photos still exist, and the listing is gone from every public URL |
| US-10 to US-12 | GET filters `type`, `hood`, `band` on `/listings/`. Write a `SearchLog` row when the filter form is submitted | Filter results are correct, band edges follow D2, and one log row is written per search |
| US-13 | Home view gets `Listing.active.filter(is_featured=True).first()` | The page renders with and without a featured listing |
| US-14 | Finish `base.html`: `aria-current` on the active link, the phone menu toggle, and the broker's name in the header | Every link resolves, and the toggle button is present |
| US-15 | Featured radio, POST to `/feature/`. In `transaction.atomic()`, clear the old flag and then set the new one. Only Available listings can be featured | After a switch, only one listing is featured |
| US-16 | `ListingInquiryForm` (name, email, phone optional, message, plus a hidden honeypot field). `send_mail` to `OFFICE_EMAIL` with a link to the listing. Nothing is saved | `mail.outbox` has 1 message with the listing link, and an invalid email shows an error |

### Backlog cards (summary)

| ID | Build in one line |
|---|---|
| US-17 | `SiteProfile` singleton with a public `/about/` page and `/manage/profile/` edit |
| US-18 | General contact form on `/about/` that reuses the inquiry form class with no listing and is emailed only |
| US-19 | Reactivate button on the Hidden tab: `is_active=True` |
| US-20 | `audit()` helper called from every admin write view, plus a read-only `/manage/activity/` |
| US-21 | `<input type="month">` on the report, with a filter on `date_time__year` and `__month` |
| US-22 | `SearchLog.objects.filter(is_completed=True, …).values("property_type__name").annotate(n=Count("id"))`, done three ways (type, neighborhood, band), with an optional CSV export |
| US-23 | `/local-area/` grouped by category (`prefetch_related("entries")`) |
| US-24 | Add, edit and remove entries in `/manage/local-area/`. Remove sets `is_active=False` |

---

## 14. Testing strategy

- One test module per story: `listings/tests/test_us03_add_listing.py`. Each test's name quotes the acceptance criterion it covers.
- Use `setUpTestData` for the lookups (call the seed command) and the two admin users.
- For photos, generate in-memory images with Pillow and wrap them in `SimpleUploadedFile`. Put `MEDIA_ROOT` in a temp directory with `override_settings`.
- For email, use Django's `locmem` backend in tests and assert on `mail.outbox`.
- Run `python manage.py test` before every push. Nothing merges to `main` with a failing test.
- Manual demo script for Paul (Sprint 2): log in as Janet, add a listing (showing one validation error first), see it on `/listings/`, log out, press Back, and get sent to login.
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

## Stack
Django 5.2, Python 3.12, SQLite, Pillow. Django templates with one CSS file (static/css/ck.css). No JS framework, no build step.

## Rules
- Build stories in rank order (BLUEPRINT section 2). Do not start a story whose lower-ranked stories aren't done.
- Every acceptance criterion gets an automated test. Run `python manage.py test` before saying a task is done.
- Admin views: login_required plus never_cache, using AdminRequiredMixin in accounts/mixins.py.
- Public querysets use Listing.active (is_active=True). Never delete a Listing.
- Visitor inquiries are emailed, never saved. Do not create an inquiry model.
- Only one listing can be featured (DB constraint plus an atomic switch).
- Exactly 4 photos per listing, enforced in the form.
- Use the design tokens in ck.css. Colors are #FFFFFF, #75000E and #000000 plus the three helper tints only. Square corners, 44 px minimum touch targets, a label on every input.
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
- Public copy lives in content/copy.md. Run /humanizer on it before it goes into templates. Never rewrite Carlos's own words.
```

---

## 18. Claude Code prompts, stage by stage

Paste these one at a time. Wait for the tests to pass before moving on.

**Stage 0: scaffold**
> Read BLUEPRINT.md and CLAUDE.md. Scaffold the Django project exactly as in section 4 (project `ckrealestate`; apps accounts, listings, inquiries, siteprofile, localarea, reports), with settings from section 5, `.env.example`, `.gitignore` and `requirements.txt`. Add `static/css/ck.css` with the tokens and components from section 10, `static/img/logo.svg`, `templates/base.html` and `templates/base_admin.html` matching canvas boards 02 and 08 (header, footer, admin sidebar). Run the server and the (empty) test suite. Don't commit yet; show me the file tree.

**Stage 1: US-01 and US-02**
> Implement US-01 and US-02 from BLUEPRINT section 13: login and logout at /manage/, AdminRequiredMixin (login_required plus never_cache), a placeholder /manage/listings/ page, the Administrators group, and a management command `create_admins` that makes the carlos and janet users with passwords read from env vars. Login template per board 07. Write every test listed on the cards. Run the tests, then commit on my branch with message "feat(accounts): admin login and logout (US-01, US-02)".

**Stage 2: US-03**
> Implement US-03: the models from section 6 (PropertyType, Neighborhood, ListingStatus, PriceRange, Listing including is_active and is_featured), migrations, the seed_lookups command from section 7, ListingForm with the validation rules on the card, the create view, and the board 09 template (house fieldset only; leave the photo fieldset for US-04). Add a minimal public /listings/ page that lists active listings. Write all US-03 tests. Run them. Commit "feat(listings): add listing (US-03)".

**Stage 3: deploy check**
> Walk me through section 16 to deploy the current main to PythonAnywhere. Give me each Bash command and each Web tab setting in order, and stop after each step so I can confirm.

**Stage 4: stretch, US-04 to US-06** (only after US-01 to US-03 are merged and live)
> Implement US-04, then US-05, then US-06, in that order, one commit each, following their cards. Use boards 03, 04 and 09 for markup. Run the tests after each.

**Copy pass**
> Create content/copy.md with every public string from the templates, grouped by screen. Then run /humanizer on it and show me the diff before changing templates.

**Graphics pass**
> Following BLUEPRINT section 11, create static/img/anatomy/house-exploded.svg, house-assembled.svg and house-stack.svg using the geometry rules, the palette and the accessibility notes. Embed house-exploded in the home hero.

---

## 19. Open decisions

| # | Question | Owner | Proposed default until answered |
|---|---|---|---|
| D1 | US-15 still lists a "Featured Property model" task and "history kept as rows", but Cole's ERD uses a `Listing_Is_Featured` flag | Cole, Gage | Use the flag (section 6). Featured changes are traceable through AuditLog once US-20 is built |
| D2 | Price band edges: is $350,000 in "$300k to $350k" or in "$350k to $400k"? | Paul | Lower bound inclusive, upper exclusive, so $350,000 falls in $350k to $400k |
| D3 | Cole's ERD stores `Listing_Price_Range_ID`, which can go stale | Cole | Keep the column, but always set it in `Listing.save()` from the price |
| D4 | How does an admin find a hidden listing to reactivate (US-19)? | Team | A "Hidden" tab on the admin listings page (board 08) |
| D5 | What counts as a "completed search" for US-22? | Paul | The visitor pressed "Show homes" with at least one filter chosen and the results page loaded |
| D6 | Full lists of home types and neighborhoods, and the price ceiling | Carlos | The four plus four from the data model, bands up to $2M |
| D7 | Logo approval | Carlos | Brand board 01 is a proposal |
| D8 | US-09 AC says "history remain stored", but no history tables exist | Gage, Anabel | Change the AC wording to "record and photos remain stored" |
| D9 | US-16 task "Create Visitor Inquiry model" and US-18 "reuses the inquiry model" conflict with email-only | Gage, Anabel | Remove the model task. US-18 reuses the form class |

---

## 20. Definition of done and Sprint 2 hand-in checklist

A story is done when:
- [ ] Every acceptance criterion passes in an automated test
- [ ] The UI matches its canvas board (layout, tokens, states)
- [ ] It works at 390 px width
- [ ] It is merged to `main` through a reviewed pull request
- [ ] It is deployed and checked on PythonAnywhere
- [ ] The Kanban card is moved to Done, with actual hours entered in the backlog

Sprint 2 submission (50 pts):
- [ ] Cost-benefit analysis (template in the project files), 10 pts
- [ ] Product backlog on the Canvas template (`Sprint2_Product_Backlog.xlsx`), 5 pts
- [ ] Interface designs, at least mockup level: the Design canvas, exported to PDF or shared by link, 10 pts
- [ ] US-01 to US-03 built, with the GitHub link and the PythonAnywhere link, 20 pts
- [ ] Meeting minutes, Gantt, Kanban screenshot, retrospective, 5 pts
- [ ] Peer evaluation submitted

---

## 21. Inspiration board (TikTok references)

All four TikTok videos have been reviewed, along with five ThemeForest templates (three landing pages: Velux, Nestrix, Ofen; two admin dashboards with logins: Evohus Django, Lahomes). The full table of what each one shows and what we take is in [`docs/design/DESIGN_DIRECTION.md`](docs/design/DESIGN_DIRECTION.md) section 1.

| Link | What we take | Applied on board |
|---|---|---|
| https://vt.tiktok.com/ZSpMKvrrt/ | Full-bleed photo hero; isometric apartment cutaway with a spec card (our Anatomy panel) | 02, 04 |
| https://vt.tiktok.com/ZSpMEho71/ | Editorial headline with one red italic accent; stat row | 02 |
| https://vt.tiktok.com/ZSpMoeEVD/ | Black featured band with a big rounded photo; amenities grid; sticky price card | 02, 04, 05 |
| https://vt.tiktok.com/ZSpkYbHHr/ | Liquid glass, only on top of photos (search bar, price chips, mobile sticky bar) | 02, 03, 11 |

Ideas already in the mockups that tend to show up in modern real estate UI: a big serif headline over a 3D or exploded house hero, a single bold "featured" band on black, filter chips you can remove, and a sticky contact bar on phones.
