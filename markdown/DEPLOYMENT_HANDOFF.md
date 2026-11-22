# Sprint 2 testing completion and deployment handoff

November 21, 2026

I completed testing of the integrated CK Real Estate project on my PythonAnywhere
account, `gigson2`, and confirmed that the project worked. I used that account
as a testing environment. I have handed the implementation and deployment
instructions to Ethan Vincent, who is responsible for deploying the project to
the team's PythonAnywhere account, `ejvincent10`.

| Environment | Account | Status / owner |
| --- | --- | --- |
| Testing | gigson2 | Testing completed and confirmed by Twumasi Adomako |
| Project deployment | ejvincent10 | Public home/login verified November 22; Ethan owns the release record and protected workflow verification |

The tested application commit is `f126e06` on `twumasi-development`.
[PR #7](https://github.com/anabel-codes/ISQA8210-TermProject/pull/7) has been merged
into `main` as `f9eb1a4`, which includes the tested application commit. Ethan can
deploy that merged release. The project URL is
`https://ejvincent10.pythonanywhere.com/`. On November 22, 2026, I verified that
its public home and login pages returned HTTP 200 and served CK Real Estate.
I have not established the deployed commit or tested authenticated writes on
that account. Those release checks remain with Ethan.

## Work included in the handoff

I integrated the Django application, frontend and management workflows with
Cole Beiermann's database model. I completed the login, logout and add-listing
workflows, validation and access checks, along with the day/night photography,
confirmation dialogs and timed dashboard notifications. I prepared the setup
scripts and deployment guide so Ethan can configure the project account.

The recorded checks include 62 Django tests and nine JavaScript timer tests.
The original 55 Django tests passed on PythonAnywhere Python 3.13, as did the
seven later message and photography tests. Subsequent changes were checked
with the relevant tests and browser verification. Detailed outcomes are in
[SPRINT2_STATUS.md](SPRINT2_STATUS.md) and
[PHOTO_AND_FEEDBACK_REPORT.md](PHOTO_AND_FEEDBACK_REPORT.md).

I kept screenshots and QA files local in the ignored `docs/sprint2/` folder.
Passwords, server configuration, sessions and the test database are not included
in the Git handoff. Ethan will create the project account's configuration and
administrator credentials privately.

## Team responsibilities

I have kept contribution credit tied to the repository and blueprint. The roles
below describe how the team divides the work; they do not replace individual
contribution records or peer evaluations.

| Team member | Contribution or responsibility |
| --- | --- |
| Twumasi Adomako | Frontend design and implementation, application integration, testing on gigson2 and deployment preparation |
| Cole Beiermann | Data model and SQL reference integrated into the Django database mapping |
| Ethan Vincent | Deployment and verification on ejvincent10; final sprint Scrum Master |
| Anabel Diaz | Initial repository documentation, user stories and backlog; Sprint 1 Scrum Master |
| Gage Heithold | Repository integration and team coordination; Scrum Master |
| Jake Madison | Earlier application and deployment exploration in the repository history; Sprint 3 Scrum Master |

## Ethan's next steps

1. Use the merged release on `main` and note the exact commit being deployed.
2. Follow [PYTHONANYWHERE.md](PYTHONANYWHERE.md) in the `ejvincent10` account.
   The preparation script and WSGI template already detect the account's home
   directory, so the test account's paths do not need to be copied.
3. Create private project settings and administrator credentials, run migrations,
   seed lookup data, collect static assets and reload the project app.
4. Repeat the login, logout, add-listing, theme and notification checks on the
   project account. Record the deployed commit, URL and results in the status
   document once that verification is complete.

I have recorded the handoff and public-site check in the repository. Ethan's
deployed commit record and protected workflow verification remain outstanding.
