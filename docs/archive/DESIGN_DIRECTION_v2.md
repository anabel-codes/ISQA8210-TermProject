# CK Real Estate: Design Direction v2

ISQA 8210 · Team 3 · Twumasi Adomako (frontend, interface design) · November 7, 2026

This replaces section 10 (Design system) and section 21 (Inspiration board) of `BLUEPRINT.md` v1.0. Everything else in the blueprint (scope, stories, data model, URLs, tests, deploy) stays the same.

**What stays:** the three brand colors. White `#FFFFFF`, CK Red `#75000E`, Black `#000000`.
**What changes:** typography, shape, depth, imagery, the hero, cards, the listing page, the admin area, and motion. The v1 look (square corners, no shadows, Playfair headings) read as a school project. v2 reads like the 2026 real estate sites below while staying on the same three colors.

---

## 1. What we studied

### 1.1 TikTok inspiration (team supplied)

| # | Link | What it shows | What we take | Board |
|---|---|---|---|---|
| T1 | [fraxBIT, "Real estate website design"](https://vt.tiktok.com/ZSpMKvrrt/) | Full-bleed building photo hero, big left-aligned headline ("Find your home in Aria."), pill CTA. Scrolling flies the camera into the building, then lands on an **isometric 3D cutaway of one apartment** with a side card (unit name, price, beds, baths, area, CTA) | Full-bleed photo hero with left headline. The **isometric cutaway + spec card** becomes our "Anatomy of this home" panel, built with the `/anatomy` skill as SVG | 02, 04 |
| T2 | [WebForge, "$5,000 real estate website… one photo + Claude Code"](https://vt.tiktok.com/ZSpMEho71/) | Cinematic villa hero ("VEYRA") driven by scroll: fly toward the house, into the interior, back out. Then an editorial light section: "We build homes where *island architecture* meets private investment income", with a 4-stat row | Scroll-scrubbed hero is out of scope for free hosting, but we take the **editorial headline with one accent phrase in red italic** and the **stat row** (homes sold, years in Omaha, neighborhoods, avg. days on market) | 02 |
| T3 | [Urkel, "Real Estate website… what do u think?"](https://vt.tiktok.com/ZSpMoeEVD/) | Light hero with a cut-out modern house and centred headline "Find the *place* you'll love to come *home* to." Dark "About the Realtor" with a tower photo. Dark featured carousel: rounded photo card + "The Aldridge, $3,150,000" + facts + "View listing". Listing page with amenities icon grid and a **sticky price card**. Long-form journal pages | Centred two-tone headline idea, **black featured band with a big rounded photo**, **amenities icon grid**, **sticky price + inquiry card** on the listing page | 02, 04, 05 |
| T4 | [UX Snacks, "Different Types of UI Design"](https://vt.tiktok.com/ZSpkYbHHr/) (photo carousel) | Catalogue of UI styles: Liquid Glass, Spatial UI, Claymorphism, Neumorphism, Glassmorphism | **Liquid glass**: frosted, translucent panels over photography. We use it in exactly three places (hero search bar, price chips on photos, mobile sticky bar). Clay and neumorphism are rejected: they fight the brand's sharp red and black | 02, 03, 11 |

### 1.2 ThemeForest templates (latest, real estate)

Picked from ThemeForest's real estate category sorted by newest, November 2026.

| # | Template | Type | What it does well | What we take |
|---|---|---|---|---|
| L1 | [Velux, Real Estate HTML Template](https://themeforest.net/item/velux-real-estate-html-template/65159143) ([demo](https://cheaphostings.org/html/velux)) | Landing | Editorial luxury. Cormorant Garamond display with an italic second line in the accent color ("Live a little *more beautifully.*"), full-bleed interior photo, a white **search card that overlaps the bottom of the hero** (Looking for · Location · Bedrooms · Budget · Show residences), split "Built around *belonging*" image and text, video band | The **overlapping search card**, the **italic accent line**, generous whitespace, uppercase eyebrow labels |
| L2 | [Nestrix, Real Estate HTML Template](https://themeforest.net/item/nestrix-real-estate-html-template/65041326) ([demo](https://unicoderbd.com/template/nestrix/)) | Landing + inner pages | "Luxury dark" home: black hero, white and gold headline, tabbed search (Buy / Rent). Dark listing cards with the **price set over the photo**. A listing page with **1 large photo + a grid of thumbs**, a **spec row with icons** (beds, baths, sq ft, garage, lot, year built), Overview / Features / Location tabs, and a **sticky agent card with the inquiry form** | Gallery layout (our 4 photos: 1 large + 3), the spec icon row, the sticky inquiry card, dark featured cards. Gold becomes CK Red |
| L3 | [Ofen, Real Estate React/Next.js & HTML](https://themeforest.net/item/ofen-real-estate-react-nextjs-template/65000731) ([demo](https://template-ofen.vercel.app/)) | Landing | A **local** brokerage ("homes across Greater Boston"), the closest match to CK in Omaha. Hero photo in a rounded frame with **floating glass chips** (address + price, "Open Sat 2 to 4"). Search card with large values (Where · Price up to · Beds). **Saved-search chips**. Filters as plain URL params (`/listings?type=condominium`, `?area=back-bay`), the same pattern our Django view uses. A neighborhoods section | Glass chips on photos, the big-value search card, removable filter chips, neighborhood cards for the Local Area page, URL-param filters |
| A1 | [Evohus, Django Real-Estate Admin & Dashboard](https://themeforest.net/item/evohus-django-realestate-admin-dashboard-template/63338156) ([demo](https://srbthemes.kcubeinfotech.com/evohus/django.html)) | Admin + login | Ships a **Django** edition and a **crimson** color variant, so it is the closest match to our stack and brand. Dark sidebar, welcome card, KPI cards, "Listings added per month" bars. Property list table with ID, title, location, type, price, area, soft status badge, date. Two-column Add Property (details left, image + facilities right). "Creative" sign-in: brand panel on the left, form card on the right | Dashboard shell, KPI row, soft status badges, two-column add form, split sign-in |
| A2 | [Lahomes, Real Estate Management Admin & Dashboard](https://themeforest.net/item/lahomes-ruby-on-rails-real-estate-management-admin-dashboard-template/65063542) ([demo](https://techzaa.in/lahomes/admin/index.html)) | Admin + login | Newest admin in the category. **KPI cards with trend deltas** ("+34.4% vs last month"). Listing table with a **photo thumbnail** next to the name, colored pill status, icon actions (view / edit / delete). Add Property with a **live preview card** of the listing on the left and a **drag-and-drop photo zone**. Centred sign-in card | Thumbnail in table rows, live preview card while adding a listing, drop-zone photo slots, KPI deltas on the report page |

We use these as inspiration only. We do not buy, copy or ship any template's code, images or icons.

---

## 2. Principles

1. **Photography leads.** Carlos's photos are the product. Every public screen opens with a photo or the featured home, not a graphic.
2. **Three colors, many tints.** White, CK Red and Black do all the work. Tints and transparent versions of them fill the gaps. No gold, no blue, no gradients between hues.
3. **Editorial, not corporate.** A serif display face with one italic red accent per headline, uppercase eyebrows, lots of air.
4. **Glass only on photos.** Frosted panels appear only where they sit on top of an image. Everywhere else, solid white or black.
5. **Local first.** Neighborhoods (Benson, Downtown, Happy Hollow, Rockbrook) are named everywhere, as Ofen does with Boston.
6. **The anatomy is the signature.** One isometric "anatomy" figure per page type (hero accent, listing page, 404, empty states), built with the `/anatomy` skill, gives CK something no template has.
7. **Same build constraints.** Django templates, one CSS file, a little plain JS, no build step, works at 390 px, WCAG AA.

---

## 3. Tokens

```css
:root {
  /* Brand (unchanged) */
  --ck-red: #75000E;
  --ck-black: #000000;
  --ck-white: #FFFFFF;

  /* Tints of the brand (new and changed) */
  --ck-red-ink: #5A000B;     /* pressed state, roof shadow */
  --ck-red-50: #FBF3F4;      /* red wash surfaces, selected rows */
  --ck-red-100: #F3DDE0;     /* chips, badges */
  --ck-ink-900: #0B0B0B;     /* dark sections (true black reads flat on big areas) */
  --ck-ink-700: #2A2A2A;     /* cards on dark */
  --ck-ink-500: #5C5C5C;     /* secondary text, 6.7:1 on white */
  --ck-ink-300: #BDBDBD;     /* borders on dark */
  --ck-ink-100: #EDEDED;     /* borders on light */
  --ck-paper: #F7F6F4;       /* page background behind white cards */

  /* Glass (only on photos) */
  --glass-light: rgba(255, 255, 255, .72);
  --glass-dark: rgba(0, 0, 0, .45);
  --glass-blur: saturate(160%) blur(14px);
  --glass-edge: 1px solid rgba(255, 255, 255, .45);

  /* Type */
  --font-display: "Instrument Serif", "Cormorant Garamond", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --fs-eyebrow: .75rem;   /* 12px, 600, +0.18em, uppercase */
  --fs-sm: .875rem; --fs-md: 1rem; --fs-lg: 1.125rem; --fs-xl: 1.5rem;
  --fs-2xl: 2.25rem; --fs-3xl: 3rem; --fs-hero: clamp(2.75rem, 6vw, 5.5rem);

  /* Shape and depth (new: v1 had none) */
  --radius-sm: 8px;      /* inputs, chips */
  --radius-md: 16px;     /* cards */
  --radius-lg: 28px;     /* hero frame, featured photo */
  --radius-pill: 999px;  /* buttons, glass chips */
  --shadow-1: 0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.06);
  --shadow-2: 0 12px 40px rgba(0,0,0,.14);

  /* Space */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px;
  --space-6: 32px; --space-7: 48px; --space-8: 72px; --space-9: 112px;
  --container: 1240px;
  --tap: 44px;
}
```

Contrast checks (AA): CK Red on white 12.6:1, white on CK Red 12.6:1, `--ck-ink-500` on white 6.7:1, white on `--ck-ink-900` 19.8:1. Text on glass always sits on `--glass-light` with black text or `--glass-dark` with white text, never directly on the photo.

**Fonts.** Instrument Serif (400 and italic) for display, Inter (400, 500, 600) for everything else. Both are on Google Fonts. Load with `display=swap`.

---

## 4. Components (v2)

| Component | v1 | v2 |
|---|---|---|
| Buttons | Square red block | **Pill**. Primary: red fill, white text. Secondary: black outline. On photos: white pill. Arrow icon after the label on primary CTAs ("Browse homes →") |
| Inputs | Square, 1.5px black border | 48px tall, `--radius-sm`, 1px `--ck-ink-100` border, red 2px focus ring, label above |
| Status chips | Square, uppercase | Pill. Available: white with black text + green-free dot (black dot). Pending: black. Sold: red. Featured: red with a small star. On photos they use glass |
| Listing card | Flat, 1px border | `--radius-md`, photo on top 4:3 with **glass price chip** bottom left and status chip top left, then address (serif), neighborhood · type, a **spec row** with icons (beds, baths, sq ft). Hover lifts 2px with `--shadow-2` |
| Header | White bar with underline | Transparent over the hero, white with blur after scrolling 40px. Logo left, links centre, "Call Carlos" pill right |
| Search | Filter panel only | **Search card** that overlaps the hero bottom (Velux, Ofen): Home type · Neighborhood · Price band · "Show homes". The same fields drive `/listings/?type=&hood=&band=` |
| Featured band | Black band | Black section with a **large rounded photo** left and serif name, price, 3 facts and "See this home" right (T3, Nestrix) |
| Stat row | none | 4 numbers in serif (T2): years in Omaha, homes sold, neighborhoods served, average days on market. Values come from Carlos, placeholders until then |
| Gallery | 1 large + 3 thumbs | Same 4 photos in a **bento grid**: 1 large (2×2) + 3 smaller, `--radius-lg` outer corners, "View all 4" opens a lightbox |
| Spec row | Text row | Icon + value + label for beds, baths, sq ft, garage, lot, year built (Nestrix) |
| Inquiry | Form in a column | **Sticky card** on desktop (price, status, Carlos's photo and name, the form). On phones it becomes a glass bottom bar "Ask about this home" that opens the form |
| Anatomy panel | Static exploded house | Interactive isometric cutaway (T1) made with the `/anatomy` skill: roof, upper floor, ground floor, foundation lift apart on hover, with a live readout of beds, baths, sq ft, year built from the listing |
| Footer | Black | Black, big serif "Let's find your place in Omaha." line, red CTA, then columns |
| Admin shell | Black sidebar, flat | Black sidebar with red active pill, white content on `--ck-paper`, KPI cards, soft badges (Evohus, Lahomes) |

**Icons.** One stroke set, 1.5px, 20px: [Lucide](https://lucide.dev) (ISC license), inlined as SVG. No emoji.

**Motion.** Sections fade and lift 16px on entering the viewport (IntersectionObserver, 400ms). The anatomy figure assembles once. All of it sits inside `@media (prefers-reduced-motion: no-preference)`.

---

## 5. Screen by screen

| Board | Screen | v2 layout |
|---|---|---|
| 01 | Brand sheet | Logo lockups, the 3 colors + tints, type scale, buttons, chips, card, input, glass sample, anatomy mark |
| 02 | Home | Glass header over a full-bleed featured-home photo. Left: eyebrow "Omaha, Nebraska", headline "Find the place you'll love to come *home* to." Right bottom: glass chip with the featured home's address and price. Overlapping search card. Stat row. "New on the market" 3 cards. Black featured band. Anatomy split ("Know a home before you visit"). Neighborhood tiles (4). Broker teaser. Footer |
| 03 | Browse | Sticky filter bar (type, neighborhood, price band, sort) with removable chips and result count, card grid 3 columns, empty state with the anatomy house and "Clear filters" |
| 04 | Listing | Breadcrumb, bento gallery, title + address + chips, spec row, tabs (Overview, Features, Neighborhood), Anatomy panel, sticky inquiry card with sent state |
| 05 | About Carlos | Large portrait in a rounded frame, serif name, bio, contact facts, stat row, black contact card form |
| 06 | Local area | Hero with neighborhood tiles, then categories (Schools, Parks, Dining, Services) as cards with external link icons |
| 07 | Admin log in | Split: left black panel with logo, a featured photo and "Welcome back."; right white card with username, password, show-password toggle, error state |
| 08 | Admin listings | Sidebar + topbar (signed-in name, log out). KPI row (Active, Pending, Sold this month, Hidden). Tabs Active / Hidden. Table with thumbnail, address, type, neighborhood, inline price, status select, featured star, Edit / Hide |
| 09 | Add listing | Two columns: form sections left (Home, Location, Details, Description), right a **live preview card** and **4 photo slots** with drag-and-drop, order numbers, alt text, "3 of 4 photos" error |
| 10 | Report + activity | Month picker, 3 bar charts (by type, neighborhood, band) with totals and deltas vs last month, CSV button; activity log table |
| 11 | Mobile | Home, browse, listing at 390 px with the glass sticky bar |

---

## 6. Rules carried over from v1

- Status is told apart by its word and fill, never color alone.
- Every input has a `<label>`; icon-only buttons have `aria-label`.
- Body text at least 16px. Touch targets at least 44px.
- Public copy goes through `content/copy.md` and `/humanizer`. Carlos's own words are never rewritten.
- The illustrations never stand in for a real house.

## 7. Rules that changed

| v1 rule | v2 rule | Why |
|---|---|---|
| No rounded corners | Radius scale 8 / 16 / 28 / pill | Every current template and all four TikToks use soft shapes; square read as dated |
| No drop shadows | Two soft shadows, used for lift only | Cards over `--ck-paper` need separation without heavy borders |
| No gradients | Still no color gradients. A black-to-transparent scrim over hero photos is allowed so white text stays readable | Readability on photos |
| Playfair Display | Instrument Serif with italic accents | Lighter, more current editorial feel (Velux, Nestrix) |
| Body 16px, Inter | Unchanged | |
