# ISQA8210-TermProject

## Carlos Kosala Real Estate Website
Term Project for ISQA 8210. This site is a live demonstration of CK Real Estate that will establish an online presence, promote listings, and allow current and potential clients to contact Carlos Kosala about his properties and services.

### Project Description
The project aims to establish an online presence for CK Real Estate,
promote property listings, and help prospective clients contact
broker Carlos Kosala.

The application uses Django 5.2, Python 3.12, SQLite, Django templates,
CSS, and plain JavaScript.

### Live Website
https://ejvincent10.pythonanywhere.com/

The current deployment uses the merged main branch on PythonAnywhere
with Python 3.12. Its database and administrator accounts are separate
from each developer's local environment.

### Current Implementation

The Sprint 2 release implements these required user stories:

- US-01: Admin login.
- US-02: Admin logout.
- US-03: Add a property listing (This sprint omits the 4 photos of the property)

Supporting functionality includes Admin login features for Carlos and Janet, logout features to ensure security, and the ability for both admins to upload a property and include a description.  This version does not include photo feature as this will be implemented in future sprint.

 Additional features, including email inquiries,
featured-property management, and monthly search reporting, remain
planned work described in markdown/BLUEPRINT.md.

See markdown/SPRINT2_STATUS.md for the recorded implementation and
verification evidence. Its references to the previous deployment
describe historical checks and require a separate status update.

### Team Members

- Anabel Diaz
- Ethan Vincent
- Jake Madison
- Twumasi Adomako
- Cole Beiermann
- Gage Heithold

### Project Deliverables
Current application supports seperate admin accounts for Carlos and Janet.  They can login/logout and create property listings.  Now listings

#### Online Application / Functionality Delivered & User Stories Completed
Deliver sprint objectives and complete approved user stories that meet acceptance criteria.

#### Online Application / Application Stability
Maintain a stable, dependable application through testing and defect resolution.  This is hosted through pythonanywhere.

#### Online Application / User Interface & User Experience
Provide a user-friendly and responsive interface that supports core business goals.

#### Project Retrospective
Reflect on successes, challenges, lessons learned, and process improvements identified throughout the project.

### Local development

The app uses Django, SQLite, and plain JavaScript
Use Python 3.12 as specified in [BLUEPRINT.md](markdown/BLUEPRINT.md).

Clone the main branch and install dependencies (Windows PowerShell):

```powershell
git clone --branch twumasi-development https://github.com/anabel-codes/ISQA8210-TermProject.git
cd ISQA8210-TermProject
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

On macOS/Linux, use `python3 -m venv .venv`, `source .venv/bin/activate`,
and `cp .env.example .env` for the equivalent steps.

Generate a local secret with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
and set `DJANGO_SECRET_KEY` in `.env`. Keep `DJANGO_DEBUG=1` for local work.
Then initialize your own database:

```powershell
python manage.py migrate
python manage.py seed_lookups
python manage.py createsuperuser
python manage.py runserver
```

Open http://127.0.0.1:8000/ for the public site and `/django-admin/` for Django administration.
The application login is `/manage/login/`. To create its administrator accounts,
run `python manage.py create_admins --interactive` and enter the new passwords
privately. Existing passwords are preserved. For file-based local setup, copy
`seed/admins.example.json` to `seed/admins.json`, replace both placeholder
passwords, and run `python manage.py create_admins`.
Optional local sample listings: `python manage.py seed_demo`.

Never commit `.env`, `seed/admins.json`, your database, or uploaded media.
Each teammate creates their own local configuration and database.

### Contributing

The integrated Django application is merged into `main`.
Work on your existing `<name>-development` branch and submit changes
through a pull request to `main`.

Before starting work, check for local changes and fetch the latest branches:

```bash
git status
git fetch origin
git switch <name>-development
git merge origin/main
```

Replace `<name>-development` with your branch name, such as
`ethan-development`. Save or commit existing work before switching
branches. Resolve any merge conflicts before continuing.

If you do not already have a development branch, create one from
the latest main:

```bash
git fetch origin
git switch -c <name>-development origin/main
```

Before pushing, incorporate the latest main and run the project checks
against your local development configuration:

```bash
git fetch origin
git merge origin/main
python manage.py check
python manage.py test
python manage.py makemigrations --check --dry-run
```

Never use the deployed database for automated tests.

Review your changes and stage only the files intended for your update.
For a README-only change:

```bash
git diff -- README.md
git add README.md
git diff --cached
git commit -m "docs(readme): update setup and deployment information"
git push -u origin <name>-development
```

Open a pull request with `main` as the base and your development branch
as the compare branch. Request a teammate's review before merging.
Include a description of the changes and the checks actually performed.
Do not force-push shared branches.

Coordinate database migrations with the team before creating them.
Preserve existing team attribution and document proposed requirements
until they are confirmed.

Follow [BLUEPRINT.md](markdown/BLUEPRINT.md) for project scope and conventions.
The `prototype/` directory is the design reference. The running Django
application uses `templates/` and `static/`; mockup screenshots are in
`docs/design/mockups/v3/`.

### Deployment

The current live application is hosted at:

https://ejvincent10.pythonanywhere.com/

Deploy reviewed releases from `main`. The current deployment uses:

| Setting | Value |
| --- | --- |
| Python version | 3.12 |
| Project directory | `/home/ejvincent10/ck-real-estate` |
| Virtual environment | `/home/ejvincent10/.virtualenvs/ck-real-estate` |
| Static files | `/home/ejvincent10/ck-real-estate/staticfiles` |
| Uploaded media | `/home/ejvincent10/ck-real-estate/media` |
| Django settings module | `ckrealestate.settings` |

Production configuration is stored privately on the server with
`DJANGO_DEBUG=0`, a separate random `DJANGO_SECRET_KEY`, and
`DJANGO_ALLOWED_HOSTS=ejvincent10.pythonanywhere.com`.
Force HTTPS is enabled.

Local and deployed databases are independent. Creating a local
administrator does not create that account on PythonAnywhere.

Back up the server database and uploaded media before deployment changes.
Preserve the server `.env`, database, and media when updating code.
Collect static files and reload the web app after deploying.
Renew the free web app before the expiration shown on the Web tab.

The existing [deployment guide](markdown/PYTHONANYWHERE.md) describes
the earlier gigson2 deployment and its Python 3.13 preparation script.
Those account paths and script defaults do not match the current
deployment described above.

### Project Documentation

- [Build blueprint and ranked user stories](markdown/BLUEPRINT.md)
- [Sprint 2 implementation and recorded verification](markdown/SPRINT2_STATUS.md)
- [Data model and Django mapping](markdown/DATABASE_MAPPING.md)
- [PythonAnywhere deployment guide](markdown/PYTHONANYWHERE.md)

The Sprint 2 status document includes historical verification from the
previous deployment. Its pending-merge and former live-site references
predate the current main release.
