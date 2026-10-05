import {escape, button, picture, arrow} from './components.mjs';

export function layout({site, page, images, body}) {
  const base = site.basePath || '';
  const pageUrl = path => `${base}${path}`;
  const canonical = `${site.domain}${pageUrl(page.path)}`;
  const nav = site.navigation.map(item => `<a href="${pageUrl(item.path)}"${item.key === page.key ? ' aria-current="page"' : ''}>${item.label}</a>`).join('');
  const schema = {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${site.domain}${pageUrl('/')}#business`,
    name: site.legalName, alternateName: 'AYS Bartending', url: `${site.domain}${pageUrl('/')}`, email: site.email,
    logo: `${site.domain}${pageUrl('/images/logo-320.webp')}`, image: `${site.domain}${pageUrl('/images/social.jpg')}`,
    description: 'Mobile bartending for weddings, private parties, corporate events, and other celebrations.',
    areaServed: site.areas.map(name => ({'@type':'Place', name})),
    founder: [{'@type':'Person',name:'Christian'}, {'@type':'Person',name:'Gina'}]
  };
  body = body.replaceAll('href="/', `href="${base}/`);
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}">
<link rel="canonical" href="${escape(canonical)}">${page.key === '404' ? '<meta name="robots" content="noindex,follow">' : ''}
<meta name="theme-color" content="#273b31">
<meta property="og:type" content="website"><meta property="og:locale" content="en_US"><meta property="og:site_name" content="${escape(site.legalName)}">
<meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${site.domain}${pageUrl('/images/social.jpg')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="An At Your Service event bar set for a celebration">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${site.domain}${pageUrl('/images/social.jpg')}"><meta name="twitter:image:alt" content="An At Your Service event bar set for a celebration">
<link rel="icon" type="image/png" sizes="32x32" href="${pageUrl('/favicon-32.png')}"><link rel="icon" type="image/png" sizes="192x192" href="${pageUrl('/favicon-192.png')}"><link rel="apple-touch-icon" sizes="180x180" href="${pageUrl('/apple-touch-icon.png')}"><link rel="manifest" href="${pageUrl('/site.webmanifest')}">
<link rel="preload" href="${pageUrl('/fonts/cormorant.woff2')}" as="font" type="font/woff2" crossorigin><link rel="preload" href="${pageUrl('/fonts/dm-sans.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${pageUrl('/fonts/fonts.css')}"><link rel="stylesheet" href="${pageUrl('/styles.css')}">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><script src="${pageUrl('/site.js')}" defer></script>
</head><body class="page-${page.key}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner">
<a class="brand" href="${pageUrl('/')}" aria-label="At Your Service Bartending — home">${picture(images,'logo',{sizes:'60px', eager:true, className:'brand-seal'})}<span class="brand-type">At Your Service<span>MOBILE BARTENDING</span></span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" hidden><span class="menu-label">Menu</span><span class="menu-lines" aria-hidden="true"></span></button>
<nav id="primary-nav" aria-label="Main navigation">${nav}${button('Plan your event', pageUrl('/contact.html'))}</nav>
</div></header>
<main id="main" tabindex="-1">${body}</main>
<footer class="site-footer"><div class="container"><div class="footer-main"><div><a class="footer-brand" href="${pageUrl('/')}" >At Your Service<span>MOBILE BARTENDING</span></a><p>Good company. Great drinks.<br>A celebration that feels like you.</p></div><div><h2>Explore</h2><nav aria-label="Footer navigation">${nav}</nav></div><div><h2>Let’s get together</h2><a class="footer-email" href="mailto:${site.email}">${site.email} ${arrow}</a><p>Rhode Island · Massachusetts<br>Eastern Connecticut</p><a href="${escape(site.theKnot)}" class="knot-link">Find us on The Knot ${arrow}</a></div></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} ${escape(site.legalName)}</p><p>With you, from setup to last call.</p></div></div></footer>
</body></html>`;
}
