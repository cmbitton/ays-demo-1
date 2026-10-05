import {mkdir, readFile, writeFile, cp, rm, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {layout} from '../src/templates/layout.mjs';
import * as home from '../src/templates/home.mjs';
import * as about from '../src/templates/about.mjs';
import * as services from '../src/templates/services.mjs';
import * as contact from '../src/templates/contact.mjs';
import * as feedback from '../src/templates/feedback.mjs';
import * as notFound from '../src/templates/not-found.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const json = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const site = await json('src/content/site.json');
const domain = new URL(process.env.SITE_URL || site.domain);
if (!['https:', 'http:'].includes(domain.protocol) || domain.pathname !== '/' || domain.search || domain.hash || domain.username || domain.password) {
  throw new Error('SITE_URL must be an HTTP(S) origin, for example https://www.aysbartending.com');
}
site.domain = domain.origin;
const basePath = process.env.SITE_BASE_PATH || '';
if (basePath && (!/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(basePath) || basePath === '/')) {
  throw new Error('SITE_BASE_PATH must be empty or a path such as /ays-demo-1');
}
site.basePath = basePath;
const definitions = await json('src/content/images.json');
const reviews = await json('src/content/testimonials.json');

await rm(out, {recursive: true, force: true});
await mkdir(path.join(out, 'images'), {recursive: true});
await cp(path.join(root, 'public'), out, {recursive: true});
const images = {};
for (const [key, definition] of Object.entries(definitions)) {
  const source = path.join(root, 'assets/originals', definition.file);
  const metadata = await sharp(source).metadata();
  const width = metadata.autoOrient?.width || metadata.width;
  const height = metadata.autoOrient?.height || metadata.height;
  const widths = [...new Set((definition.widths || [400, 800, 1400]).map(w => Math.min(w, width)))];
  const variants = [];
  for (const size of widths) {
    const base = `/images/${key}-${size}`;
    await Promise.all([
      sharp(source).rotate().resize({width:size, withoutEnlargement:true}).webp({quality:83}).toFile(path.join(out, `${base}.webp`)),
      sharp(source).rotate().resize({width:size, withoutEnlargement:true}).avif({quality:52, effort:4}).toFile(path.join(out, `${base}.avif`))
    ]);
    variants.push({width:size, webp:`${basePath}${base}.webp`, avif:`${basePath}${base}.avif`});
  }
  images[key] = {...definition, width, height, variants};
}

await sharp(path.join(root, 'assets/originals/nbch-bar_orig.jpg')).rotate()
  .resize(1200,630,{fit:'contain',background:'#273b31'}).jpeg({quality:88}).toFile(path.join(out,'images/social.jpg'));
for (const [file, size] of [['favicon-32.png',32],['favicon-192.png',192],['apple-touch-icon.png',180]]) {
  await sharp(path.join(root, 'assets/originals/logo-winner_orig.jpg')).resize(size,size).png().toFile(path.join(out,file));
}

const pages = [home,about,services,contact,feedback,notFound];
for (const page of pages) {
  const body = page.render({site,images,reviews});
  const html = layout({site,page:page.meta,images,body});
  const filename = page.meta.path === '/' ? 'index.html' : page.meta.path.slice(1);
  await writeFile(path.join(out, filename), html);
}

const xmlEscape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
await writeFile(path.join(out,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p=>p.meta.key!=='404').map(p=>`  <url><loc>${xmlEscape(site.domain+basePath+p.meta.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(out,'robots.txt'), `User-agent: *\nAllow: ${basePath || '/'}\n\nSitemap: ${site.domain}${basePath}/sitemap.xml\n`);
await writeFile(path.join(out,'site.webmanifest'), JSON.stringify({name:site.legalName,short_name:'AYS Bartending',start_url:`${basePath}/`,display:'browser',background_color:'#f8f6ef',theme_color:'#273b31',icons:[{src:`${basePath}/favicon-192.png`,sizes:'192x192',type:'image/png'}]},null,2));

// Font files are copied verbatim from public/, so prefix their root-relative URLs
// for project Pages sites as well.
if (basePath) {
  const fontsFile = path.join(out, 'fonts/fonts.css');
  const fontsCss = await readFile(fontsFile, 'utf8');
  await writeFile(fontsFile, fontsCss.replaceAll('url(/', `url(${basePath}/`));
}

// Detect accidental missing local dependencies before a deploy.
for (const page of pages) {
  const file = page.meta.path === '/' ? 'index.html' : page.meta.path.slice(1);
  const html = await readFile(path.join(out,file),'utf8');
  for (const [,url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const localPath = basePath && url.startsWith(`${basePath}/`) ? url.slice(basePath.length) : url;
    await stat(path.join(out,localPath === '/' ? 'index.html' : localPath.slice(1)));
  }
  if (/editmysite|weebly\.com|\/uploads\//i.test(html)) throw new Error(`Legacy dependency in ${file}`);
}
console.log(`Built 5 pages + 404, ${Object.keys(images).length} responsive image sets, sitemap, and favicons in dist/.`);
console.log(`Canonical origin: ${site.domain}${basePath}/`);
