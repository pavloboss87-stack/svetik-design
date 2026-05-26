import { expect, test } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/works/',
  '/works/project-01/',
  '/about/',
  '/services/',
  '/contact/',
  '/privacy/',
] as const;

for (const route of PUBLIC_ROUTES) {
  test(`GET ${route} → 200 + header/footer`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response, `no response for ${route}`).not.toBeNull();
    expect(response!.status(), `bad status for ${route}`).toBe(200);

    await expect(page).toHaveTitle(/.+/);

    await expect(page.locator('header nav[aria-label="Главная навигация"]')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });
}

test('GET /no-such-page → 404 page renders Layout', async ({ page }) => {
  const response = await page.goto('/no-such-page-e2e/');
  expect(response).not.toBeNull();
  expect(response!.status()).toBe(404);

  await expect(page.locator('h1')).toContainText('Страница не найдена');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
