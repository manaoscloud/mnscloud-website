import { chromium } from 'playwright';

const baseUrl = process.env.RESPONSIVE_CHECK_BASE_URL ?? 'http://localhost:4321';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('mnscloud_cookie_consent'));
await page.reload({ waitUntil: 'networkidle' });

await page.locator('[data-cookie-customize]').click();
await page.locator('[data-cookie-category="analytics"]').check();
await page.locator('[data-cookie-category="functional"]').check();
await page.locator('[data-cookie-save]').click();

const result = await page.evaluate(() => {
  const modal = document.querySelector('[data-cookie-modal]');
  const banner = document.querySelector('[data-cookie-consent]');
  const raw = localStorage.getItem('mnscloud_cookie_consent');

  return {
    modalHidden: modal?.hasAttribute('hidden') ?? false,
    bannerHidden: banner?.hasAttribute('hidden') ?? false,
    consent: raw ? JSON.parse(raw) : null,
  };
});

await browser.close();

if (!result.modalHidden || !result.bannerHidden || !result.consent?.necessary) {
  console.error(JSON.stringify({ ok: false, result }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, result }, null, 2));
