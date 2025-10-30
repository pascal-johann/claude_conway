import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
        'vitest.config.ts',
      ],
      all: true,
      lines: 85,
      functions: 85,
      branches: 85,
      statements: 85,
    },
  },
});
