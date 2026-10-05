# Source review and preservation

Inspected the live site and all five navigation pages before implementation on October 5, 2026. This audit records the substantive content review; temporary HTML and text snapshots were removed after the rebuild. `asset-inventory.json` records discovered image URLs, their page associations, retained local originals, and source dimensions. Unused downloads are marked as not retained locally.

| Original page | Retained content and purpose |
| --- | --- |
| [Home](https://www.aysbartending.com/) | Personalized mobile bartending; consultation/custom quote invitation; weddings, private parties, corporate events, organization functions, birthdays, anniversaries, boat dock parties; nonprofit discounts; business introduction; service summary; two full testimonial passages; Rhode Island, Massachusetts, eastern Connecticut; The Knot directory link. |
| [About Us](https://www.aysbartending.com/about-us.html) | Christian and Gina own/operate the LLC; Christian teaches locally, Gina manages subsidized housing property; shared interest in service, connection, travel; more than 25 combined service-industry years; high-end New England restaurant/bar backgrounds; trained, certified, friendly team; all bartenders TIPS certified; responsible service and legal drinking age. |
| [Services](https://www.aysbartending.com/services.html) | Casual/formal events; all seven supplied-item categories, including conditional themed décor and coolers; customized drink menu; separate help coordinating liquor/soft drinks, ice, cups/glassware, fruit garnishes. Coordination is not represented as an all-inclusive supply or alcohol-sale package. |
| [Contact](https://www.aysbartending.com/contact.html) | Consultation and quote request; verified email; first name, last name, phone, email, and event details including date/time/location/guest count. Required fields retained. Demo clearly states it cannot deliver a request. |
| [Feedback](https://www.aysbartending.com/feedback.html) | All four published testimonial passages; invitation to share feedback; required discovery-source radio options (Internet Search, Advertisement, Friend, Other); required experience field, enlarged to textarea. |

## Testimonials

All six passages are preserved verbatim apart from normalized HTML whitespace. Two remain on Home with native expandable full text; four remain on Feedback. No names, stars, dates, ratings, or additional reviews were invented. Review-specific statements (for example savings or a client's Total Wine recommendation) remain inside quotations, not promoted to universal business guarantees.

## Contact information

The Contact page publishes `aysbartendingllc@yahoo.com` through Cloudflare's email-obfuscation markup. It was decoded from `data-cfemail` and is now a normal `mailto:` link throughout the site. The five source pages did not publish a telephone number, street address, opening hours, Instagram, or Facebook account. No `tel:` or social-profile links could therefore be carried over. The Knot is a directory link, retained with the exact original destination.

## Images and branding

The home slideshow exposes sixteen image references, including real event bars, Christian/Gina, a wedding couple, a boat gathering, cocktail/menu images, and a group photograph. Page HTML also exposes the logo, TIPS badge, a check mark, the About portrait/background, and decorative backgrounds. The original The Knot badge was also inspected; its directory link is retained as text.

Higher-resolution `_orig` variants were checked and downloaded. Examples: the logo is **1024×1024**, rather than the displayed 209×209; Gina's event photograph is **1030×800**, Christian's **1046×800**, and the bar panorama **1903×750**. The About portrait is **2000×1500**. `assets/originals/` retains the best sources selected for the build. Unused downloads were removed during repository cleanup; their source URLs remain in the inventory. The build never hotlinks to Weebly or a font CDN.

The homepage centers real AYS event photos. Cocktail images retained from the Services page are presented as drink imagery, without inventing provenance. Source aspect ratios remain intact in generated files; CSS crops selected photographs for layout without stretching them. The Services cocktail collage is shown uncropped. The logo and TIPS badge are not redrawn.

Fonts are Cormorant Garamond and DM Sans, self-hosted from Google Fonts with OFL licenses. The new ivory, olive, and warm-gold palette complements the source's neutral logo and event photography. Decorative stock backgrounds, the Weebly slideshow, tracking scripts, old forms, and Weebly branding are absent from the deployed output.

## Retrieval gaps

- `/uploads/8/2/9/8/8298596/background-images/77358995.jpg`, referenced in legacy secondary-page styling, returned **404**. It is a background reference; no substantive copy depended on it. The new background styling replaces it.
- The legacy contact/feedback templates also referenced generic Weebly stock MacBook/city backgrounds. They were identified and intentionally not reused; they add no business-specific content.
- No vector logo was exposed by the source. The high-resolution original raster logo was retrieved successfully and is stored locally.
- No substantive page copy, testimonial, selected event image, logo, or form field is missing.
- The owner should provide a phone number or social profiles if those should be added. Their absence is a source-information gap, not a broken link in the rebuild.

Original page paths are unchanged; convenience aliases and host setup are documented in the README. No domain, DNS, hosting, or external form changes have been made.
