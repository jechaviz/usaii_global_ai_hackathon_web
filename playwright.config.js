const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './qa',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4197',
    viewport: { width: 1366, height: 900 },
  },
  outputDir: './test-results',
});
