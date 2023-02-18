import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    baseUrl: 'http://stage.listalpha.com',
  },
  e2e: {
    baseUrl: 'http://stage.listalpha.com',

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    viewportWidth: 1280,
    viewportHeight: 970,
    videoUploadOnPasses: false,
    screenshotOnRunFailure: false,
    retries: 0,
    video: false,
    requestTimeout: 20000,
    defaultCommandTimeout: 20000,
  },
});