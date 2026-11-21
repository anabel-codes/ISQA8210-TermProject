# Sprint 2 implementation and hand-in status

Scope: BLUEPRINT section 2 requires US-01 (login), US-02 (logout), US-03 (add a
listing), deployed to PythonAnywhere. US-04 photos and US-05/06 browsing/details
are stretch goals. The owner confirmed using the repo blueprint as the rubric.
Date: November 21, 2026.

| Area | Implemented evidence | Verification / remaining work |
| --- | --- | --- |
| Frontend | Real Django login, dashboard, listing table and add form; public home and browse list; light/dark styles and responsive navigation | Browser-verified public home/listings/login and protected add form at 390 px, in light/dark modes, with no page-level horizontal overflow. Screenshots in docs/sprint2. |
| Backend | Administrator group/superuser guard, session login/logout, server form validation, sanitized rich text, forced Available status and owner, atomic listing/audit writes | accounts/tests.py and listings/tests.py cover required acceptance criteria and failure cases. |
| HTTP/API layer | GET/POST login, POST logout, protected GET/POST new listing, protected dashboard/table, public GET home/listings | Session authentication and CSRF apply to writes. No standalone JSON API is specified by the blueprint; do not claim one exists. |
| Database | Cole's SQLite reference merged; runtime Django migrations implement its entities with built-in Django authentication | See DATABASE_MAPPING.md. No pending migrations. Do not import the reference SQL into the migrated app database. |
| Data | Repeatable lookup seed: 5 types, 4 neighborhoods, 3 statuses, 20 price bands; private admin seed; ownership and audit timestamps | Live database counts match. Owner created Carlos and Janet with private prompts; Janet successfully logged in. Live database starts with zero listings. |
| Deployment | PythonAnywhere WSGI template and repeatable preparation script; production env is created only on server | Live at https://gigson2.pythonanywhere.com/ with owner approval, from twumasi-development commit dd47162. Old project preserved; WSGI backup at /home/gigson2/wsgi-before-ck-20261121.py. Team review/main release remains. |

## Required endpoints

| URL | Methods | Access / behavior |
| --- | --- | --- |
| /manage/login/ | GET, POST | Only active Administrators group members or team superusers can start a management session; errors do not disclose account roles. |
| /manage/logout/ | POST | CSRF-protected session termination, logout audit entry and login redirect; GET returns 405. |
| /manage/ | GET | Administrator dashboard; signed-out requests redirect and ordinary users get 403. |
| /manage/listings/ | GET | Administrator listing table with search, sort, pagination and filters. |
| /manage/listings/new/ | GET, POST | Server-validated listing form. Invalid submission renders errors; valid submission redirects to the listing table. |
| / | GET | Public home backed by active listings. |
| /listings/ | GET | Public active listings, with type, hood and band query filters. |
| /django-admin/ | GET, POST | Django staff administration, separate from the application login. |

## Validation commands

```powershell
python manage.py check
python manage.py test
python manage.py makemigrations --check --dry-run
```

The current suite has 55 passing tests. Newly covered cases include nonadministrator
access, inactive users, CSRF on writes, logout without JavaScript, invalid numeric
inputs, spoofed owner/status fields, and rollback when an audit write fails.
All 55 also passed on PythonAnywhere Python 3.13 (43.643 seconds), using a separate
test database. Final local tests passed after the frontend copy corrections.

## Live verification

- Janet reached the dashboard after the owner signed in privately.
- The protected add form loaded its actual lookup options and rich-text controls.
- An incomplete form retained the entered address, displayed nine field errors,
  and created no listing; the management table remained empty.
- Logout ended the session; browser Back redirected to login with
  `next=/manage/listings/`.
- An anonymous add-form request redirected to login; an invalid login displayed
  the generic error. No administrator session was created by that invalid attempt.
- Eleven live HTTP checks passed; responses are saved in
  [http-checks.json](../docs/sprint2/http-checks.json), including CSRF rejection,
  login redirects, POST-only logout and CSS/JavaScript availability.
- Valid listing creation, ownership, Available status, sanitization and public
  visibility were tested in the server's disposable test database. Fictional homes
  were not added to the live database. The owner can add the first real listing.
- [Desktop home](../docs/sprint2/home-desktop-light.jpg),
  [mobile light](../docs/sprint2/home-mobile-light.jpg),
  [mobile dark](../docs/sprint2/home-mobile-dark.jpg),
  [dashboard](../docs/sprint2/dashboard-desktop-light.jpg),
  [form validation](../docs/sprint2/add-listing-desktop-errors.jpg), and
  [mobile form](../docs/sprint2/add-listing-mobile-dark.jpg) provide visual evidence.
  Management screenshots preceded the final removal of internal story labels;
  layout and behavior are unchanged.

## Remaining completion evidence

- [PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7) needs team
  review and merge to main. The owner-approved live demonstration currently uses
  twumasi-development. After review, deploy main using PYTHONANYWHERE.md.
- Product backlog and actual hours, cost-benefit analysis, meeting minutes,
  Gantt/Kanban evidence, retrospective and peer evaluations: team deliverables;
  no completion claim is made here.

The activity rows exist in AUDIT_LOG and can be inspected in Django administration
by a team superuser. A custom activity-log UI is US-20, beyond the required three
stories. Photo upload and listing details are not implemented in this release.
