import { defineConfig, devices } from '@playwright/test'

const e2eDatabaseUrl = 'sqlite:////tmp/bmad_todo_e2e.db'
const e2eApiBaseUrl = 'http://127.0.0.1:8001'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `rm -f /tmp/bmad_todo_e2e.db && DATABASE_URL=${e2eDatabaseUrl} ENABLE_E2E_TEST_ROUTES=1 ../.venv/bin/python -m fastapi dev ../api/app/main.py --host 127.0.0.1 --port 8001`,
      port: 8001,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `VITE_API_BASE_URL=${e2eApiBaseUrl} npm run dev -- --host 127.0.0.1 --port 4173`,
      port: 4173,
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
