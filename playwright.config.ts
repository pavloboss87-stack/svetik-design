import { defineConfig, devices } from '@playwright/test';

// E2E config (T30). webServer runs `pnpm build && pnpm preview` so tests hit
// the real production output (CF Pages mirrors the same artifacts), not the
// dev server. PUBLIC_SUBMIT_URL is baked at build-time into the ContactForm's
// data-submit-url; tests intercept that URL via page.route to emulate the
// Submit Worker's mock-mode reply without needing a live worker.
//
// PUBLIC_SITE_URL stays unset on purpose — the home/works/etc. routes do not
// depend on it for rendering (they use Astro.site or the seed seo.json).

const E2E_SUBMIT_URL = 'https://e2e-mock.svetik-design.test/api/submit';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Low worker count keeps webkit child processes on Windows from contending
  // and missing the post-suite shutdown window (Playwright 1.60 force-kills
  // hung workers after ~5 min, which masks green runs with red exit codes).
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // iPhone 13 device emulation defaults to webkit; mirrors the Lighthouse
      // mobile preset's viewport while exercising a second engine.
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'pnpm build && pnpm preview --port 4321 --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      PUBLIC_SUBMIT_URL: E2E_SUBMIT_URL,
    },
  },

  metadata: {
    submitUrl: E2E_SUBMIT_URL,
  },
});

// Re-export so spec files share one literal — keeps page.route() filter in sync
// with the URL Vite inlined into <form data-submit-url>.
export { E2E_SUBMIT_URL };
