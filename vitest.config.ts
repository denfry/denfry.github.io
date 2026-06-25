import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
