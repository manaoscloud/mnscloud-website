import { chromium } from 'playwright';

const baseUrl = process.env.RESPONSIVE_CHECK_BASE_URL ?? 'http://localhost:4321';

// Optional override for a locally cached browser build (e.g. CHROMIUM_EXECUTABLE_PATH=~/.cache/ms-playwright/...).
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
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

// Every locale renders its own banner copy (same storage key and behavior).
const localized = [];
for (const [path, lang] of [
  ['/', 'pt-BR'],
  ['/en/', 'en-US'],
  ['/es/', 'es-ES'],
]) {
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('mnscloud_cookie_consent'));
  await page.reload({ waitUntil: 'networkidle' });
  localized.push(
    await page.evaluate((expectedLang) => {
      const banner = document.querySelector('[data-cookie-consent]');
      return {
        lang: document.documentElement.lang,
        expectedLang,
        bannerVisible: banner ? !banner.hasAttribute('hidden') : false,
        title: banner?.querySelector('h2')?.textContent?.trim() ?? '',
      };
    }, lang),
  );
}

await browser.close();

const titles = new Set(localized.map((item) => item.title));
const localizedOk =
  localized.every((item) => item.lang === item.expectedLang && item.bannerVisible && item.title) &&
  titles.size === localized.length;

if (!result.modalHidden || !result.bannerHidden || !result.consent?.necessary || !localizedOk) {
  console.error(JSON.stringify({ ok: false, result, localized }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, result, localized }, null, 2));
