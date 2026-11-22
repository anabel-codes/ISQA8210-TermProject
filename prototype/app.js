/* CK Real Estate: shared script for every page.
   Each page sets data-page on <main>; init() renders the shared header and footer, then runs that page's setup. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const MAIN = $('main[data-page]');
const PAGE = MAIN ? MAIN.dataset.page : 'home';
const store = {
  get(k, d){ try{ const v = JSON.parse(localStorage.getItem(k) || 'null'); return v ?? d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
/* light is the default; dark only after the visitor chooses it */
if (store.get('ck-mode', 'light') === 'dark') root.dataset.mode = 'dark';

/* ================= icons (24px grid, 1.8 stroke) ================= */
const IC = {
  arrow:'M5 12h14M13 6l6 6-6 6', arrowUR:'M7 17 17 7M8 7h9v9', chevR:'m9 18 6-6-6-6',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  pin:'M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  sliders:'M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4',
  bed:'M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 17h20M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M12 4v6',
  bath:'M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M10 5 8 7M2 12h20M7 19v2M17 19v2',
  area:'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3M8 12h8M12 8v8',
  heart:'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3C14.7 3 13.5 3.5 12 5c-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
  close:'M18 6 6 18M6 6l12 12', chev:'m6 9 6 6 6-6', up:'M12 19V5M5 12l7-7 7 7',
  check:'M20 6 9 17l-5-5', plus:'M12 5v14M5 12h14', minus:'M5 12h14',
  sun:'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4',
  moon:'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 16l2 2 4-4',
  shield:'M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  user:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  star:'M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.7a2 2 0 0 0-.6 1.8l.9 5.2a.5.5 0 0 1-.8.6l-4.6-2.5a2 2 0 0 0-1.9 0l-4.6 2.5a.5.5 0 0 1-.8-.6l.9-5.2a2 2 0 0 0-.6-1.8L1.7 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.5-1.1z',
  home:'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  building:'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
  briefcase:'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  tag:'M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4zM7.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z',
  key:'m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4M21 2l-9.6 9.6M7.5 21a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z',
  map:'M14.1 5.1a2 2 0 0 0 1.8 0l3.7-1.9A1 1 0 0 1 21 4.1v12.3a1 1 0 0 1-.6.9l-4.5 2.2a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.7 1.9A1 1 0 0 1 3 18.4V6.1a1 1 0 0 1 .6-.9l4.5-2.2a2 2 0 0 1 1.8 0zM15 5.8v15M9 3.2v15',
  mail:'M22 7 13 12.7a2 2 0 0 1-2 0L2 7M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  send:'M14.5 21.7a.5.5 0 0 0 .9 0L22 2.6a.5.5 0 0 0-.6-.6L2.3 8.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13',
  pen:'M12 20h9M16.4 3.6a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z',
  book:'M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  compass:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.2 7.8l-2.1 6.4-6.4 2.1 2.1-6.4z',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff:'M10.7 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.5M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20',
  lock:'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  login:'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  copy:'M8 8h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2zM4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2',
  share:'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  garage:'M22 8.4V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.4a2 2 0 0 1 1.2-1.8l8-3.5a2 2 0 0 1 1.6 0l8 3.5A2 2 0 0 1 22 8.4zM6 22V12h12v10M6 16h12',
  hammer:'m15 12-8.4 8.4a2.1 2.1 0 0 1-3-3L12 9M17.6 15 22 10.6M20.9 11.7l-1.3-1.3a2 2 0 0 1-.6-1.4V7.9a1 1 0 0 0-.3-.7l-2.6-2.6A6 6 0 0 0 11.9 3H9l.9.8a6.2 6.2 0 0 1 2.1 4.6V10l2 2h1.2a2 2 0 0 1 1.4.6l1.3 1.3',
  layers:'m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',
  image:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 15l-3.1-3.1a2 2 0 0 0-2.8 0L6 21',
  video:'m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.8a.5.5 0 0 0-.8-.4L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  walk:'M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM10 22l2-6 3 3v3M7 12l3-4 4 1 2 4 3 1M10 8l-1 6',
  school:'M22 10 12 5 2 10l10 5zM6 12v5c3 3 9 3 12 0v-5',
  clinic:'M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z',
  cart:'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2 2h2.5l2.7 12.4a2 2 0 0 0 2 1.6h9.4a2 2 0 0 0 2-1.6L22 7H5.1',
  train:'M8 3h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h.01M16 15h.01',
  tree:'M12 22v-5M9 9a3 3 0 1 1 6 0 3 3 0 0 1 3 3 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3 3 3 0 0 1 3-3z',
  target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  award:'M15.5 12.9 17 22l-5-3-5 3 1.5-9.1M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
  globe:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z',
  calc:'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01',
  chat:'M7.9 20A9 9 0 1 0 4 16.1L2 22z',
  doc:'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8',
  wifi:'M12 20h.01M2 8.8a15 15 0 0 1 20 0M5 12.9a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0',
  quote:'M3 21c3 0 7-1 7-8V5H3v8h4'
};
const ico = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n] || IC.info}"/></svg>`;
const paintIcons = (scope = document) => $$('i[data-ic]', scope).forEach(e => { e.outerHTML = ico(e.dataset.ic, e.className); });

/* ================= data ================= */
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* neighborhood centers, same as the admin side, so each sample home gets a pin near its area */
const HOOD_LL = {'Benson':[41.2853, -96.0031], 'Downtown':[41.2587, -95.9378], 'Happy Hollow':[41.2664, -95.9887], 'Rockbrook':[41.2386, -96.0752]};
const FEAT_BY_TYPE = {
  Ranch:['Single-level living','Attached garage','Finished basement','Fenced backyard','Central air','Laundry on the main floor'],
  Tudor:['Original woodwork','Fireplace','Detached garage','Mature trees','Central air','Full basement'],
  'Split-Entry':['Two living levels','Lower-level family room','Attached garage','Fenced backyard','Central air','Walkout or daylight windows'],
  Townhome:['Attached garage','Private patio','Central air','Laundry room','Low-maintenance yard','Walk to shops'],
  Condominium:['Elevator','Secure entry','Assigned parking','Central air','In-unit laundry','Walk to restaurants']
};
const DATA = [
  {id:1, type:'Tudor', status:'Available', featured:true, street:'4812 Underwood Avenue', hood:'Happy Hollow', zip:'68132', price:425000, beds:4, baths:2.5, sqft:2640},
  {id:2, type:'Ranch', status:'Available', street:'6107 Maple Street', hood:'Benson', zip:'68104', price:289000, beds:3, baths:2, sqft:1450},
  {id:3, type:'Condominium', status:'Available', street:'1450 Jones Street, Unit 4', hood:'Downtown', zip:'68102', price:315000, beds:2, baths:2, sqft:1180},
  {id:4, type:'Townhome', status:'Pending', street:'10230 Rockbrook Road', hood:'Rockbrook', zip:'68124', price:368000, beds:3, baths:2.5, sqft:1820},
  {id:5, type:'Tudor', status:'Available', street:'5021 Izard Street', hood:'Happy Hollow', zip:'68132', price:409500, beds:3, baths:2, sqft:2100},
  {id:6, type:'Ranch', status:'Available', street:'2416 South 108th Street', hood:'Rockbrook', zip:'68144', price:334000, beds:3, baths:2, sqft:1640},
  {id:7, type:'Condominium', status:'Available', street:'1101 Harney Street, Unit 7B', hood:'Downtown', zip:'68102', price:259000, beds:1, baths:1, sqft:860},
  {id:8, type:'Townhome', status:'Available', street:'6320 Binney Street', hood:'Benson', zip:'68104', price:274900, beds:2, baths:1.5, sqft:1300},
  {id:9, type:'Ranch', status:'Pending', street:'118 North 52nd Street', hood:'Happy Hollow', zip:'68132', price:438000, beds:4, baths:3, sqft:2380},
  {id:10, type:'Tudor', status:'Available', street:'5914 Military Avenue', hood:'Benson', zip:'68104', price:352000, beds:4, baths:2, sqft:2050},
  {id:11, type:'Split-Entry', status:'Available', street:'11815 Poppleton Avenue', hood:'Rockbrook', zip:'68144', price:298500, beds:4, baths:2, sqft:1960}
].map(p => {
  const seed = p.id * 977 + 13;
  const built = 1922 + (seed % 80);
  /* kind picks the illustration and floor plan: houses use the house drawing, condos use the building */
  const kind = p.type === 'Condominium' ? 'Apartment' : 'Villa';
  /* the general features Carlos enters with the listing (sample: five of the type's six) */
  const features = FEAT_BY_TYPE[p.type].filter((_, i) => i !== seed % FEAT_BY_TYPE[p.type].length);
  const c = HOOD_LL[p.hood], j = k => (((seed * k) % 1000) / 1000 - .5) * .012;
  return {...p, features, lat: +(c[0] + j(7)).toFixed(6), lng: +(c[1] + j(13)).toFixed(6), mode:'sale', kind, seed, name: p.street, city: p.hood, addr: `${p.street}, ${p.hood}, Omaha, NE ${p.zip}`,
    slug: slugify(p.street), built, remodel: Math.min(2025, built + 20 + (seed % 30)),
    garage: p.type === 'Condominium' ? 1 : 2,
    floors: p.type === 'Tudor' || p.type === 'Townhome' || p.type === 'Split-Entry' ? 2 : 1,
    listed: new Date(2026, (seed % 10), 1 + (seed % 27)),
    specs: [`${p.beds} ${p.beds === 1 ? 'bed' : 'beds'}`, `${p.baths} ${p.baths === 1 ? 'bath' : 'baths'}`, `${p.sqft.toLocaleString('en-US')} sqft`]};
}).sort((a, b) => (b.featured === true) - (a.featured === true));
const FEATURED = DATA.find(p => p.featured) || DATA[0];
const CITIES = ['Benson', 'Downtown', 'Happy Hollow', 'Rockbrook'];
const CITY_INFO = {
  'Benson':{sub:'North-central Omaha'},
  'Downtown':{sub:'Central Omaha'},
  'Happy Hollow':{sub:'Midtown Omaha'},
  'Rockbrook':{sub:'West Omaha'}
};
const TYPE_IC = {Ranch:'home', Tudor:'home', 'Split-Entry':'layers', Townhome:'building', Condominium:'building', Villa:'home', Apartment:'building', Office:'briefcase', all:'grid'};
const TYPES = ['Ranch', 'Tudor', 'Split-Entry', 'Townhome', 'Condominium'];
const DESC = {
  Ranch:p=>[`${p.name} is a ${p.beds}-bedroom ranch in ${p.hood}. Everything sits on one floor: the living room faces the street, the kitchen opens to the dining area, and the bedrooms are down a short hall at the back.`,`The house was built in ${p.built} and updated in ${p.remodel}. There is a ${p.garage}-car garage and a backyard with room for a garden.`,`[Carlos adds his own notes here: what he noticed on his visit, and anything a buyer should ask about.]`],
  Tudor:p=>[`${p.name} is a ${p.beds}-bedroom Tudor in ${p.hood}, with the steep roofline and arched front door the style is known for. The main floor has the living room, dining room and kitchen. The bedrooms are upstairs.`,`It was built in ${p.built} and updated in ${p.remodel}. The garage holds ${p.garage} cars, and the lot has mature trees on the street side.`,`[Carlos adds his own notes here: what he noticed on his visit, and anything a buyer should ask about.]`],
  'Split-Entry':p=>[`${p.name} is a ${p.beds}-bedroom split-entry in ${p.hood}. You come in at a landing with short stairs going up and down. The kitchen, living room and most bedrooms are on the upper level, and the lower level has a family room and another bedroom.`,`It was built in ${p.built} and updated in ${p.remodel}. The garage holds ${p.garage} cars.`,`[Carlos adds his own notes here: what he noticed on his visit, and anything a buyer should ask about.]`],
  Townhome:p=>[`${p.name} is a ${p.beds}-bedroom townhome in ${p.hood} on two floors. The kitchen, living area and a half bath are on the ground floor, and the bedrooms are upstairs.`,`The building was completed in ${p.built} and updated in ${p.remodel}. It comes with an attached garage and a small private patio.`,`[Carlos adds his own notes here, including HOA dues and what they cover.]`],
  Condominium:p=>[`${p.name} is a ${p.beds}-bedroom condo of ${p.sqft.toLocaleString('en-US')} sqft in ${p.hood}. The living room and kitchen share one open space, and the unit has its own laundry.`,`The building dates from ${p.built} and was updated in ${p.remodel}. It has secure entry, an elevator and one assigned parking space.`,`[Carlos adds his own notes here, including HOA dues and building rules.]`]
};
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const priceLabel = p => p.mode === 'rent' ? money(p.price) + ' a month' : money(p.price);
const byId = id => DATA.find(p => p.id === +id);
const bySlug = s => DATA.find(p => p.slug === s);
const propUrl = p => `property.html#${p.slug}`;
const BAND = 50000; /* price ranges run in $50,000 steps from $0 to $1,000,000 */
const bandLabel = v => `${money(v)} to ${money(v + BAND)}`;
const OPT = {
  hood:[{v:'all',l:'Any area',ic:'map'}, ...CITIES.map(c => ({v:c, l:c, ic:'pin'}))],
  type:[{v:'all',l:'Any type',ic:'grid'}, ...TYPES.map(t => ({v:t, l:t, ic:TYPE_IC[t]}))],
  band:[{v:'0',l:'Any price',ic:'tag'}, ...Array.from({length:20}, (_, i) => i * BAND).map(v => ({v:String(v || 1), l: v ? bandLabel(v) : `Under ${money(BAND)}`, ic:'tag'}))],
  topic:[{v:'Buying a home',l:'Buying a home',ic:'tag'},{v:'Selling a home',l:'Selling a home',ic:'home'},{v:'A specific listing',l:'A specific listing',ic:'doc'},{v:'Something else',l:'Something else',ic:'info'}],
  ltype:TYPES.map(t => ({v:t, l:t, ic:TYPE_IC[t]})),
  time:['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t => ({v:t, l:t, ic:'clock'})),
  term:[{v:'15',l:'15 years'},{v:'20',l:'20 years'},{v:'25',l:'25 years'},{v:'30',l:'30 years'}],
  role:[{v:'Administrator',l:'Administrator',ic:'user'}],
  country:[{v:'United States',l:'United States',ic:'globe'}]
};
OPT.city = CITIES.map(c => ({v:c, l:c, ic:'pin'}));

/* ================= small helpers ================= */
function toast(msg, ic = 'check'){
  let box = $('.toasts');
  if (!box){ box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('aria-live','polite'); document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ico(ic) + `<span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2600);
}
async function copyText(text, label){
  try { await navigator.clipboard.writeText(text); toast(`${label} copied`, 'copy'); }
  catch(e){ toast('Copy is blocked here. Select the text and copy it manually.', 'info'); }
}
const goTo = sel => { const el = typeof sel === 'string' ? $(sel) : sel; if (el) el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'}); };
function splitWords(el){
  let i = 0;
  (function walk(n){
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3){
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'wd';
          const inner = document.createElement('span'); inner.textContent = t; inner.style.setProperty('--wi', i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
  })(el);
}
/* buttons: the hover fill grows from the pointer position */
document.addEventListener('pointerover', e => {
  const b = e.target.closest('.btn'); if (!b) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
  b.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
});

/* ================= custom select ================= */
const SEL = {};
let openSel = null, uid = 0;
function makeSelect(el, opts){
  const id = el.id || ('cs' + (++uid));
  const st = {opts: opts || [], value: el.dataset.value ?? '', onChange: null};
  const inLabel = !!el.closest('label');
  const label = el.dataset.label || (inLabel ? (el.closest('label').querySelector('.lab-top') || el.closest('label').firstChild).textContent.trim() : '');
  el.innerHTML = `<button type="button" class="cs-btn" aria-haspopup="listbox" aria-expanded="false">${inLabel ? '' : `<span class="sr">${label}: </span>`}<span class="cs-ic"></span><span class="cs-v"></span>${ico('chev','cs-chev')}</button>${el.dataset.name ? `<input type="hidden" name="${el.dataset.name}">` : ''}`;
  const btn = $('.cs-btn', el), vEl = $('.cs-v', el), icEl = $('.cs-ic', el), hid = $('input', el);
  const paint = () => {
    const o = st.opts.find(o => o.v === st.value);
    vEl.textContent = o ? o.l : (el.dataset.placeholder || 'Choose one');
    vEl.classList.toggle('ph', !o);
    icEl.innerHTML = o && o.ic ? ico(o.ic) : ''; icEl.hidden = !(o && o.ic);
    if (hid) hid.value = st.value;
  };
  let pop = null, scrim = null, act = 0, sheet = false, offs = [];
  const setAct = i => {
    act = (i + st.opts.length) % st.opts.length;
    const all = $$('.cs-opt', pop); all.forEach((o, k) => o.classList.toggle('act', k === act));
    pop.setAttribute('aria-activedescendant', all[act].id); all[act].scrollIntoView({block:'nearest'});
  };
  const place = () => {
    if (sheet) return;
    const r = btn.getBoundingClientRect();
    pop.style.minWidth = Math.max(r.width, 200) + 'px';
    const ph = pop.offsetHeight, pw = pop.offsetWidth;
    const below = innerHeight - r.bottom, up = below < ph + 16 && r.top > below;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pw - 8)) + 'px';
    pop.style.top = (up ? r.top - ph - 6 : r.bottom + 6) + 'px';
    pop.classList.toggle('up', up);
  };
  const close = focus => {
    if (!pop) return;
    const p = pop, s = scrim;
    p.classList.remove('open'); if (s) s.classList.remove('open');
    setTimeout(() => { p.remove(); if (s) s.remove(); }, reduce ? 0 : 320);
    btn.setAttribute('aria-expanded', 'false');
    offs.forEach(f => f()); offs = []; pop = scrim = null; openSel = null;
    if (focus) btn.focus({preventScroll:true});
  };
  const choose = i => {
    const o = st.opts[i]; if (!o) return;
    const changed = o.v !== st.value;
    st.value = o.v; paint(); close(true); clearErr(el);
    if (changed && st.onChange) st.onChange(st.value);
  };
  const open = () => {
    if (pop) return;
    if (openSel) openSel.close(false);
    sheet = matchMedia('(max-width:560px)').matches;
    const host = btn.closest('dialog') || document.body;
    if (sheet){ scrim = document.createElement('div'); scrim.className = 'cs-scrim'; scrim.addEventListener('click', () => close(true)); host.appendChild(scrim); }
    pop = document.createElement('div');
    pop.className = 'cs-pop' + (sheet ? ' sheet' : '');
    pop.setAttribute('role','listbox'); pop.tabIndex = -1; pop.setAttribute('aria-label', label || 'Options');
    pop.innerHTML = `<div class="sh-title">${label}</div>` + st.opts.map((o, i) => `<div class="cs-opt" role="option" id="${id}-o${i}" aria-selected="${o.v === st.value}" data-i="${i}">${o.ic ? `<span class="oi">${ico(o.ic)}</span>` : ''}<span>${o.l}</span>${ico('check','ok')}</div>`).join('');
    host.appendChild(pop); place();
    btn.setAttribute('aria-expanded','true');
    setAct(Math.max(0, st.opts.findIndex(o => o.v === st.value)));
    requestAnimationFrame(() => { pop && pop.classList.add('open'); scrim && scrim.classList.add('open'); });
    pop.focus({preventScroll:true});
    pop.addEventListener('click', e => { const o = e.target.closest('.cs-opt'); if (o) choose(+o.dataset.i); });
    pop.addEventListener('pointermove', e => { const o = e.target.closest('.cs-opt'); if (o && +o.dataset.i !== act) setAct(+o.dataset.i); });
    pop.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowDown'){ e.preventDefault(); setAct(act + 1); }
      else if (k === 'ArrowUp'){ e.preventDefault(); setAct(act - 1); }
      else if (k === 'Home'){ e.preventDefault(); setAct(0); }
      else if (k === 'End'){ e.preventDefault(); setAct(st.opts.length - 1); }
      else if (k === 'Enter' || k === ' '){ e.preventDefault(); choose(act); }
      else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); }
      else if (k === 'Tab'){ close(false); }
      else if (k.length === 1){ const i = st.opts.findIndex(o => o.l.toLowerCase().startsWith(k.toLowerCase())); if (i > -1) setAct(i); }
    });
    const outside = e => { if (pop && !pop.contains(e.target) && !btn.contains(e.target)) close(false); };
    const onScroll = e => { if (!sheet && pop && !pop.contains(e.target)) close(false); };
    const onResize = () => close(false);
    document.addEventListener('pointerdown', outside, true);
    addEventListener('scroll', onScroll, true); addEventListener('resize', onResize);
    offs = [() => document.removeEventListener('pointerdown', outside, true), () => removeEventListener('scroll', onScroll, true), () => removeEventListener('resize', onResize)];
    openSel = {close};
  };
  btn.addEventListener('click', () => pop ? close(true) : open());
  btn.addEventListener('keydown', e => { if (['ArrowDown','ArrowUp'].includes(e.key)){ e.preventDefault(); open(); } });
  paint();
  const api = {
    el, close,
    get value(){ return st.value; },
    set value(v){ st.value = String(v); paint(); },
    setOptions(o, v){ st.opts = o; st.value = v ?? (o[0] ? o[0].v : ''); paint(); },
    set onChange(f){ st.onChange = f; }
  };
  SEL[id] = api;
  return api;
}

/* ================= form helpers ================= */
function showErr(field, msg){
  field.classList.add('bad', 'invalid');
  const host = field.matches('.check') ? field.parentElement : (field.closest('label, .lab') || field.parentElement);
  let e = host.querySelector(':scope > .f-err');
  if (!e){ e = document.createElement('small'); e.className = 'f-err'; host.appendChild(e); }
  e.innerHTML = ico('info') + msg;
}
function clearErr(field){
  field.classList.remove('bad', 'invalid');
  const host = field.matches('.check') ? field.parentElement : (field.closest('label, .lab') || field.parentElement);
  const e = host && host.querySelector(':scope > .f-err'); if (e) e.remove();
}
function validate(form){
  let first = null;
  $$('input:not([type="hidden"]), textarea', form).forEach(i => {
    if (i.type === 'checkbox'){
      if (i.required && !i.checked){ const l = i.closest('.check'); l.classList.add('bad'); first = first || i; showErr(l, 'Tick this box to continue.'); }
      return;
    }
    if (!i.checkValidity()){
      first = first || i;
      const msg = i.validity.valueMissing ? 'This field is required.' : i.validity.typeMismatch && i.type === 'email' ? 'Enter an email address like name@example.com.' : i.validity.tooShort ? `Use at least ${i.minLength} characters.` : i.validity.rangeUnderflow ? `Enter ${i.min} or more.` : i.validationMessage;
      showErr(i, msg);
    } else if (!i.dataset.customErr) clearErr(i);
  });
  $$('.cs[data-required]', form).forEach(c => { if (!SEL[c.id].value){ first = first || $('.cs-btn', c); showErr(c, 'Choose an option to continue.'); } });
  $$('[data-custom-err="1"]', form).forEach(i => { first = first || i; });
  if (first){ first.focus(); return false; }
  return true;
}
document.addEventListener('input', e => { const i = e.target; if (i.matches && i.matches('input, textarea') && i.classList.contains('bad') && i.checkValidity() && !i.dataset.customErr) clearErr(i); });
document.addEventListener('change', e => { const i = e.target; if (i.type === 'checkbox' && i.checked){ const l = i.closest('.check'); if (l) clearErr(l); } });
/* Connect these forms to your backend here. In this demo they validate input and show a confirmation on the page only. */
function bindForm(form, done, delay = 700){
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(form)) return;
    const btn = $('button[type="submit"]', form);
    const fd = Object.fromEntries(new FormData(form).entries());
    if (btn) btn.classList.add('loading');
    setTimeout(() => { form.innerHTML = done(fd); paintIcons(form); }, reduce ? 0 : delay);
  });
}
const successHTML = (title, text, extra = '') => `<div class="done"><div class="ok">${ico('check')}</div><h3>${title}</h3><p>${text}</p>${extra}</div>`;
const firstName = n => (n || '').trim().split(/\s+/)[0] || 'there';

/* ================= illustrations ================= */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const st = (v, o) => `style="stop-color:var(${v})${o !== undefined ? ';stop-opacity:' + o : ''}"`;
const R = (x,y,w,h,c,ex='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}" ${ex}/>`;
const P = (pts,c,ex='') => `<polygon points="${pts}" class="${c}" ${ex}/>`;
function artDefs(g){
  return `<defs><linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${st('--art-sky-a')}/><stop offset="1" ${st('--art-sky-b')}/></linearGradient><radialGradient id="${g}sun"><stop offset="0" ${st('--art-sun',.55)}/><stop offset="1" ${st('--art-sun',0)}/></radialGradient><linearGradient id="${g}gl" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" ${st('--art-glass-a')}/><stop offset="1" ${st('--art-glass-b')}/></linearGradient><linearGradient id="${g}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${st('--art-wall')}/><stop offset="1" ${st('--art-wall-b')}/></linearGradient><linearGradient id="${g}lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${st('--art-lawn-a')}/><stop offset="1" ${st('--art-lawn-b')}/></linearGradient><linearGradient id="${g}wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${st('--art-water-a')}/><stop offset="1" ${st('--art-water-b')}/></linearGradient></defs>`;
}
const cloud = (x,y,s) => `<g class="a-cloud" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="8" rx="34" ry="10"/><circle cx="-12" cy="2" r="12"/><circle cx="8" cy="-2" r="15"/><circle cx="24" cy="5" r="9"/></g>`;
const tree = (x,y,s,r) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="16" ry="3.5" class="a-shadow"/>${R(-2.5,-22,5,24,'a-trunk','rx="2"')}<circle cx="0" cy="-34" r="17" class="a-tree"/><circle cx="-6" cy="-40" r="10" class="a-tree2" opacity="${(.6+r()*.3).toFixed(2)}"/><circle cx="8" cy="-26" r="9" class="a-tree"/></g>`;
const palm = (x,y,s,col) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q4 -30 -2 -62" stroke="${col||'var(--art-trunk)'}" stroke-width="5" fill="none" stroke-linecap="round"/>${[-150,-110,-70,-30,10].map(a=>`<path d="M-2 -62 q${(Math.cos(a*Math.PI/180)*18).toFixed(1)} ${(Math.sin(a*Math.PI/180)*18-8).toFixed(1)} ${(Math.cos(a*Math.PI/180)*34).toFixed(1)} ${(Math.sin(a*Math.PI/180)*34+14).toFixed(1)}" stroke="${col||'var(--art-tree-a)'}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
const hedge = (x,y,w) => `<rect x="${x}" y="${y}" width="${w}" height="14" rx="7" class="a-tree"/><rect x="${x+4}" y="${y+2}" width="${w*.5}" height="5" rx="2.5" class="a-tree2" opacity=".6"/>`;
const lamp = (x,y) => `<g transform="translate(${x} ${y})">${R(-1.2,-46,2.4,46,'a-roof')}${R(-7,-49,14,3,'a-roof','rx="1.5"')}<ellipse cx="0" cy="-40" rx="9" ry="12" class="a-lampglow"/><circle cx="0" cy="-44" r="4" class="a-lampg"/></g>`;
const car = (x,y,f) => `<g transform="translate(${x} ${y}) scale(${f?-1:1} 1)"><ellipse cx="0" cy="12" rx="30" ry="3" class="a-shadow"/><path d="M-28 4 q0-8 8-9 l8-9 q3-3 8-3 h14 q5 0 8 4 l7 8 q6 1 6 8 v4 h-59z" class="a-car"/><path d="M-10 -7 l5-6 h10 v6z M7 -7 v-6 h5 q2 0 4 2 l3 4z" class="a-carw"/><circle cx="-15" cy="8" r="5.5" class="a-wheel"/><circle cx="14" cy="8" r="5.5" class="a-wheel"/></g>`;
function scene(g, r, opts={}){
  const sx = (60 + r()*280)|0;
  let s = `<rect width="400" height="300" fill="url(#${g}sky)"/><circle cx="${sx}" cy="60" r="78" fill="url(#${g}sun)"/><circle cx="${sx}" cy="60" r="17" class="a-sunc"/>`;
  s += cloud(40 + r()*80, 40 + r()*20, .8 + r()*.3) + cloud(250 + r()*90, 30 + r()*30, .6 + r()*.3);
  s += `<path d="M0 222 Q60 192 120 210 T240 204 T400 196 V250 H0z" class="a-hill"/><path d="M0 236 Q90 214 180 228 T400 222 V250 H0z" class="a-hill2"/><rect y="246" width="400" height="54" fill="url(#${g}lawn)"/>`;
  if (opts.road) s += `${R(0,262,400,38,'a-road')}<path d="M0 282 H400" class="a-dash"/>${R(0,254,400,8,'a-path')}`;
  return s;
}
function villa(g, r){
  let s = scene(g, r) + `<ellipse cx="190" cy="250" rx="160" ry="9" class="a-shadow"/><polygon points="196,300 248,300 238,250 206,250" class="a-path"/>`;
  s += `<rect x="62" y="160" width="208" height="90" fill="url(#${g}wall)"/>` + P('270,160 294,148 294,238 270,250','a-side');
  s += `<rect x="112" y="104" width="178" height="56" fill="url(#${g}wall)"/>` + P('290,104 310,94 310,150 290,160','a-side');
  s += P('102,96 122,86 322,86 302,96','a-rooft') + R(102,96,200,9,'a-roof') + P('302,96 322,86 322,95 302,105','a-roof');
  s += P('52,152 70,144 300,144 282,152','a-rooft') + R(52,152,230,8,'a-roof');
  s += R(112,104,44,56,'a-acc'); for (let x=118;x<156;x+=7) s += `<path d="M${x} 108v48" class="a-slat"/>`;
  s += `<rect x="162" y="112" width="120" height="40" fill="url(#${g}gl)"/>`;
  for (let x=192;x<282;x+=30) s += `<path d="M${x} 112v40" class="a-mull"/>`;
  s += `<polygon points="170,112 196,112 172,152 162,152 162,124" class="a-sheen"/>` + R(158,138,128,14,'a-railg') + `<path d="M158 138h128M158 152h128" class="a-rail"/>`;
  s += `<rect x="76" y="174" width="116" height="76" fill="url(#${g}gl)"/>` + R(90,198,40,52,'a-lit f','opacity=".55"') + `<path d="M115 174v76M153 174v76M76 212h116" class="a-mull"/><polygon points="80,174 104,174 80,206" class="a-sheen"/>`;
  s += R(204,172,40,78,'a-door') + R(235,206,2.5,14,'a-lit','rx="1"') + R(200,168,48,4,'a-roof');
  s += `<polygon points="250,262 372,262 390,290 234,290" fill="url(#${g}wat)"/><polygon points="250,262 372,262 374,265 249,265" class="a-path"/><path d="M262 272h26M300 280h36M346 270h18" class="a-shim"/>`;
  return s + hedge(20,238,46) + tree(36,250,1,r) + palm(354,252,.95) + lamp(186,250);
}
function apartment(g, r){
  let s = scene(g, r, {road:true});
  s += `<rect x="40" y="132" width="96" height="122" fill="url(#${g}wall)"/>` + P('40,132 58,124 154,124 136,132','a-rooft');
  for (let q=0;q<5;q++) for (let c=0;c<3;c++) s += r()<.3 ? R(50+c*28,144+q*21,18,12,'a-lit f') : `<rect x="${50+c*28}" y="${144+q*21}" width="18" height="12" fill="url(#${g}gl)"/>`;
  s += `<rect x="290" y="150" width="84" height="104" fill="url(#${g}wall)"/>` + P('374,150 388,142 388,246 374,254','a-side');
  for (let q=0;q<4;q++) for (let c=0;c<2;c++) s += `<rect x="${302+c*34}" y="${162+q*22}" width="24" height="12" fill="url(#${g}gl)"/>`;
  s += `<ellipse cx="210" cy="254" rx="90" ry="6" class="a-shadow"/><rect x="146" y="40" width="128" height="214" fill="url(#${g}wall)"/>` + P('274,40 298,28 298,242 274,254','a-side');
  s += P('140,34 162,22 304,22 282,34','a-rooft') + R(140,34,142,7,'a-roof') + P('282,34 304,22 304,29 282,41','a-roof');
  s += R(176,10,26,14,'a-wallb') + R(172,8,34,3,'a-roof') + `<path d="M248 22V2" stroke="var(--art-roof)" stroke-width="1.5"/><circle cx="248" cy="2" r="2.5" class="a-beacon"/>`;
  for (let q=0;q<8;q++){
    const y = 50 + q*23;
    for (let c=0;c<3;c++){ const x = 156 + c*38; s += r()<.28 ? R(x,y,30,15,'a-lit f',`style="animation-delay:-${(r()*4).toFixed(1)}s"`) : `<rect x="${x}" y="${y}" width="30" height="15" fill="url(#${g}gl)"/>`; }
    s += R(150,y+16,120,3,'a-roof') + R(150,y+10,120,6,'a-railg') + P(`274,${y+2} 296,${y-9} 296,${y+5} 274,${y+16}`,'a-gside','opacity=".55"');
  }
  s += `<polygon points="156,50 176,50 156,90" class="a-sheen"/>` + R(186,228,48,26,'a-door') + R(180,224,60,5,'a-roof') + `<rect x="192" y="232" width="36" height="22" fill="url(#${g}gl)"/><path d="M210 232v22" class="a-mull"/>`;
  return s + tree(126,256,.85,r) + tree(318,258,.95,r) + lamp(104,256) + car(60,272,false) + car(350,288,true);
}
function office(g, r){
  let s = scene(g, r, {road:true});
  s += `<rect x="44" y="112" width="104" height="142" fill="url(#${g}wall)"/>` + P('44,112 62,104 166,104 148,112','a-rooft');
  for (let q=0;q<6;q++) s += `<rect x="52" y="${124+q*21}" width="88" height="11" fill="url(#${g}gl)"/>`;
  s += `<rect x="290" y="140" width="80" height="114" fill="url(#${g}wall)"/>` + P('370,140 386,132 386,246 370,254','a-side');
  for (let q=0;q<4;q++) s += `<rect x="298" y="${152+q*24}" width="64" height="12" fill="url(#${g}gl)"/>`;
  s += `<ellipse cx="216" cy="254" rx="96" ry="6" class="a-shadow"/><rect x="156" y="26" width="118" height="228" fill="url(#${g}gl)"/>` + P('274,26 298,14 298,242 274,254','a-gside');
  for (let x=171;x<274;x+=15) s += `<path d="M${x} 26v228" class="a-mull"/>`;
  for (let y=44;y<254;y+=18) s += `<path d="M156 ${y}h118M274 ${y}l24-12" class="a-mull"/>`;
  for (let i=0;i<16;i++) s += R(157+((r()*8)|0)*15, 27+((r()*12)|0)*18, 13, 16, 'a-lit f', `opacity=".7" style="animation-delay:-${(r()*4).toFixed(1)}s"`);
  s += `<polygon points="156,26 206,26 156,150" class="a-sheen"/>` + P('172,14 188,6 262,6 246,14','a-rooft') + R(172,14,74,12,'a-roof') + `<path d="M216 6V0" stroke="var(--art-roof)" stroke-width="2"/><circle cx="216" cy="1" r="2.5" class="a-beacon"/>`;
  s += `<rect x="128" y="222" width="176" height="32" fill="url(#${g}wall)"/>` + R(124,218,184,5,'a-roof') + `<rect x="180" y="230" width="72" height="24" fill="url(#${g}gl)"/><path d="M204 230v24M228 230v24" class="a-mull"/>`;
  return s + tree(110,256,.8,r) + tree(326,258,.9,r) + lamp(140,256) + car(250,288,true);
}
function art(p, sfx = '', seedOff = 0, label){
  const r = rng(p.seed + seedOff), g = `g${p.id}${sfx}`;
  const k = p.kind || p.type;
  const body = k === 'Villa' ? villa(g, r) : k === 'Apartment' ? apartment(g, r) : office(g, r);
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label || 'Illustration of ' + p.name}">${artDefs(g)}${body}</svg>`;
}
function skyline(seed,w,h,layers){
  const r=rng(seed);let out='';
  layers.forEach(L=>{
    let x=-20,g=`<g class="${L.cls}">`;
    while(x<w){
      const bw=L.minW+r()*(L.maxW-L.minW),bh=L.minH+r()*(L.maxH-L.minH),top=h-bh,k=r();
      if(L.shapes&&k<.18) g+=`<path d="M${x.toFixed(1)} ${h} V${top.toFixed(1)} l${(bw/2).toFixed(1)} -${(bw*.45).toFixed(1)} l${(bw/2).toFixed(1)} ${(bw*.45).toFixed(1)} V${h}z"/>`;
      else if(L.shapes&&k<.32) g+=`<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}"/><rect x="${(x+bw*.3).toFixed(1)}" y="${(top-bh*.12).toFixed(1)}" width="${(bw*.4).toFixed(1)}" height="${(bh*.12+1).toFixed(1)}"/><rect x="${(x+bw*.48).toFixed(1)}" y="${(top-bh*.12-16).toFixed(1)}" width="2" height="16"/>`;
      else g+=`<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}"/>`;
      if(L.win){const cols=Math.floor((bw-6)/11),rows=Math.floor((bh-8)/15);for(let c=0;c<cols;c++)for(let q=0;q<rows;q++){if(r()<L.win){g+=`<rect class="w${r()<.18?' t':''}" style="animation-delay:-${(r()*5).toFixed(1)}s" x="${(x+5+c*11).toFixed(1)}" y="${(top+8+q*15).toFixed(1)}" width="5" height="7"/>`;}}}
      x+=bw+r()*L.gap;
    }
    out+=g+'</g>';
  });
  return out;
}
const LANDMARK = {
  'New York':`<g class="c-lm"><rect x="190" y="150" width="44" height="190"/><rect x="198" y="118" width="28" height="34"/><rect x="204" y="96" width="16" height="24"/><rect x="210" y="56" width="4" height="42"/></g>`,
  'Dubai':`<g class="c-lm"><path d="M196 340 V170 L204 120 L208 60 L210 10 L212 60 L216 120 L224 170 V340z"/><rect x="186" y="230" width="48" height="110"/></g>`,
  'London':`<g class="c-lm"><circle cx="210" cy="190" r="70" fill="none" stroke="rgba(255,255,255,.34)" stroke-width="4"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M210 190 L${(210+Math.cos(a)*70).toFixed(1)} ${(190+Math.sin(a)*70).toFixed(1)}" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/><circle cx="${(210+Math.cos(a)*70).toFixed(1)}" cy="${(190+Math.sin(a)*70).toFixed(1)}" r="5"/>`}).join('')}<path d="M196 340 L210 190 L224 340z"/><rect x="60" y="130" width="26" height="210"/><path d="M58 130 L73 92 L88 130z"/><circle cx="73" cy="150" r="7" fill="#12030A"/></g>`,
  'Los Angeles':`<g class="c-lm"><path d="M0 250 Q70 170 150 220 T300 200 V340 H0z"/></g>`,
  'Denver':`<g class="c-lm"><path d="M0 260 L60 160 L95 205 L150 120 L200 200 L240 150 L300 240 V340 H0z"/><path d="M150 120 L136 144 L150 140 L164 146z" fill="#fff" opacity=".5"/><path d="M60 160 L50 177 L62 172 L72 178z" fill="#fff" opacity=".45"/></g>`,
  'Accra':`<g class="c-lm"><path d="M150 340 V210 H270 V340 H246 V250 Q210 214 174 250 V340z"/><rect x="200" y="186" width="20" height="26"/><path d="M210 160 l6 14 h-12z"/></g>`
};
function cityArt(name,seed,i,sfx=''){
  const r=rng(seed),gid='cg'+i+sfx;
  const hue=[['#8A0A1C','#1A0207'],['#5C0712','#0B0103'],['#75000E','#220309']][i%3];
  let stars='';for(let k=0;k<26;k++)stars+=`<circle class="c-star" style="animation-delay:-${(r()*3).toFixed(1)}s" cx="${(r()*300).toFixed(0)}" cy="${(r()*170).toFixed(0)}" r="${(r()*1.2+.3).toFixed(1)}"/>`;
  const mx=(70+r()*160)|0,my=(70+r()*40)|0,water=['London','Dubai','Accra','New York'].includes(name);
  const sk=skyline(seed,300,water?340:380,[{cls:'c-s1',minW:24,maxW:50,minH:130,maxH:240,gap:4,shapes:true},{cls:'c-s2',minW:26,maxW:54,minH:90,maxH:180,gap:6,shapes:true}]);
  const near=skyline(seed+7,300,water?340:380,[{cls:'c-s3',minW:28,maxW:58,minH:46,maxH:120,gap:8,win:.24}]);
  const pal=name==='Los Angeles'?palm(40,380,1.1,'#12030A')+palm(255,380,1.25,'#12030A'):'';
  let wat='';if(water){wat=`<rect y="338" width="300" height="42" class="c-water"/>`;for(let k=0;k<9;k++){const y=345+k*4,x=(r()*240)|0;wat+=`<path class="c-ref" style="animation-delay:-${(r()*4).toFixed(1)}s" d="M${x} ${y}h${(20+r()*40)|0}"/>`;}}
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${name} skyline at dusk"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hue[1]}"/><stop offset=".7" stop-color="${hue[0]}"/></linearGradient><linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient></defs><rect width="300" height="400" fill="url(#${gid})"/>${stars}<circle cx="${mx}" cy="${my}" r="48" class="c-halo"/><circle cx="${mx}" cy="${my}" r="30" class="c-halo"/><circle cx="${mx}" cy="${my}" r="16" class="c-moon"/>${sk}${LANDMARK[name]||''}${near}${pal}${wat}<rect width="300" height="400" fill="url(#${gid}s)"/></svg>`;
}
/* floor plan: rooms as [x,y,w,h,label,furniture] in a 400x280 frame */
function floorRooms(p, floor){
  const b = n => p.beds >= n, k = p.kind || p.type;
  if (k === 'Villa' && floor === 1) return [[20,20,200,140,'Living room','sofa'],[220,20,160,90,'Kitchen','kitchen'],[220,110,160,50,'Dining','table'],[20,160,140,100,'Garage','car'],[160,160,80,100,'Hall',''],[240,160,60,100,'Bath','bath'],[300,160,80,100,'Study','desk']];
  if (k === 'Villa') return [[20,20,180,120,'Main bedroom','bed'],[200,20,80,70,'Bath','bath'],[280,20,100,120,'Bedroom 2','bed'],[200,90,80,50,'Hall',''],[20,140,140,120,b(3)?'Bedroom 3':'Study',b(3)?'bed':'desk'],[160,140,120,120,b(4)?'Bedroom 4':'Family room',b(4)?'bed':'sofa'],[280,140,100,120,'Balcony','']];
  if (k === 'Apartment') return [[20,20,200,130,'Living room','sofa'],[220,20,160,70,'Kitchen','kitchen'],[220,90,80,60,'Bath','bath'],[300,90,80,60,'Storage',''],[20,150,150,110,'Main bedroom','bed'],[170,150,110,110,b(2)?'Bedroom 2':'Study',b(2)?'bed':'desk'],[280,150,100,110,b(3)?'Bedroom 3':'Balcony',b(3)?'bed':'']];
  const n = Math.min(6, Math.max(3, Math.round(p.beds / 2)));
  const offices = Array.from({length:n}, (_, i) => [140 + i * (240 / n), 190, 240 / n, 70, `Office ${i + 1}`, 'desk']);
  return [[20,20,120,90,'Reception','sofa'],[140,20,240,170,'Open workspace','desks'],[20,110,120,80,'Meeting room','table'],[20,190,120,70,'Kitchenette','kitchen'], ...offices];
}
function furn(kind, x, y, w, h){
  const cx = x + w / 2, cy = y + h / 2 + 8;
  switch(kind){
    case 'sofa': return `<rect class="plan-furn" x="${cx-30}" y="${cy-4}" width="60" height="18" rx="5"/><rect class="plan-furn" x="${cx-18}" y="${cy-26}" width="36" height="16" rx="3" opacity=".6"/>`;
    case 'bed': return `<rect class="plan-furn" x="${cx-20}" y="${cy-20}" width="40" height="46" rx="4"/><rect class="plan-furn" x="${cx-16}" y="${cy-17}" width="14" height="9" rx="2" opacity=".5"/><rect class="plan-furn" x="${cx+2}" y="${cy-17}" width="14" height="9" rx="2" opacity=".5"/>`;
    case 'kitchen': return `<rect class="plan-furn" x="${x+6}" y="${y+6}" width="${w-12}" height="12" rx="2"/><rect class="plan-furn" x="${cx-20}" y="${cy-4}" width="40" height="14" rx="3" opacity=".7"/>`;
    case 'table': return `<rect class="plan-furn" x="${cx-24}" y="${cy-10}" width="48" height="20" rx="5"/>${[-16,0,16].map(d=>`<circle class="plan-furn" cx="${cx+d}" cy="${cy-17}" r="4" opacity=".6"/><circle class="plan-furn" cx="${cx+d}" cy="${cy+17}" r="4" opacity=".6"/>`).join('')}`;
    case 'bath': return `<rect class="plan-furn" x="${x+6}" y="${y+h-34}" width="${Math.min(40,w-12)}" height="26" rx="8"/><circle class="plan-furn" cx="${x+w-14}" cy="${y+16}" r="7" opacity=".7"/>`;
    case 'car': return `<rect class="plan-furn" x="${cx-16}" y="${cy-30}" width="32" height="58" rx="8"/>`;
    case 'desk': return `<rect class="plan-furn" x="${cx-16}" y="${cy-6}" width="32" height="14" rx="2"/><circle class="plan-furn" cx="${cx}" cy="${cy+16}" r="5" opacity=".6"/>`;
    case 'desks': return [0,1,2].map(i=>`<rect class="plan-furn" x="${x+20+i*72}" y="${cy-16}" width="56" height="14" rx="2"/><rect class="plan-furn" x="${x+20+i*72}" y="${cy+6}" width="56" height="14" rx="2"/>`).join('');
    default: return '';
  }
}
function floorPlan(p, floor = 1){
  const rooms = floorRooms(p, floor);
  const total = rooms.reduce((a, r) => a + r[2] * r[3], 0);
  const per = (p.sqft / p.floors) / total;
  let s = `<svg viewBox="0 0 400 290" role="img" aria-label="Floor plan of ${p.name}, floor ${floor}" class="${reduce ? '' : 'plan-anim'}"><rect x="0" y="0" width="400" height="290" fill="var(--plan-floor)"/>`;
  rooms.forEach((r, k) => {
    const [x, y, w, h, l, f] = r;
    s += `<rect class="plan-room ${k % 2 ? 'b' : 'a'}" style="--k:${k}" x="${x}" y="${y}" width="${w}" height="${h}"/>${furn(f, x, y, w, h)}`;
    s += `<text class="plan-t" x="${x + 8}" y="${y + 16}">${l}</text><text class="plan-s" x="${x + 8}" y="${y + 28}">${Math.round(w * h * per)} sqft</text>`;
    if (k > 0) s += `<path class="plan-door" d="M${x + 4} ${y + h - 4} a18 18 0 0 1 18 -18"/>`;
  });
  s += `<rect class="plan-outer" x="20" y="20" width="360" height="240"/><text class="plan-s" x="20" y="280">Floor ${floor}. Room areas are approximate.</text></svg>`;
  return s;
}
const BLOG_ART = [
  () => { let s=`<rect width="400" height="240" class="bl-bg"/>`;const blocks=[[20,20,90,60],[124,20,70,60],[208,20,110,60],[332,20,60,60],[20,94,60,60],[94,94,110,60],[218,94,70,60],[302,94,90,60],[20,168,110,60],[144,168,60,60],[218,168,90,60],[322,168,70,60]];blocks.forEach(([x,y,w,h],i)=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="${i===5?'bl-acc':'bl-card'}" ${i===5?'opacity=".18"':''}/>`;});s+=`<path d="M0 87H400M0 161H400M117 0V240M211 0V240M325 0V240" class="bl-road" stroke-width="7" opacity=".9"/><path d="M60 200 C 120 200, 140 130, 205 124 S 300 60, 350 50" fill="none" stroke="var(--burgundy)" stroke-width="3" stroke-dasharray="6 7" stroke-linecap="round"/>`;[[60,200,0],[205,124,.5],[350,50,1]].forEach(([x,y,d])=>{s+=`<g class="bl-pin" style="animation-delay:-${d}s"><path transform="translate(${x-12} ${y-30})" d="M12 30s-10-9-10-17a10 10 0 0 1 20 0c0 8-10 17-10 17z" class="bl-acc"/><circle cx="${x}" cy="${y-17}" r="4" fill="#fff"/></g>`;});return s+`<g transform="translate(140 104)"><rect width="56" height="40" rx="8" class="bl-fg"/><path d="M14 30 V18 L28 8 L42 18 V30z" fill="#fff"/></g>`; },
  () => `<rect width="400" height="240" class="bl-bg"/><circle cx="320" cy="60" r="34" class="bl-acc" opacity=".15"/><rect y="196" width="400" height="44" class="bl-line"/><g transform="translate(160 70)"><path d="M0 60 L80 0 L160 60 V126 H0z" class="bl-card"/><path d="M-10 64 L80 -4 L170 64" fill="none" stroke="var(--fg)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/><rect x="66" y="78" width="30" height="48" rx="3" class="bl-acc"/><rect x="18" y="70" width="34" height="26" rx="3" class="bl-fg" opacity=".85"/><rect x="110" y="70" width="34" height="26" rx="3" class="bl-fg" opacity=".85"/><rect x="118" y="8" width="16" height="30" class="bl-fg"/></g><g transform="translate(40 92)"><rect x="12" y="0" width="6" height="106" class="bl-fg"/><rect x="18" y="8" width="96" height="4" class="bl-fg"/><g style="transform-origin:66px 12px;animation:swing 3.2s ease-in-out infinite"><path d="M36 12v10M96 12v10" stroke="var(--fg)" stroke-width="2"/><rect x="24" y="22" width="84" height="44" rx="6" class="bl-acc"/><text x="66" y="50" text-anchor="middle" class="bl-txt">FOR SALE</text></g></g><circle cx="352" cy="196" r="22" class="bl-acc" opacity=".9"/><path d="M342 196l7 7 13-14" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  () => { let s=`<rect width="400" height="240" class="bl-bg"/><g transform="translate(70 30) rotate(-6)"><rect width="150" height="190" rx="14" class="bl-card"/><rect x="20" y="24" width="70" height="10" rx="5" class="bl-fg"/>${[52,72,92,112].map(y=>`<rect x="20" y="${y}" width="${110-(y%3)*10}" height="7" rx="3.5" class="bl-line"/>`).join('')}<path d="M20 160 q14 -16 26 -2 t26 -4 t24 2" fill="none" stroke="var(--burgundy)" stroke-width="2.5" stroke-linecap="round"/><rect x="104" y="146" width="28" height="28" rx="8" class="bl-acc"/><path d="M111 160l5 5 9-10" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></g><g transform="translate(262 52)"><circle cx="40" cy="40" r="40" class="bl-acc"/><text x="40" y="49" text-anchor="middle" class="bl-txt" style="font-size:24px">4.9%</text></g>`;[0,1,2,3,4].forEach(i=>{s+=`<g transform="translate(250 ${196-i*12})"><ellipse cx="40" cy="8" rx="34" ry="9" class="bl-fg"/><ellipse cx="40" cy="4" rx="34" ry="9" class="${i%2?'bl-acc':'bl-mut'}"/></g>`;});return s+`<g transform="translate(320 150)"><rect width="56" height="70" rx="10" class="bl-fg"/><rect x="8" y="8" width="40" height="16" rx="4" fill="#fff" opacity=".9"/>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${8+c*14}" y="${30+r*12}" width="10" height="8" rx="2" fill="#fff" opacity=".55"/>`).join('')).join('')}</g>`; }
];
const blogArt = i => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration for this group of local places">${BLOG_ART[i % BLOG_ART.length]()}</svg>`;
function buildSky(el, seedBase = 101){
  if (!el) return;
  const layers = [{cls:'sk-far',minW:50,maxW:110,minH:90,maxH:210,gap:4,d:.25,shapes:true},{cls:'sk-mid',minW:40,maxW:92,minH:70,maxH:170,gap:6,d:.55,shapes:true},{cls:'sk-near',minW:36,maxW:84,minH:40,maxH:120,gap:10,win:.2,d:1}];
  el.innerHTML = layers.map((L, i) => `<svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" data-depth="${L.d}" aria-hidden="true">${skyline(seedBase + i * 37, 1600, 300, [L])}</svg>`).join('');
  if (reduce) return;
  const host = el.closest('section');
  host.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const x = e.clientX / innerWidth - .5; $$('svg', el).forEach(s => { s.style.transform = `translateX(${(-x * 40 * s.dataset.depth).toFixed(1)}px)`; }); });
}

/* ================= shared shell ================= */
const LOGO = `<svg class="lg-mark" viewBox="0 0 40 40" aria-hidden="true"><rect class="lg-bg" x="1" y="1" width="38" height="38" rx="11"/><g class="lg-smoke"><circle cx="28.5" cy="8" r="1.4"/><circle cx="30" cy="5" r="1.1"/></g><path class="lg-chim" d="M27.5 16.5 V10.5"/><path class="lg-roof" pathLength="1" d="M8.5 20 L20 10.5 L31.5 20"/><text class="lg-ck" x="20" y="31.5" text-anchor="middle">CK</text><rect class="lg-win" x="18.6" y="15.2" width="2.8" height="2.8" rx=".6"/></svg><span class="lg-word"><b>CK</b><small>Real Estate</small></span>`;
const NAV_ACTIVE = {home:'home', property:'listings', about:'about', contact:'contact', local:'local'};
const OFFICE = {phone:'[Office phone]', email:'[Office email]', addr:'[Office address], Omaha, NE', hours:'[Office hours]'};
function renderHeader(){
  const on = k => NAV_ACTIVE[PAGE] === k ? ' class="on" aria-current="page"' : '';
  const slot = $('#site-header');
  slot.outerHTML = `<a class="sr" href="#main">Skip to content</a>
<header class="hdr" id="hdr"><div class="wrap hdr-in">
  <a class="logo" href="index.html" aria-label="CK Real Estate, home">${LOGO}</a>
  <nav class="nav" aria-label="Primary"><ul>
    <li><a href="index.html"${on('home')}>Home</a></li>
    <li class="has-dd"><button type="button" class="dd-btn${NAV_ACTIVE[PAGE] === 'listings' ? ' on' : ''}" aria-expanded="false" aria-controls="ddListings">Listings ${ico('chev')}</button>
      <div class="dd" id="ddListings">
        <a href="index.html#listings"><span class="di">${ico('tag')}</span><span>Homes for sale<small>Every active listing</small></span></a>
        <a href="index.html#cities"><span class="di">${ico('map')}</span><span>Browse by neighborhood<small>Four Omaha neighborhoods</small></span></a>
        <a href="${propUrl(FEATURED)}"${PAGE === 'property' ? ' class="on"' : ''}><span class="di">${ico('star')}</span><span>Featured home<small>Carlos's current pick</small></span></a>
      </div></li>
    <li><a href="about.html"${on('about')}>About</a></li>
    <li><a href="local.html"${on('local')}>Local area</a></li>
    <li><a href="contact.html"${on('contact')}>Contact</a></li>
  </ul></nav>
  <div class="hdr-act">
    <button class="icon-btn" id="themeBtn" aria-label="Switch color theme"></button>
    <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span><i></i><i></i><i></i></span></button>
  </div>
</div></header>
<div class="drawer" id="drawer" hidden>
  <div class="scrim" data-close-menu></div>
  <aside class="panel" role="dialog" aria-modal="true" aria-label="Site menu">
    <div class="d-top"><a class="logo" href="index.html">${LOGO}</a><button class="icon-btn" data-close-menu aria-label="Close menu">${ico('close')}</button></div>
    <nav class="d-nav" aria-label="Mobile">
      <a href="index.html" style="--i:0"${PAGE === 'home' ? ' class="on" aria-current="page"' : ''}><span class="di">${ico('home')}</span>Home${ico('arrow','go')}</a>
      <div class="d-grp" style="--i:1">
        <button type="button" class="d-sub-btn${PAGE === 'property' ? ' on' : ''}" aria-expanded="false" aria-controls="dSubListings"><span class="di">${ico('tag')}</span>Listings${ico('chev','chv')}</button>
        <div class="d-sub" id="dSubListings"><div>
          <a href="index.html#listings" style="--i:0"><span class="di">${ico('grid')}</span>Homes for sale${ico('arrow','go')}</a>
          <a href="index.html#cities" style="--i:0"><span class="di">${ico('map')}</span>Browse by neighborhood${ico('arrow','go')}</a>
          <a href="${propUrl(FEATURED)}" style="--i:0"${PAGE === 'property' ? ' class="on" aria-current="page"' : ''}><span class="di">${ico('star')}</span>Featured home${ico('arrow','go')}</a>
        </div></div>
      </div>
      <a href="about.html" style="--i:2"${PAGE === 'about' ? ' class="on" aria-current="page"' : ''}><span class="di">${ico('info')}</span>About${ico('arrow','go')}</a>
      <a href="local.html" style="--i:3"${PAGE === 'local' ? ' class="on" aria-current="page"' : ''}><span class="di">${ico('book')}</span>Local area${ico('arrow','go')}</a>
      <a href="contact.html" style="--i:4"${PAGE === 'contact' ? ' class="on" aria-current="page"' : ''}><span class="di">${ico('mail')}</span>Contact${ico('arrow','go')}</a>
    </nav>
    <div class="d-foot">
      <div class="d-contact"><span>${ico('phone')}${OFFICE.phone}</span><span>${ico('mail')}${OFFICE.email}</span><span>${ico('clock')}${OFFICE.hours}</span></div>
    </div>
  </aside>
</div>`;
}
function renderFooter(){
  const slot = $('#site-footer');
  const li = (h, l) => `<li><a href="${h}">${ico('chevR')}${l}</a></li>`;
  slot.outerHTML = `<footer>
  <div class="news"><div class="wrap news-in">
    <div><h2>Tell Carlos what you're looking for</h2><p class="sub">Leave your email and he'll write when a home that fits comes up. It goes to the office inbox and nowhere else.</p></div>
    <div><form class="news-form" id="newsForm" novalidate>
      <label class="news-field">${ico('mail')}<span class="sr">Email address</span><input id="nEmail" type="email" required placeholder="Your email address" autocomplete="email"></label>
      <button class="btn btn-light" type="submit">Send ${ico('arrow','mv')}</button>
    </form><p class="msg" id="nMsg" aria-live="polite"></p></div>
  </div></div>
  <div class="foot"><div class="wrap">
    <div class="foot-g">
      <div><a class="logo" href="index.html">${LOGO}</a><p>Carlos Kosala, broker. Homes for sale in Benson, Downtown, Happy Hollow and Rockbrook.</p></div>
      <div><h4>Homes</h4><ul>${li('index.html#listings','Homes for sale')}${li('index.html#cities','Neighborhoods')}${li(propUrl(FEATURED),'Featured home')}${li('local.html','Local area')}</ul></div>
      <div><h4>CK Real Estate</h4><ul>${li('about.html','About Carlos')}${li('contact.html','Contact the office')}${li('login.html','Log in')}</ul></div>
      <div><h4>Office</h4><ul><li class="ci">${ico('mail')}${OFFICE.email}</li><li class="ci">${ico('phone')}${OFFICE.phone}</li><li class="ci">${ico('clock')}${OFFICE.hours}</li></ul></div>
    </div>
    <div class="foot-b"><span>&copy; 2026 CK Real Estate. All rights reserved.</span><span>Listings, prices and pictures on this site are sample content until Carlos adds his own.</span></div>
  </div></div>
</footer>
<button class="totop" id="toTop" aria-label="Back to top"><svg class="prog" viewBox="0 0 52 52" aria-hidden="true"><circle class="trk" cx="26" cy="26" r="23" pathLength="100"/><circle class="val" cx="26" cy="26" r="23" pathLength="100"/></svg>${ico('up')}</button>
<dialog class="modal" id="modal" aria-label="Details"></dialog>`;
}
function bindShell(){
  /* theme */
  const tb = $('#themeBtn');
  const dark = () => root.dataset.mode === 'dark';
  const paintTheme = () => { tb.innerHTML = ico(dark() ? 'sun' : 'moon'); tb.setAttribute('aria-label', dark() ? 'Switch to light theme' : 'Switch to dark theme'); };
  paintTheme();
  tb.addEventListener('click', () => { const n = dark() ? 'light' : 'dark'; if (n === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; store.set('ck-mode', n); paintTheme(); });
  /* drawer */
  const drawer = $('#drawer'), burger = $('#burger');
  let last = null;
  const openMenu = () => { last = document.activeElement; drawer.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open'))); burger.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; setTimeout(() => $('[data-close-menu].icon-btn', drawer).focus({preventScroll:true}), 60); };
  const closeMenu = () => { if (drawer.hidden) return; drawer.classList.remove('open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 450); if (last && last.focus) last.focus({preventScroll:true}); };
  burger.addEventListener('click', openMenu);
  /* desktop Listings dropdown: opens on hover, and on click/tap for keyboard and touch */
  $$('.has-dd').forEach(li => {
    const b = $('.dd-btn', li);
    const set = o => { li.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', e => { e.stopPropagation(); set(!li.classList.contains('open')); });
    li.addEventListener('mouseleave', () => set(false));
    document.addEventListener('click', e => { if (!li.contains(e.target)) set(false); });
    li.addEventListener('keydown', e => { if (e.key === 'Escape'){ set(false); b.focus(); } });
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) set(false); });
  });
  $$('.d-sub-btn', drawer).forEach(b => b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o); $('#' + b.getAttribute('aria-controls')).classList.toggle('open', o); }));
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close-menu]') || e.target.closest('.d-nav a, .d-foot a')) closeMenu(); });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ closeMenu(); return; }
    if (e.key === 'Tab'){ const f = $$('a,button', drawer).filter(x => x.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } }
  });
  matchMedia('(min-width:1101px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  /* same-page links on the home page scroll instead of reloading */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="index.html#"]');
    if (a && PAGE === 'home'){ const t = $(a.getAttribute('href').slice(10)); if (t){ e.preventDefault(); goTo(t); } }
  });
  /* newsletter */
  const nf = $('#newsForm'), ni = $('#nEmail'), nm = $('#nMsg');
  nf.addEventListener('submit', e => {
    e.preventDefault();
    if (!ni.value || !ni.checkValidity()){ nm.className = 'msg'; nm.innerHTML = `${ico('info')}Enter a valid email address, for example name@example.com.`; nf.classList.remove('shake'); void nf.offsetWidth; nf.classList.add('shake'); ni.focus(); return; }
    nm.className = 'msg ok'; nm.innerHTML = `${ico('check')}Thanks. Carlos will write to ${ni.value} when something fits.`; ni.value = '';
  });
  /* global clicks */
  document.addEventListener('click', e => {
    const t = e.target;
    const cp = t.closest('[data-copy]'); if (cp){ copyText(cp.dataset.copy, cp.dataset.copyLabel || 'Text'); return; }
    const po = t.closest('[data-post]'); if (po){ openPost(+po.dataset.post); return; }
  });
  $('#toTop').addEventListener('click', () => scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}));
  /* scroll effects */
  const hdr = $('#hdr'), top = $('#toTop');
  let tick = false;
  const run = () => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    top.style.setProperty('--sp', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    hdr.classList.toggle('scrolled', y > 10);
    top.classList.toggle('show', y > 600);
    scrollHooks.forEach(f => f(y));
  };
  addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(run); } }, {passive:true});
  requestAnimationFrame(run);
}
const scrollHooks = [];

/* ================= modal ================= */
const modal = () => $('#modal');
function showModal(html, cls = ''){
  const m = modal();
  if (openSel) openSel.close(false);
  m.className = 'modal ' + cls;
  m.onkeydown = null;
  m.innerHTML = html; paintIcons(m);
  $$('.cs', m).forEach(c => makeSelect(c, OPT[c.dataset.opts]));
  if (!m.open){ m.showModal(); requestAnimationFrame(() => m.classList.add('open')); } else m.classList.add('open');
  m.scrollTop = 0;
  if (!m.dataset.bound){
    m.dataset.bound = 1;
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
    m.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
  }
}
function closeModal(){ const m = modal(); if (openSel) openSel.close(false); m.classList.remove('open'); setTimeout(() => { if (m.open) m.close(); }, reduce ? 0 : 300); }
const xBtn = `<button class="icon-btn m-x" data-close aria-label="Close dialog">${ico('close')}</button>`;
const LA_ENTRIES = n => [1, 2, 3].map(i => ({t:`[${n} ${i}]`, d:'[One line from Carlos on why it is worth a visit.]', href:'#'}));
const POSTS = [
  {slug:'events', ent:LA_ENTRIES('Event'), tag:'Events',time:'Local area',title:'Events around Omaha worth putting on the calendar',body:['[Carlos adds links to upcoming events here, each with one line on why it is worth going.]','Each entry opens the event\'s own website.']},
  {slug:'places-to-visit', ent:LA_ENTRIES('Place'), tag:'Places to visit',time:'Local area',title:'Places to visit when you are getting to know a neighborhood',body:['[Carlos adds parks, museums and spots he sends buyers to before they make an offer.]','Each entry opens the place\'s own website.']},
  {slug:'family-activities', ent:LA_ENTRIES('Activity'), tag:'Family activities',time:'Local area',title:'Family activities close to the homes we list',body:['[Carlos adds things to do with kids near Benson, Downtown, Happy Hollow and Rockbrook.]','Each entry opens the place\'s own website.']},
  {slug:'places-to-eat', ent:LA_ENTRIES('Restaurant'), tag:'Places to eat',time:'Local area',title:'Places to eat that Carlos recommends',body:['[Carlos adds the restaurants and coffee shops he likes in each neighborhood.]','Each entry opens the restaurant\'s own website.']}
];
function openPost(i){
  location.href = 'local.html#' + POSTS[i].slug; return;
  const p = POSTS[i];
  showModal(`<div class="m-simple">${xBtn}<p class="eyebrow" style="margin-bottom:10px">${p.tag} · ${p.time}</p><h2>${p.title}</h2><div class="post" style="cursor:auto;margin-top:18px"><div class="pa">${blogArt(i)}</div></div><div class="article" style="margin-top:18px">${p.body.map(t => `<p>${t}</p>`).join('')}</div></div>`);
}

/* ================= reusable blocks ================= */
function card(p, i = 0){
  /* the card shows the first two of the listing's four photos; swipe or drag to see the second, the rest are on the listing page */
  const shots = [art(p, 'c' + i), art(p, 'c2' + i, 4211, 'Photo 2 of ' + p.name)];
  return `<article class="card" style="--i:${i}">
    <div class="card-art">
      <div class="c-track" tabindex="0" aria-label="Photos of ${p.name}. Swipe or use the arrow keys for the next photo.">${shots.map((svg, k) => `<a class="c-slide" href="${propUrl(p)}" aria-label="${p.name}, photo ${k + 1} of 2, open the listing"${k ? ' tabindex="-1"' : ''} draggable="false">${svg}</a>`).join('')}</div>
      ${p.featured ? `<span class="fbadge">${ico('star')}Featured</span>` : ''}
      <span class="ptype">${ico(TYPE_IC[p.type])}${p.type} · ${p.status}</span>
      <div class="c-dots" role="group" aria-label="Choose a photo">${shots.map((_, k) => `<button type="button" data-k="${k}" aria-label="Show photo ${k + 1}"${k ? '' : ' aria-current="true"'}></button>`).join('')}</div>
    </div>
    <a class="card-body" href="${propUrl(p)}">
      <ul class="specs"><li>${ico('bed')}${p.specs[0]}</li><li>${ico('bath')}${p.specs[1]}</li><li>${ico('area')}${p.specs[2]}</li></ul>
      <b class="c-price">${money(p.price)}</b>
      <h3 class="c-name">${p.name}</h3>
      <p class="addr">${ico('pin')}<span>${p.hood}, Omaha, NE ${p.zip}</span></p>
    </a>
  </article>`;
}
/* card photo carousels: swipe on touch, drag or trackpad on desktop, the line at the bottom shows which photo is up */
(() => {
  const dotsOf = t => t.parentElement.querySelectorAll('.c-dots button');
  const sync = t => { const k = Math.round(t.scrollLeft / Math.max(1, t.clientWidth)); dotsOf(t).forEach((d, i) => d.toggleAttribute('aria-current', i === k)); };
  const go = (t, k) => t.scrollTo({left: k * t.clientWidth, behavior: reduce ? 'auto' : 'smooth'});
  document.addEventListener('scroll', e => { if (e.target.classList && e.target.classList.contains('c-track')) sync(e.target); }, true);
  document.addEventListener('click', e => { const d = e.target.closest('.c-dots button'); if (!d) return; e.preventDefault(); go(d.closest('.card-art').querySelector('.c-track'), +d.dataset.k); });
  document.addEventListener('keydown', e => { const t = e.target.closest && e.target.closest('.c-track'); if (!t || !/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault(); go(t, e.key === 'ArrowRight' ? 1 : 0); });
  let drag = null;
  document.addEventListener('dragstart', e => { if (e.target.closest && e.target.closest('.c-track')) e.preventDefault(); });
  document.addEventListener('pointerdown', e => { const t = e.target.closest('.c-track'); if (!t || e.pointerType !== 'mouse' || e.button !== 0) return; drag = {t, x: e.clientX, sl: t.scrollLeft, moved: 0}; });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; drag.moved = Math.max(drag.moved, Math.abs(dx)); if (drag.moved > 6){ drag.t.classList.add('dragging'); drag.t.scrollLeft = drag.sl - dx; } });
  addEventListener('pointerup', () => { if (!drag) return; const {t, sl, moved} = drag; t.classList.remove('dragging');
    if (moved > 6){ const w = t.clientWidth, k = t.scrollLeft > sl ? Math.ceil(t.scrollLeft / w - .15) : Math.floor(t.scrollLeft / w + .15); go(t, Math.max(0, Math.min(1, k))); t.dataset.justDragged = '1'; setTimeout(() => delete t.dataset.justDragged, 50); }
    drag = null; });
  document.addEventListener('click', e => { const t = e.target.closest('.c-track'); if (t && t.dataset.justDragged){ e.preventDefault(); e.stopPropagation(); } }, true);
})();
function buildFaq(el, items){
  if (!el) return;
  el.innerHTML = items.map(([q, a], i) => `<div class="faq-i"><h3><button class="faq-q" aria-expanded="${i === 0}" aria-controls="${el.id}a${i}">${q}<span class="pm">${ico('plus')}</span></button></h3><div class="faq-a ${i === 0 ? 'open' : ''}" id="${el.id}a${i}"><div><p>${a}</p></div></div></div>`).join('');
  el.addEventListener('click', e => {
    const b = e.target.closest('.faq-q'); if (!b) return;
    const open = b.getAttribute('aria-expanded') === 'true';
    $$('.faq-q', el).forEach(x => { x.setAttribute('aria-expanded','false'); x.closest('.faq-i').querySelector('.faq-a').classList.remove('open'); });
    if (!open){ b.setAttribute('aria-expanded','true'); b.closest('.faq-i').querySelector('.faq-a').classList.add('open'); }
  });
}
const FAQ = [
  ['Who will answer my message?','Carlos Kosala or Janet from the CK office. Messages from this site go straight to the office email.'],
  ['Do you keep what I send through the forms?','No. The site emails your message to the office and does not save it.'],
  ['Which neighborhoods do you cover?','Benson, Downtown, Happy Hollow and Rockbrook in Omaha. If you are looking somewhere else, ask anyway.'],
  ['Can I see a home outside office hours?','Ask on the listing page and say which day suits you. Carlos will reply with a time that works.'],
  ['How do I sell my house with CK?','Call the office or send a message from this page. Carlos will come and look at the house first.']
];
function bindTabsInk(tabs){
  const move = () => { const a = $('[aria-selected="true"], [aria-pressed="true"]', tabs), ink = $('.tab-ink, .ink', tabs); if (!a || !ink) return; ink.style.width = a.offsetWidth + 'px'; ink.style.transform = `translateX(${a.offsetLeft - (ink.classList.contains('ink') ? 4 : 0)}px)`; };
  addEventListener('resize', move); if (document.fonts) document.fonts.ready.then(move);
  move(); return move;
}
function animateCounts(scope){
  $$('[data-count]', scope).forEach(el => {
    const end = +el.dataset.count, dec = +el.dataset.dec || 0, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const t0 = performance.now(), dur = 1700, fmt = v => pre + v.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec}) + suf;
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(end * e); if (k < 1) requestAnimationFrame(step); else el.textContent = fmt(end); };
    el.textContent = fmt(0); requestAnimationFrame(step);
  });
}
function bindReveal(){
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--d', (i * .09) + 's'); }));
  $$('[data-split]').forEach(splitWords);
  if (reduce) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); e.target.classList.remove('pre-meters'); io.unobserve(e.target);
    if (e.target.matches('[data-counts]')) animateCounts(e.target);
  }), {threshold:.15, rootMargin:'0px 0px -6% 0px'});
  const below = el => el.getBoundingClientRect().top > innerHeight * .95;
  $$('.rv').forEach(el => { if (below(el)){ el.classList.add('pre'); io.observe(el); } });
  $$('.hl').forEach(h => { if (below(h)){ h.classList.add('hl-pre'); io.observe(h); } });
  $$('[data-counts]').forEach(el => { if (below(el)) io.observe(el); });
  $$('.meters').forEach(el => { if (below(el)){ el.classList.add('pre-meters'); io.observe(el); } });
}

/* ================= page: home ================= */
function initHome(){
  const S = {type:'all', hood:'all', band:0};
  const isFiltered = () => !!(S.band || S.type !== 'all' || S.hood !== 'all');
  const match = p => {
    if (S.type !== 'all' && p.type !== S.type) return false;
    if (S.hood !== 'all' && p.hood !== S.hood) return false;
    if (S.band){ const lo = S.band === 1 ? 0 : S.band, hi = (S.band === 1 ? 0 : S.band) + BAND; if (!(p.price >= lo && p.price < hi)) return false; }
    return true;
  };
  let ink = null;
  const renderAll = () => {
    const list = DATA.filter(match);
    $('#saleGrid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><div class="ei">${ico('search')}</div><h3>No homes match those filters right now</h3><p>Try a wider price range or another neighborhood, or ask Carlos to tell you when one comes up.</p><button class="btn btn-accent" data-clear>Clear search</button></div>`;
    $('#saleCount').textContent = list.length === DATA.length ? `${DATA.length} homes for sale` : `${list.length} of ${DATA.length} homes match`;
    const tabs = $('[data-tabs="sale"]'); $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', t.dataset.type === S.type));
    ink && ink();
    $$('[data-clear].link').forEach(b => b.hidden = !isFiltered());
  };
  const tabsEl = $('[data-tabs="sale"]');
  tabsEl.innerHTML = '<span class="tab-ink" aria-hidden="true"></span>' + ['all', ...TYPES].map(v => `<button class="tab" role="tab" data-type="${v}" aria-selected="${v === 'all'}">${ico(TYPE_IC[v])}${v === 'all' ? 'All' : v}</button>`).join('');
  ink = bindTabsInk(tabsEl);
  tabsEl.addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b) return; S.type = b.dataset.type; SEL.fType.value = S.type; renderAll(); });
  /* search */
  makeSelect($('#fHood'), OPT.hood); makeSelect($('#fType'), OPT.type); makeSelect($('#fMax'), OPT.band);
  const runSearch = () => { S.hood = SEL.fHood.value; S.type = SEL.fType.value; S.band = +SEL.fMax.value || 0; renderAll(); goTo('#listings'); };
  const clearSearch = () => { Object.assign(S, {type:'all', hood:'all', band:0}); SEL.fType.value = 'all'; SEL.fHood.value = 'all'; SEL.fMax.value = '0'; renderAll(); };
  $('#searchForm').addEventListener('submit', e => { e.preventDefault(); runSearch(); });
  $$('.chip[data-type], .chip[data-hood]').forEach(c => c.addEventListener('click', () => { if (c.dataset.type){ SEL.fType.value = c.dataset.type; SEL.fHood.value = 'all'; } if (c.dataset.hood){ SEL.fHood.value = c.dataset.hood; SEL.fType.value = 'all'; } runSearch(); }));
  document.addEventListener('click', e => { if (e.target.closest('[data-clear]')){ e.preventDefault(); clearSearch(); } });
  renderAll();
  /* featured band */
  const F = FEATURED, fh = $('#fhBox');
  if (fh) fh.innerHTML = `<a class="fh-art" href="${propUrl(F)}" aria-label="${F.name}, view this home">${art(F, 'fh', 0, 'Photo of ' + F.name)}<span class="fh-flag">${ico('star')}Featured this week</span></a>
    <div class="fh-tx"><p class="eyebrow">Featured home</p><h2 class="title">${F.name}</h2><p class="addr">${ico('pin')}<span>${F.addr}</span></p>
      <div class="pd-tags" style="margin-top:14px"><span class="tag dark">${F.status}</span><span class="tag">${ico(TYPE_IC[F.type])}${F.type}</span><span class="tag">${ico('pin')}${F.hood}</span></div>
      <b class="fh-price">${money(F.price)}</b>
      <ul class="specs"><li>${ico('bed')}${F.specs[0]}</li><li>${ico('bath')}${F.specs[1]}</li><li>${ico('area')}${F.specs[2]}</li></ul>
      <p class="lead">${DESC[F.type](F)[0]}</p>
      <div class="fh-acts"><a class="btn btn-accent" href="${propUrl(F)}">View this home ${ico('arrow','mv')}</a><a class="btn btn-ghost" href="index.html#listings">See every listing</a></div></div>`;
  /* hero */
  const hb = $('#heroBadge'); hb.textContent = `${FEATURED.name}, ${FEATURED.hood}`; hb.closest('a').setAttribute('href', propUrl(FEATURED));
  buildSky($('#sky'));
  if (!reduce){ splitWords($('#h1')); $('#h1').classList.add('anim-words'); }
  /* neighborhoods rail */
  const rail = $('#rail');
  rail.innerHTML = CITIES.map((c, i) => { const n = DATA.filter(p => p.hood === c).length; return `<button class="city" data-city="${c}" aria-label="${c}, ${n} homes">${cityArt(c, 200 + i * 53, i)}<span class="city-meta"><small>${CITY_INFO[c].sub}</small><h3>${c}</h3><p>${n} ${n === 1 ? 'home' : 'homes'} for sale</p></span><span class="go">${ico('arrowUR')}</span></button>`; }).join('');
  rail.addEventListener('click', e => { const b = e.target.closest('[data-city]'); if (!b) return; Object.assign(S, {type:'all', hood:b.dataset.city, band:0}); SEL.fHood.value = b.dataset.city; SEL.fType.value = 'all'; SEL.fMax.value = '0'; renderAll(); goTo('#listings'); });
  const step = () => Math.max(260, rail.clientWidth * .8);
  $('#railNext').addEventListener('click', () => rail.scrollBy({left:step(), behavior:'smooth'}));
  $('#railPrev').addEventListener('click', () => rail.scrollBy({left:-step(), behavior:'smooth'}));
  const thumb = $('#barThumb');
  const upd = () => { const max = rail.scrollWidth - rail.clientWidth, ratio = Math.min(1, rail.clientWidth / rail.scrollWidth); thumb.style.width = (ratio * 100) + '%'; const track = thumb.parentElement.clientWidth; thumb.style.setProperty('--bx', (max > 0 ? (rail.scrollLeft / max) * (track - track * ratio) : 0) + 'px'); $('#railPrev').disabled = rail.scrollLeft < 4; $('#railNext').disabled = rail.scrollLeft > max - 4; };
  rail.addEventListener('scroll', upd, {passive:true}); addEventListener('resize', upd); upd();
  let down = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; moved = 0; rail.style.scrollSnapType = 'none'; rail.style.cursor = 'grabbing'; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); rail.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; rail.style.cursor = ''; });
  rail.addEventListener('click', e => { if (moved > 6){ e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
  /* about art, steps line, local area */
  $('#aboutA').innerHTML = art({...DATA[4], id:101, seed:4242}, 'a');
  $('#aboutB').innerHTML = art({...DATA[2], id:102, seed:777}, 'b');
  const steps = $('#steps');
  scrollHooks.push(() => { const r = steps.getBoundingClientRect(); steps.style.setProperty('--p', Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height + innerHeight * .1))).toFixed(3)); });
  $('#posts').innerHTML = POSTS.map((p, i) => `<button class="post" data-post="${i}"><div class="pa">${blogArt(i)}</div><div class="meta"><b>${p.tag}</b><span>${ico('pin')}${p.time}</span></div><h3>${p.title}</h3><span class="more">Open the list ${ico('arrow')}</span></button>`).join('');
  /* honor a hash from another page */
  if (location.hash && $(location.hash)) setTimeout(() => goTo(location.hash), 80);
}

/* ================= page: property ================= */
function initProperty(){
  let p = bySlug(location.hash.slice(1));
  if (!p){ p = byId(store.get('ck-last', 1)) || DATA[0]; }
  store.set('ck-last', p.id);
  document.title = `${p.name} | CK Real Estate`;
  addEventListener('hashchange', () => { if (bySlug(location.hash.slice(1))) location.reload(); });
  const rent = p.mode === 'rent';
  /* every listing has exactly four photos (US-04). The drawings stand in until Carlos uploads real ones. */
  const slides = [
    {l:'Photo 1: front', ic:'image', svg: s => art(p, 'v1' + s, 0, 'Photo 1 of ' + p.name)},
    {l:'Photo 2: street', ic:'image', svg: s => art(p, 'v2' + s, 4211, 'Photo 2 of ' + p.name)},
    {l:'Photo 3: side', ic:'image', svg: s => art(p, 'v3' + s, 8423, 'Photo 3 of ' + p.name)},
    {l:'Photo 4: floor plan', ic:'layers', svg: s => `<div class="plan-slide">${floorPlan(p, 1).replace('class="plan-anim"', 'class=""')}</div>`}
  ];
  const facts = [[TYPE_IC[p.type], p.type, 'Type'], ['hammer', p.built, 'Built'], ['bed', p.beds, 'Bedrooms'], ['bath', p.baths, 'Bathrooms'], ['area', p.sqft.toLocaleString('en-US'), 'Square feet'], ['garage', p.garage, p.type === 'Condominium' ? 'Parking spaces' : 'Garage spaces']];
  const details = [['Listing ID', `CK-${String(p.id).padStart(4,'0')}`], ['Listed on', p.listed.toLocaleDateString('en-US', {day:'numeric', month:'short', year:'numeric'})], ['Status', p.status], ['Home type', p.type], ['Neighborhood', p.hood], ['Year built', p.built], ['Last updated', p.remodel], ['Bedrooms', p.beds], ['Bathrooms', p.baths], ['Floor area', `${p.sqft.toLocaleString('en-US')} sqft`], ['Floors', p.floors], [p.type === 'Condominium' ? 'Parking' : 'Garage', p.garage]];
  MAIN.innerHTML = `
  <div class="wrap">
    <div class="pd-head">
      <div>
        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">${ico('home')}Home</a>${ico('chevR','sep')}<a href="index.html#listings">Homes for sale</a>${ico('chevR','sep')}<span aria-current="page">${p.name}</span></nav>
        <div class="pd-tags"><span class="tag dark">${p.status}</span>${p.featured ? `<span class="tag">${ico('star')}Featured home</span>` : ''}<span class="tag">${ico(TYPE_IC[p.type])}${p.type}</span><span class="tag">${ico('pin')}${p.hood}</span></div>
        <h1 class="anim-words" id="pdTitle">${p.name}</h1>
        <p class="addr">${ico('pin')}<span>${p.addr}</span></p>
      </div>
      <div class="pd-price">
        <b>${money(p.price)}${rent ? '<small style="font-size:1rem;font-weight:500;color:var(--muted)"> /month</small>' : ''}</b>
        <span>${rent ? `Deposit ${money(p.price)}, due at signing` : `Asking price, in the ${bandLabel(Math.floor(p.price / BAND) * BAND)} range`}</span>
        <div class="pd-acts">
          <button class="btn btn-ghost sm" data-copy="${p.name}, ${priceLabel(p)}, ${p.addr}" data-copy-label="Listing details">${ico('share')}Copy details</button>
        </div>
      </div>
    </div>
    <div class="gallery">
      <div class="g-main" id="gMain" tabindex="0" aria-label="Photo gallery. Use the arrow keys to change the view. Press Enter to enlarge.">
        ${slides.map((s, i) => `<div class="slide${i === 0 ? ' on' : ''}" data-i="${i}">${s.svg('')}</div>`).join('')}
        <button class="g-nav g-prev" aria-label="Previous view">${ico('arrow')}</button><button class="g-nav g-next" aria-label="Next view">${ico('arrow')}</button>
        <span class="g-label" id="gLabel">${ico('image')}${slides[0].l}</span><span class="g-count" id="gCount">1 / ${slides.length}</span>
      </div>
      <div class="g-thumbs" id="gSide"></div>
    </div>
    <div class="facts" data-stagger>${facts.map(([ic, v, l]) => `<div class="fact"><span class="fi">${ico(ic)}</span><b>${v}</b><span>${l}</span></div>`).join('')}</div>
    <div class="pd-grid">
      <div class="pd-main">
        <section class="panel rv"><h3><span class="hi">${ico('doc')}</span>Description</h3><div class="more-text" id="desc">${DESC[p.type](p).map(t => `<p>${t}</p>`).join('')}</div><button class="read-more" id="descBtn" aria-expanded="false" aria-controls="desc">Read the full description ${ico('chev')}</button></section>
        <section class="panel rv"><h3><span class="hi">${ico('info')}</span>Property details</h3><dl class="dl">${details.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>
        <section class="panel rv"><h3><span class="hi">${ico('check')}</span>Features</h3><div class="amen-g">${p.features.map(f => `<div class="am yes"><span class="mk">${ico('check')}</span>${f}</div>`).join('')}</div></section>
        <section class="panel rv"><h3><span class="hi">${ico('map')}</span>Location</h3>
          <div class="pd-map" id="pdMap" role="region" aria-label="Map showing ${p.name}"></div>
          <p class="addr" style="margin-top:12px">${ico('pin')}<span><b style="color:var(--fg)">Full address:</b> ${p.addr}</span></p>
          <a class="link" href="https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=17/${p.lat}/${p.lng}" target="_blank" rel="noopener">Open in a full map</a>
        </section>
      </div>
      <aside class="pd-side">
        <div class="side-card ask-card" id="tour">
          <h3>Interested in this home?</h3>
          <button type="button" class="btn btn-accent block ask-main" id="openTour">${ico('calendar')}<span><b>Request a showing</b><small>as early as ${firstSlot()} at 9 AM</small></span></button>
          <button type="button" class="btn btn-ghost block" id="openAsk">${ico('chat')}Contact Carlos</button>
          <p class="ask-note">${ico('shield')}Requests go to the CK office by email. Nothing is stored on the site.</p>
        </div>
      </aside>
    </div>
  </div>
  <div class="m-cta" id="mCta"><div><b>${money(p.price)}${rent ? ' /month' : ''}</b><small>${p.name}</small></div><a class="btn btn-accent" href="#tour">${ico('calendar')}Request a showing</a></div>
  <section class="sec tight" id="similar"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Similar homes</p><h2 class="title hl" data-split>More homes like this one</h2></div><a class="btn btn-ghost" href="index.html#listings">View all ${ico('arrow','mv')}</a></div><div class="mini-grid" id="simGrid"></div></div></section>`;
  paintIcons(MAIN);
  if (reduce) $('#pdTitle').classList.remove('anim-words'); else splitWords($('#pdTitle'));
  /* gallery */
  let cur = 0;
  const N = slides.length;
  /* the three side tiles show the next photos after the one in the main frame; the last tile opens the full set */
  const sideHTML = () => [1, 2, 3].map(k => {
    const i = (cur + k) % N, last = k === 3;
    const more = N - 4;
    return `<button class="g-thumb${last ? ' g-all' : ''}" data-i="${i}" aria-label="${last ? `See all ${N} photos` : `Open ${slides[i].l}`}">${slides[i].svg('t' + i)}${last
      ? `<span class="g-more">${ico('grid')}<b>${more > 0 ? '+' + more : N}</b><small>${more > 0 ? `See all ${N} photos` : 'See all photos'}</small></span>`
      : `<span>${slides[i].l}</span>`}</button>`;
  }).join('');
  const show = i => { cur = (i + N) % N; $$('#gMain .slide').forEach((s, k) => s.classList.toggle('on', k === cur)); $('#gSide').innerHTML = sideHTML(); paintIcons($('#gSide')); $('#gLabel').innerHTML = ico(slides[cur].ic) + slides[cur].l; $('#gCount').textContent = `${cur + 1} / ${N}`; };
  show(0);
  $('.g-prev').addEventListener('click', e => { e.stopPropagation(); show(cur - 1); });
  $('.g-next').addEventListener('click', e => { e.stopPropagation(); show(cur + 1); });
  const gm = $('#gMain');
  /* lightbox: browse every view with arrows, thumbnails, keyboard or swipe */
  const enlarge = (start = cur) => {
    let lb = start;
    showModal(`${xBtn}<div class="lb-stage" id="lbStage" tabindex="0" aria-roledescription="carousel" aria-label="${p.name} views">
      ${slides.map((s, i) => `<div class="lb-slide${i === lb ? ' on' : ''}" data-i="${i}" aria-hidden="${i !== lb}">${s.svg('lb')}</div>`).join('')}
      <button class="lb-nav lb-prev" aria-label="Previous view">${ico('arrow')}</button><button class="lb-nav lb-next" aria-label="Next view">${ico('arrow')}</button>
    </div>
    <div class="lb-bar"><b id="lbTitle"></b><span class="lb-count" id="lbCount" aria-live="polite"></span></div>
    <div class="lb-thumbs">${slides.map((s, i) => `<button class="lb-thumb" data-i="${i}" aria-label="Show ${s.l}">${s.svg('lbt')}<span>${s.l}</span></button>`).join('')}</div>`, 'wide lightbox');
    const m = modal();
    const go = (i, dir) => {
      const n = (i + slides.length) % slides.length; if (n === lb && dir) return;
      const d = dir || (n > lb ? 1 : -1);
      $$('.lb-slide', m).forEach((s, k) => { s.style.setProperty('--dx', (k === n ? d * 60 : -d * 60) + 'px'); s.classList.toggle('on', k === n); s.setAttribute('aria-hidden', k !== n); });
      lb = n;
      $('#lbTitle').innerHTML = ico(slides[n].ic) + `${p.name}: ${slides[n].l}`;
      $('#lbCount').textContent = `${n + 1} / ${slides.length}`;
      $$('.lb-thumb', m).forEach((t, k) => t.setAttribute('aria-current', k === n));
      const th = $$('.lb-thumb', m)[n], row = th.parentElement; row.scrollTo({left: th.offsetLeft - (row.clientWidth - th.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth'});
      show(n);
    };
    go(lb, 0);
    $('.lb-prev', m).addEventListener('click', () => go(lb - 1, -1));
    $('.lb-next', m).addEventListener('click', () => go(lb + 1, 1));
    $('.lb-thumbs', m).addEventListener('click', e => { const t = e.target.closest('.lb-thumb'); if (t) go(+t.dataset.i); });
    m.onkeydown = e => { if (e.key === 'ArrowRight'){ e.preventDefault(); go(lb + 1, 1); } else if (e.key === 'ArrowLeft'){ e.preventDefault(); go(lb - 1, -1); } };
    const stg = $('#lbStage'); let sx = null;
    stg.addEventListener('pointerdown', e => { sx = e.clientX; });
    stg.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 50) go(e.clientX < sx ? lb + 1 : lb - 1, e.clientX < sx ? 1 : -1); sx = null; });
    stg.focus({preventScroll:true});
  };
  gm.addEventListener('click', () => enlarge(cur));
  $('#gSide').addEventListener('click', e => { const t = e.target.closest('.g-thumb'); if (t) enlarge(t.classList.contains('g-all') ? cur : +t.dataset.i); });
  gm.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'Enter') enlarge(); });
  let gx = null; gm.addEventListener('pointerdown', e => { gx = e.clientX; }); gm.addEventListener('pointerup', e => { if (gx !== null && Math.abs(e.clientX - gx) > 50){ show(cur + (e.clientX < gx ? 1 : -1)); gm.dataset.swiped = 1; setTimeout(() => delete gm.dataset.swiped, 50); } gx = null; });
  gm.addEventListener('click', e => { if (gm.dataset.swiped) e.stopImmediatePropagation(); }, true);
  /* description */
  $('#descBtn').addEventListener('click', e => { const o = $('#desc').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); e.currentTarget.firstChild.textContent = o ? 'Show less ' : 'Read the full description '; });
  /* floor tabs */
  /* location: real map with the listing's pin */
  const mapEl = $('#pdMap');
  if (mapEl && window.L){
    const tile = () => `https://{s}.basemaps.cartocdn.com/${root.dataset.mode === 'dark' ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`;
    const m = L.map(mapEl, {scrollWheelZoom:false}).setView([p.lat, p.lng], 15);
    const t = L.tileLayer(tile(), {maxZoom:19, subdomains:'abcd', attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'}).addTo(m);
    let warned = false; t.on('tileerror', () => { if (warned) return; warned = true; mapEl.classList.add('tiles-off'); });
    new MutationObserver(() => t.setUrl(tile())).observe(root, {attributes:true, attributeFilter:['data-mode']});
    L.marker([p.lat, p.lng], {icon: L.divIcon({className:'ck-pin', html:'<span></span>', iconSize:[30, 40], iconAnchor:[15, 38]}), title:p.name}).addTo(m);
    m.on('focus', () => m.scrollWheelZoom.enable()); m.on('blur', () => m.scrollWheelZoom.disable());
    new ResizeObserver(() => m.invalidateSize()).observe(mapEl);
  } else if (mapEl){ mapEl.innerHTML = `<div class="map-off">${ico('map')}<span>${p.addr}</span></div>`; }
  /* showing request + contact: two buttons, each opens a step-by-step modal */
  const strip = (el, prev, next) => {
    const step = () => Math.max(140, el.clientWidth * .7);
    const upd = () => { const max = el.scrollWidth - el.clientWidth; prev.disabled = el.scrollLeft < 4; next.disabled = el.scrollLeft > max - 4; el.classList.toggle('fade-l', el.scrollLeft > 4); el.classList.toggle('fade-r', el.scrollLeft < max - 4); };
    prev.addEventListener('click', () => el.scrollBy({left:-step(), behavior: reduce ? 'auto' : 'smooth'}));
    next.addEventListener('click', () => el.scrollBy({left:step(), behavior: reduce ? 'auto' : 'smooth'}));
    el.addEventListener('scroll', upd, {passive:true}); new ResizeObserver(upd).observe(el); upd();
    let dn = false, x0 = 0, sl = 0, mv = 0;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dn = true; x0 = e.clientX; sl = el.scrollLeft; mv = 0; });
    addEventListener('pointermove', e => { if (!dn) return; const dx = e.clientX - x0; mv = Math.max(mv, Math.abs(dx)); if (mv > 6){ el.classList.add('dragging'); el.scrollLeft = sl - dx; } });
    addEventListener('pointerup', () => { if (!dn) return; dn = false; el.classList.remove('dragging'); });
    el.addEventListener('click', e => { if (mv > 6){ e.preventDefault(); e.stopImmediatePropagation(); mv = 0; } }, true);
  };
  const days = nextDays(14);
  const longDay = iso => new Date(iso + 'T12:00').toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'});
  const summaryHTML = () => `<div class="ask-sum"><div class="ask-th">${slides[0].svg('ask')}</div><div><b>${p.street}</b><span>${p.hood}, Omaha, NE ${p.zip}</span><small>${p.beds} bd | ${p.baths} ba | ${p.sqft.toLocaleString('en-US')} sqft</small></div></div>`;
  const pickerHTML = () => `
    <div class="seg ask-seg" id="mMode"><span class="ink" aria-hidden="true"></span><button type="button" aria-pressed="true" data-m="In person">${ico('walk')}In person</button><button type="button" aria-pressed="false" data-m="Video call">${ico('video')}Video call</button></div>
    <div class="lab"><div class="dp-head"><span>Pick a day</span><span class="dp-nav"><button type="button" class="dp-btn rev" id="mDaysPrev" aria-label="Earlier days">${ico('chevR')}</button><button type="button" class="dp-btn" id="mDaysNext" aria-label="Later days">${ico('chevR')}</button></span></div><div class="days" id="mDays" role="radiogroup" aria-label="Day">${days.map((d, i) => `<button type="button" class="day" role="radio" aria-checked="${i === 0}" aria-pressed="${i === 0}" data-d="${d.iso}"><small>${d.dow}</small><b>${d.day}</b><span>${d.mon}</span></button>`).join('')}</div></div>
    <div class="lab" id="mTimeLab"><div class="dp-head"><span>Pick a time window</span><span class="dp-nav"><button type="button" class="dp-btn rev" id="mTimesPrev" aria-label="Earlier times">${ico('chevR')}</button><button type="button" class="dp-btn" id="mTimesNext" aria-label="Later times">${ico('chevR')}</button></span></div><div class="days times" id="mTimes" role="radiogroup" aria-label="Time window" tabindex="-1">${TIME_WINDOWS.map(w => `<button type="button" class="day tw" role="radio" aria-checked="false" data-t="${w.v}"><small>${w.part}</small><b>${w.a}</b><span>${w.sfx}</span></button>`).join('')}</div></div>`;
  const bindPicker = m => {
    const pick = {mode:'In person', day:days[0].iso, time:''};
    const seg = $('#mMode', m), segInk = bindTabsInk(seg);
    seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach(x => x.setAttribute('aria-pressed', x === b)); segInk(); pick.mode = b.dataset.m; });
    strip($('#mDays', m), $('#mDaysPrev', m), $('#mDaysNext', m));
    strip($('#mTimes', m), $('#mTimesPrev', m), $('#mTimesNext', m));
    $('#mDays', m).addEventListener('click', e => { const b = e.target.closest('.day'); if (!b) return; $$('#mDays .day', m).forEach(x => { x.setAttribute('aria-pressed', x === b); x.setAttribute('aria-checked', x === b); }); pick.day = b.dataset.d; });
    const tm = $('#mTimes', m);
    tm.addEventListener('click', e => { const b = e.target.closest('.tw'); if (!b) return; $$('.tw', tm).forEach(x => x.setAttribute('aria-checked', x === b)); pick.time = b.dataset.t; tm.dataset.customErr = ''; clearErr(tm); });
    pick.ok = () => { if (pick.time) return true; showErr(tm, 'Choose a time window that suits you.'); tm.focus({preventScroll:true}); tm.scrollIntoView({block:'nearest'}); return false; };
    return pick;
  };
  const contactFields = (msg, req) => `
    <div class="row"><label>Full name<input name="name" required autocomplete="name"></label><label>Email address<input name="email" type="email" required autocomplete="email"></label></div>
    <label><span class="lab-top">Phone number<span class="hint">${req ? 'Required' : 'Optional'}</span></span><input name="phone" type="tel" autocomplete="tel" placeholder="(402) 555-0100"${req ? ' required' : ''}></label>
    <label>Message<textarea name="msg" required minlength="10">${msg}</textarea></label>`;
  const legal = `<p class="ask-legal">When you send this, the CK office gets your name, contact details, message and a link to this listing by email. The site does not keep a copy. Carlos or Janet may call or email you about this request.</p>`;
  const stepHead = (title, n, of) => `<div class="ask-head">${xBtn}<h2>${title}</h2>${n ? `<span class="ask-step">Step ${n} of ${of}</span>` : ''}</div>`;
  const goStep = (m, html) => { $('.ask-body', m).innerHTML = html; paintIcons(m); $('.ask-body', m).scrollTop = 0; m.scrollTop = 0; };
  const doneHTML = (title, text) => `<div class="ask-done"><div class="ask-house">${ico('home')}<span>${ico('check')}</span></div><h2>${title}</h2><p>${text}</p><button type="button" class="btn btn-accent block" data-close>Done</button></div>`;
  const sending = (btn, cb) => { btn.classList.add('loading'); btn.disabled = true; setTimeout(cb, reduce ? 0 : 800); };

  const openTour = () => {
    showModal(`<div class="ask-modal ask-body"></div>`, 'ask');
    const m = modal();
    const step1 = () => {
      goStep(m, `${stepHead('Request a showing', 1, 2)}${summaryHTML()}
        <p class="ask-tip">${ico('info')}<span>Carlos shows every CK home himself. Choose how you'd like to see it, then a day and a one-hour window.</span></p>
        ${pickerHTML()}
        <button type="button" class="btn btn-accent block lg" id="mNext">Next ${ico('arrow','mv')}</button>`);
      const pick = bindPicker(m);
      $('#mNext', m).addEventListener('click', () => { if (pick.ok()) step2(pick); });
    };
    const step2 = pick => {
      goStep(m, `${stepHead('Confirm your showing', 2, 2)}
        <div class="ask-chosen">${ico(pick.mode === 'In person' ? 'walk' : 'video')}<span><b>${pick.mode === 'In person' ? 'In-person showing' : 'Video call'}</b>${longDay(pick.day)}, ${pick.time}</span><button type="button" class="link" id="mBack">Change</button></div>
        <h3 class="ask-q">How can Carlos reach you to confirm?</h3>
        <form class="form plain" id="mForm" novalidate>${contactFields(`I'd like to see ${p.name}.`, false)}
          <button class="btn btn-accent block lg" type="submit">${ico('send')}Request showing</button></form>${legal}`);
      $('#mBack', m).addEventListener('click', step1);
      const f = $('#mForm', m);
      f.addEventListener('submit', e => { e.preventDefault(); if (!validate(f)) return; const fd = Object.fromEntries(new FormData(f).entries());
        sending($('button[type="submit"]', f), () => goStep(m, doneHTML('Showing requested', `Thanks, ${firstName(fd.name)}. You asked for ${pick.mode === 'In person' ? 'an in-person showing' : 'a video call'} of ${p.name} on ${longDay(pick.day)}, ${pick.time}. Carlos or Janet will confirm by email at ${fd.email}.`))); });
    };
    step1();
  };

  const openAsk = () => {
    showModal(`<div class="ask-modal ask-body"></div>`, 'ask');
    const m = modal();
    goStep(m, `${stepHead('Contact Carlos', 0, 0)}${summaryHTML()}
      <form class="form plain" id="mForm" novalidate>${contactFields(`I'm interested in ${p.addr}.`, false)}
        <button class="btn btn-accent block lg" type="submit">Next ${ico('arrow','mv')}</button></form>${legal}`);
    const f = $('#mForm', m);
    f.addEventListener('submit', e => { e.preventDefault(); if (!validate(f)) return; const fd = Object.fromEntries(new FormData(f).entries());
      sending($('button[type="submit"]', f), () => {
        goStep(m, `${xBtn}<div class="ask-done tight"><div class="ask-house">${ico('home')}<span>${ico('check')}</span></div><h2>Message sent</h2><p>Thanks, ${firstName(fd.name)}. Carlos will reply to ${fd.email}. Would you like to see the home too? Pick a time and he'll set it up.</p></div>
          ${pickerHTML()}
          <div class="ask-acts"><button type="button" class="btn btn-accent block lg" id="mPick">Request this time</button><button type="button" class="btn btn-ghost block" data-close>Not right now</button></div>`);
        const pick = bindPicker(m);
        $('#mPick', m).addEventListener('click', () => { if (!pick.ok()) return; sending($('#mPick', m), () => goStep(m, doneHTML('Showing requested', `You asked for ${pick.mode === 'In person' ? 'an in-person showing' : 'a video call'} of ${p.name} on ${longDay(pick.day)}, ${pick.time}. Carlos or Janet will confirm by email at ${fd.email}.`))); });
      });
    });
  };
  $('#openTour').addEventListener('click', openTour);
  $('#openAsk').addEventListener('click', openAsk);
  /* mobile booking bar: shown after the header area, hidden while the tour form is on screen */
  document.body.classList.add('has-mcta');
  const mc = $('#mCta'), tour = $('#tour');
  $('#mCta a').addEventListener('click', e => { e.preventDefault(); openTour(); });
  scrollHooks.push(y => { const r = tour.getBoundingClientRect(); mc.classList.toggle('show', y > 400 && !(r.top < innerHeight && r.bottom > 0)); });
  /* similar homes */
  const sim = DATA.filter(x => x.id !== p.id && (x.type === p.type || x.hood === p.hood)).sort((a, b) => (b.type === p.type) - (a.type === p.type)).slice(0, 3);
  $('#simGrid').innerHTML = sim.map(card).join('');
}
/* one-hour showing windows, 9 AM to 5 PM */
const TIME_WINDOWS = (() => {
  const h12 = h => ((h + 11) % 12) + 1;
  const name = h => h === 12 ? 'noon' : `${h12(h)} ${h < 12 ? 'AM' : 'PM'}`;
  const out = [];
  for (let h = 9; h < 17; h++){
    const e = h + 1;
    const sameHalf = (h < 12) === (e < 12) && h !== 12 && e !== 12;
    out.push({
      part: h < 12 ? 'Morning' : h === 12 ? 'Midday' : 'Afternoon',
      a: h === 12 ? 'Noon' : `${h12(h)} ${h < 12 ? 'AM' : 'PM'}`,
      sfx: `to ${name(e)}`,
      v: sameHalf ? `${h12(h)} to ${h12(e)} ${e < 12 ? 'AM' : 'PM'}` : `${name(h)} to ${name(e)}`
    });
  }
  return out;
})();
const AGENTS = [
  {n:'Carlos Kosala', r:'Broker, CK Real Estate', ph:OFFICE.phone, em:OFFICE.email}
];
const firstSlot = () => { const d = nextDays(1)[0], t = new Date(); t.setDate(t.getDate() + 1); return d.iso === new Date(t.setHours(12, 0, 0, 0)).toISOString().slice(0, 10) ? 'tomorrow' : new Date(d.iso + 'T12:00').toLocaleDateString('en-US', {weekday:'long'}); };
function nextDays(n){
  const out = [], d = new Date(); d.setHours(12, 0, 0, 0);
  for (let i = 1; out.length < n; i++){ const x = new Date(d); x.setDate(d.getDate() + i); if (x.getDay() === 0) continue; out.push({iso: x.toISOString().slice(0, 10), dow: x.toLocaleDateString('en-US', {weekday:'short'}), day: x.getDate(), mon: x.toLocaleDateString('en-US', {month:'short'})}); }
  return out;
}
/* ================= page: about ================= */
/* stand-in until Carlos supplies his portrait photo */
const PORTRAIT = `<svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait of Carlos Kosala (placeholder)"><defs><linearGradient id="ptg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E1D2F"/><stop offset="1" stop-color="#1A0207"/></linearGradient><radialGradient id="ptl" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="400" height="340" fill="url(#ptg)"/><rect width="400" height="340" fill="url(#ptl)"/><circle cx="200" cy="132" r="56" fill="#F3E8EA" opacity=".92"/><path d="M78 340 C88 252 140 214 200 214 C260 214 312 252 322 340Z" fill="#F3E8EA" opacity=".92"/><path d="M172 214 L200 262 L228 214Z" fill="#75000E" opacity=".55"/><text x="20" y="32" fill="#fff" opacity=".75" font-family="Figtree, sans-serif" font-size="13" font-weight="600">[Carlos's portrait photo goes here]</text></svg>`;
function initAbout(){
  buildSky($('#sky'), 311);
  if (!reduce){ splitWords($('#pageTitle')); $('#pageTitle').classList.add('anim-words'); }
  $('#abArt').innerHTML = PORTRAIT;
  bindForm($('#aboutForm'), fd => successHTML('Sent to Carlos', `Thanks, ${firstName(fd.name)}. Your message is in Carlos's inbox, and he'll reply to ${fd.email}.`, `<button class="btn btn-ghost sm" type="button" onclick="location.reload()">Send another message</button>`), 900);
  const VT = [
    {k:'who', t:'Who we are', ic:'users', h:'A small office: Carlos and Janet', p:'CK Real Estate is Carlos Kosala\'s brokerage in Omaha. Carlos handles the listings and the buyers. Janet works alongside him, and both of them can update the site.', ticks:['Carlos is the broker on every listing','Janet keeps listings and the office running','You deal with the same two people from start to finish'], a:{...DATA[1], id:202, seed:5150}},
    {k:'what', t:'What we do', ic:'briefcase', h:'Help people buy and sell homes in Omaha', p:'Carlos lists ranches, Tudors, split-entries, townhomes and condos in Benson, Downtown, Happy Hollow and Rockbrook. He shows the homes, answers questions and works through the offer with you.', ticks:['Homes for sale in four neighborhoods','Showings set up around your schedule','Help pricing your house if you want to sell'], a:{...DATA[3], id:203, seed:6262}},
    {k:'how', t:'How we work', ic:'target', h:'Clear listings, quick answers', p:'Each listing has four photos, the full address and the price, and it comes down from public view once it sells. Questions from the site go straight to the office inbox, and Carlos or Janet writes back.', ticks:['Four photos on every listing','Sold homes are taken off the public site','Every message reaches a real person'], a:{...DATA[2], id:204, seed:7373}}
  ];
  const list = $('#vtList'), panel = $('#vtPanel');
  list.innerHTML = VT.map((v, i) => `<button class="vt" role="tab" aria-selected="${i === 0}" data-i="${i}" id="vt${i}" aria-controls="vtPanel"><span class="vi">${ico(v.ic)}</span>${v.t}${ico('arrow','go')}</button>`).join('');
  const show = i => { const v = VT[i]; $$('.vt', list).forEach((b, k) => b.setAttribute('aria-selected', k === i)); panel.setAttribute('aria-labelledby', 'vt' + i); panel.innerHTML = `<div class="vp-art">${art(v.a, 'vt' + i)}</div><div class="vp-tx" key="${i}"><h3>${v.h}</h3><p>${v.p}</p><ul class="ticks">${v.ticks.map(t => `<li>${ico('check')}${t}</li>`).join('')}</ul><a class="btn btn-dark" href="contact.html" style="align-self:flex-start">Contact the office ${ico('arrow','mv')}</a></div>`; };
  list.addEventListener('click', e => { const b = e.target.closest('.vt'); if (b) show(+b.dataset.i); });
  list.addEventListener('keydown', e => { const cur = $$('.vt', list).findIndex(b => b.getAttribute('aria-selected') === 'true'); if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); show((cur + 1) % VT.length); $$('.vt', list)[(cur + 1) % VT.length].focus(); } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); show((cur + VT.length - 1) % VT.length); $$('.vt', list)[(cur + VT.length - 1) % VT.length].focus(); } });
  show(0);
  /* timeline */
  const TL = [['Step 1','A listing is added','Carlos or Janet enters the address, price and details, and uploads four photos.'],['Step 2','It shows up for buyers','The home appears in Browse homes and in searches by type, neighborhood and price.'],['Step 3','It may be featured','Carlos picks one home at a time to feature on the home page.'],['Step 4','Status changes','When an offer comes in the listing moves to Pending, then to Sold.'],['Step 5','It comes down, not out','A sold home is hidden from the public site. The record and photos stay in the office files.']];
  const tl = $('#timeline');
  tl.innerHTML = `<span class="tl-fill" aria-hidden="true"></span>` + TL.map(([y, h, t]) => `<div class="tl-i rv"><span class="dotm" aria-hidden="true"></span><div class="tl-card"><b>${y}</b><h3>${h}</h3><p>${t}</p></div></div>`).join('');
  scrollHooks.push(() => { const r = tl.getBoundingClientRect(); const pr = Math.max(0, Math.min(1, (innerHeight * .6 - r.top) / r.height)); tl.style.setProperty('--tp', pr.toFixed(3)); $$('.tl-i', tl).forEach(i => { const ir = i.getBoundingClientRect(); i.classList.toggle('reached', ir.top + 30 < innerHeight * .6); }); });
  /* team */
  const TEAM = [['Carlos Kosala','Broker and owner'],['Janet','CK Real Estate office']];
  $('#team').innerHTML = TEAM.map(([n, r], i) => { const g = 'tm' + i, hue = ['#75000E','#4A0009','#8E1D2F','#2A0006','#5C0712'][i]; return `<article class="member"><div class="ph"><svg viewBox="0 0 200 210" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hue}"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="200" height="210" fill="url(#${g})"/>${skyline(400 + i * 11, 200, 210, [{cls:'c-s1', minW:14, maxW:30, minH:40, maxH:120, gap:4, shapes:true}])}</svg><span class="ini">${n.split(' ').map(x => x[0]).join('')}</span><div class="soc"><button data-copy="${OFFICE.email}" data-copy-label="Email address" aria-label="Copy the office email address">${ico('mail')}</button><button data-copy="${OFFICE.phone}" data-copy-label="Phone number" aria-label="Copy the office phone number">${ico('phone')}</button></div></div><div class="mi"><h3>${n}</h3><small>${r}</small></div></article>`; }).join('');
}

/* ================= page: local area ================= */
function initLocal(){
  buildSky($('#sky'), 733);
  if (!reduce){ splitWords($('#pageTitle')); $('#pageTitle').classList.add('anim-words'); }
  $('#laNav').innerHTML = POSTS.map(c => `<a class="chip" href="#${c.slug}">${ico('pin')}${c.tag}</a>`).join('');
  $('#laList').innerHTML = POSTS.map((c, i) => `<section class="la-cat rv" id="${c.slug}">
    <div class="la-head"><div class="la-art">${blogArt(i)}</div><div><p class="eyebrow">${String(i + 1).padStart(2, '0')} · Local area</p><h2>${c.tag}</h2><p class="lead">${c.body[0]}</p></div></div>
    <ul class="la-items">${c.ent.map(e => `<li><a class="la-item" href="${e.href}" target="_blank" rel="noopener"><span class="la-i">${ico('pin')}</span><span><b>${e.t}</b><small>${e.d}</small></span>${ico('arrowUR','go')}</a></li>`).join('')}</ul>
  </section>`).join('');
  $('#laList').addEventListener('click', e => { const a = e.target.closest('a[href="#"]'); if (a){ e.preventDefault(); toast('Carlos adds this link from the admin area.', 'info'); } });
  if (location.hash && $(location.hash)) setTimeout(() => goTo(location.hash), 120);
}

/* ================= page: contact ================= */
function initContact(){
  buildSky($('#sky'), 523);
  if (!reduce){ splitWords($('#pageTitle')); $('#pageTitle').classList.add('anim-words'); }
  makeSelect($('#cTopic'), OPT.topic);
  const seg = $('#prefSeg'), ink = bindTabsInk(seg);
  seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach(x => x.setAttribute('aria-pressed', x === b)); ink(); $('#contactForm [name="pref"]').value = b.dataset.v; $('#cPhone').required = b.dataset.v === 'Phone'; $('#phoneHint').textContent = b.dataset.v === 'Phone' ? 'Required' : 'Optional'; });
  bindForm($('#contactForm'), fd => successHTML('Sent to the office', `Thanks, ${firstName(fd.name)}. Carlos or Janet will get back to you by ${fd.pref === 'Phone' ? 'phone at ' + fd.phone : 'email at ' + fd.email} about ${fd.topic.toLowerCase()}.`, `<button class="btn btn-ghost sm" type="button" onclick="location.reload()">Send another message</button>`), 900);
  buildFaq($('#faq'), FAQ);
}

/* ================= page: login / register ================= */
function authArt(){
  const p = {...DATA[0], id:301, seed:8080};
  const box = $('#authArt'); if (!box) return;
  const r = rng(77); let stars = ''; for (let k = 0; k < 60; k++) stars += `<circle class="c-star" style="animation-delay:-${(r()*3).toFixed(1)}s" cx="${(r()*400).toFixed(0)}" cy="${(r()*300).toFixed(0)}" r="${(r()*1.1+.3).toFixed(1)}"/>`;
  box.innerHTML = `<svg class="stars-l" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${stars}</svg><div class="scene">${art(p, 'au', 0, 'A house')}</div><div class="shade"></div><div class="copy"><span class="eyebrow" style="color:#F0CFD4;margin:0">CK Real Estate</span><h2>Welcome back.</h2><div class="glass"><div><b>${DATA.length}</b><span>homes listed</span></div><div><b>${CITIES.length}</b><span>neighborhoods</span></div></div></div>`;
  /* desktop: whole house, bottom aligned; small screens: scene covers the page behind the form */
  const sv = $('.scene svg', box), mq = matchMedia('(max-width:900px)');
  const fit = () => sv && sv.setAttribute('preserveAspectRatio', mq.matches ? 'xMidYMax slice' : 'xMidYMax meet');
  fit(); mq.addEventListener('change', fit);
}
function bindPw(scope){
  $$('.pw-toggle', scope).forEach(b => b.addEventListener('click', () => { const i = b.parentElement.querySelector('input'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.innerHTML = ico(show ? 'eyeOff' : 'eye'); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); b.setAttribute('aria-pressed', show); }));
}
const DEMO_NOTE = `<div class="auth-note">${ico('info')}<span>Demo form. Nothing is sent or stored. Connect it to your sign-in service before launch.</span></div>`;
function initLogin(){
  authArt(); bindPw(MAIN);
  $('#forgotBtn').addEventListener('click', () => { const o = $('#resetPanel').classList.toggle('open'); $('#forgotBtn').setAttribute('aria-expanded', o); if (o) setTimeout(() => $('#rEmail').focus(), 300); });
  $('#resetSend').addEventListener('click', () => { const i = $('#rEmail'); if (!i.value || !i.checkValidity()){ showErr(i, 'Enter the email address on your account.'); i.focus(); return; } clearErr(i); $('#resetPanel .reset-in').innerHTML = `<p style="display:flex;gap:10px;color:var(--ok);font-weight:600">${ico('check')}If ${i.value} belongs to an account, a reset link is on its way.</p>`; });
  /* prototype: any username and password open the dashboard. Django checks real accounts. */
  $('#loginForm').addEventListener('submit', e => { e.preventDefault(); if (!validate(e.target)) return; const b = $('button[type="submit"]', e.target); b.classList.add('loading'); try{ const who = /carlos/i.test($('#lgUser').value) ? 'Carlos' : 'Janet'; sessionStorage.setItem('ck-admin-user', who); sessionStorage.setItem('ck-admin-login', JSON.stringify({who, ts: Date.now()})); }catch(err){} setTimeout(() => { location.href = 'admin.html'; }, reduce ? 0 : 700); });
}
function initRegister(){
  authArt(); bindPw(MAIN);
  makeSelect($('#rRole'), OPT.role); makeSelect($('#rCountry'), OPT.country);
  const pw = $('#rPw'), pw2 = $('#rPw2'), meter = $('#meter'), match = $('#match');
  const RULES = [['len', v => v.length >= 8, '8 or more characters'], ['up', v => /[A-Z]/.test(v), 'An uppercase letter'], ['num', v => /\d/.test(v), 'A number'], ['sym', v => /[^A-Za-z0-9]/.test(v), 'A symbol']];
  $('#reqs').innerHTML = RULES.map(([k, , l]) => `<li data-k="${k}">${ico('check')}${l}</li>`).join('');
  const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const check = () => {
    const v = pw.value; let s = 0;
    RULES.forEach(([k, f]) => { const ok = f(v); if (ok) s++; $(`#reqs [data-k="${k}"]`).classList.toggle('met', ok); });
    meter.dataset.s = v ? s : 0; $('#meterLbl').textContent = v ? LABELS[s] : '';
    if (pw2.value){ const ok = pw2.value === v; match.className = 'match ' + (ok ? 'ok' : 'no'); match.innerHTML = ico(ok ? 'check' : 'close') + (ok ? 'Passwords match' : 'Passwords do not match'); }
    else { match.className = 'match'; match.innerHTML = ''; }
    pw.dataset.customErr = s < 3 ? '1' : ''; pw2.dataset.customErr = pw2.value !== v ? '1' : '';
  };
  pw.addEventListener('input', check); pw2.addEventListener('input', check); check();
  const form = $('#registerForm');
  form.addEventListener('submit', () => {
    if (pw.dataset.customErr === '1') showErr(pw, 'Use a stronger password that meets at least three of the rules below.'); else clearErr(pw);
    if (pw2.dataset.customErr === '1') showErr(pw2, 'Type the same password again.'); else clearErr(pw2);
  }, true);
  bindForm(form, fd => successHTML(`Thanks, ${firstName(fd.name)}`, `Your details as a ${fd.role.toLowerCase()} in ${fd.country} passed validation.`, `${DEMO_NOTE}<a class="btn btn-accent" href="index.html">Browse listings ${ico('arrow','mv')}</a>`), 1000);
}

/* ================= boot ================= */
function init(){
  renderHeader(); renderFooter();
  bindShell();
  ({home:initHome, property:initProperty, about:initAbout, contact:initContact, local:initLocal, login:initLogin, register:initRegister}[PAGE] || (() => {}))();
  paintIcons();
  bindReveal();
}
init();
})();
