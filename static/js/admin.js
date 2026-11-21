/* CK Real Estate admin behavior (Django build).
   Built from the prototype's admin.js (prototype/admin.js). The markup and data come from the templates;
   this adds the side menu, theme, menus, Tom Select, Quill, Leaflet and IMask, and the add-listing helpers. */
(() => {
'use strict';
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

Object.assign(IC, {
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  bars:'M3 3v18h18M7 16v-4M12 16V8M17 16v-7',
  activity:'M22 12h-4l-3 9L9 3l-3 9H2',
  panel:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18M16 10l-2 2 2 2',
  menu:'M4 6h16M4 12h16M4 18h10',
  more:'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  cal:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ext:'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  idcard:'M16 10h2M16 14h2M6.2 15a3 3 0 0 1 5.6 0M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'
});
const ico = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n] || IC.info}"/></svg>`;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k, d){ try{ const v = JSON.parse(localStorage.getItem(k) || 'null'); return v ?? d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
if (store.get('ck-mode', 'light') === 'dark') root.dataset.mode = 'dark';
const paintIcons = (r = document) => $$('[data-ic]', r).forEach(i => { i.outerHTML = ico(i.dataset.ic, i.className); });
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const moneyK = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'k';
const rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 7;
const toast = (message, level = 'info') => { if (window.CKFeedback) window.CKFeedback.toast(message, level); };

/* ---------- extra icons for the admin pages ---------- */
Object.assign(IC, {
  edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  trash:'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff:'M17.9 17.9A10 10 0 0 1 12 19C5.5 19 2 12 2 12a18 18 0 0 1 5.1-5.9M9.9 5.2A9 9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M14.1 14.2a3 3 0 0 1-4.2-4.2M2 2l20 20',
  upload:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  image:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  printer:'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  link:'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  refresh:'M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5',
  alert:'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  lock:'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  drag:'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
});
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const qs = new URLSearchParams(location.search);
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const HOODS = ['Benson', 'Downtown', 'Happy Hollow', 'Rockbrook'];
const TYPES = ['Ranch', 'Tudor', 'Split-Entry', 'Townhome', 'Condominium'];
const STATUSES = ['Available', 'Pending', 'Sold'];
const HOOD_LL = {'Benson':[41.2853, -96.0031], 'Downtown':[41.2587, -95.9378], 'Happy Hollow':[41.2664, -95.9887], 'Rockbrook':[41.2386, -96.0752]};
const OMAHA = [41.2565, -95.9945];

const FEAT_BY_TYPE = {
  Ranch:['Single-level living','Attached garage','Finished basement','Fenced backyard','Central air','Laundry on the main floor'],
  Tudor:['Original woodwork','Fireplace','Detached garage','Mature trees','Central air','Full basement'],
  'Split-Entry':['Two living levels','Lower-level family room','Attached garage','Fenced backyard','Central air','Walkout or daylight windows'],
  Townhome:['Attached garage','Private patio','Central air','Laundry room','Low-maintenance yard','Walk to shops'],
  Condominium:['Elevator','Secure entry','Assigned parking','Central air','In-unit laundry','Walk to restaurants']
};
const FEAT_SUGGEST = [...new Set(Object.values(FEAT_BY_TYPE).flat().concat(['Hardwood floors','Updated kitchen','Deck','Sprinkler system','New roof','Walk-in closet']))].sort();
const seedFeatures = (type, id) => { const f = FEAT_BY_TYPE[type], seed = id * 977 + 13; return f.filter((_, i) => i !== seed % f.length); };
const BAND = 50000;
const bandOf = p => Math.floor(p / BAND) * BAND;
const bandLbl = v => `${moneyK(v)} to ${moneyK(v + BAND)}`;

let dlg, closeT, dlgResolve = null;
function openDialog({title, body, foot = '', wide = false, onOpen}){
  if (dlgResolve){ const r = dlgResolve; dlgResolve = null; r(false); }
  clearTimeout(closeT); if (dlg && dlg.open) dlg.close();
  if (!dlg){ dlg = document.createElement('dialog'); dlg.className = 'mdl'; document.body.append(dlg);
    dlg.addEventListener('click', e => { if (e.target === dlg) closeDialog(); });
    dlg.addEventListener('cancel', e => { e.preventDefault(); closeDialog(); }); }
  dlg.classList.toggle('wide', wide);
  dlg.innerHTML = `<div class="mdl-in"><header class="mdl-h"><h2 id="mdlT">${title}</h2><button type="button" class="rbtn mdl-x" data-close aria-label="Close">${ico('close')}</button></header><div class="mdl-b">${body}</div>${foot ? `<footer class="mdl-f">${foot}</footer>` : ''}</div>`;
  dlg.setAttribute('aria-labelledby', 'mdlT');
  $$('[data-close]', dlg).forEach(b => b.addEventListener('click', () => closeDialog()));
  dlg.showModal(); document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => dlg.classList.add('in'));
  onOpen && onOpen(dlg);
  return dlg;
}
function closeDialog(v = false){ if (!dlg || !dlg.open) return; dlg.classList.remove('in'); const d = dlg; closeT = setTimeout(() => { d.close(); document.body.style.overflow = ''; }, reduce ? 0 : 160); if (dlgResolve){ const r = dlgResolve; dlgResolve = null; r(v); } }
function confirmBox({title, text, ok = 'Confirm', danger = false, icon = 'alert'}){
  if (window.CKFeedback) return window.CKFeedback.confirm({title, text, ok, danger});
  return new Promise(res => {
    openDialog({title, body:`<div class="cf"><span class="cf-ic${danger ? ' del' : ''}">${ico(icon)}</span><p>${text}</p></div>`,
      foot:`<button type="button" class="pbtn ghost" data-close>Cancel</button><button type="button" class="pbtn ${danger ? 'danger' : 'acc'}" id="cfOk">${ok}</button>`,
      onOpen: d => { $('#cfOk', d).addEventListener('click', () => closeDialog(true)); $('#cfOk', d).focus(); }});
    dlgResolve = res;
  });
}

/* ---------- row action menu ---------- */

const fErr = (el, msg) => { const f = el.closest('.fld'); if (!f) return; f.classList.add('err'); let m = $('.f-err', f); if (!m){ m = document.createElement('small'); m.className = 'f-err'; m.id = (el.id || 'f' + Math.random().toString(36).slice(2)) + 'Err'; f.append(m); } m.innerHTML = ico('alert') + msg; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', m.id); };
const fOk = el => { const f = el.closest('.fld'); if (!f) return; f.classList.remove('err'); const m = $('.f-err', f); m && m.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); };

// Empty photo slots use clearly labeled stock photography, never a fabricated property image.
const houseThumb = () => `<span class="estate-photo"><img class="estate-day" src="${esc(document.body.dataset.estateDay)}" alt="Illustrative stock photo in daylight"><img class="estate-night" src="${esc(document.body.dataset.estateNight)}" alt="Illustrative stock photo at night"></span>`;

const ANY = {tHood:'All neighborhoods', tType:'All home types', tStatus:'Any status', tBand:'Any price', lHood:'All neighborhoods', lType:'All home types', lStatus:'Any status', lBand:'Any price', aWho:'Anyone', aAct:'Any change', aWhen:'Any time'};
function enhanceSelect(sel){
  if (typeof TomSelect !== 'undefined') return tomSelect(sel);
  const wrap = sel.closest('.t-sel'); wrap.classList.add('cs');
  const id = sel.id + 'Pop';
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cs-btn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
  const pop = document.createElement('div'); pop.className = 'cs-pop'; pop.id = id; pop.setAttribute('role', 'listbox'); pop.setAttribute('aria-label', (wrap.querySelector('.sr') || {}).textContent || 'Options');
  sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.classList.add('cs-native');
  wrap.append(btn, pop);
  const opts = () => [...sel.options];
  const paint = () => {
    const o = sel.options[sel.selectedIndex];
    btn.innerHTML = `<span class="cs-v${sel.value ? ' on' : ''}">${o.textContent}</span>${ico('chev', 'chv')}`;
    pop.innerHTML = opts().map((x, i) => `<button type="button" role="option" data-i="${i}" aria-selected="${i === sel.selectedIndex}">${x.value === '' ? `<span class="cs-any">${ANY[sel.id] || x.textContent}</span>` : x.textContent}${i === sel.selectedIndex ? ico('check') : ''}</button>`).join('');
  };
  const close = () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  const open = () => { $$('.cs.open').forEach(c => c !== wrap && c.classList.remove('open')); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); const cur = $('[aria-selected="true"]', pop) || $('button', pop); cur && cur.focus({preventScroll:true}); };
  btn.addEventListener('click', e => { e.stopPropagation(); wrap.classList.contains('open') ? close() : open(); });
  pop.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; e.stopPropagation(); sel.selectedIndex = +b.dataset.i; sel.dispatchEvent(new Event('change')); paint(); close(); btn.focus(); });
  pop.addEventListener('keydown', e => {
    const items = $$('button', pop), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown'){ e.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); items[Math.max(0, i - 1)].focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab'){ close(); if (e.key === 'Escape'){ e.stopPropagation(); btn.focus(); } }
  });
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown'){ e.preventDefault(); open(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  sel.addEventListener('sync', paint);
  paint();
}

/* ---------- reveal on scroll ---------- */
function reveal(){
  const els = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px'});
  els.forEach((e, i) => { e.style.transitionDelay = Math.min(i, 6) * 60 + 'ms'; io.observe(e); });
}


const LIB = n => typeof window[n] !== 'undefined';

/* ---------- Tom Select ---------- */
function tomSelect(sel){
  const wrap = sel.closest('.t-sel'); wrap.classList.add('tsw');
  const any = ANY[sel.id];
  const search = sel.options.length > 7 || 'search' in sel.dataset;
  const ts = new TomSelect(sel, {
    allowEmptyOption: true, maxOptions: null, create: false, closeAfterSelect: true, refreshThrottle: 0,
    controlInput: search ? undefined : null,
    plugins: search ? ['dropdown_input'] : [],
    searchField: ['text'],
    render: {
      option: d => `<div>${d.value === '' ? `<span class="cs-any">${esc(any || d.text)}</span>` : esc(d.text)}</div>`,
      item: d => `<div class="${d.value === '' ? 'ph' : ''}">${esc(d.text)}</div>`,
      no_results: () => '<div class="no-results">No matches</div>'
    },
    onDropdownOpen(){ wrap.classList.add('open'); },
    onDropdownClose(){ wrap.classList.remove('open'); }
  });
  ts.control.setAttribute('aria-label', (wrap.querySelector('.sr') || {}).textContent || 'Options');
  sel.addEventListener('sync', () => ts.setValue(sel.value, true));
  sel._ts = ts;
  return ts;
}

/* ---------- Quill rich text, stored as cleaned HTML ---------- */
const RT_TAGS = {ALLOWED_TAGS:['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ol', 'ul', 'li', 'a'], ALLOWED_ATTR:['href', 'target', 'rel']};
const isHTML = s => /<\/?(p|br|strong|em|b|i|u|ol|ul|li|a)\b/i.test(s || '');
const toHTML = s => isHTML(s) ? s : String(s || '').split(/\n\s*\n/).filter(p => p.trim()).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
const clean = html => LIB('DOMPurify') ? DOMPurify.sanitize(html, RT_TAGS) : esc(String(html).replace(/<[^>]+>/g, ' '));
const richOut = s => clean(toHTML(s)).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
const plainText = s => { const d = document.createElement('div'); d.innerHTML = clean(toHTML(s)); return d.textContent.replace(/\s+/g, ' ').trim(); };
const textLen = el => el._q ? el._q.getText().replace(/\s+/g, ' ').trim().length : el.value.trim().length;
function richText(ta, {max = 2000, placeholder = ''} = {}){
  if (!LIB('Quill')) return null;
  const box = document.createElement('div'); box.className = 'rt';
  const ed = document.createElement('div'); box.append(ed);
  ta.after(box); ta.hidden = true;
  const q = new Quill(ed, {theme:'snow', placeholder, modules:{toolbar:[['bold', 'italic'], [{list:'ordered'}, {list:'bullet'}], ['link'], ['clean']]}});
  const set = v => { q.setContents([], 'silent'); if (v) q.clipboard.dangerouslyPasteHTML(0, clean(toHTML(v)), 'silent'); };
  set(ta.value);
  q.root.setAttribute('aria-label', ($(`label[for="${ta.id}"]`) || {}).textContent || 'Text');
  q.root.setAttribute('aria-multiline', 'true'); q.root.setAttribute('role', 'textbox');
  q.on('text-change', (d, old, src) => {
    if (q.getLength() - 1 > max) q.deleteText(max, q.getLength(), 'silent');
    const txt = q.getText().trim();
    ta.value = txt ? clean(q.root.innerHTML) : '';
    ta.dispatchEvent(new Event('input', {bubbles:true}));
  });
  q.root.addEventListener('focus', () => box.classList.add('focus'));
  q.root.addEventListener('blur', () => box.classList.remove('focus'));
  ta._q = q; ta._setRT = set;
  ta.focus = () => q.focus();
  return q;
}

/* ---------- maps ---------- */
const llOf = x => x.lat != null ? [x.lat, x.lng] : HOOD_LL[x.hood] || OMAHA;
const tileUrl = () => `https://{s}.basemaps.cartocdn.com/${root.dataset.mode === 'dark' ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`;
function baseMap(el, opts = {}){
  if (!LIB('L')) { el.innerHTML = `<div class="map-off">${ico('map')}<span>The map could not load. The address still saves.</span></div>`; return null; }
  const m = L.map(el, {scrollWheelZoom:false, zoomControl:true, attributionControl:true, ...opts});
  const t = L.tileLayer(tileUrl(), {maxZoom:19, subdomains:'abcd', attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'}).addTo(m);
  let warned = false;
  t.on('tileerror', () => { if (warned) return; warned = true; el.classList.add('tiles-off'); el.insertAdjacentHTML('beforeend', `<div class="map-note">${ico('info')}The map background could not load here. Pins and circles still work.</div>`); });
  new MutationObserver(() => t.setUrl(tileUrl())).observe(root, {attributes:true, attributeFilter:['data-mode']});
  m.on('focus', () => m.scrollWheelZoom.enable()); m.on('blur', () => m.scrollWheelZoom.disable());
  setTimeout(() => m.invalidateSize(), 200);
  return m;
}
const pinIcon = () => L.divIcon({className:'ck-pin', html:'<span></span>', iconSize:[30, 40], iconAnchor:[15, 38], tooltipAnchor:[0, -34]});

const maskPrice = el => LIB('IMask') ? IMask(el, {mask:Number, scale:0, thousandsSeparator:',', min:0, max:50000000}) : (el.addEventListener('input', () => { const c = el.value.replace(/[^\d]/g, ''); el.value = c ? (+c).toLocaleString('en-US') : ''; }), null);
const maskZip = el => LIB('IMask') ? IMask(el, {mask:'00000'}) : (el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, '').slice(0, 5); }), null);
/* ================= Django glue =================
   The admin pages are rendered by Django templates with the prototype's markup.
   This adds the shell (side menu, theme, menus), the libraries, and the add-listing helpers.
   Forms post to Django, which checks everything again. */

function bindShell(){
  const adm = $('#adm'), scrim = $('#sbScrim'), tog = $('#tbTog');
  if (!adm || !tog) return;
  const small = matchMedia('(max-width:900px)');
  const syncTog = () => { const open = small.matches ? adm.classList.contains('drawer') : !adm.classList.contains('collapsed'); tog.setAttribute('aria-expanded', open); tog.setAttribute('aria-label', small.matches ? 'Open menu' : open ? 'Collapse menu' : 'Expand menu'); tog.title = tog.getAttribute('aria-label'); };
  const setCol = c => { adm.classList.toggle('collapsed', c); store.set('ck-admin-collapsed', c); syncTog(); };
  const drawer = o => { adm.classList.toggle('drawer', o); scrim.hidden = !o; document.body.style.overflow = o ? 'hidden' : ''; syncTog(); if (o) $('#sbClose').focus(); };
  setCol(store.get('ck-admin-collapsed', false));
  small.addEventListener('change', syncTog);
  tog.addEventListener('click', () => small.matches ? drawer(true) : setCol(!adm.classList.contains('collapsed')));
  $('#sbClose').addEventListener('click', () => drawer(false));
  scrim.addEventListener('click', () => drawer(false));
  const pops = $$('.has-pop');
  const closePops = except => pops.forEach(p => { if (p !== except){ p.classList.remove('open'); const b = $('button', p); b && b.setAttribute('aria-expanded', false); } });
  pops.forEach(p => { const b = $('button', p); b.addEventListener('click', e => { e.stopPropagation(); const o = !p.classList.contains('open'); closePops(p); p.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }); });
  document.addEventListener('click', e => { if (!e.target.closest('.has-pop')) closePops(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.querySelector('dialog[open]')){ drawer(false); closePops(); }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable){ const s = $('#tbSearch'); if (s && s.offsetParent){ e.preventDefault(); s.focus(); } }
  });
  matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) drawer(false); });
  const tb = $('#themeBtn');
  const paintTheme = () => { const d = root.dataset.mode === 'dark'; tb.innerHTML = ico(d ? 'sun' : 'moon'); tb.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode'); };
  paintTheme();
  tb.addEventListener('click', () => { const d = root.dataset.mode !== 'dark'; if (d) root.dataset.mode = 'dark'; else delete root.dataset.mode; store.set('ck-mode', d ? 'dark' : 'light'); paintTheme(); });
  /* the side-menu Log out is a POST form (Django 5): it looks like the other menu items */
  $$('form[action$="/logout/"]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.confirming === '1') return;
    form.dataset.confirming = '1';
    const accepted = await confirmBox({title:'Log out?', text:'You will need to log in again to manage listings. Unsaved form changes will be lost.', ok:'Log out', danger:true});
    form.dataset.confirming = '0';
    if (accepted){ document.dispatchEvent(new Event('ck:leaving')); form.submit(); }
  }));
  /* house thumbnails stand in until a listing has photos */
  $$('[data-thumb]').forEach(el => { el.innerHTML = houseThumb(+el.dataset.thumb, 'big' in el.dataset); });
  /* Django messages */
  // admin-feedback.js presents every Django message, including its severity.
}

/* ---------- dashboard: listings by status donut ---------- */
function initDashboard(){
  const box = $('#donut'); if (!box) return;
  const st = $$('#donutKey button').map(b => [b.dataset.l, +b.dataset.n, b.dataset.c, b.dataset.href]);
  const tot = st.reduce((a, b) => a + b[1], 0), C = 2 * Math.PI * 52;
  let off = 0;
  box.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 128 128" aria-hidden="true"><circle cx="64" cy="64" r="52" fill="none" stroke="var(--card-2)" stroke-width="16"/>${tot ? st.map(([, n, c], i) => { const L = n / tot * C, gap = n && n < tot ? 3 : 0; const s = n ? `<circle class="seg-a" data-i="${i}" cx="64" cy="64" r="52" stroke="${c}" stroke-dasharray="${Math.max(0, L - gap).toFixed(1)} ${(C - L + gap).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" stroke-linecap="round"/>` : ''; off += L; return s; }).join('') : ''}</svg>`);
  const mid = $('.mid', box);
  const hl = i => {
    box.classList.toggle('hl', i !== null);
    $$('.seg-a', box).forEach(c => c.classList.toggle('on', +c.dataset.i === i));
    $$('#donutKey button').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    mid.innerHTML = i === null ? `<b>${tot}</b><small>listings</small>` : `<b>${st[i][1]}</b><small>${st[i][0].toLowerCase()}</small>`;
  };
  const pick = i => { location.href = st[i][3]; };
  $$('.seg-a', box).forEach(c => { c.addEventListener('mouseenter', () => hl(+c.dataset.i)); c.addEventListener('mouseleave', () => hl(null)); c.addEventListener('click', () => pick(+c.dataset.i)); });
  $$('#donutKey button').forEach(b => { ['mouseenter', 'focus'].forEach(ev => b.addEventListener(ev, () => hl(+b.dataset.i))); ['mouseleave', 'blur'].forEach(ev => b.addEventListener(ev, () => hl(null))); b.addEventListener('click', () => pick(+b.dataset.i)); });
}

/* ---------- Dashboard "Newest listings": live search, filters and column sort (the form also works without JS) ---------- */
function initDashTable(){
  const f = $('#dashFilter'), tbl = $('#dashTable'); if (!f || !tbl) return;
  $$('.t-sel select', f).forEach(enhanceSelect);
  const body = tbl.tBodies[0], none = $('#dashNone'), info = $('#dashInfo');
  const rows = () => $$('tr[data-addr]', body);
  const val = id => ($('#' + id).value || '').trim();
  let sortKey = null, dir = 1;
  const apply = () => {
    const q = val('tSearch').toLowerCase(), hood = val('tHood'), type = val('tType'), st = val('tStatus'), band = val('tBand');
    let shown = 0;
    rows().forEach(r => {
      const d = r.dataset;
      const ok = (!q || d.addr.includes(q) || d.hood.toLowerCase().includes(q)) && (!hood || d.hood === hood) && (!type || d.type === type) && (!st || d.status === st) && (!band || d.band === band);
      r.hidden = !ok; if (ok) shown++;
    });
    if (none) none.hidden = shown > 0 || !rows().length;
    if (info) info.textContent = rows().length ? `Showing ${shown} of ${rows().length} newest listing${rows().length === 1 ? '' : 's'}` : '';
  };
  f.addEventListener('submit', e => { e.preventDefault(); apply(); });
  f.addEventListener('input', apply);
  f.addEventListener('change', apply);
  f.addEventListener('reset', () => setTimeout(() => { $$('.t-sel select', f).forEach(s => { if (s.tomselect) s.tomselect.sync(); s.dispatchEvent(new Event('sync')); }); apply(); }));
  $$('.th-sort', tbl).forEach(b => b.addEventListener('click', () => {
    const key = b.dataset.key, num = 'num' in b.dataset;
    dir = sortKey === key ? -dir : 1; sortKey = key;
    $$('th', tbl).forEach(th => th.setAttribute('aria-sort', 'none'));
    b.closest('th').setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
    rows().sort((a, c) => (num ? (+a.dataset[key] - +c.dataset[key]) : a.dataset[key].localeCompare(c.dataset[key])) * dir).forEach(r => body.insertBefore(r, none));
  }));
  apply();
}

/* ---------- All listings: filters are a GET form, so they work without JavaScript too ---------- */
function initListings(){
  const f = $('#filterForm'); if (!f) return;
  const card = f.closest('.card') || f.parentElement;
  const paintThumbs = () => $$('[data-thumb]', card).forEach(el => { el.innerHTML = houseThumb(+el.dataset.thumb, 'big' in el.dataset); });
  const bindPager = () => { const per = $('#tPer'); if (per){ enhanceSelect(per); per.addEventListener('change', () => per.form.requestSubmit()); } };
  /* Typing or picking a filter reloads just the table and pager (no page jump, search box keeps focus).
     If fetch fails, the plain GET form still works. */
  let timer = null, ctl = null;
  const load = async () => {
    const params = new URLSearchParams(new FormData(f));
    [...params.keys()].forEach(k => { if (params.get(k) === '') params.delete(k); });
    params.delete('page');
    const url = '?' + params.toString();
    if (ctl) ctl.abort(); ctl = new AbortController();
    try {
      const r = await fetch(url, {signal: ctl.signal, headers: {'X-Requested-With': 'fetch'}});
      if (!r.ok) throw new Error('bad response');
      const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
      ['.tbl-wrap', '.tbl-pager'].forEach(sel => { const n = doc.querySelector(sel), o = $(sel, card); if (n && o) o.replaceWith(n); });
      history.replaceState(null, '', url);
      paintThumbs(); bindPager();
    } catch (e) { if (e.name !== 'AbortError') f.submit(); }
  };
  f.addEventListener('submit', e => { e.preventDefault(); clearTimeout(timer); load(); });
  /* select-all (delegated, so it survives the table refresh) */
  card.addEventListener('change', e => {
    if (e.target.id === 'tAll') $$('.rck', card).forEach(c => { c.checked = e.target.checked; });
    else if (e.target.classList.contains('rck')) { const all = $('#tAll', card), boxes = $$('.rck', card); if (all) all.checked = boxes.length > 0 && boxes.every(c => c.checked); }
  });
  const q = $('#lSearch'), tbs = $('#tbSearch');
  if (q){ q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(load, 250); }); }
  $$('.t-sel select', f).forEach(s => { enhanceSelect(s); s.addEventListener('change', () => { clearTimeout(timer); load(); }); });
  bindPager();
  if (q && tbs){ tbs.value = q.value; }
}

/* ---------- Add listing (US-03) ---------- */
function initAdd(){
  const f = $('#addForm'); if (!f) return;
  const v = id => $('#' + id);
  const featEl = v('aFeat');
  let featTS = null;
  const SEP = ';';
  if (LIB('TomSelect')){
    const start = featEl.value.split(SEP).map(s => s.trim()).filter(Boolean);
    featTS = new TomSelect(featEl, {create: s => ({value: s.trim().replace(/\s+/g, ' ').slice(0, 60), text: s.trim().replace(/\s+/g, ' ').slice(0, 60)}), createFilter: s => s.trim().length >= 2 && !s.includes(SEP) && !FEAT_SUGGEST.concat(featTS ? [].concat(featTS.items) : []).some(x => x.toLowerCase() === s.trim().toLowerCase()), addPrecedence:true, persist:false, maxItems:20, delimiter:SEP, refreshThrottle:0, plugins:['remove_button'],
      options: [...new Set(FEAT_SUGGEST.concat(start))].map(x => ({value:x, text:x})), items: start,
      render:{option_create: (d, e) => `<div class="create">Add <b>${e(d.input)}</b></div>`, no_results: () => '<div class="no-results">Type a feature and press Enter</div>'},
      onItemAdd(){ this.setTextboxValue(''); this.refreshOptions(false); },
      onChange: () => { featEl.dispatchEvent(new Event('input', {bubbles:true})); }});
    featEl.closest('.fld').classList.add('tsf');
    const hint = $('#featSepHint'); if (hint) hint.hidden = true;
  }
  const feats = () => (featTS ? [].concat(featTS.items) : featEl.value.split(SEP)).map(s => String(s).trim()).filter(Boolean);
  const typeName = () => { const o = v('aType').selectedOptions[0]; return o && o.value ? o.textContent.trim() : ''; };
  const hoodName = () => { const o = v('aHood').selectedOptions[0]; return o && o.value ? o.textContent.trim() : ''; };
  v('aType').addEventListener('change', () => { if (!featTS) return; const t = FEAT_BY_TYPE[typeName()] || []; const keep = [].concat(featTS.items); featTS.clearOptions(); featTS.addOptions([...new Set([...t, ...FEAT_SUGGEST, ...keep])].map(x => ({value:x, text:x}))); });
  $$('.t-sel select', f).forEach(enhanceSelect);
  let dirty = false;
  document.addEventListener('ck:leaving', () => { dirty = false; });
  const num = el => el.value === '' ? null : +el.value;
  const price = () => +v('aPrice').value.replace(/[^\d]/g, '');
  const checks = () => [
    ['Address and ZIP code', v('aStreet').value.trim().length >= 5 && /^\d{5}$/.test(v('aZip').value.trim())],
    ['Neighborhood and home type', !!v('aHood').value && !!v('aType').value],
    ['Asking price', price() >= 1000],
    ['Bedrooms, bathrooms and size', v('aBeds').value !== '' && v('aBaths').value !== '' && +v('aSqft').value >= 100],
    ['Features', feats().length >= 1],
    ['Description', textLen(v('aDesc')) >= 40]
  ];
  const art = $('#pvArt'), artKind = () => typeName() === 'Condominium' ? 'condo' : 'house';
  let lastKind = '';
  const preview = () => {
    if (artKind() !== lastKind){ lastKind = artKind(); art.innerHTML = houseThumb(lastKind === 'condo' ? 2 : 1); }
    const pr = price();
    $('#pvPrice').textContent = pr ? money(pr) : '$0';
    $('#pvType').textContent = `${typeName() || 'Home type'} · Available`;
    $('#pvSpecs').innerHTML = `<li>${ico('bed')}${v('aBeds').value || '0'} beds</li><li>${ico('bath')}${v('aBaths').value || '0'} baths</li><li>${ico('area')}${v('aSqft').value ? (+v('aSqft').value).toLocaleString('en-US') : '0'} sqft</li>`;
    $('#pvName').textContent = v('aStreet').value.trim() || 'Street address';
    $('#pvAddr').textContent = `${hoodName() || 'Neighborhood'}, Omaha, NE ${v('aZip').value || ''}`.trim();
    const c = checks(), done = c.filter(x => x[1]).length;
    $('#ckList').innerHTML = c.map(([l, ok]) => `<li class="${ok ? 'ok' : ''}">${ico(ok ? 'check' : 'close')}<span>${l}</span></li>`).join('');
    $('#ckBar').style.setProperty('--w', (done / c.length * 100) + '%');
    $('#ckTxt').textContent = done === c.length ? 'Ready to save' : `${done} of ${c.length} done`;
    $('#dCount').textContent = `${textLen(v('aDesc'))} / 2000 characters`;
    const b = price(); $('#bandHint').textContent = b >= 1000 ? (b < 1000000 ? `Shows in the ${bandOf(b) ? bandLbl(bandOf(b)) : 'under $50k'} price range` : 'Above the $1M top price range, so it shows under any price') : 'Searches group prices in $50,000 ranges';
  };
  richText(v('aDesc'), {max:2000, placeholder:'Describe the house in plain words: layout, updates, features, what is nearby.'});
  maskPrice(v('aPrice')); maskZip(v('aZip'));
  /* map pin: picks up the neighborhood, then the address lookup or a click or drag sets it exactly */
  const latEl = v('id_latitude'), lngEl = v('id_longitude');
  let ll = latEl.value && lngEl.value ? [+latEl.value, +lngEl.value] : null, moved = !!ll, mk = null;
  const map = baseMap($('#aMap'), {center: ll || OMAHA, zoom: ll ? 16 : 11});
  const showLL = () => { $('#aLL').innerHTML = ll ? `${ico('pin')}${ll[0].toFixed(5)}, ${ll[1].toFixed(5)}${moved ? '' : ' (middle of the neighborhood, move it onto the house)'}` : 'No pin yet. Pick a neighborhood, look up the address, or click the map.'; };
  const place = (p, zoom) => {
    ll = p; latEl.value = p[0].toFixed(6); lngEl.value = p[1].toFixed(6);
    if (map){
      if (!mk){ mk = L.marker(p, {icon: pinIcon(), draggable:true, keyboard:true, title:'Listing location, drag to move'}).addTo(map); mk.on('dragend', () => { const q = mk.getLatLng(); ll = [q.lat, q.lng]; latEl.value = q.lat.toFixed(6); lngEl.value = q.lng.toFixed(6); moved = true; dirty = true; showLL(); }); }
      else mk.setLatLng(p);
      map.setView(p, zoom || Math.max(map.getZoom(), 15));
    }
    showLL();
  };
  if (ll) place(ll, 16); else showLL();
  if (map) map.on('click', e => { moved = true; dirty = true; place([e.latlng.lat, e.latlng.lng]); });
  v('aHood').addEventListener('change', () => { if (!moved && HOOD_LL[hoodName()]) place(HOOD_LL[hoodName()], 15); });
  $('#aFind').addEventListener('click', async () => {
    const st = v('aStreet').value.trim(); if (st.length < 5){ fErr(v('aStreet'), 'Enter the street address first.'); v('aStreet').focus(); return; }
    const b = $('#aFind'); b.classList.add('loading');
    try{
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(`${st}, Omaha, NE ${v('aZip').value}`)}`, {headers:{Accept:'application/json'}});
      const j = await r.json(); if (!j.length) throw new Error('none');
      moved = true; dirty = true; place([+j[0].lat, +j[0].lon], 17); toast('Pin placed. Drag it if it is not on the house.', 'info');
    }catch(e){ toast(e.message === 'none' ? 'That address was not found. Click the map to place the pin.' : 'The address lookup is not available here. Click the map to place the pin.', 'warning'); }
    finally{ b.classList.remove('loading'); }
  });
  f.addEventListener('input', e => { dirty = true; if (e.target.matches('input,textarea,select')) fOk(e.target); preview(); });
  f.addEventListener('change', () => { dirty = true; preview(); });
  addEventListener('beforeunload', e => { if (dirty){ e.preventDefault(); e.returnValue = ''; } });
  $('#cancelBtn').addEventListener('click', async e => { if (!dirty) return; e.preventDefault(); const href = e.currentTarget.href; if (await confirmBox({title:'Leave without saving?', text:'What you entered on this form will be lost.', ok:'Leave the form', danger:true})){ dirty = false; location.href = href; } });
  document.addEventListener('click', async event => {
    const link = event.target.closest('a[href]');
    if (!dirty || event.defaultPrevented || !link || link.target || link.hasAttribute('download') || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    const destination = new URL(link.href, location.href);
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    event.preventDefault();
    if (await confirmBox({title:'Leave without saving?', text:'What you entered on this form will be lost.', ok:'Leave the form', danger:true})){
      dirty = false; location.href = destination.href;
    }
  });
  const summary = errs => {
    const sum = $('#errSum');
    if (!errs.length){ sum.hidden = true; return; }
    sum.hidden = false;
    sum.innerHTML = `<b>${ico('alert')}Fix ${errs.length === 1 ? 'one thing' : errs.length + ' things'} before saving</b><ul>${errs.map(([el, m], i) => `<li><a href="#" data-j="${i}">${esc(m)}</a></li>`).join('')}</ul>`;
    $$('[data-j]', sum).forEach(a => a.addEventListener('click', e => { e.preventDefault(); const el = errs[+a.dataset.j][0]; (el._q ? el._q.root.closest('.rt') : el.closest('.fld') || el).scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'}); const t = el.tomselect ? el.tomselect.control_input : el.matches('input:not([type=hidden]),textarea') ? el : el.closest('.t-sel') ? ($('.ts-control', el.closest('.t-sel')) || $('.cs-btn', el.closest('.t-sel'))) : el; setTimeout(() => t && t.focus({preventScroll:true}), 300); }));
    sum.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
  };
  const validate = () => {
    const errs = [];
    const need = (id, ok, msg) => { const el = v(id); if (!ok){ fErr(el, msg); errs.push([el, msg]); } else fOk(el); };
    const year = new Date().getFullYear();
    need('aStreet', v('aStreet').value.trim().length >= 5, 'Enter the street address, for example 4812 Underwood Avenue.');
    need('aHood', !!v('aHood').value, 'Pick the neighborhood.');
    need('aZip', /^\d{5}$/.test(v('aZip').value.trim()), 'Enter the five-digit ZIP code.');
    need('aType', !!v('aType').value, 'Pick the home type.');
    need('aBeds', v('aBeds').value !== '' && +v('aBeds').value >= 0 && +v('aBeds').value <= 20 && Number.isInteger(+v('aBeds').value), 'Enter the number of bedrooms, from 0 to 20.');
    need('aBaths', v('aBaths').value !== '' && +v('aBaths').value >= 0 && +v('aBaths').value <= 20 && (+v('aBaths').value * 2) % 1 === 0, 'Enter bathrooms in halves, for example 2 or 2.5.');
    need('aSqft', +v('aSqft').value >= 100 && +v('aSqft').value <= 100000, 'Enter the finished square feet, at least 100.');
    need('aLot', v('aLot').value === '' || (+v('aLot').value >= 100 && +v('aLot').value <= 10000000), 'Enter the lot size in square feet, or leave it blank.');
    need('aYear', v('aYear').value === '' || (+v('aYear').value >= 1800 && +v('aYear').value <= year), `Enter a year from 1800 to ${year}, or leave it blank.`);
    need('aGarage', v('aGarage').value !== '' && +v('aGarage').value >= 0 && +v('aGarage').value <= 10, 'Enter garage spaces, from 0 to 10.');
    need('aFeat', feats().length >= 1, 'Add at least one feature, for example Fireplace or Fenced backyard.');
    need('aPrice', price() >= 1000 && price() <= 50000000, price() > 50000000 ? 'That price looks too high. Check the number of zeros.' : 'Enter the asking price, at least $1,000.');
    need('aDesc', textLen(v('aDesc')) >= 40, 'Write at least a few sentences (40 characters or more).');
    summary(errs);
    return !errs.length;
  };
  let publishing = false, approved = false;
  f.addEventListener('submit', async event => {
    if (approved) return;
    event.preventDefault();
    if (publishing) return;
    if (featTS) featEl.value = feats().join(SEP + ' ');
    if (!validate()){ toast('Check the marked fields before saving.', 'error'); return; }
    publishing = true;
    const accepted = await confirmBox({title:'Publish this listing?', text:'It will appear on the public site as Available. Check the address and house details before publishing.', ok:'Publish listing'});
    publishing = false;
    if (!accepted) return;
    approved = true; dirty = false;
    $('#saveBtn').classList.add('loading');
    f.requestSubmit();
  });
  /* errors from the server: same summary, linked to each field */
  const server = $$('.fld.err .f-err', f).map(m => [$('input:not([type=hidden]),select,textarea', m.closest('.fld')), m.textContent.trim()]).filter(x => x[0]);
  if (server.length) summary(server);
  preview();
}

const INIT = {dashboard: initDashboard, listings: initListings, add: initAdd};
bindShell();
initDashTable();
(INIT[$('#adm') ? $('#adm').dataset.page : ''] || (() => {}))();
paintIcons();
reveal();
})();
