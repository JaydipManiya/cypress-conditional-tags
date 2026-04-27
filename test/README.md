# Tests

This directory contains all tests for the `cypress-conditional-tags` plugin.

## Directory Structure

```
test/
├── unit/                           # Unit tests (Mocha/Chai)
│   ├── plugin.test.js             # All unit tests
├── e2e/                            # E2E tests (Cypress)
│   ├── cypress.config.js          # Cypress configuration
│   ├── plugin-functionality.cy.js # E2E test suite
│   ├── support/
│   │   └── e2e.js                 # Support file
└── README.md                      # This file
```

## Test Types

### 🧪 Unit Tests (`test/unit/`)

**Purpose:** Test plugin functions in isolation using Node.js environment

**Technology:** Mocha + Chai

**What they test:**
- ✅ Setup functions (`setupNodeEvents`, `setupSupport`)
- ✅ Runtime tag functions (CLI tag access)
- ✅ Test tag functions (config tag access)
- ✅ Module exports
- ✅ Edge cases and performance

**Run:**
```bash
npm run test:unit
```

---

### 🌐 E2E Tests (`test/e2e/`)

**Purpose:** Test plugin integration in real Cypress environment

**Technology:** Cypress

**What they test:**
- ✅ Plugin integration with Cypress
- ✅ Runtime tag access in browser
- ✅ Test tag access in browser
- ✅ Synchronous API (`Cypress.Tags.*`)
- ✅ Asynchronous API (`cy.tags.*`)
- ✅ Real-world test scenarios

**Run:**
```bash
npm run test:e2e # Headless (uses test/e2e/cypress.config.js) 
npm run test:e2e:open # Interactive (uses test/e2e/cypress.config.js)
```

**Note:** These commands are defined in the root `package.json` and automatically use the correct config file:
```json
"test:e2e": "cypress run --config-file test/e2e/cypress.config.js",
"test:e2e:open": "cypress open --config-file test/e2e/cypress.config.js"
```


---

## Running All Tests

### Run Everything

```bash
npm test
```

This runs both unit and E2E tests sequentially.

### Run Specific Test Type

```bash
npm run test:unit # Unit tests only (uses Mocha) 
npm run test:e2e # E2E tests only (uses test/e2e/cypress.config.js)
```

**Note:** These are npm scripts defined in the root `package.json`:
```json
"test:unit": "mocha test/unit/**/*.test.js",
"test:e2e": "cypress run --config-file test/e2e/cypress.config.js"
```


## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run all tests:**
   ```bash
   npm test
   ```

3. **Run specific tests:**
   ```bash
   npm run test:unit        # Fast unit tests
   npm run test:e2e:open    # Interactive E2E tests
   ```

## Adding New Tests

### For New Features

1. **Add unit tests** in `test/unit/plugin.test.js`
2. **Add E2E tests** in `test/e2e/cypress/e2e/plugin-functionality.cy.js`
3. **Run tests** to verify
4. **Update documentation** if needed

### For Bug Fixes

1. **Add failing test** that reproduces the bug
2. **Fix the bug** in source code
3. **Verify test passes**
4. **Commit both** test and fix

## Debugging

### Unit Tests

```bash
# Run specific test by pattern (uses locally installed mocha)
npx mocha test/unit/plugin.test.js --grep "should return first tag"

# Or use npm script with grep
npm run test:unit -- --grep "should return first tag"

# Debug with Node inspector
npx --node-options="--inspect-brk" mocha test/unit/plugin.test.js

# Or use node directly
node --inspect-brk ./node_modules/.bin/mocha test/unit/plugin.test.js
```

### E2E Tests

```bash
# Run specific spec
npx cypress run --config-file test/e2e/cypress.config.js --spec "cypress/e2e/plugin-functionality.cy.js"

# Open interactive mode
npm run test:e2e:open

# Enable debug logs
DEBUG=cypress:* npm run test:e2e
```

## Related Documentation

- [Main README](../README.md) - Plugin documentation
- [TESTING.md](../TESTING.md) - Complete testing guide
- [Examples](../examples/) - Usage examples


## Need Help?

- 📖 Check the [main README](../README.md)
- 🐛 [Report issues](https://github.com/JaydipManiya/cypress-conditional-tags/issues)

---
