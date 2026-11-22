#!/usr/bin/env bash
# Prepare this checkout without changing the account's active website.
set -euo pipefail
cd "$(dirname "$0")/.."

# Reuse the Web app's configured environment; gigson2 can keep its existing .venv.
venv_path="${CK_VENV:-$PWD/.venv}"
python_command="${CK_PYTHON:-python3.12}"
if [ ! -x "$venv_path/bin/python" ]; then
    "$python_command" -m venv "$venv_path"
fi
"$venv_path/bin/python" -m pip install -r requirements.txt
"$venv_path/bin/python" deploy/prepare_environment.py
"$venv_path/bin/python" manage.py migrate --noinput
"$venv_path/bin/python" manage.py seed_lookups
"$venv_path/bin/python" manage.py collectstatic --noinput
"$venv_path/bin/python" manage.py check
"$venv_path/bin/python" manage.py makemigrations --check --dry-run
printf '%s\n' 'Prepared. Configure the Web tab using markdown/PYTHONANYWHERE.md.'
