/* CK Real Estate: public site behavior (Django build).
   Built from the prototype's app.js (prototype/app.js). The markup comes from the templates;
   this adds the header, theme, custom selects, card photo swipes, stand-in illustrations and reveals. */
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

/* ================= Django glue =================
   The pages are rendered by Django templates with the prototype's markup.
   This script only adds behavior: header, theme, custom selects, card photos,
   illustrations where a listing has no photos yet, and the scroll reveals. */

/* minimal stand-ins the prototype's select code expects */
function showErr(field, msg){ field.classList.add('bad'); }
function clearErr(field){ field.classList.remove('bad'); }

/* A native <select> inside .cs becomes the prototype's custom select.
   Without JavaScript the plain select still submits the form. */
function enhanceSelect(host){
  const sel = $('select', host); if (!sel) return null;
  const opts = [...sel.options].map(o => ({v:o.value, l:o.textContent.trim(), ic:o.dataset.ic || host.dataset.ic || ''}));
  host.dataset.name = sel.name;
  host.dataset.value = sel.value;
  if (!host.dataset.label) host.dataset.label = sel.getAttribute('aria-label') || '';
  const api = makeSelect(host, opts);
  if (host.dataset.submit !== undefined) api.onChange = () => host.closest('form').requestSubmit();
  return api;
}

/* illustrations stand in for photos until Carlos uploads his own (BLUEPRINT section 11) */
function paintArt(scope = document){
  $$('[data-art]', scope).forEach((el, i) => {
    const p = {id: el.dataset.artId || i, seed: +el.dataset.artSeed || 101, kind: el.dataset.art, name: el.dataset.artName || 'a home'};
    el.innerHTML = art(p, el.dataset.artSfx || ('x' + i), +el.dataset.artOff || 0, el.dataset.artLabel);
  });
  $$('[data-city-art]', scope).forEach((el, i) => { el.insertAdjacentHTML('afterbegin', cityArt(el.dataset.cityArt, 200 + i * 53, i)); });
}

function bindShell(){
  const tb = $('#themeBtn');
  if (tb){
    const dark = () => root.dataset.mode === 'dark';
    const paintTheme = () => { tb.innerHTML = ico(dark() ? 'sun' : 'moon'); tb.setAttribute('aria-label', dark() ? 'Switch to light theme' : 'Switch to dark theme'); };
    paintTheme();
    tb.addEventListener('click', () => { const n = dark() ? 'light' : 'dark'; if (n === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; store.set('ck-mode', n); paintTheme(); });
  }
  const drawer = $('#drawer'), burger = $('#burger');
  if (drawer && burger){
    let last = null;
    const openMenu = () => { last = document.activeElement; drawer.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open'))); burger.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; setTimeout(() => { const c = $('[data-close-menu].icon-btn', drawer); c && c.focus({preventScroll:true}); }, 60); };
    const closeMenu = () => { if (drawer.hidden) return; drawer.classList.remove('open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 450); if (last && last.focus) last.focus({preventScroll:true}); };
    burger.addEventListener('click', openMenu);
    $$('.d-sub-btn', drawer).forEach(b => b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o); $('#' + b.getAttribute('aria-controls')).classList.toggle('open', o); }));
    drawer.addEventListener('click', e => { if (e.target.closest('[data-close-menu]') || e.target.closest('.d-nav a, .d-foot a')) closeMenu(); });
    drawer.addEventListener('keydown', e => {
      if (e.key === 'Escape'){ closeMenu(); return; }
      if (e.key === 'Tab'){ const f = $$('a,button', drawer).filter(x => x.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } }
    });
    matchMedia('(min-width:1101px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }
  $$('.has-dd').forEach(li => {
    const b = $('.dd-btn', li);
    const set = o => { li.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', e => { e.stopPropagation(); set(!li.classList.contains('open')); });
    li.addEventListener('mouseleave', () => set(false));
    document.addEventListener('click', e => { if (!li.contains(e.target)) set(false); });
    li.addEventListener('keydown', e => { if (e.key === 'Escape'){ set(false); b.focus(); } });
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) set(false); });
  });
  /* links to a section of the page you are on scroll instead of reloading */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]'); if (!a) return;
    const u = new URL(a.href, location.href);
    if (u.pathname === location.pathname && u.hash && $(u.hash)){ e.preventDefault(); goTo(u.hash); history.replaceState(null, '', u.hash); }
  });
  const hdr = $('#hdr'), top = $('#toTop');
  if (top) top.addEventListener('click', () => scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}));
  let tick = false;
  const run = () => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (top){ top.style.setProperty('--sp', max > 0 ? Math.min(1, y / max).toFixed(4) : 0); top.classList.toggle('show', y > 600); }
    if (hdr) hdr.classList.toggle('scrolled', y > 10);
    scrollHooks.forEach(f => f(y));
  };
  addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(run); } }, {passive:true});
  requestAnimationFrame(run);
  /* Django messages show as toasts */
  $$('[data-toast]').forEach((m, i) => setTimeout(() => toast(m.dataset.toast, m.dataset.toastIc || 'check'), 250 + i * 400));
}
const scrollHooks = [];

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
}

/* ================= pages ================= */
function initSearch(){
  $$('form [data-cs]').forEach(enhanceSelect);
  /* quick chips fill the search and run it */
  $$('.chip[data-type], .chip[data-hood]').forEach(c => c.addEventListener('click', () => {
    const f = $('#searchForm'); if (!f) return;
    f.elements.type.value = c.dataset.type || ''; f.elements.hood.value = c.dataset.hood || ''; f.elements.band.value = '';
    f.submit();
  }));
}
function initGridTabs(){
  /* type tabs over the cards already on the page */
  const tabs = $('[data-tabs="sale"]'), grid = $('#saleGrid'); if (!tabs || !grid) return;
  const ink = bindTabsInk(tabs), count = $('#saleCount'), total = $$('.card', grid).length, empty = $('#tabEmpty');
  tabs.addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    const t = b.dataset.type;
    $$('.tab', tabs).forEach(x => x.setAttribute('aria-selected', x === b));
    let n = 0;
    $$('.card', grid).forEach(c => { const show = t === 'all' || c.dataset.type === t; c.hidden = !show; if (show) n++; });
    if (count) count.textContent = n === total ? count.dataset.all : `${n} of ${total} ${total === 1 ? 'home' : 'homes'}`;
    if (empty) empty.hidden = n > 0;
    ink();
  });
}
function initRail(){
  const rail = $('#rail'); if (!rail) return;
  const next = $('#railNext'), prev = $('#railPrev'), thumb = $('#barThumb');
  const step = () => Math.max(260, rail.clientWidth * .8);
  next.addEventListener('click', () => rail.scrollBy({left:step(), behavior:'smooth'}));
  prev.addEventListener('click', () => rail.scrollBy({left:-step(), behavior:'smooth'}));
  const upd = () => { const max = rail.scrollWidth - rail.clientWidth, ratio = Math.min(1, rail.clientWidth / rail.scrollWidth); thumb.style.width = (ratio * 100) + '%'; const track = thumb.parentElement.clientWidth; thumb.style.setProperty('--bx', (max > 0 ? (rail.scrollLeft / max) * (track - track * ratio) : 0) + 'px'); prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft > max - 4; };
  rail.addEventListener('scroll', upd, {passive:true}); addEventListener('resize', upd); upd();
  let down = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; moved = 0; rail.style.scrollSnapType = 'none'; rail.style.cursor = 'grabbing'; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); rail.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; rail.style.cursor = ''; });
  rail.addEventListener('click', e => { if (moved > 6){ e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
}
function initHome(){
  buildSky($('#sky'));
  const h1 = $('#h1'); if (h1 && !reduce){ splitWords(h1); h1.classList.add('anim-words'); }
  initRail();
  const steps = $('#steps');
  if (steps) scrollHooks.push(() => { const r = steps.getBoundingClientRect(); steps.style.setProperty('--p', Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height + innerHeight * .1))).toFixed(3)); });
}
function authArt(){
  const box = $('#authArt'); if (!box) return;
  const p = {id:301, seed:8080, kind:'Villa', name:'A house'};
  const r = rng(77); let stars = ''; for (let k = 0; k < 60; k++) stars += `<circle class="c-star" style="animation-delay:-${(r()*3).toFixed(1)}s" cx="${(r()*400).toFixed(0)}" cy="${(r()*300).toFixed(0)}" r="${(r()*1.1+.3).toFixed(1)}"/>`;
  box.insertAdjacentHTML('afterbegin', `<svg class="stars-l" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${stars}</svg><div class="scene">${art(p, 'au', 0, 'A house')}</div><div class="shade"></div>`);
  const sv = $('.scene svg', box), mq = matchMedia('(max-width:900px)');
  const fit = () => sv && sv.setAttribute('preserveAspectRatio', mq.matches ? 'xMidYMax slice' : 'xMidYMax meet');
  fit(); mq.addEventListener('change', fit);
}
function initLogin(){
  authArt();
  $$('.pw-toggle').forEach(b => b.addEventListener('click', () => { const i = b.parentElement.querySelector('input'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.innerHTML = ico(show ? 'eyeOff' : 'eye'); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); b.setAttribute('aria-pressed', show); }));
  const fb = $('#forgotBtn');
  if (fb) fb.addEventListener('click', () => { const o = $('#resetPanel').classList.toggle('open'); fb.setAttribute('aria-expanded', o); });
  const f = $('#loginForm');
  if (f) f.addEventListener('submit', e => {
    let bad = null;
    $$('input[required]', f).forEach(i => { const lab = i.closest('label'); const err = lab && $('.f-err', lab); if (!i.value.trim()){ bad = bad || i; if (lab && !err) lab.insertAdjacentHTML('beforeend', `<small class="f-err">${ico('info')}This field is required.</small>`); } else if (err) err.remove(); });
    if (bad){ e.preventDefault(); bad.focus(); return; }
    $('button[type="submit"]', f).classList.add('loading');
  });
}

function init(){
  bindShell();
  initSearch();
  ({home: initHome, listings: () => {}, login: initLogin}[PAGE] || (() => {}))();
  initGridTabs();
  paintArt();
  paintIcons();
  bindReveal();
}
init();
})();
