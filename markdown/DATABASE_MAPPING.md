# Cole's data model and the Django database

Cole's `CKRealEstateDatabase.sql` was merged from `origin/cole-development`
(commit `4918b94`, containing the model merged to main in `4bd154d`).
It is the team's standalone SQLite schema reference. Preserve that file as supplied.

The running app uses Django migrations to create its database. **Do not execute the
reference SQL against the Django database.** It creates tables with the same names
and different physical columns, and replaces Django's authentication design.
An empty database is initialized with `python manage.py migrate`, followed by
`python manage.py seed_lookups`.

| Reference table | Runtime model / table | Integration |
| --- | --- | --- |
| ADMINISTRATOR_ACCOUNT | Django User / auth_user | Django owns password hashing, sessions, permissions and active accounts. Carlos and Janet belong to the Administrators group. Team superusers also have access. |
| PROPERTY_TYPE | listings.PropertyType / PROPERTY_TYPE | Five required home types; protected listing references. |
| NEIGHBORHOOD | listings.Neighborhood / NEIGHBORHOOD | Four Omaha neighborhoods; protected listing references. |
| LISTING_STATUS | listings.ListingStatus / LISTING_STATUS | Available, Pending, Sold; new listings are forced to Available. |
| PRICE_RANGE | listings.PriceRange / PRICE_RANGE | Twenty $50,000 bands, lower inclusive and upper exclusive. |
| LISTING | listings.Listing / LISTING | Owner and modifier reference auth_user. Features and optional map coordinates are blueprint v2 additions. |
| LISTING_PHOTO | listings.ListingPhoto / LISTING_PHOTO | Slots 1–4, unique per listing; photo upload is US-04 stretch scope. |
| SEARCH_LOG | reports.SearchLog / SEARCH_LOG | Model exists; search-report workflows are later sprint scope. |
| AUDIT_LOG | reports.AuditLog / AUDIT_LOG | Login, logout and new-listing events record user and timestamp. |
| LOCAL_AREA_CATEGORY | localarea.LocalAreaCategory / LOCAL_AREA_CATEGORY | Later sprint content model. |
| LOCAL_AREA_ENTRY | localarea.LocalAreaEntry / LOCAL_AREA_ENTRY | Editor references auth_user; later sprint workflow. |
| SITE_PROFILE | siteprofile.SiteProfile / SITE_PROFILE | Editor references auth_user; later sprint workflow. |

Cole uses prefixed names such as `Listing_ID` and `Listing_Property_Type_ID`.
Django uses `id` and `property_type_id`. These are deliberate ORM mappings of the
same concepts, not an interchangeable physical schema. Django also creates its
own migration, session, permission and admin tables. The runtime permits a blank
lot size/year built and a missing price band above the $1 million lookup ceiling,
as specified in the blueprint; the reference SQL requires those values.

## Data and verification

- `seed_lookups` is repeatable: 5 types, 4 neighborhoods, 3 statuses, 20 price bands.
- `create_admins` provisions Carlos and Janet from private local input; credentials
  and databases are excluded from Git. Do not retain the example `change-me` passwords.
- `seed_demo` is for local development only. Do not load its fictional homes into
  the live site. Create authorized listings through the management form.
- Login and logout audit entries and listing ownership are verified by automated tests.
- Listing creation and its audit record commit in one transaction.
- New feature columns or renamed database columns require coordination with Cole
  before generating a migration. This integration does not introduce migrations.
