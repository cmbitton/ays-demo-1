# At Your Service Bartending

A complete static rebuild of [aysbartending.com](https://www.aysbartending.com/). Five separate pages, original URLs, shared templates, locally hosted photography and fonts, and explicitly non-submitting demo forms. No runtime framework, database, or application server.

## Install, build, and preview

Use Node.js 24 LTS (or Node 22.12+).

```sh
npm ci
npm run build
npm run preview
```

Open **http://127.0.0.1:4173**. `npm run dev` builds once and starts the same preview. After editing, rebuild and refresh; there is no watch process. Change the local port with `PORT=8080 npm run preview`.

The production artifact is **`dist/`**. Deploy only this directory. It contains complete HTML for `/`, `/about-us.html`, `/services.html`, `/contact.html`, `/feedback.html`, and `/404.html`, plus optimized assets and SEO files. The preview script is development tooling and is never deployed.

## GitHub Pages

The `Deploy to GitHub Pages` workflow builds the site with the repository base path `/ays-demo-1/` and publishes `dist/` whenever `main` changes. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The resulting site is served at `https://cmbitton.github.io/ays-demo-1/`; assets, navigation, canonical URLs, sitemap, and manifest use that project path.

To reproduce that build locally, run `SITE_URL=https://cmbitton.github.io SITE_BASE_PATH=/ays-demo-1 npm run build`. Other hosts can keep the default empty `SITE_BASE_PATH` for a root deployment.

## Editing

| Change | File |
| --- | --- |
| Business name, email, domain, navigation, service lists, areas | `src/content/site.json` |
| Published testimonials and original page association | `src/content/testimonials.json` |
| Photography choices and alt text | `src/content/images.json` |
| Page copy and sections | `src/templates/home.mjs`, `about.mjs`, `services.mjs`, `contact.mjs`, `feedback.mjs` |
| Shared header, footer, metadata, structured data | `src/templates/layout.mjs` |
| Reusable forms, buttons, images, review markup | `src/templates/components.mjs` |
| Design and responsive styles | `public/styles.css` |
| Mobile menu and demo validation | `public/site.js` |

To add a photograph, put the original in `assets/originals/`, add an entry to `images.json`, and use the `picture()` helper in a template. The build generates AVIF and WebP variants without enlarging originals, strips metadata, and emits intrinsic dimensions and responsive `srcset`s. Below-the-fold images load lazily. Only selected original images are kept locally; `docs/asset-inventory.json` records the full source inventory and URLs for unused images.

All fonts are local, with their SIL Open Font Licenses in `public/fonts/`. The existing raster logo is retained; its original gray background is part of the supplied artwork.

## Production domain and SEO

The default is `https://www.aysbartending.com`. Update `domain` in `site.json`, or override it for a build:

```sh
SITE_URL=https://www.example.com npm run build
```

Use an origin without a subdirectory. This one setting updates canonical URLs, Open Graph/Twitter metadata, sitemap, robots.txt, and JSON-LD. Each page has its own title and description. Organization structured data uses only published facts; there are no invented addresses, prices, ratings, phone numbers, or opening hours. The 404 is excluded from the sitemap and marked `noindex`.

## Forms

The forms preserve the original fields. Required fields, email format, and basic phone validation are checked in the browser. The feedback experience field is a multiline textarea for readability. Nothing is sent or persisted; there is no endpoint, fetch request, analytics, or browser storage. Buttons say “Check … (demo),” and the result explicitly says nothing was sent or saved. With JavaScript off, the demo buttons are disabled and the email link still works. Security headers also prohibit form submission.

**For real inquiries, visitors should email `aysbartendingllc@yahoo.com`.** Connecting forms later is a separate change requiring a delivery service, revised messaging, and revised `form-action`/`connect-src` policy. A form backend is not needed to launch this email-based version.

## Free commercial hosting: Cloudflare Workers Static Assets

Recommended deployment: Cloudflare's **Free plan with static assets only**. Despite the product name, this configuration has no Worker script or server code. Static-asset requests and storage are free; the build happens locally. Cloudflare's current self-serve and Developer Platform terms allow this ordinary commercial business website; they do not restrict the Free plan to personal projects. Domain registration/renewal remains a separate existing cost.

Verified October 5, 2026: [static-asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [self-serve terms](https://www.cloudflare.com/terms/), and [Developer Platform terms](https://www.cloudflare.com/service-specific-terms-developer-platform/). Recheck the plan and terms when deploying.

1. Create a Cloudflare account and use the Free plan.
2. Build with the intended production domain.
3. From the project root, run:

   ```sh
   npx wrangler@4 login
   npx wrangler@4 deploy
   ```

4. Wrangler reads `wrangler.jsonc`, uploads only `dist/`, and prints a `workers.dev` URL. Check all pages there before changing DNS. Choose a different `name` in the config if necessary.
5. Future updates use the same build and deploy commands. For Git-based builds, use `npm ci && npm run build` and `npx wrangler@4 deploy`, with Node 24 and `SITE_URL` set to the production origin.

The config deliberately sets `html_handling: "none"` to preserve the Weebly `.html` URLs. `_redirects` explicitly serves `index.html` at `/`. Keep this setting and these rules together. Do not deploy this configuration unchanged to Cloudflare **Pages**, whose automatic extension removal conflicts with the extensionless-to-`.html` aliases. See [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/) and [redirect rules](https://developers.cloudflare.com/workers/static-assets/redirects/).

### Connect the existing domain

1. Add `aysbartending.com` to Cloudflare using its Free DNS plan. Check that existing DNS records, especially MX/TXT records for email, are imported correctly.
2. At the existing domain registrar, replace the authoritative nameservers with those Cloudflare supplies. The domain can remain registered with its current registrar.
3. Once the zone is active, open **Workers & Pages → your project → Settings → Domains & Routes → Add → Custom Domain** and add `www.aysbartending.com`. Cloudflare provisions the relevant DNS and HTTPS certificate. Replace conflicting old Weebly records only when ready to switch.
4. Add the apex `aysbartending.com` as well, then create a Cloudflare Redirect Rule sending the apex to `https://www.aysbartending.com`, preserving the path and query string with a 301 redirect. Set HTTP-to-HTTPS redirection in Cloudflare too. Keep `www` as the canonical origin, or change `SITE_URL` consistently if choosing the apex.
5. Verify HTTPS, all five legacy URLs, an unknown URL's 404 status, and the working email link after DNS changes. Keep Weebly available until the new deployment is confirmed, then cancel hosting separately if desired. Submit `/sitemap.xml` in the site's search-console account.

See Cloudflare's [custom-domain instructions](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). Hosting/account access and DNS changes have not been performed by this project.

## URL mapping

All original public page paths are unchanged. Additional convenience aliases in `public/_redirects`:

| Incoming URL | Result |
| --- | --- |
| `/` | `index.html` served with 200; address stays `/` |
| `/index.html` | 301 → `/` |
| `/about-us` | 301 → `/about-us.html` |
| `/services` | 301 → `/services.html` |
| `/contact` | 301 → `/contact.html` |
| `/feedback` | 301 → `/feedback.html` |
| Unknown URL | Custom `404.html`, HTTP 404 |

Other static hosts may need their own equivalents of `_headers`, `_redirects`, and the 404 setting.

## Verification

```sh
npx playwright install chromium
npm run build
npm test
```

Tests cover all six pages at 390, 768, and 1440 CSS pixels, plus 320px without JavaScript, keyboard navigation, mobile menu behavior, form validation and absence of submission, local image loading, browser errors, internal links/anchors, SEO files, and automated WCAG A/AA checks. `npm test` starts a preview server if needed. For an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable.

Screenshots are written to each test's output directory under `test-results/`, which Git ignores. See [verification notes](docs/VERIFICATION.md) for the actual run and limits, and [content audit](docs/CONTENT-AUDIT.md) for the source review and launch gaps.

## Before launch

- The owner should review the rebuilt copy, photos, and email address.
- No phone number or social profiles were published on the five source pages. Add these only if the owner provides them. The original The Knot directory link is retained.
- Forms remain clearly labeled demos; direct email is the live inquiry route.
- Set the domain, deploy, connect DNS, and check the real HTTPS site.

No substantive page content was unavailable. One legacy decorative background returned 404; it is documented in the asset audit and replaced by the new styling.
