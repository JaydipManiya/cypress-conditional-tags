// Import cypress-conditional-tags support
const { setupSupport } = require('../../../src/index')

// Enable runtime tag access
setupSupport()

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
