const { defineConfig } = require('cypress')
const { setupNodeEvents } = require('../src/index')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Register the cypress-conditional-tags plugin
      return setupNodeEvents(on, config)
    },
    specPattern: 'examples/cypress/*/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'examples/cypress/support/e2e.js',
  },
})
