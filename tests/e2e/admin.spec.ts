import { expect, test } from '@playwright/test';

// /admin/ loads the Decap CMS shell from unpkg. In CI we don't go through the
// real OAuth — just confirm:
//   (a) the shell HTML responds 200,
//   (b) the Decap CMS bundle reference is present,
//   (c) once Decap boots, the «Login with GitHub» button shows up.
//
// If unpkg is unreachable from the runner, (c) fails first — surfaces as a
// network problem rather than a code regression.
test('GET /admin/ → Decap login visible', async ({ page }) => {
  const response = await page.goto('/admin/');
  expect(response).not.toBeNull();
  expect(response!.status()).toBe(200);

  const decapScript = page.locator('script[src*="decap-cms"]');
  await expect(decapScript).toHaveCount(1);

  // Decap loads JS from unpkg, renders into <body>. Login button text is
  // localized — pattern catches «Войти через GitHub» and «Login with GitHub».
  const loginButton = page.getByRole('button', { name: /GitHub/i });
  await expect(loginButton).toBeVisible({ timeout: 30_000 });
});
