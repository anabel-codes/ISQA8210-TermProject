"""Copy this file into the WSGI file linked on PythonAnywhere's Web tab.

The checkout lives at /home/<username>/ISQA8210-TermProject.
Its .env is loaded by ckrealestate.settings, without exposing secrets here.
"""

import sys
from pathlib import Path

project_root = Path.home() / "ISQA8210-TermProject"
sys.path.insert(0, str(project_root))

from ckrealestate.wsgi import application  # noqa: E402, F401
