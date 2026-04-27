# Cypress Conditional Tags

Access runtime tags (from CLI) and test tags (from config) inside Cypress test logic!

## ⚠️ Important: What This Plugin Does

This plugin provides **conditional logic** based on tags - it does **NOT filter/skip tests**.

**Use this plugin when you need to:**
- Execute different code paths based on environment tags
- Access tag information inside test logic
- Make runtime decisions based on CLI tags


## The Problem
As test suites grow, tests often need to behave differently depending on context:

- Different environments
- Feature flags
- Test types (smoke, regression, critical)
- Debug vs CI execution
- Data variations
- Region or tenant-specific logic

What usually happens?

Teams end up with:

❌ Hardcoded values inside tests
❌ Scattered conditional logic
❌ Multiple config switches
❌ Duplicate test cases for different scenarios

This makes test suites:

- Hard to maintain
- Difficult to scale
- Less readable over time

## The Solution

This plugin makes both runtime tags (from CLI) and test tags (from config) accessible inside your tests:

```javascript
it('Test Case 01', { tags: ['IS_QA', 'IS_GA'] }, () => {
  // Access runtime tag from CLI (passed via --env conditionalTags=IS_QA)
  if (Cypress.Tags.isRuntime('IS_QA')) {
    cy.log('Running in QA mode')
    cy.visit('https://qa.example.com')
  } else if (Cypress.Tags.isRuntime('IS_GA')) {
    cy.log('Running in GA mode')
    cy.visit('https://ga.example.com')
  }
  
  // Access test's configured tags
  const testTags = Cypress.Tags.getTest()
  cy.log(`Test tags: ${testTags.join(', ')}`)
})
```

## Environment Variable

**Use `conditionalTags`** to pass runtime tags:

```bash
npx cypress run --env conditionalTags=IS_QA
```

```bash
# Filter tests with tag2, use tag5+tag6 for conditional logic
npx cypress run --env conditionalTags=tag5+tag6
```


## Installation

```bash
npm install cypress-conditional-tags --save-dev
```

## Setup

### 1. Configure Cypress (cypress.config.js)

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

### 2. Setup Support File (cypress/support/e2e.js)

```javascript
const { setupSupport } = require('cypress-conditional-tags')

setupSupport()
```

That's it! You're ready to use runtime tags.

## Usage

### Adding Tags to Tests

Use Cypress's native `tags` option in test configuration:

```javascript
describe('Login Tests', () => {
  it('should login with valid credentials', { tags: ['IS_QA', 'SMOKE'] }, () => {
    // Test code
  })
  
  it('should show error for invalid credentials', { tags: ['IS_QA', 'REGRESSION'] }, () => {
    // Test code
  })
})
```

### Running Tests with Tags


#### Option 1: Conditional Logic Only (This Plugin Standalone)
Use `conditionalTags` for conditional logic - **all tests will run**:

```bash
# Pass runtime tag for conditional logic using conditionalTags
npx cypress run --env conditionalTags=IS_QA

# Result: All tests execute, but Cypress.Tags.isRuntime('IS_QA') returns true

# Multiple tags for conditional logic
npx cypress run --env conditionalTags=tag5+tag6
```

#### Option 2: Test Filtering + Conditional Logic (Both Plugins)
Use **separate environment variables** for filtering vs conditional logic:

**Setup:**
```bash
# 1. Install @cypress/grep
npm install --save-dev @cypress/grep

# 2. Update cypress.config.js
const { defineConfig } = require('cypress')
const { setupNodeEvents } = require('cypress-conditional-tags')
const registerCypressGrep = require('@cypress/grep/src/plugin')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupNodeEvents(on, config)
      registerCypressGrep(config) // Add grep for filtering
      return config
    },
  },
})

# 3. Update cypress/support/e2e.js
const { setupSupport } = require('cypress-conditional-tags')
require('@cypress/grep')() // Add grep support

setupSupport()
```

**Usage - Independent Control:**
```bash
# Filter tests with tag2, use tag5+tag6 for conditional logic
npx cypress run --env grepTags=tag2,conditionalTags=tag5+tag6

# What happens:
# 1. @cypress/grep filters: Only runs tests with 'tag2'
# 2. Inside those tests: Cypress.Tags.isRuntime('tag5') returns true
#                        Cypress.Tags.isRuntime('tag6') returns true

# Another example: Filter with multiple tags, different conditional tags
npx cypress run --env grepTags=SMOKE+REGRESSION,conditionalTags=IS_QA

# Result:
# - Runs tests tagged with SMOKE OR REGRESSION (filtering)
# - Inside tests: Cypress.Tags.isRuntime('IS_QA') returns true (conditional logic)
```

**Key Benefits:**
- ✅ **Independent control**: Filter tests with one set of tags, use different tags for logic
- ✅ **No conflicts**: `grepTags` for filtering, `conditionalTags` for logic
- ✅ **Backward compatible**: Still supports `grepTags` for conditional logic if `conditionalTags` not provided

### Accessing Tags at Runtime

#### Method 1: Synchronous Access (Recommended)

Use `Cypress.Tags` for immediate, synchronous access:

```javascript
it('should test feature', { tags: ['IS_QA', 'SMOKE'] }, () => {
  // Get runtime tag from CLI
  const runtimeTag = Cypress.Tags.getRuntime()
  console.log(runtimeTag) // 'IS_QA' (if run with --env conditionalTags=IS_QA)
  
  // Check if running with specific tag
  if (Cypress.Tags.isRuntime('IS_QA')) {
    cy.log('Running in QA mode')
  }
  
  // Check for any of multiple tags
  if (Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING')) {
    cy.log('Running in non-production environment')
  }
  
  // Get test's configured tags
  const testTags = Cypress.Tags.getTest()
  console.log(testTags) // ['IS_QA', 'SMOKE']
  
  // Check if test has specific tag
  if (Cypress.Tags.hasTest('SMOKE')) {
    cy.log('This is a smoke test')
  }
  
  // Check if test matches runtime tag
  if (Cypress.Tags.matchesRuntime()) {
    cy.log('Test has the runtime tag!')
  }
})
```

#### Method 2: Cypress Commands (Async)

Use custom Cypress commands for chainable operations:

```javascript
it('should test feature', { tags: ['IS_QA', 'SMOKE'] }, () => {
  cy.getRuntimeTag().then(tag => {
    cy.log(`Runtime tag: ${tag}`)
  })
  
  cy.isRuntimeTag('IS_QA').then(isQA => {
    if (isQA) {
      cy.log('Running in QA mode')
    }
  })
  
  cy.getTestTags().then(tags => {
    expect(tags).to.include('SMOKE')
  })
  
  cy.hasTestTag('SMOKE').then(hasIt => {
    if (hasIt) {
      cy.log('This is a smoke test')
    }
  })
})
```

## Real-World Examples

### Example 1: Environment-Specific URLs

```javascript
it('should use correct environment', { tags: ['IS_QA', 'IS_PROD'] }, () => {
  const baseUrl = Cypress.Tags.isRuntime('IS_QA') 
    ? 'https://qa-api.example.com'
    : Cypress.Tags.isRuntime('IS_PROD')
    ? 'https://api.example.com'
    : 'https://dev-api.example.com'
  
  cy.request(`${baseUrl}/users`)
})
```

### Example 2: Conditional Test Steps

```javascript
it('should test checkout', { tags: ['FAST', 'FULL'] }, () => {
  cy.visit('/cart')
  cy.get('[data-cy=checkout]').click()
  
  // Skip expensive operations for FAST tests
  if (!Cypress.Tags.isRuntime('FAST')) {
    cy.get('[data-cy=order-summary]').should('be.visible')
    cy.get('[data-cy=shipping-info]').should('be.visible')
    cy.get('[data-cy=payment-info]').should('be.visible')
  }
  
  cy.get('[data-cy=place-order]').click()
})
```

### Example 3: Environment-Specific Test Data

```javascript
it('should process data', { tags: ['IS_QA', 'SMALL_DATA', 'LARGE_DATA'] }, () => {
  const recordCount = Cypress.Tags.isRuntime('LARGE_DATA') ? 10000 : 100
  
  cy.request('POST', '/api/generate-data', { count: recordCount })
  cy.visit('/data-viewer')
  cy.get('[data-cy=record-count]').should('contain', recordCount)
})
```

### Example 4: Multiple Tag Conditions

```javascript
it('should validate production', { tags: ['IS_PROD', 'CRITICAL'] }, () => {
  // Extra validations for critical production tests
  if (Cypress.Tags.isAllRuntime('IS_PROD', 'CRITICAL')) {
    cy.log('Running critical production validations')
    cy.request('/health').its('status').should('eq', 200)
    cy.request('/metrics').its('status').should('eq', 200)
  }
  
  // Run for any smoke or regression test
  if (Cypress.Tags.hasAnyTest('SMOKE', 'REGRESSION')) {
    cy.visit('/home')
    cy.get('h1').should('be.visible')
  }
})
```

### Example 5: Feature Flags

```javascript
it('should test features', { tags: ['IS_QA', 'NEW_FEATURE'] }, () => {
  const features = {
    newCheckout: Cypress.Tags.isRuntime('IS_QA'),
    betaFeatures: Cypress.Tags.hasTest('NEW_FEATURE')
  }
  
  if (features.newCheckout) {
    cy.log('Testing new checkout flow')
    cy.visit('/checkout-v2')
  } else {
    cy.visit('/checkout')
  }
})
```

## API Reference

### Synchronous API (Cypress.Tags)

| Method | Description | Returns | Example |
|--------|-------------|---------|---------|
| `getRuntime()` | Get runtime tag from CLI | `string \| null` | `Cypress.Tags.getRuntime()` |
| `getAllRuntime()` | Get all runtime tags | `string[]` | `Cypress.Tags.getAllRuntime()` |
| `isRuntime(tag)` | Check if runtime tag matches | `boolean` | `Cypress.Tags.isRuntime('IS_QA')` |
| `isAnyRuntime(...tags)` | Check if any runtime tag matches | `boolean` | `Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING')` |
| `isAllRuntime(...tags)` | Check if all runtime tags match | `boolean` | `Cypress.Tags.isAllRuntime('IS_QA', 'SMOKE')` |
| `getTest()` | Get test's configured tags | `string[]` | `Cypress.Tags.getTest()` |
| `hasTest(tag)` | Check if test has specific tag | `boolean` | `Cypress.Tags.hasTest('SMOKE')` |
| `hasAnyTest(...tags)` | Check if test has any tag | `boolean` | `Cypress.Tags.hasAnyTest('SMOKE', 'REGRESSION')` |
| `hasAllTest(...tags)` | Check if test has all tags | `boolean` | `Cypress.Tags.hasAllTest('SMOKE', 'CRITICAL')` |
| `matchesRuntime()` | Check if test has runtime tag | `boolean` | `Cypress.Tags.matchesRuntime()` |

### Async API (Cypress Commands)

| Command | Description | Returns | Example |
|---------|-------------|---------|---------|
| `cy.getRuntimeTag()` | Get runtime tag from CLI | `Chainable<string \| null>` | `cy.getRuntimeTag().then(tag => ...)` |
| `cy.getAllRuntimeTags()` | Get all runtime tags | `Chainable<string[]>` | `cy.getAllRuntimeTags().then(tags => ...)` |
| `cy.isRuntimeTag(tag)` | Check if runtime tag matches | `Chainable<boolean>` | `cy.isRuntimeTag('IS_QA').then(is => ...)` |
| `cy.getTestTags()` | Get test's configured tags | `Chainable<string[]>` | `cy.getTestTags().then(tags => ...)` |
| `cy.hasTestTag(tag)` | Check if test has specific tag | `Chainable<boolean>` | `cy.hasTestTag('SMOKE').then(has => ...)` |
| `cy.matchesRuntimeTag()` | Check if test has runtime tag | `Chainable<boolean>` | `cy.matchesRuntimeTag().then(matches => ...)` |

## TypeScript Support

Full TypeScript definitions are included. No additional setup required!

```typescript
it('should test', { tags: ['IS_QA', 'SMOKE'] }, () => {
  const runtimeTag: string | null = Cypress.Tags.getRuntime()
  const testTags: string[] = Cypress.Tags.getTest()
  const isQA: boolean = Cypress.Tags.isRuntime('IS_QA')
  
  cy.getRuntimeTag().then((tag: string | null) => {
    // TypeScript knows the type
  })
})
```

## How It Works

1. **Tag Storage**: Plugin wraps `it()` to extract tags from test config
2. **Runtime Access**: Reads `Cypress.env('grepTags')` for CLI-passed tags
3. **API Exposure**: Provides `Cypress.Tags` API and custom commands
4. **Compatibility**: Works seamlessly with `@cypress/grep`

## Compatibility

- **Cypress**: >= 10.0.0
- **Node.js**: >= 14.0.0
- **TypeScript**: Full support included
- **@cypress/grep**: Fully compatible

## Best Practices

1. **Use Descriptive Tag Names**: `IS_QA`, `IS_PROD`, `SMOKE`, `REGRESSION` are better than `Q`, `P`, `S`, `R`
2. **Prefer Synchronous API**: Use `Cypress.Tags.isRuntime()` over `cy.isRuntimeTag()` for simpler code
3. **Combine with @cypress/grep**: Use for filtering + runtime logic
4. **Document Tags**: Maintain a list of available tags in your project
5. **Environment Tags**: Use `IS_QA`, `IS_STAGING`, `IS_PROD` for environment-specific logic
6. **Test Type Tags**: Use `SMOKE`, `REGRESSION`, `CRITICAL` for test categorization


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

- 🐛 [Report Issues](https://github.com/JaydipManiya/cypress-conditional-tags/issues)
- 📖 [Documentation](https://github.com/JaydipManiya/cypress-conditional-tags#readme)
