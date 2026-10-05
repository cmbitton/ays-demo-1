// Progressive enhancement only: all page content and links are in the HTML.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const mobile = window.matchMedia('(max-width: 900px)');

if (toggle && nav) {
  nav.dataset.enhanced = '';
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-label').textContent = 'Menu';
    nav.classList.remove('is-open');
    if (restoreFocus) toggle.focus();
  };
  const syncMenu = () => {
    const focusWillHide = mobile.matches && nav.contains(document.activeElement);
    toggle.hidden = !mobile.matches;
    closeMenu(focusWillHide);
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (mobile.matches && !event.target.closest('.site-header')) closeMenu();
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && mobile.matches) closeMenu();
  });
  mobile.addEventListener('change', syncMenu);
  syncMenu();
}

for (const form of document.querySelectorAll('[data-demo-form]')) {
  // Never transmit data, use storage, or show a submission confirmation.
  form.addEventListener('submit', event => event.preventDefault());
  const button = form.querySelector('[data-demo-check]');
  const status = form.querySelector('.form-status');
  button.disabled = false;
  form.addEventListener('input', event => {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    status.textContent = '';
  });
  button.addEventListener('click', () => {
    for (const input of form.querySelectorAll('input:not([type="radio"]), textarea')) {
      input.setCustomValidity(input.required && !input.value.trim() ? 'Please complete this field.' : '');
    }
    const phone = form.querySelector('[type="tel"]');
    if (phone && phone.value.trim() && phone.value.replace(/\D/g, '').length < 7) {
      phone.setCustomValidity('Please enter a phone number with at least 7 digits, including your area code.');
    }
    if (!form.reportValidity()) return;
    status.textContent = 'Your fields look complete. This is a demo: nothing has been sent or saved. Please use the email link above to contact us.';
    status.focus();
  });
}
