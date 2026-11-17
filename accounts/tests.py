"""US-01 Administrator Log In and US-02 Administrator Log Out."""

from django.contrib.auth.models import Group, User
from django.test import TestCase
from django.urls import reverse
from django.utils.html import strip_tags

from reports.models import AuditLog

LOGIN = reverse("accounts:login")
LOGOUT = reverse("accounts:logout")
ADMIN_HOME = reverse("listings_admin:list")
DASHBOARD = reverse("listings_admin:dashboard")


class AdminAccountsMixin:
    @classmethod
    def setUpTestData(cls):
        group = Group.objects.create(name="Administrators")
        cls.carlos = User.objects.create_user("carlos", password="Test-pass-123", first_name="Carlos")
        cls.janet = User.objects.create_user("janet", password="Test-pass-456", first_name="Janet")
        cls.carlos.groups.add(group)
        cls.janet.groups.add(group)


class US01LoginTests(AdminAccountsMixin, TestCase):
    def test_ac1_valid_credentials_reach_the_admin_area(self):
        response = self.client.post(LOGIN, {"username": "janet", "password": "Test-pass-456"})
        self.assertRedirects(response, DASHBOARD)
        self.assertEqual(int(self.client.session["_auth_user_id"]), self.janet.pk)

    def test_ac1_login_is_recorded_with_who_and_when(self):
        self.client.post(LOGIN, {"username": "janet", "password": "Test-pass-456"})
        row = AuditLog.objects.get(action="login")
        self.assertEqual(row.administrator, self.janet)
        self.assertIsNotNone(row.date_time)

    def test_ac2_failed_login_is_not_recorded(self):
        self.client.post(LOGIN, {"username": "janet", "password": "wrong"})
        self.assertFalse(AuditLog.objects.filter(action="login").exists())

    def test_login_page_does_not_advertise_the_admin_area(self):
        html = self.client.get(LOGIN).content.decode()
        visible = strip_tags(html.split("<body>", 1)[1].split("<script", 1)[0])
        self.assertNotIn("admin", visible.lower())

    def test_ac2_invalid_credentials_show_an_error_and_open_nothing(self):
        response = self.client.post(LOGIN, {"username": "janet", "password": "wrong"})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "don't match")
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_ac3_anonymous_admin_page_redirects_to_login(self):
        response = self.client.get(ADMIN_HOME)
        self.assertRedirects(response, f"{LOGIN}?next={ADMIN_HOME}")

    def test_carlos_and_janet_are_separate_users_in_one_group(self):
        self.assertNotEqual(self.carlos.pk, self.janet.pk)
        self.assertEqual(
            list(self.carlos.groups.values_list("name", flat=True)),
            list(self.janet.groups.values_list("name", flat=True)),
        )

    def test_passwords_are_stored_hashed(self):
        self.assertTrue(self.janet.password.startswith("pbkdf2_sha256$"))


class US02LogoutTests(AdminAccountsMixin, TestCase):
    def setUp(self):
        self.client.login(username="carlos", password="Test-pass-123")

    def test_ac1_logout_ends_session_and_returns_to_login(self):
        response = self.client.post(LOGOUT)
        self.assertRedirects(response, LOGIN)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_ac1_logout_is_recorded(self):
        self.client.post(LOGOUT)
        self.assertEqual(AuditLog.objects.get(action="logout").administrator, self.carlos)

    def test_every_admin_page_needs_login_and_is_never_cached(self):
        for url in (DASHBOARD, ADMIN_HOME, reverse("listings_admin:create")):
            with self.subTest(url=url):
                self.assertIn("no-store", self.client.get(url).headers.get("Cache-Control", ""))
        self.client.post(LOGOUT)
        for url in (DASHBOARD, ADMIN_HOME, reverse("listings_admin:create")):
            with self.subTest(url=url, logged_in=False):
                self.assertRedirects(self.client.get(url), f"{LOGIN}?next={url}")

    def test_side_menu_log_out_is_a_post_form(self):
        html = self.client.get(DASHBOARD).content.decode()
        self.assertIn(f'method="post" action="{LOGOUT}"', html)

    def test_ac2_after_logout_admin_page_redirects_to_login(self):
        self.client.post(LOGOUT)
        response = self.client.get(ADMIN_HOME)
        self.assertRedirects(response, f"{LOGIN}?next={ADMIN_HOME}")

    def test_ac3_admin_pages_are_not_cached_for_the_back_button(self):
        response = self.client.get(ADMIN_HOME)
        cache_control = response.headers.get("Cache-Control", "")
        self.assertIn("no-store", cache_control)

    def test_logout_needs_post(self):
        response = self.client.get(LOGOUT)
        self.assertEqual(response.status_code, 405)
