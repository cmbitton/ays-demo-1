import {button, textLink} from './components.mjs';
export const meta = {key:'404',path:'/404.html',title:'Page Not Found | At Your Service Bartending',description:'This page could not be found. Return home or contact At Your Service Mobile Bartending to plan your event.'};
export function render() {
 return `<section class="container not-found"><p class="eyebrow">404 · PAGE NOT FOUND</p><span class="not-found-star" aria-hidden="true">✧</span><h1>Looks like this page<br>has <em>left the party.</em></h1><p>We couldn’t find that address. Let’s get you back to the good stuff.</p><div class="hero-actions">${button('Back to home','/')}${textLink('Get in touch','/contact.html')}</div></section>`;
}
