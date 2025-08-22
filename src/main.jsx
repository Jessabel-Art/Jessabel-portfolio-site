import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const META_COLOR_SCHEME = 'color-scheme';
const META_THEME_COLOR  = 'theme-color';
const BRAND_ORANGE      = '#d74708'; // header/footer bar

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

// 🚫 No dark mode: force light theme on first load
(() => {
  document.documentElement.classList.remove('dark'); // ensure no dark class
  upsertMeta(META_COLOR_SCHEME, 'light');            // not "light dark"
  upsertMeta(META_THEME_COLOR, BRAND_ORANGE);        // browser address bar color
  try { localStorage.removeItem('theme'); } catch {} // clear any saved choice
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

