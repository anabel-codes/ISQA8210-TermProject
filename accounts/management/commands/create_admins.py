"""Create the Administrators group and the carlos and janet accounts (US-01).

Passwords come from seed/admins.json (gitignored; copy seed/admins.example.json).
Environment variables CK_CARLOS_PASSWORD / CK_JANET_PASSWORD override it if set.
"""

import json
import os
from pathlib import Path

from django.conf import settings

from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand, CommandError

ADMINS = [
    ("carlos", "Carlos", "Kosala", "CK_CARLOS_PASSWORD"),
    ("janet", "Janet", "", "CK_JANET_PASSWORD"),
]


class Command(BaseCommand):
    help = "Create the Administrators group and the carlos and janet users."

    def handle(self, *args, **options):
        seed_path = Path(settings.BASE_DIR) / "seed" / "admins.json"
        seeded = json.loads(seed_path.read_text()) if seed_path.exists() else {}
        group, _ = Group.objects.get_or_create(name="Administrators")
        for username, first_name, last_name, env_name in ADMINS:
            password = os.environ.get(env_name) or seeded.get(username)
            if not password:
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
