import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'workers/**/test/**/*.test.ts',
      'tests/unit/**/*.test.ts',
      'tests/content/**/*.spec.ts',
    ],
    environment: 'node',
  },
});
