# ISQA8210-TermProject

## Carlos Kosala Real Estate Website

Custom real estate web application for managing property listings, customer inquiries, featured properties, and search analytics.

### Project Description

This project involves the design and development of a custom real estate website using Agile methodologies. The website will allow visitors to browse property listings, search by various criteria, contact the realtor, and view featured properties.

### Team Members

- Anabel Diaz
- Ethan Vincent
- Jake Madison
- Twumasi Adomako
- Cole Beiermann
- Gage Heithold

### Project Deliverables

#### Online Application / Functionality Delivered & User Stories Completed
Deliver sprint objectives and complete approved user stories that meet acceptance criteria.

#### Online Application / Application Stability
Maintain a stable, dependable application through testing and defect resolution.

#### Online Application / User Interface & User Experience
Provide a user-friendly and responsive interface that supports core business goals.

#### Project Retrospective
Reflect on successes, challenges, lessons learned, and process improvements identified throughout the project.

### Local development

The app uses Django, SQLite, and plain JavaScript. No Node.js build is needed.
Use Python 3.12 as specified in [BLUEPRINT.md](markdown/BLUEPRINT.md).

Clone the development branch and install dependencies (Windows PowerShell):

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

`twumasi-development` contains this development work. Create your own branch from
it if you need this work before it is merged into `main`:

```powershell
git switch -c <name>-development
```

Before pushing, fetch and merge the latest `origin/main`, then run the checks:

```powershell
git fetch origin
git merge origin/main
python manage.py check
python manage.py test
python manage.py makemigrations --check --dry-run
git push -u origin <name>-development
```

Commit only the files intended for your change. Use messages such as
`feat(listings): add listing validation (US-03)` and open a pull request to `main`
with a teammate as reviewer. Coordinate migrations with the team before creating
them. Follow [BLUEPRINT.md](markdown/BLUEPRINT.md) for scope and
project conventions; use the existing `<name>-development` branch names.

`prototype/` is the HTML design reference. The running Django app uses
`templates/` and `static/`; mockup screenshots are in `docs/design/mockups/v3/`.

Sprint 2 integration and deployment notes:

- [Sprint 2 status and endpoints](markdown/SPRINT2_STATUS.md)
- [Cole's data model and Django mapping](markdown/DATABASE_MAPPING.md)
- [PythonAnywhere deployment](markdown/PYTHONANYWHERE.md)
