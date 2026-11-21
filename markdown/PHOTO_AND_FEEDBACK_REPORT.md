# Photography and management feedback update

November 21, 2026

I replaced the generated estate illustrations on the landing page, login and
missing-photo slots with real stock photography. I chose a sunny red house for
the light theme and illuminated homes for the dark theme. I kept the CK colors
and existing typography. I recorded the sources in [PHOTO_CREDITS.md](PHOTO_CREDITS.md)
and added a public credits page.

I added management notifications for success, error, warning and information.
Each message has a visible severity label and an accessible announcement role.
Errors stay until dismissed. Other notifications pause their dismissal timer
while hovered or focused. Server messages remain readable when JavaScript is
unavailable. I added a welcome message after login and an error message when a
listing fails server validation.

I used SweetAlert2 for publishing a listing, leaving an edited form and logging
out. The default focus stays on “Keep working.” Canceling preserves the form.
The server still handles authentication, validation and saving, including when
JavaScript is disabled.

I documented backend functions and methods with Python docstrings, including
request methods, access checks, validation and database writes where relevant.
The blueprint uses Django page endpoints. I have not added a separate JSON API.
This update needs no database migration.

I verified 62 Django tests locally, including safe message rendering, all four
message levels, login feedback, photo credits, stock labels and preservation of
actual property photos. I also checked JavaScript syntax, Django configuration
and pending migrations. I checked the day and night layouts in the browser,
mobile toast bounds, logout confirmation, unsaved-form protection and publish
confirmation. I used an isolated local preview for management browser checks;
I did not create a fictional listing in the live database.

I kept screenshots and QA files in the ignored `docs/sprint2/` folder, as requested.
I also ran the seven new tests on PythonAnywhere's Python 3.13 environment; all
passed. I collected the new static assets there and passed the Django system
check. I versioned the changed page scripts so returning browsers fetch this
update instead of reusing the previous illustration or notification code.
The earlier Sprint 2 acceptance record remains in [SPRINT2_STATUS.md](SPRINT2_STATUS.md).
Team review of [PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7)
and the merge to main remain team actions.

I applied the [Humanizer skill](https://github.com/blader/humanizer/blob/main/SKILL.md),
version 4.0.0, to this report and the update's commit and review notes. The
Humanizer plugin was not installed in this workspace, so I read its public skill
instructions directly. I used first-person reporting and kept claims tied to
checks I performed.
