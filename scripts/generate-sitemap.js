import fs from 'fs';
import path from 'path';

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*VITE_SITE_URL\s*=\s*(.+)\s*$/);
      if (m) return m[1].trim().replace(/^"|"$/g, '');
    }
  } catch (e) {
    return null;
  }
  return null;
}

function getSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL;
  const root = process.cwd();
  const candidates = ['.env.local', '.env', '.env.example'];
  for (const f of candidates) {
    const p = path.join(root, f);
    const val = parseEnvFile(p);
    if (val) return val;
  }
  return 'https://metal-cortes.example';
}

function buildSitemap(urls, siteUrl) {
  const now = new Date().toISOString();
  const items = urls.map(u => {
    const loc = siteUrl.replace(/\/$/, '') + (u === '/' ? '/' : u.startsWith('/') ? u : '/' + u);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

function main() {
  const siteUrl = getSiteUrl();
  const urls = [ '/', '/nosotros' ];
  const xml = buildSitemap(urls, siteUrl);
  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('sitemap.xml generated at', outPath);
}

main();
