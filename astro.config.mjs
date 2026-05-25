// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dev-only: Vite не отдаёт public/<dir>/index.html по URL /<dir>/, нужный Decap CMS на /admin/.
// В preview/prod (CF Pages) static-hosting резолвит trailing-slash на index.html сам.
// Vite не лежит в прямых deps, поэтому типы импортируются из astro/connect-style минимально руками.
const serveAdminIndexInDev = {
  name: 'serve-admin-index-in-dev',
  /** @param {{ middlewares: { use: (m: (req: { url?: string }, res: unknown, next: () => void) => void) => void } }} server */
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/admin' || req.url === '/admin/') {
        req.url = '/admin/index.html';
      }
      next();
    });
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://svetik-design.pages.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), serveAdminIndexInDev],
  },
});
