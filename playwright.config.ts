import { defineConfig } from '@playwright/test'

// Dedicated, isolated test port + no reuse: guarantees e2e always exercises a
// fresh build of the current code and never silently reuses a stale dev/start
// server lingering on the default port 3000.
const PORT = 4317
const BASE = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: `pnpm build && pnpm exec next start --port ${PORT}`,
    url: BASE,
    timeout: 180_000,
    reuseExistingServer: false,
  },
  use: { baseURL: BASE },
})
