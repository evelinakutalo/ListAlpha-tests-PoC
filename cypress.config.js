import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: "t64w2f",
  env: {
    baseUrl: 'https://dev-ui.listalpha.com/',
  },
  e2e: {
    baseUrl: 'https://dev-ui.listalpha.com/',

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    experimentalStudio: true,

    viewportWidth: 1440,
    viewportHeight: 970,
    videoUploadOnPasses: false,
    retries: 0,
    video: true,
    videoCompression: 32,
    requestTimeout: 20000,
    defaultCommandTimeout: 20000,
  },
});