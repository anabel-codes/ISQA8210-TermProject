"""Initialize server-only configuration and back up an existing SQLite database.

Run through prepare_pythonanywhere.sh, on PythonAnywhere only.
Never imports or overwrites another project's database or configuration.
"""

import getpass
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from dotenv import dotenv_values


def validate_checkout(root, username):
    """Accept the project and testing checkout names only within the signed-in account."""
    account_home = Path("/home") / username
    if root not in {account_home / "ck-real-estate", account_home / "ISQA8210-TermProject"}:
        raise SystemExit("Run this from ~/ck-real-estate or ~/ISQA8210-TermProject on PythonAnywhere.")


def main():
    """Validate the PythonAnywhere checkout, create private configuration, and back up its database."""
    root = Path(__file__).resolve().parents[1]
    username = getpass.getuser()
    validate_checkout(root, username)
    env_path = root / ".env"
    host = f"{username}.pythonanywhere.com"
    if not env_path.exists():
        with env_path.open("x", encoding="utf-8") as handle:
            handle.write(
                f"DJANGO_SECRET_KEY={secrets.token_urlsafe(64)}\n"
                "DJANGO_DEBUG=0\n"
                f"DJANGO_ALLOWED_HOSTS={host}\n"
                f"DJANGO_CSRF_TRUSTED_ORIGINS=https://{host}\n"
                "DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend\n"
            )
        env_path.chmod(0o600)
        print("Created private production .env; no administrator passwords were created.")
    values = dotenv_values(env_path)
    if not values.get("DJANGO_SECRET_KEY") or values.get("DJANGO_DEBUG") != "0":
        raise SystemExit("Set a secret key and DJANGO_DEBUG=0 in the server .env first.")
    if host not in [h.strip() for h in values.get("DJANGO_ALLOWED_HOSTS", "").split(",")]:
        raise SystemExit(f"Add {host} to DJANGO_ALLOWED_HOSTS in the server .env.")
    database = root / "db.sqlite3"
    if database.exists():
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        backup = root / f"db.backup.{stamp}.sqlite3"
        with sqlite3.connect(database) as source, sqlite3.connect(backup) as destination:
            source.backup(destination)
        backup.chmod(0o600)
        print(f"Database backed up to {backup.name}.")
    (root / "media").mkdir(exist_ok=True)


if __name__ == "__main__":
    main()
