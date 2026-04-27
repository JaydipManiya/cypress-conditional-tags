# Quick Start Guide

Get started with `cypress-conditional-tags` in 5 minutes!

## ⚠️ Important Notes

This plugin provides **conditional logic** based on tags - it does **NOT filter/skip tests**.

- ✅ Access tag info inside test logic
- ❌ Does NOT skip tests based on tags

**Environment Variable:** Use `conditionalTags` (not `grepTags`) to avoid conflicts with `@cypress/grep`.

For test filtering, install `@cypress/grep` separately (see README).

## Installation

```bash
npm install cypress-conditional-tags --save-dev
```

## Setup (2 steps)

### Step 1: Configure Cypress

Edit `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress')
const { setupNodeEvents } = require('cypress-conditional-tags')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return setupNodeEvents(on, config)
    },
  },
})
```

### Step 2: Setup Support File

Edit `cypress/support/e2e.js`:

```javascript
const { setupSupport } = require('cypress-conditional-tags')

setupSupport()
```

## Basic Usage

### 1. Add Tags to Tests

Use Cypress's native `tags` option:

```javascript
describe('Login Tests', () => {
  it('should login successfully', { tags: ['IS_QA', 'SMOKE'] }, () => {
    cy.visit('/login')
    cy.get('[data-cy=username]').type('user')
    cy.get('[data-cy=password]').type('pass')
    cy.get('[data-cy=submit]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### 2. Pass Runtime Tags via CLI

```bash
# Pass runtime tag for conditional logic (all tests still run)
npx cypress run --env conditionalTags=IS_QA

# Pass multiple runtime tags
npx cypress run --env conditionalTags=tag5+tag6

# Note: This does NOT filter tests - use @cypress/grep for filtering
```

**Backward Compatibility:** `grepTags` still works if `conditionalTags` is not provided.

### 3. Use Tags in Test Logic

```javascript
it('should test feature', { tags: ['IS_QA', 'IS_PROD'] }, () => {
  // Use different URL based on runtime tag
  if (Cypress.Tags.isRuntime('IS_QA')) {
    cy.visit('https://qa.example.com')
  } else if (Cypress.Tags.isRuntime('IS_PROD')) {
    cy.visit('https://prod.example.com')
  }
  
  // Your test code here
  cy.get('h1').should('be.visible')
})
```

## Common Use Cases

### Environment-Specific URLs

```javascript
it('should use correct environment', { tags: ['IS_QA', 'IS_PROD'] }, () => {
  const baseUrl = Cypress.Tags.isRuntime('IS_QA')
    ? 'https://qa.example.com'
    : 'https://prod.example.com'
  
  cy.visit(baseUrl)
})
```

### Skip Expensive Operations

```javascript
it('should test feature', { tags: ['FAST', 'FULL'] }, () => {
  cy.visit('/page')
  
  // Skip expensive operations for FAST tests
  if (!Cypress.Tags.isRuntime('FAST')) {
    cy.get('[data-cy=analytics]').click()
    cy.wait('@analyticsData')
  }
  
  cy.get('[data-cy=submit]').click()
})
```

### Different Test Data

```javascript
it('should process data', { tags: ['SMALL_DATA', 'LARGE_DATA'] }, () => {
  const recordCount = Cypress.Tags.isRuntime('LARGE_DATA') ? 10000 : 100
  
  cy.request('POST', '/api/data', { count: recordCount })
  cy.visit('/data-viewer')
})
```

## API Cheat Sheet

### Check Runtime Tag (from CLI)

```javascript
// Get runtime tag
const tag = Cypress.Tags.getRuntime() // 'IS_QA' or null

// Check if running with specific tag
if (Cypress.Tags.isRuntime('IS_QA')) {
  // QA-specific logic
}

// Check for any of multiple tags
if (Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING')) {
  // Non-production logic
}
```

### Check Test Tags (from config)

```javascript
// Get test's tags
const tags = Cypress.Tags.getTest() // ['IS_QA', 'SMOKE']

// Check if test has specific tag
if (Cypress.Tags.hasTest('SMOKE')) {
  // Smoke test logic
}

// Check if test matches runtime tag
if (Cypress.Tags.matchesRuntime()) {
  // Test has the runtime tag
}
```

## Running Tests

```bash
# Run all tests (no filtering)
npx cypress run

# Pass runtime tag for conditional logic (all tests still run)
npx cypress run --env conditionalTags=IS_QA

# Pass multiple runtime tags
npx cypress run --env conditionalTags=tag5+tag6

# Open Cypress UI with runtime tag
npx cypress open --env conditionalTags=IS_QA

# With @cypress/grep: Filter tests + conditional logic
npx cypress run --env grepTags=tag2,conditionalTags=tag5+tag6
```

**For test filtering:** Install `@cypress/grep` - see README for setup instructions.

## Next Steps

- 📖 Read the [full README](README.md) for detailed documentation
- 💡 Check [examples](examples/) for more use cases
- 🧪 Review [test examples](examples/cypress/e2e/) for comprehensive testing patterns


---

Happy Testing! 🎉