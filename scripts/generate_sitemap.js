// XML Sitemap Generator for SEO Search Engine Indexing
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://merkato.com';
const pages = [
    '',
    '/shop.html',
    '/about.html',
    '/contact.html',
    '/faq.html',
    '/returns.html',
    '/artisans.html',
    '/cart.html',
    '/wishlist.html',
    '/login.html'
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${p === '' || p === '/shop.html' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'sitemap.xml'), sitemapXml, 'utf8');
console.log('✅ Generated frontend/sitemap.xml successfully!');
