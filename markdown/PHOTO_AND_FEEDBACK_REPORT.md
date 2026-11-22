# Photography and management feedback update

November 21, 2026

I used `gigson2` for testing and confirmed that the project worked there.
I have handed the implementation and deployment instructions to Ethan Vincent
for the project's PythonAnywhere account, `ejvincent10`. All live-site checks
in this report refer to the test environment. Ethan's project deployment remains
pending his setup and verification; see [DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md).

I later replaced the night scenes with an edited version of the Kent Rebman
neighborhood photograph supplied by the owner. I changed the twilight sky to
navy and added warm window lighting. I also widened the daytime banner framing
to show the full roofline and more of the neighboring houses. Both variants
were made with the built-in image editing tool. I disclosed the edits in the
public credits and retained the centered text and full-image overlay.

I replaced the generated estate illustrations on the landing page, login and
missing-photo slots with real stock photography. I chose a sunny red house for
the light theme and illuminated homes for the dark theme. I kept the CK colors
and existing typography. I recorded the sources in [PHOTO_CREDITS.md](PHOTO_CREDITS.md)
and added a public credits page.

I added management notifications for success, error, warning and information.
Each message has a visible severity label and an accessible announcement role.
I later added countdown text and a shrinking timer bar to every notification.
Success closes after 1.5 seconds, error and danger after 2.5 seconds, warning
after 3 seconds, and info or debug after 4 seconds. Unknown levels use info's
4-second timer. Each notification has its own fixed deadline; hovering or
focusing it does not extend the timeout. Server messages remain readable when JavaScript is
unavailable. I added a welcome message after login and an error message when a
listing fails server validation.

I verified the timer deadlines, overlapping notifications, manual dismissal and
fallback countdown in nine JavaScript tests. The three Django message tests also
passed. I checked the countdown text and progress bars in the dashboard preview.

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
After the owner's visual review, I restored the centered landing-page layout
and extended the estate photograph across the whole hero. I added an even dark
overlay with white text and a pale CK pink highlight, replacing the side fade.
I checked both themes and the 390 px mobile layout in the browser.
I also ran the seven new tests on PythonAnywhere's Python 3.13 environment; all
passed. I collected the new static assets there and passed the Django system
check. I versioned the changed page scripts so returning browsers fetch this
update instead of reusing the previous illustration or notification code.
The earlier Sprint 2 acceptance record remains in [SPRINT2_STATUS.md](SPRINT2_STATUS.md).
[PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7) has since
been merged into main as `f9eb1a4`. Ethan owns deployment of the merged project
release to `ejvincent10`.

I applied the [Humanizer skill](https://github.com/blader/humanizer/blob/main/SKILL.md),
version 4.0.0, to this report and the update's commit and review notes. The
Humanizer plugin was not installed in this workspace, so I read its public skill
instructions directly. I used first-person reporting and kept claims tied to
checks I performed.
