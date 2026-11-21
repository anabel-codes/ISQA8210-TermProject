#!/usr/bin/env bash
# Prepare this checkout without changing the account's active website.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -x .venv/bin/python ]; then
    python3.13 -m venv .venv
fi
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python deploy/prepare_environment.py
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py seed_lookups
.venv/bin/python manage.py collectstatic --noinput
.venv/bin/python manage.py check
.venv/bin/python manage.py makemigrations --check --dry-run
printf '%s\n' 'Prepared. Configure the Web tab using markdown/PYTHONANYWHERE.md.'
