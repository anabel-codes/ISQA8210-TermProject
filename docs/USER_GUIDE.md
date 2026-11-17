# User guide

## Browse and discover

Open the homepage to see featured published properties. Every seeded card is labeled “Sample listing.” These records are fictional, and the photographs illustrate styles rather than actual addresses.

Use the hero search to enter a city, address, title keyword, or ZIP code and choose a property type. On `/properties`, refine minimum/maximum price, minimum bedrooms/bathrooms, property type, status, interior square feet, and featured selection. Choose a sort order and select **Apply filters**. The URL keeps your selections, so it can be bookmarked or shared. Previous/Next links preserve the filters. Reversed ranges are normalized; **Clear filters** starts over.

Open a card to see the gallery, available facts, description, amenities and related properties. Select gallery thumbnails with mouse or keyboard. Unknown facts are displayed as unavailable rather than invented. Unpublished or deleted property URLs show the unavailable-page state.

## Send an inquiry

Use `/contact` for a general question or the form on a property page for a listing-specific question. Enter a name, valid email and a message of at least ten characters. Phone is optional. Submit once and wait for the success status. Errors preserve your message so it can be corrected or retried. Inquiries persist even though no email provider is configured.

This is an academic demonstration. Do not submit real sensitive personal/financial information. Contact details are available only in the administrator environment. There is no promised response time or email delivery.

## Administrator access

The project owner creates an account using the environment-based initialization command in README. Sign in at `/login`. Public visitors cannot open the dashboard. Sessions last eight hours; sign out using the administration sidebar. Account deactivation/password resets revoke sessions on the next protected request.

### Overview

`/admin` displays stored inventory totals, sale status counts, featured count, new inquiries, recent conversations, and observed views/searches. Inventory totals include drafts and samples. Activity metrics cover recorded events rather than fabricated sample performance.

### Listings

1. Open **Listings** to search/filter all records, including drafts.
2. Choose **Add listing**, enter address, price, type, status and a description.
3. Add optional facts only when known; empty fields remain unavailable.
4. Enter features one per line.
5. Upload JPEG/PNG/WebP photographs under 4 MB, then enter descriptive alt text.
6. Use **Move up/down** to reorder, **Set primary** for the card image, and **Remove photograph** to detach an image.
7. Choose **Demonstration sample** for fictional content. Leave **Published publicly** off to save a draft. Publication requires a photograph.
8. Select **Featured on homepage** to include a published listing in the homepage's three newest featured records.
9. Save and verify the public view when published. Editing status does not automatically unpublish a listing.
10. **Delete listing** requires confirmation. This permanently removes the record and its attached metadata; inquiries survive without a listing link. Disk photographs are retained until operational cleanup.

### Inquiries

Search by visitor name/email, filter status, and sort by date. Read the associated property, message and private contact details. Set status to New, Contacted or Resolved; add internal notes and select **Save inquiry**. These controls do not send email. Use an approved communication method if responding outside the demonstration.

### Analytics

Review views, submitted searches, featured interactions and inquiry submissions for the past 30 days. Popular locations/keywords, common filters, most viewed listings and inquiry dates appear when observations exist. Browser-session deduplication is approximate; these are event counts, not unique visitor counts. Test observations are excluded during normal operation.

### Site settings

Edit verified name, business display name, optional contact email/phone, homepage headline/introduction, and biography. Leave unknown contact fields empty. Refresh a public page after saving. The theme and CK monogram are source-controlled rather than a separate branding editor.

### Users

All listed accounts are administrators. Add an account with a unique email and a password of at least twelve characters. Activate/deactivate colleagues with confirmation. You cannot deactivate yourself. Reset an account's password using the form; existing sessions are revoked. Resetting your own password requires signing in again. There is no public registration or self-service recovery.
