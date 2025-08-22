import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const META_COLOR_SCHEME = 'color-scheme';
const META_THEME_COLOR = 'theme-color';

// Tailwind HSLs converted to HEX-ish approximations for browser chrome
const COLORS = {
  darkBg: '#0B0F14',   // matches --background in .dark
  lightBg: '#E7F2EC',  // matches --background in :root
};

function ensureMeta(name) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  return el;
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    ensureMeta(META_COLOR_SCHEME).setAttribute('content', 'dark light');
    ensureMeta(META_THEME_COLOR).setAttribute('content', COLORS.darkBg);
  } else {
    html.classList.remove('dark');
    ensureMeta(META_COLOR_SCHEME).setAttribute('content', 'light dark');
    ensureMeta(META_THEME_COLOR).setAttribute('content', COLORS.lightBg);
  }
}

// 1) Determine initial theme (default = dark)
const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = stored || (prefersDark ? 'dark' : 'dark'); // default dark
applyTheme(initialTheme);

// 2) Keep up with OS changes (only if user hasn't explicitly chosen)
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const onSchemeChange = (e) => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
};
mq.addEventListener?.('change', onSchemeChange);

// Optional helpers if you later add a UI theme toggle:
// window.setTheme = (theme) => { localStorage.setItem('theme', theme); applyTheme(theme); };
// window.clearTheme = () => { localStorage.removeItem('theme'); applyTheme(mq.matches ? 'dark' : 'light'); };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
