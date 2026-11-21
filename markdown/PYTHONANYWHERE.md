# PythonAnywhere deployment

Deployment target discovered on November 21, 2026: `gigson2.pythonanywhere.com`,
Python 3.13. The owner approved replacing the active `django-todo-readiness` site
with CK Real Estate, preserving the old checkout and backing up its WSGI file
before changing the Web tab. Live verification is recorded in SPRINT2_STATUS.md.

The production release should be reviewed and merged into `main`. Until that
review, the integrated work is on `twumasi-development`.

## Prepare alongside the existing site

In a new PythonAnywhere Bash console, clone the branch containing the release:

```bash
git clone --branch main https://github.com/anabel-codes/ISQA8210-TermProject.git
cd ~/ISQA8210-TermProject
bash deploy/prepare_pythonanywhere.sh
```

If reviewing the development branch before its PR is merged, clone with
`--branch twumasi-development` instead. For an existing checkout, inspect
`git status` and pull its intended branch with `git pull --ff-only` before running
the preparation script. Never reset a checkout with uncommitted work.

The script creates a Python 3.13 virtualenv, installs the declared dependencies,
creates a private server `.env` if absent, backs up an existing project database,
applies migrations, seeds lookup data and collects static assets. It preserves
existing `.env` values and stops if production host/debug settings are wrong.
It never loads demo homes or touches another project's files.

The owner should create Carlos and Janet using private terminal prompts:

```bash
.venv/bin/python manage.py create_admins --interactive
```

The command validates new passwords, stores only Django hashes, and preserves
existing passwords. It does not save a plaintext seed file. The private JSON/env
seed method remains available for local setup. Use `createsuperuser` interactively
for a separate team account if needed.
Never paste passwords or API tokens into chat or commit the server configuration.

## Activate after approval

Back up `/var/www/gigson2_pythonanywhere_com_wsgi.py` to a timestamped file
under `/home/gigson2/` first. Record the previous source, working-directory,
virtualenv and static mappings so the old app can be restored.

On the Web tab:

| Setting | Value |
| --- | --- |
| Python version | 3.13 |
| Source code / working directory | /home/gigson2/ISQA8210-TermProject |
| Virtualenv | /home/gigson2/ISQA8210-TermProject/.venv |
| WSGI file contents | Contents of deploy/pythonanywhere_wsgi.py |
| Static URL / directory | /static/ → /home/gigson2/ISQA8210-TermProject/staticfiles |
| Media URL / directory | /media/ → /home/gigson2/ISQA8210-TermProject/media |
| Force HTTPS | Enabled |

Reload once all settings are saved. The server `.env` must have `DJANGO_DEBUG=0`,
an independent random `DJANGO_SECRET_KEY`, and `DJANGO_ALLOWED_HOSTS=gigson2.pythonanywhere.com`.
The platform handles HTTP-to-HTTPS redirection; Django already sets secure session
and CSRF cookies when debug is disabled. Inbound HTTPS works independently of
the console email backend; visitor email is not part of US-01 to US-03.

## Verify and hand in

1. Open the HTTPS home and `/listings/`; verify CSS and JavaScript load.
2. Open `/manage/listings/` signed out; expect a login redirect.
3. At `/manage/login/`, try an incorrect password and then the owner's valid account.
4. Submit an incomplete listing; errors must identify the fields and retain input.
5. Add an authorized real listing; it must be Available, attributed to the account,
   present in the public list and recorded in AUDIT_LOG. Use a local disposable
   database for fictional demonstration data.
6. Log out with POST; revisit management pages and use Back to verify access is blocked.
7. Repeat the required screens at 390 px and in light/dark mode.
8. Record the deployed commit, review PR, live URL and screenshots in SPRINT2_STATUS.md.

The account currently expires December 11, 2026; confirm the current date shown
on the Web tab and extend before expiry. No reminder has been scheduled.

For later releases, back up the database, pull the reviewed main branch, rerun
the preparation script, then reload. To roll back the app configuration, restore
the saved WSGI file and previous Web tab paths, then reload. Keep database backups
if a future release changes its schema.

References: [PythonAnywhere Django deployment](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject),
[static file configuration](https://help.pythonanywhere.com/pages/DjangoStaticFiles),
and [Django deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/).
