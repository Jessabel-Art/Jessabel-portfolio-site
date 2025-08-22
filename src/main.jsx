import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const META_COLOR_SCHEME = 'color-scheme';
const META_THEME_COLOR = 'theme-color';

// Browser chrome colors (brand aligned)
const COLORS = {
  light: '#d74708', // bold brand orange for light mode
  dark:  '#0B0F1A', // deep neutral for dark mode
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
  const colorSchemeMeta = ensureMeta(META_COLOR_SCHEME);
  const themeColorMeta   = ensureMeta(META_THEME_COLOR);

  if (theme === 'dark') {
    html.classList.add('dark');
    colorSchemeMeta.setAttribute('content', 'dark light');
    themeColorMeta.setAttribute('content', COLORS.dark);
  } else {
    html.classList.remove('dark');
    colorSchemeMeta.setAttribute('content', 'light dark');
    themeColorMeta.setAttribute('content', COLORS.light);
  }
}

// Initial theme: honor explicit user choice -> else honor OS preference
const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = stored || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

// React to OS changes only if user hasn't explicitly chosen a theme
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const onSchemeChange = (e) => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
};
mq.addEventListener?.('change', onSchemeChange);

// If you add a theme toggle later, uncomment:
// window.setTheme = (theme) => { localStorage.setItem('theme', theme); applyTheme(theme); };
// window.clearTheme = () => { localStorage.removeItem('theme'); applyTheme(mq.matches ? 'dark' : 'light'); };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
