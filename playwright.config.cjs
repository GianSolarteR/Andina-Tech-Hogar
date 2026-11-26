const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/e2e', timeout: 30000, fullyParallel: false, workers: 1,
  outputDir: '.expo/test-results', reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, launchOptions: { channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' }, screenshot: 'only-on-failure' },
  projects: [ { name: 'escritorio', use: { viewport: { width: 1366, height: 900 } } }, { name: 'movil', use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } } ],
  webServer: { command: 'node tests/serve-web.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: false }
});
