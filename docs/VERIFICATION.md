# Verification record

Completed October 5, 2026 against the production output in `dist/`.

## Build and dependencies

- `npm run build` completed successfully using Node 24.11.0.
- Output: five complete HTML pages, a custom 404, sitemap, robots.txt, local fonts, 11 responsive image sets, social sharing image, and favicon/manifest assets.
- The build checks local linked-file existence and rejects legacy Weebly/CDN upload references in generated HTML.
- The final npm installation audit reported **0 vulnerabilities**. The initial Sharp dependency advisory was resolved by updating to 0.35.5.

## Browser checks

**36 Playwright tests passed**, using Chromium 1223 from the available browser installation, in 11.3 seconds. The suite is committed in `tests/site.spec.mjs`.

Each of Home, About Us, Services, Contact, Feedback, and 404 was rendered and captured at:

| Device profile | Viewport |
| --- | --- |
| Phone | 390 × 844, 2× pixel density, touch/mobile emulation |
| Tablet | 768 × 1024 |
| Desktop | 1440 × 1000 |
| Additional narrow-screen fallback | 320 × 740, JavaScript off, reduced motion requested |

Verified:

- No horizontal overflow at the tested widths.
- Every image decodes successfully, with dimensions and alt attributes present.
- No browser console errors, uncaught JavaScript errors, failed requests, or third-party page-resource requests.
- No automated axe WCAG 2 A/AA and 2.1 AA violations on any of the six pages at the three primary widths.
- Keyboard skip link moves focus to main; menu toggles with Enter; Escape closes the menu and restores focus; mobile links navigate and collapse the menu.
- Every internal link and section anchor resolves. Each document has one H1 and the expected canonical URL.
- Contact required fields, invalid email, and basic phone validation work. Feedback retains all four original referral choices and required experience input.
- Valid demo checks explicitly say nothing was sent or saved. No document submission, fetch/XHR/beacon, non-GET requests, localStorage, or sessionStorage is used by the tested contact interaction.
- All six original testimonials are present in full on their corresponding pages. Home's full testimonials are keyboard-expandable.
- With JavaScript disabled, navigation and content remain available, and demo buttons are disabled.
- Sitemap has exactly the five public pages, omits 404, and robots.txt references the configured canonical sitemap.

Full-page screenshots were visually reviewed for all five main pages and 404 at phone, tablet, and desktop widths. Generated screenshots were removed during repository cleanup. Running the suite again recreates them in each test's output directory under the ignored `test-results/` directory.

## Static hosting behavior

Validated with **Wrangler 4.147.0**, installed separately in `/tmp` for QA, using the repository's `wrangler.jsonc` against the final build. No account login, deployment, or DNS change was made.

- `/`, `/about-us.html`, `/services.html`, `/contact.html`, and `/feedback.html`: **200**, correct page title/body.
- `/missing`: **404**, custom 404 content.
- `/contact`: **301** to `/contact.html`.
- `/index.html`: **301** to `/`.
- Home's explicit 200 rewrite works with `html_handling: "none"`; it does not create a redirect loop.
- Emulator parsed six redirect/rewrite rules and one shared header rule. The content security policy was present on the responses, including `form-action 'none'`.

## Limits

- Device checks use emulation, not physical phones/tablets. Safari/WebKit, Firefox, and a manual screen-reader session were not tested.
- Automated accessibility checks do not replace a full manual accessibility audit. Visible focus, keyboard order, layout, headings, labels, and image treatments were also reviewed.
- The live production deployment, DNS propagation, TLS certificate, email-client launch/delivery, and third-party The Knot destination are not covered by the local browser suite. Email and directory links preserve the original destinations; verify them with the owner's devices/account before launch.
- No Lighthouse score, real-user performance measurement, or search-engine indexing/rich-result acceptance is claimed.
- Nothing was sent through either form; real delivery is intentionally unavailable.
