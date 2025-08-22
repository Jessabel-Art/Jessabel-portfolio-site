// scripts/generate-sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Helper: load package.json
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// --- 1) Pull base URL dynamically
const BASE_URL =
  (process.env.SITE_URL && process.env.SITE_URL.trim()) ||
  (pkg.homepage && pkg.homepage.trim()) ||
  (pkg.siteUrl && pkg.siteUrl.trim()) ||
  'https://example.com'; // <- safety fallback (replace if you want)

if (!/^https?:\/\//.test(BASE_URL)) {
  throw new Error(`SITE_URL/homepage must include protocol, e.g. "https://...". Got: ${BASE_URL}`);
}

// --- Your public routes (add/remove as needed)
const routes = [
  '/',               // Home
  '/about',
  '/process',
  // '/portfolio',   // hidden for now
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/clients'
];

// Optional: blog post slugs (if you want static entries)
// import posts data if available, or maintain manually:
// const posts = [{ slug: 'your-first-post' }, ...];
// routes.push(...posts.map(p => `/blog/${p.slug}`));

// --- Generate entries
const now = new Date().toISOString();
const urlEntries = routes.map((route) => {
  const loc = new URL(route.replace(/^\//, ''), BASE_URL).toString(); // ensures single slash
  // Basic priorities: home highest, others medium
  const priority =
    route === '/' ? '1.0' :
    route.startsWith('/blog') ? '0.7' :
    '0.8';

  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('');

// --- XML wrapper
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`;

// --- Write to /dist/sitemap.xml after Vite build
const distDir = path.resolve(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const outPath = path.join(distDir, 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`[sitemap] Wrote ${outPath} with base ${BASE_URL}`);
