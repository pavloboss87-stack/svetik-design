import { expect, test } from '@playwright/test';

// ep02 T09 — структурный stop-loss от silent fallback на Georgia (Fraunces 2.0).
// Открываем страницу с русским <h1>, ждём document.fonts.ready, читаем resolved
// font-family и состояние FontFaceSet. Зелёный, только если:
//   а) стек font-family на <h1> начинается с 'PT Serif' (не оттеснён в хвост
//      fallback'ами),
//   б) document.fonts содержит зарегистрированный FontFace 'PT Serif' в
//      статусе 'loaded' (это ловит ситуацию "font-family-стек правильный, но
//      @font-face declaration отсутствует, woff2 не пришёл, либо preload-
//      mismatch — а резолвится в Georgia silent fallback").
//
// Намеренно НЕ используем document.fonts.check() — этот API возвращает true
// и для несуществующих/незарегистрированных family ("ждать нечего"), что
// маскирует regression.
//
// WebKit/Safari возвращает FontFace.family с обёрткой в кавычки ('"PT Serif"'),
// Chromium — без ('PT Serif'). Снимаем кавычки перед сравнением.
//
// Негативный тест (manual): закомментировать импорт PT Serif в src/styles/global.css,
// перезапустить pnpm test:e2e — этот спек должен покраснеть. Восстановить — зелёный.
// Проверено локально 2026-05-26 для обоих <h1> (/, /works/project-01/) на
// chromium и mobile-safari.

async function readH1PtSerifState(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    const fontFamily = window.getComputedStyle(h1).fontFamily;
    const ptSerifLoaded = Array.from(document.fonts).some(
      (f) => f.family.replace(/^['"]|['"]$/g, '') === 'PT Serif' && f.status === 'loaded',
    );
    return { fontFamily, ptSerifLoaded };
  });
}

test('PT Serif рендерится на /works/project-01/ <h1> (cyrillic stop-loss)', async ({ page }) => {
  await page.goto('/works/project-01/');
  const info = await readH1PtSerifState(page);
  expect(info, '<h1> not found on /works/project-01/').not.toBeNull();
  expect(info!.fontFamily.toLowerCase()).toMatch(/^['"]?pt serif['"]?\b/i);
  expect(
    info!.ptSerifLoaded,
    `PT Serif не зарегистрирован/не загружен; fontFamily=${info!.fontFamily}`,
  ).toBe(true);
});

test('PT Serif рендерится на / Hero <h1> (display token)', async ({ page }) => {
  await page.goto('/');
  const info = await readH1PtSerifState(page);
  expect(info, '<h1> not found on /').not.toBeNull();
  expect(info!.fontFamily.toLowerCase()).toMatch(/^['"]?pt serif['"]?\b/i);
  expect(
    info!.ptSerifLoaded,
    `Hero h1 — PT Serif не зарегистрирован/не загружен; fontFamily=${info!.fontFamily}`,
  ).toBe(true);
});
