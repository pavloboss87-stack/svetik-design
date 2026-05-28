import { expect, test } from '@playwright/test';

test('GET / → FeaturedWorks renders 4 cards linking to project pages', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-testid="featured-card"]');
  await expect(cards).toHaveCount(4);

  for (let i = 0; i < 4; i++) {
    const card = cards.nth(i);
    await expect(card).toBeVisible();
    const href = await card.getAttribute('href');
    expect(href, `card ${i} href`).toMatch(/^\/works\/project-\d+\/$/);
  }
});

test('GET / → FeaturedWorks badge "Концепт" visible on all 4 cards (all isConcept: true)', async ({
  page,
}) => {
  await page.goto('/');
  const badges = page.locator('[data-testid="featured-card"] >> text=/^Концепт/');
  await expect(badges).toHaveCount(4);
});
