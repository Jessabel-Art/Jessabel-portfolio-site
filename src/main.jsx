import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const META_COLOR_SCHEME = 'color-scheme';
const META_THEME_COLOR  = 'theme-color';
const BRAND_NAVY        = '#0B0F1A'; // matches index.html head

function upsertMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

// Force light scheme; keep browser chrome color consistent with background
(() => {
  document.documentElement.classList.remove('dark');
  upsertMeta(META_COLOR_SCHEME, 'light');
  upsertMeta(META_THEME_COLOR, BRAND_NAVY);
  try { localStorage.removeItem('theme'); } catch {}
})();

// ---- Safe preloads for images that used to be in <head> (no file moves) ----
import bgWelcome from '@/assets/images/bg-welcome.svg';
import spotlight from '@/assets/images/spotlight-radial.svg';

function preload(href, as) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href; // Vite gives the hashed dist URL
  document.head.appendChild(link);
}
preload(bgWelcome, 'image');
preload(spotlight, 'image');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// ----------------------------------------------------------------------------