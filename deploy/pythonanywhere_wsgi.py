"""Copy this file into the WSGI file linked on PythonAnywhere's Web tab.

The project checkout lives at /home/<username>/ck-real-estate.
The earlier ISQA8210-TermProject testing checkout is also supported.
Its .env is loaded by ckrealestate.settings, without exposing secrets here.
"""

import sys
from pathlib import Path

project_root = Path.home() / "ck-real-estate"
if not (project_root / "manage.py").is_file():
    project_root = Path.home() / "ISQA8210-TermProject"
sys.path.insert(0, str(project_root))

from ckrealestate.wsgi import application  # noqa: E402, F401
