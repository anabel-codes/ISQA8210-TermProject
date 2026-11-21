# Sprint 2 implementation and hand-in status

Scope: BLUEPRINT section 2 requires US-01 (login), US-02 (logout), US-03 (add a
listing), deployed to PythonAnywhere. US-04 photos and US-05/06 browsing/details
are stretch goals. This status uses the repo blueprint; an additional course rubric
has not yet been supplied. Date: November 21, 2026.

| Area | Implemented evidence | Verification / remaining work |
| --- | --- | --- |
| Frontend | Real Django login, dashboard, listing table and add form; public home and browse list; light/dark styles and responsive navigation | Automated template checks pass. Browser verification at 390 px and live screenshots remain. |
| Backend | Administrator group/superuser guard, session login/logout, server form validation, sanitized rich text, forced Available status and owner, atomic listing/audit writes | accounts/tests.py and listings/tests.py cover required acceptance criteria and failure cases. |
| HTTP/API layer | GET/POST login, POST logout, protected GET/POST new listing, protected dashboard/table, public GET home/listings | Session authentication and CSRF apply to writes. No standalone JSON API is specified by the blueprint; do not claim one exists. |
| Database | Cole's SQLite reference merged; runtime Django migrations implement its entities with built-in Django authentication | See DATABASE_MAPPING.md. No pending migrations. Do not import the reference SQL into the migrated app database. |
| Data | Repeatable lookup seed: 5 types, 4 neighborhoods, 3 statuses, 20 price bands; private admin seed; ownership and audit timestamps | Initialize server lookups and private owner credentials using `create_admins --interactive`. Fictional sample listings stay local. |
| Deployment | PythonAnywhere WSGI template and repeatable preparation script; production env is created only on server | Active-site replacement requires owner approval. Team review/main merge and live verification remain. |

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

## Remaining completion evidence

- Reviewed PR into main and deployed commit: pending.
- Live CK Real Estate URL and end-to-end smoke test: pending; intended target is
  https://gigson2.pythonanywhere.com/ after approval to replace the existing app.
- Mobile/light/dark screenshots: pending.
- Owner-created private administrator credentials: pending.
- Product backlog and actual hours, cost-benefit analysis, meeting minutes,
  Gantt/Kanban evidence, retrospective and peer evaluations: team deliverables;
  no completion claim is made here.

The activity rows exist in AUDIT_LOG and can be inspected in Django administration
by a team superuser. A custom activity-log UI is US-20, beyond the required three
stories. Photo upload and listing details are not implemented in this release.
