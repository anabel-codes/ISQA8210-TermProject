# PythonAnywhere deployment

Ethan Vincent owns deployment to the project's PythonAnywhere account,
`ejvincent10`. The intended project URL is `https://ejvincent10.pythonanywhere.com/`.
Deployment to that account is pending Ethan's setup and verification.

I used `gigson2.pythonanywhere.com` as a temporary testing environment on
Python 3.13. I completed the recorded checks there, and I confirmed in my own
testing that the project worked. I have handed the implementation and setup
instructions to Ethan for project deployment. See [DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md)
for the handoff and [SPRINT2_STATUS.md](SPRINT2_STATUS.md) for test evidence.

[PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7) has been
merged into `main` as `f9eb1a4`. Ethan can deploy the merged release and record
the exact commit used. Further changes should follow the team's review process.

## Prepare alongside the existing site

In a new PythonAnywhere Bash console, clone the branch containing the release:

```bash
git clone --branch main https://github.com/anabel-codes/ISQA8210-TermProject.git
cd ~/ISQA8210-TermProject
bash deploy/prepare_pythonanywhere.sh
```

For a preview of unmerged development work, clone with
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

## Ethan's project account setup

If the project account already hosts an app, back up
`/var/www/ejvincent10_pythonanywhere_com_wsgi.py` to a timestamped file under
`/home/ejvincent10/` first. Record its source, working-directory, virtualenv and
static mappings so the previous configuration can be restored.

On the Web tab:

| Setting | Value |
| --- | --- |
| Python version | 3.13 |
| Source code / working directory | /home/ejvincent10/ISQA8210-TermProject |
| Virtualenv | /home/ejvincent10/ISQA8210-TermProject/.venv |
| WSGI file contents | Contents of deploy/pythonanywhere_wsgi.py |
| Static URL / directory | /static/ → /home/ejvincent10/ISQA8210-TermProject/staticfiles |
| Media URL / directory | /media/ → /home/ejvincent10/ISQA8210-TermProject/media |
| Force HTTPS | Enabled |

Reload once all settings are saved. The server `.env` must have `DJANGO_DEBUG=0`,
an independent random `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS=ejvincent10.pythonanywhere.com`,
and `DJANGO_CSRF_TRUSTED_ORIGINS=https://ejvincent10.pythonanywhere.com`.
The preparation script detects the signed-in account and generates these values
for a fresh checkout. The WSGI template also uses the account's home directory.
Create a fresh configuration and private administrator passwords in the project
account; the test account's secrets and sessions are not part of the handoff.
The platform handles HTTP-to-HTTPS redirection; Django already sets secure session
and CSRF cookies when debug is disabled. Inbound HTTPS works independently of
the console email backend; visitor email is not part of US-01 to US-03.

## Verify and hand in

1. Open the HTTPS home and `/listings/`; verify CSS and JavaScript load.
2. Open `/manage/listings/` signed out; expect a login redirect.
3. At `/manage/login/`, try an incorrect password and then an authorized administrator account.
4. Submit an incomplete listing; errors must identify the fields and retain input.
5. Add an authorized real listing; it must be Available, attributed to the account,
   present in the public list and recorded in AUDIT_LOG. Use a local disposable
   database for fictional demonstration data.
6. Log out with POST; revisit management pages and use Back to verify access is blocked.
7. Repeat the required screens at 390 px and in light/dark mode.
8. Record the deployed commit, review PR, live URL and screenshots in SPRINT2_STATUS.md.

Ethan should check the expiry date shown on the project's Web tab and extend
the app as needed. The December 11, 2026 date recorded during testing applies to
`gigson2` only. The previous test site's WSGI backup remains at
`/home/gigson2/wsgi-before-ck-20261121.py`. No reminder has been scheduled.

For later releases, back up the database, pull the reviewed main branch, rerun
the preparation script, then reload. To roll back the app configuration, restore
the saved WSGI file and previous Web tab paths, then reload. Keep database backups
if a future release changes its schema.

References: [PythonAnywhere Django deployment](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject),
[static file configuration](https://help.pythonanywhere.com/pages/DjangoStaticFiles),
and [Django deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/).
