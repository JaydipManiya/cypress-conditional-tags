const { defineConfig } = require('cypress')
const { setupNodeEvents } = require('../../src/index')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return setupNodeEvents(on, config)
    },
    specPattern: 'test/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/e2e/support/e2e.js',
  },
})
