import { expect, test } from '@playwright/test';
import { E2E_SUBMIT_URL } from '../../playwright.config';

// ContactForm wired to a fake Submit Worker URL set in webServer.env, then
// intercepted via page.route here. Mirrors the Worker's mock-mode reply.
test.describe('ContactForm', () => {
  test('happy path: with consent → POST → 200 mock → success UI', async ({ page }) => {
    let captured: { method: string; body: unknown } | null = null;

    await page.route(E2E_SUBMIT_URL, async (route, request) => {
      captured = {
        method: request.method(),
        body: request.postDataJSON(),
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, mock: true }),
      });
    });

    await page.goto('/contact/');

    await page.locator('#contact-name').fill('Тест Тестов');
    await page.locator('#contact-contact').fill('@svgodesign');
    await page.locator('#contact-message').fill('E2E hello — это автотест T30.');
    await page.locator('#contact-consent').check();

    await page.locator('[data-submit-button]').click();

    await expect(page.locator('#contact-form-status')).toContainText('Заявка отправлена');

    expect(captured, 'fetch was not invoked').not.toBeNull();
    expect(captured!.method).toBe('POST');
    expect(captured!.body).toMatchObject({
      name: 'Тест Тестов',
      contact: '@svgodesign',
      consent: true,
    });
  });

  test('negative path: without consent → submit blocked, no fetch', async ({ page }) => {
    let fetched = false;
    await page.route(E2E_SUBMIT_URL, async (route) => {
      fetched = true;
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto('/contact/');

    await page.locator('#contact-name').fill('Без галочки');
    await page.locator('#contact-contact').fill('user@example.com');
    await page.locator('#contact-message').fill('Без consent — submit должен быть заблокирован.');

    await page.locator('[data-submit-button]').click();

    // HTML5 `required` on the consent checkbox triggers the browser's native
    // validation tooltip; the JS submit handler never runs. We assert the
    // negative-space: status stays empty, no fetch happened, the form's
    // reportValidity() returns false.
    await expect(page.locator('#contact-form-status')).toHaveText('');
    expect(fetched).toBe(false);

    const consentValid = await page
      .locator('#contact-consent')
      .evaluate((el: Element) => (el as HTMLInputElement).validity.valid);
    expect(consentValid).toBe(false);
  });
});
