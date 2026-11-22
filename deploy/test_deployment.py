"""Check deployment path selection without touching a hosted site or its data."""

import runpy
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import patch

from prepare_environment import validate_checkout


class CheckoutValidationTests(unittest.TestCase):
    def test_project_checkout_is_supported(self):
        validate_checkout(Path('/home/ejvincent10/ck-real-estate'), 'ejvincent10')

    def test_existing_testing_checkout_is_supported(self):
        validate_checkout(Path('/home/gigson2/ISQA8210-TermProject'), 'gigson2')

    def test_another_accounts_checkout_is_rejected(self):
        with self.assertRaises(SystemExit):
            validate_checkout(Path('/home/gigson2/ck-real-estate'), 'ejvincent10')

    def test_unrelated_checkout_is_rejected(self):
        with self.assertRaises(SystemExit):
            validate_checkout(Path('/home/ejvincent10/another-project'), 'ejvincent10')


class WsgiPathTests(unittest.TestCase):
    def check_checkout(self, names, expected):
        """Load only the WSGI path-selection code with a stub Django application."""
        template = Path(__file__).with_name('pythonanywhere_wsgi.py')
        with tempfile.TemporaryDirectory() as directory:
            account_home = Path(directory)
            for name in names:
                checkout = account_home / name
                checkout.mkdir()
                (checkout / 'manage.py').touch()
            stub = types.ModuleType('ckrealestate.wsgi')
            stub.application = object()
            with patch.object(Path, 'home', return_value=account_home), \
                 patch.dict(sys.modules, {'ckrealestate.wsgi': stub}), \
                 patch.object(sys, 'path', list(sys.path)):
                result = runpy.run_path(str(template))
                self.assertEqual(result['project_root'], account_home / expected)
                self.assertEqual(sys.path[0], str(account_home / expected))
                self.assertIs(result['application'], stub.application)

    def test_project_site_uses_ethans_checkout(self):
        self.check_checkout(['ck-real-estate'], 'ck-real-estate')

    def test_existing_test_site_keeps_its_checkout(self):
        self.check_checkout(['ISQA8210-TermProject'], 'ISQA8210-TermProject')

    def test_project_checkout_takes_precedence_when_both_exist(self):
        self.check_checkout(['ck-real-estate', 'ISQA8210-TermProject'], 'ck-real-estate')
