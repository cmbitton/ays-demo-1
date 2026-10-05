import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';

const pages = ['/', '/about-us.html', '/services.html', '/contact.html', '/feedback.html', '/404.html'];
for (const route of pages) {
  test(`${route} renders, loads assets, and meets automated accessibility checks`,async({page},testInfo)=>{
    const errors=[];const failures=[];const external=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    page.on('requestfailed',request=>failures.push(request.url()));
    page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4173/'))external.push(request.url());});
    expect((await page.goto(route)).status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    await page.evaluate(async()=>{for(const image of document.images){image.loading='eager';}await Promise.all([...document.images].map(image=>image.decode()));await document.fonts.ready;});
    const missing=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
    expect(missing).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('img').evaluateAll(images=>images.every(i=>i.hasAttribute('width')&&i.hasAttribute('height')&&i.hasAttribute('alt')))).toBe(true);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.aysbartending.com${route}`);
    expect(errors).toEqual([]);expect(failures).toEqual([]);expect(external).toEqual([]);
    await page.screenshot({path:testInfo.outputPath('page.png'),fullPage:true});
  });
}

test('internal links and anchors, original paths, redirects, and 404 work',async({page,request})=>{
  for(const route of pages){
    await page.goto(route);
    const links=await page.locator('a[href^="/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')))]);
    for(const link of links){
      const [path,hash]=link.split('#');
      const response=await request.get(path);
      expect(response.status(),link).toBe(200);
      if(hash)expect(await response.text()).toContain(`id="${hash}"`);
    }
  }
  expect((await request.get('/missing-page')).status()).toBe(404);
  expect(await (await request.get('/missing-page')).text()).toContain('left the party');
  expect((await request.get('/contact',{maxRedirects:0})).status()).toBe(301);
  const sitemap=await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(5);
  expect(sitemap).not.toContain('404.html');
  expect(await (await request.get('/robots.txt')).text()).toContain('https://www.aysbartending.com/sitemap.xml');
});

test('keyboard skip link, navigation, and menu dismissal',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const toggle=page.locator('.menu-toggle');
  if(await toggle.isVisible()){
    await toggle.focus();await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Tab');
    await expect(page.locator('#primary-nav a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(page.locator('#primary-nav')).toBeHidden();
    await toggle.click();await page.locator('#primary-nav').getByRole('link',{name:'Services',exact:true}).click();
    await expect(page).toHaveURL(/services\.html$/);
    await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
  }else{
    await expect(page.locator('#primary-nav')).toBeVisible();
  }
});

test('contact demo validates fields and never sends data',async({page})=>{
  await page.goto('/contact.html');const requests=[];page.on('request',r=>{if(['document','fetch','xhr','ping'].includes(r.resourceType()) || r.method() !== 'GET')requests.push(r.url());});
  const button=page.getByRole('button',{name:'Check inquiry (demo)'});
  await button.click();await expect(page.locator('#first-name')).toBeFocused();
  await page.getByLabel('First name').fill('Test');await page.getByLabel('Last name').fill('Guest');
  await page.getByLabel('Phone number').fill('letters');await page.getByLabel('Email address').fill('bad-email');
  await page.getByLabel('Tell us about your event').fill('A celebration, date and venue to be confirmed.');
  await button.click();await expect(page.locator('#phone')).toBeFocused();
  await page.getByLabel('Phone number').fill('401-555-0100');await button.click();await expect(page.locator('#email')).toBeFocused();
  await page.getByLabel('Email address').fill('test@example.com');await button.click();
  await expect(page.locator('.form-status')).toContainText('nothing has been sent or saved');
  await expect(page.locator('.form-status')).toBeFocused();
  expect(requests).toEqual([]);
  expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
});

test('feedback demo keeps referral choices and does not submit',async({page})=>{
  await page.goto('/feedback.html');
  await expect(page.getByRole('radio')).toHaveCount(4);
  await page.getByRole('button',{name:'Check feedback (demo)'}).click();
  await expect(page.getByRole('radio',{name:'Internet Search'})).toBeFocused();
  await page.getByRole('radio',{name:'Friend',exact:true}).check();
  await page.getByLabel('How was your experience').fill('Thank you for your hospitality.');
  await page.getByRole('button',{name:'Check feedback (demo)'}).click();
  await expect(page.locator('.form-status')).toContainText('nothing has been sent or saved');
  await expect(page).toHaveURL(/feedback\.html$/);
});

test('every original testimonial is complete and expandable by keyboard',async({page})=>{
  const reviews=JSON.parse(await readFile('src/content/testimonials.json','utf8'));
  for(const [key,route] of [['home','/'],['feedback','/feedback.html']]){
    await page.goto(route);
    const actual=await page.locator('blockquote').evaluateAll(quotes=>quotes.map(quote=>[...quote.querySelectorAll('p')].map(p=>p.textContent).join(' ')));
    expect(actual).toEqual(reviews.filter(review=>review.page===key).map(review=>review.text));
    for(const summary of await page.locator('summary').all()){
      await summary.focus();await page.keyboard.press('Enter');
      await expect(summary.locator('..')).toHaveAttribute('open','');
      await expect(summary.locator('..').locator('p')).toBeVisible();
    }
  }
});

test('works without JavaScript and at 320px with reduced motion',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const route of pages){
    await page.goto(`http://127.0.0.1:4173${route}`);
    await expect(page.locator('#primary-nav')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(route.includes('contact')||route.includes('feedback'))await expect(page.locator('[data-demo-check]')).toBeDisabled();
  }
  await context.close();
});
