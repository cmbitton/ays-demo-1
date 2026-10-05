export const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const arrow = '<span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M4 12 12 4M5 4h7v7"/></svg></span>';
export const button = (label, href = '/contact.html', secondary = false) => `<a class="button${secondary ? ' button-secondary' : ''}" href="${escape(href)}">${escape(label)} ${arrow}</a>`;
export const textLink = (label, href) => `<a class="text-link" href="${escape(href)}">${escape(label)} ${arrow}</a>`;

export function picture(images, key, {className = '', sizes = '(max-width: 700px) 100vw, 50vw', eager = false} = {}) {
  const image = images[key];
  if (!image) throw new Error(`Unknown image: ${key}`);
  return `<picture class="${className}"><source type="image/avif" srcset="${image.variants.map(v => `${v.avif} ${v.width}w`).join(', ')}" sizes="${sizes}"><img src="${image.variants.at(-1).webp}" srcset="${image.variants.map(v => `${v.webp} ${v.width}w`).join(', ')}" sizes="${sizes}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : 'decoding="async"'}></picture>`;
}

export function callout() {
  return `<section class="callout"><div class="container callout-inner"><div><p class="eyebrow">YOUR OCCASION. OUR PERSONAL TOUCH.</p><h2>Let’s make it <em>one to remember.</em></h2></div>${button('Let’s plan your event')}</div></section>`;
}

export function quote(review, {compact = false} = {}) {
  const split = review.text.indexOf('. ') + 1;
  return `<figure class="testimonial"><span class="quote-mark" aria-hidden="true">“</span><blockquote>${compact ? `<p>${escape(review.text.slice(0, split))}</p><details><summary>Read the full testimonial</summary><p>${escape(review.text.slice(split).trim())}</p></details>` : `<p>${escape(review.text)}</p>`}</blockquote><figcaption>Words from our clients</figcaption></figure>`;
}

export function demoNotice(email, id) {
  return `<div class="demo-notice" id="${id}"><strong>A little note: this is a demo form.</strong><p>Nothing you enter here is sent or saved. To get in touch, <a href="mailto:${escape(email)}">email us directly</a>.</p></div>`;
}

export function contactForm(site) {
  return `<form class="demo-form" aria-label="Event inquiry" aria-describedby="contact-demo" data-demo-form>
    ${demoNotice(site.email, 'contact-demo')}
    <p class="form-help">All fields are required.</p>
    <div class="form-row"><div class="field"><label for="first-name">First name <span aria-hidden="true">*</span></label><input id="first-name" name="firstName" autocomplete="given-name" required maxlength="100"></div><div class="field"><label for="last-name">Last name <span aria-hidden="true">*</span></label><input id="last-name" name="lastName" autocomplete="family-name" required maxlength="100"></div></div>
    <div class="form-row"><div class="field"><label for="phone">Phone number <span aria-hidden="true">*</span></label><input type="tel" id="phone" name="phone" autocomplete="tel" required minlength="7" maxlength="30" aria-describedby="phone-help"><small id="phone-help">Include your area code.</small></div><div class="field"><label for="email">Email address <span aria-hidden="true">*</span></label><input type="email" id="email" name="email" autocomplete="email" required maxlength="254"></div></div>
    <div class="field"><label for="event-details">Tell us about your event <span aria-hidden="true">*</span></label><p class="field-hint" id="event-help">Include the date, time, location, and guest count, if known.</p><textarea id="event-details" name="eventDetails" rows="5" required maxlength="5000" aria-describedby="event-help"></textarea></div>
    <button class="button" type="button" data-demo-check disabled>Check inquiry (demo) ${arrow}</button><p class="form-status" role="status" aria-live="polite" tabindex="-1"></p>
    <noscript><p>This demo requires JavaScript to check fields. No information is submitted. Please <a href="mailto:${escape(site.email)}">email us directly</a>.</p></noscript>
  </form>`;
}

export function feedbackForm(site) {
  return `<form class="demo-form" aria-label="Share your feedback" aria-describedby="feedback-demo" data-demo-form>
    ${demoNotice(site.email, 'feedback-demo')}
    <p class="form-help">All fields are required.</p>
    <fieldset><legend>How did you hear about this site? <span aria-hidden="true">*</span></legend><div class="radio-options">${['Internet Search','Advertisement','Friend','Other'].map((label,i) => `<label class="radio-option" for="heard-${i}"><input id="heard-${i}" type="radio" name="heardAbout" value="${label}" required>${label}</label>`).join('')}</div></fieldset>
    <div class="field"><label for="experience">How was your experience with our services? <span aria-hidden="true">*</span></label><textarea id="experience" name="experience" rows="5" required maxlength="5000"></textarea></div>
    <button class="button" type="button" data-demo-check disabled>Check feedback (demo) ${arrow}</button><p class="form-status" role="status" aria-live="polite" tabindex="-1"></p>
    <noscript><p>This demo requires JavaScript to check fields. No information is submitted. Please <a href="mailto:${escape(site.email)}">email your feedback</a>.</p></noscript>
  </form>`;
}
