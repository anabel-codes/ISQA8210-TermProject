# CK Real Estate (ISQA 8210, Team 3)

Read BLUEPRINT.md (v2.0) first. It is the source of truth for scope, models, URLs, design and deploy.
Mockup screenshots: docs/design/mockups/v3/. Older design notes in docs/archive/ are superseded; do not build from them.
The prototype/ folder is the design reference: copy its markup, classes and CSS, replace its sample data with real queries.

## Stack
Django 5.2, Python 3.12, SQLite, Pillow, nh3. Django templates, static/css/ck.css (public) and static/css/admin.css (admin).
Plain JavaScript plus the vendored libraries in static/vendor/ (Tom Select, Quill, DOMPurify, FilePond, Leaflet, flatpickr, IMask). No build step.

## Rules
- Build stories in rank order (BLUEPRINT section 2). Do not start a story whose lower-ranked stories aren't done.
- Every acceptance criterion gets an automated test. Run `python manage.py test` before saying a task is done.
- Admin views: login_required plus never_cache, using AdminRequiredMixin in accounts/mixins.py.
- Admin templates live in templates/manage/, not templates/admin/ (that name overrides Django's own admin templates).
- Public querysets use Listing.active (is_active=True). Never delete a Listing.
- After a listing is saved, only price, status, featured, is_active and photos may change. There is no full edit form.
- Visitor inquiries are emailed, never saved. Do not create an inquiry model.
- Only one listing can be featured (DB constraint plus an atomic switch), and only an Available one.
- Exactly 4 photos per listing, JPEG or PNG, 5 MB each, an alt text for each, enforced on the server.
- Clean rich text (description, bio) with nh3 on save. Never use |safe on uncleaned input.
- Log every admin change and every log in and log out to AuditLog.
- static/js/ck.js (public) and static/js/admin.js (admin) are built from prototype/app.js and prototype/admin.js. Templates render the markup; the scripts only add behavior. Icons in templates: `{% load ck %}{% icon 'search' %}`.
- Use the tokens in ck.css and admin.css. CK Red #75000E, light and dark mode. Buttons are 12 px rounded rectangles (never pills), icon-only buttons are round, input focus is a red border with no glow, labels never overflow their buttons.
- Every input has a label, 44 px minimum touch targets, no sideways scrolling at 360 px.
- Libraries must fail soft: if one does not load, the plain control still works.
- Secrets stay in .env, never in code or commits.
- Migrations: tell the user before creating one, because teammates may be making migrations on other branches.

## Git
- Work on your own branch (`<name>-development`). Never commit to main directly.
- Commit messages: `feat(listings): ... (US-03)`.
- Before pushing: `git fetch origin && git merge origin/main`, then run tests.

## Commands
- Run: `python manage.py runserver`
- Test: `python manage.py test`
- Seed: `python manage.py seed_lookups`
- Sample listings for local work only: `python manage.py seed_demo` (never on the live site)
- Admin users: copy seed/admins.example.json to seed/admins.json (gitignored) and set the passwords, then `python manage.py create_admins`

## Copy
- Public copy lives in content/copy.md. Run /humanizer on it before it goes into templates. No em dashes. Never rewrite Carlos's own words.
