"""Create the Administrators group and the carlos and janet accounts (US-01).

Passwords come from seed/admins.json (gitignored; copy seed/admins.example.json).
Environment variables CK_CARLOS_PASSWORD / CK_JANET_PASSWORD override it if set.
"""

import json
import os
from getpass import getpass
from pathlib import Path

from django.conf import settings

from django.contrib.auth.models import Group, User
from django.contrib.auth.password_validation import validate_password
from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ValidationError

ADMINS = [
    ("carlos", "Carlos", "Kosala", "CK_CARLOS_PASSWORD"),
    ("janet", "Janet", "", "CK_JANET_PASSWORD"),
]


class Command(BaseCommand):
    help = "Create the Administrators group and the carlos and janet users."

    def add_arguments(self, parser):
        """Expose the private interactive-password option for initial administrator provisioning."""
        parser.add_argument(
            "--interactive", action="store_true",
            help="Prompt privately for new accounts instead of reading passwords from a file.",
        )

    def handle(self, *args, **options):
        """Create or reuse Carlos and Janet, validate prompted passwords, preserve existing hashes, and assign the administrator group."""
        seed_path = Path(settings.BASE_DIR) / "seed" / "admins.json"
        seeded = json.loads(seed_path.read_text()) if seed_path.exists() else {}
        group, _ = Group.objects.get_or_create(name="Administrators")
        for username, first_name, last_name, env_name in ADMINS:
            password = os.environ.get(env_name) or seeded.get(username)
            if options["interactive"]:
                if User.objects.filter(username=username).exists():
                    password = None  # Existing passwords are never reset by this command.
                else:
                    password = getpass(f"Password for {username}: ")
                    if password != getpass("Confirm password: "):
                        raise CommandError("Passwords do not match. No account was created for this user.")
                    try:
                        validate_password(password, User(username=username, first_name=first_name, last_name=last_name))
                    except ValidationError as error:
                        raise CommandError(" ".join(error.messages)) from error
            if not password and not (options["interactive"] and User.objects.filter(username=username).exists()):
                raise CommandError(f"Add \"{username}\" to seed/admins.json (see seed/admins.example.json) or set {env_name}.")
            user, created = User.objects.get_or_create(
                username=username, defaults={"first_name": first_name, "last_name": last_name}
            )
            if not created and last_name and not user.last_name:
                user.last_name = last_name
                user.save(update_fields=["last_name"])
            if created:
                user.set_password(password)
                user.save()
            user.groups.add(group)
            state = "created" if created else "already existed (password unchanged)"
            self.stdout.write(f"{username}: {state}")
        self.stdout.write(self.style.SUCCESS("Administrators ready."))
