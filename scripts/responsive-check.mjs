import { chromium } from 'playwright';

const baseUrl = process.env.RESPONSIVE_CHECK_BASE_URL ?? 'http://localhost:4321';

const paths = [
  '/',
  '/modules/voip/',
  '/modules/hosting/',
  '/modules/monitoring/',
  '/modules/cyber-security/',
  '/modules/support/',
  '/docs/',
  '/developers/',
  '/security/',
  '/blog/',
  '/contact/',
];

const viewports = [
  { name: 'mobile-320', width: 320, height: 740 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const problems = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });

  for (const path of paths) {
    await page.goto(new URL(path, baseUrl).toString(), { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
      const documentWidth = document.documentElement.scrollWidth;
      const viewportWidth = document.documentElement.clientWidth;
      const overflowElements = [...document.querySelectorAll('body *')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          const allowsInternalScroll = ['auto', 'scroll'].includes(style.overflowX);

          return (
            rect.width > 0 &&
            !allowsInternalScroll &&
            (rect.right > window.innerWidth + 2 || rect.left < -2)
          );
        })
        .slice(0, 10)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          className: String(element.className),
          text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 90) ?? '',
        }));

      return {
        documentWidth,
        viewportWidth,
        overflow: documentWidth - viewportWidth,
        overflowElements,
      };
    });

    if (result.overflow > 2 || result.overflowElements.length > 0) {
      problems.push({ viewport: viewport.name, path, ...result });
    }
  }

  await page.close();
}

await browser.close();

if (problems.length > 0) {
  console.error(JSON.stringify({ ok: false, problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      checkedPages: paths.length,
      checkedViewports: viewports.map((viewport) => viewport.name),
    },
    null,
    2,
  ),
);
