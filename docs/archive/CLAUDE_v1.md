# CK Real Estate (ISQA 8210, Team 3)

Read BLUEPRINT.md first. It is the source of truth for scope, models, URLs, tests and deploy.
The design system is docs/design/DESIGN_DIRECTION.md (v2). It replaces BLUEPRINT section 10.
Mockups: the Design canvas "CK Real Estate Mockups", page "v2 Refined" (copies in docs/design/mockups/).

## Stack
Django 5.2, Python 3.12+ (3.14 works locally; match PythonAnywhere on the server), SQLite, Pillow.
Django templates with one CSS file (static/css/ck.css). No JS framework, no build step.

## Rules
- Build stories in rank order (BLUEPRINT section 2).
- Every acceptance criterion gets an automated test. Run `python manage.py test` before saying a task is done.
- Admin views: `admin_required` / `AdminRequiredMixin` from accounts/mixins.py (login required + never cache).
- Admin templates live in templates/manage/, not templates/admin/ (that name would override Django's own admin login).
- Public querysets use Listing.active (is_active=True). Never delete a Listing.
- Visitor inquiries are emailed, never saved. Do not create an inquiry model.
- Only one listing can be featured (DB constraint plus an atomic switch).
- Exactly 4 photos per listing, enforced in the form.
- Colors: #FFFFFF, #75000E, #000000 plus the tints in ck.css only. 44 px minimum touch targets, a label on every input.
- Secrets stay in .env, never in code or commits.
- Migrations: tell the team before creating one; teammates may be making migrations on their branches.

## Git
- Work on your own branch (`<name>-development`). Never commit to main directly; merge through a reviewed pull request.
- Commit messages: `feat(listings): ... (US-03)`.
- Before pushing: `git fetch origin && git merge origin/main`, then run tests.

## Commands
- Run: `python manage.py runserver`
- Test: `python manage.py test`
- Seed: `python manage.py seed_lookups`
- Admin users: set CK_CARLOS_PASSWORD and CK_JANET_PASSWORD in .env, then `python manage.py create_admins`

## Copy
- Public copy lives in content/copy.md. Run /humanizer on it before it goes into templates. Never rewrite Carlos's own words.
