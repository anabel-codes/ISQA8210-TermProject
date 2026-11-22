# Sprint 2 implementation and hand-in status

Scope: BLUEPRINT section 2 requires US-01 (login), US-02 (logout), US-03 (add a
listing), deployed to PythonAnywhere. US-04 photos and US-05/06 browsing/details
are stretch goals. The owner confirmed using the repo blueprint as the rubric.
Date: November 21, 2026.

I added real day/night photography, themed management notifications, SweetAlert2
confirmations and backend method documentation in a later update. I recorded
those changes and their checks in [PHOTO_AND_FEEDBACK_REPORT.md](PHOTO_AND_FEEDBACK_REPORT.md).
The current local suite has 62 passing tests, with nine additional JavaScript
timer tests. I used `gigson2` for testing, and I have confirmed that the project
worked in that environment. I have handed the implementation and deployment
instructions to Ethan Vincent, who owns deployment to the project's account,
`ejvincent10`. That deployment remains pending Ethan's setup and verification.
See [DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md).

| Area | Implemented evidence | Verification / remaining work |
| --- | --- | --- |
| Frontend | Real Django login, dashboard, listing table and add form; public home and browse list; light/dark styles and responsive navigation | Browser-verified public home/listings/login and protected add form at 390 px, in light/dark modes, with no page-level horizontal overflow. Screenshots in local, gitignored docs/sprint2. |
| Backend | Administrator group/superuser guard, session login/logout, server form validation, sanitized rich text, forced Available status and owner, atomic listing/audit writes | accounts/tests.py and listings/tests.py cover required acceptance criteria and failure cases. |
| HTTP/API layer | GET/POST login, POST logout, protected GET/POST new listing, protected dashboard/table, public GET home/listings | Session authentication and CSRF apply to writes. No standalone JSON API is specified by the blueprint; do not claim one exists. |
| Database | Cole's SQLite reference merged; runtime Django migrations implement its entities with built-in Django authentication | See DATABASE_MAPPING.md. No pending migrations. Do not import the reference SQL into the migrated app database. |
| Data | Repeatable lookup seed: 5 types, 4 neighborhoods, 3 statuses, 20 price bands; private admin seed; ownership and audit timestamps | Live database counts match. Owner created Carlos and Janet with private prompts; Janet successfully logged in. Live database starts with zero listings. |
| Deployment | PythonAnywhere WSGI template and repeatable preparation script; private configuration is created on the target account | Testing completed at https://gigson2.pythonanywhere.com/ from twumasi-development, application commit f126e06. I confirmed the project worked and handed deployment to Ethan Vincent for ejvincent10. PR #7 is merged into main as f9eb1a4; project deployment remains pending Ethan's verification. |

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

The original Sprint 2 verification had 55 passing tests. Those cases include nonadministrator
access, inactive users, CSRF on writes, logout without JavaScript, invalid numeric
inputs, spoofed owner/status fields, and rollback when an audit write fails.
All 55 also passed on PythonAnywhere Python 3.13 (43.643 seconds), using a separate
test database. Final local tests passed after the frontend copy corrections.

## Verification in the gigson2 test environment

I completed my own PythonAnywhere testing and confirmed that the project worked.
The checks below describe the test account; they do not verify the project
account `ejvincent10`.

- Janet reached the dashboard after the owner signed in privately.
- The protected add form loaded its actual lookup options and rich-text controls.
- An incomplete form retained the entered address, displayed nine field errors,
  and created no listing; the management table remained empty.
- Logout ended the session; browser Back redirected to login with
  `next=/manage/listings/`.
- An anonymous add-form request redirected to login; an invalid login displayed
  the generic error. No administrator session was created by that invalid attempt.
- Eleven live HTTP checks passed; responses are saved locally in
  `docs/sprint2/http-checks.json`, including CSRF rejection,
  login redirects, POST-only logout and CSS/JavaScript availability.
- Valid listing creation, ownership, Available status, sanitization and public
  visibility were tested in the server's disposable test database. Fictional homes
  were not added to the live database. The owner can add the first real listing.
- Desktop/mobile home, light/dark, dashboard and form-validation screenshots
  provide visual evidence in `docs/sprint2/` on the owner's machine.
  Management screenshots preceded the final removal of internal story labels;
  layout and behavior are unchanged.
- The owner requested keeping QA evidence local. `docs/sprint2/` is excluded from
  Git; screenshots, HTTP results and `deployment-record.json` are not published
  in the repository. The implementation and this status summary are checked in.

## Remaining completion evidence

- [PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7) is merged
  into main as `f9eb1a4`. Ethan Vincent owns deployment of the merged release
  to `ejvincent10` using [PYTHONANYWHERE.md](PYTHONANYWHERE.md), followed by checks
  on that account. The deployment on `gigson2` is the completed testing record.
- Product backlog and actual hours, cost-benefit analysis, meeting minutes,
  Gantt/Kanban evidence, retrospective and peer evaluations: team deliverables;
  no completion claim is made here.

The activity rows exist in AUDIT_LOG and can be inspected in Django administration
by a team superuser. A custom activity-log UI is US-20, beyond the required three
stories. Photo upload and listing details are not implemented in this release.
