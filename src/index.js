/**
 * Cypress Conditional Tags Plugin
 * Access runtime tags (from CLI) and test tags (from config) inside test logic
 */

const testTagStore = new Map();

/**
 * Get the runtime tag passed via CLI
 * Supports both 'conditionalTags' (preferred) and 'grepTags' (fallback for backward compatibility)
 * @returns{string|null} - The runtime tag or null
 */
function getRuntimeTag() {
  // Prefer conditionalTags, fallback to grepTags for backward compatibility
  const conditionalTags = Cypress.env('conditionalTags');
  const grepTags = Cypress.env('grepTags');
  const tags = conditionalTags || grepTags;

  if (!tags) return null;

  // Handle multiple tags separated by + or ,
  if (typeof tags === 'string') {
    // Return first tag if multiple
    return tags.split(/[+,]/)[0].trim();
  }

  return tags;
}

/**
 * Get all runtime tags passed via CLI
 * Supports both 'conditionalTags' (preferred) and 'grepTags' (fallback for backward compatibility)
 * @returns{string[]} - Array of runtime tags
 */
function getAllRuntimeTags() {
  // Prefer conditionalTags, fallback to grepTags for backward compatibility
  const conditionalTags = Cypress.env('conditionalTags');
  const grepTags = Cypress.env('grepTags');
  const tags = conditionalTags || grepTags;

  if (!tags) return [];

  if (typeoftags === 'string') {
    return tags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  return [tags];
}

/**
 * Check if runtime tag matches the given tag
 * @param{string}tag - Tag to check
 * @returns{boolean}
 */
function isRuntimeTag(tag) {
  const runtimeTags = getAllRuntimeTags();
  return runtimeTags.includes(tag);
}

/**
 * Check if runtime has any of the given tags
 * @param{...string}tags - Tags to check
 * @returns{boolean}
 */
function isAnyRuntimeTag(...tags) {
  const runtimeTags = getAllRuntimeTags();
  return tags.some(tag => runtimeTags.includes(tag));
}

/**
 * Check if runtime has all of the given tags
 * @param{...string}tags - Tags to check
 * @returns{boolean}
 */
function isAllRuntimeTags(...tags) {
  const runtimeTags = getAllRuntimeTags();
  return tags.every(tag => runtimeTags.includes(tag));
}

/**
 * Get tags for current test from config
 * @returns{string[]} - Array of test tags
 */
function getTestTags() {
  const currentTest = cy.state('test');
  if (!currentTest) return [];

  const testId = currentTest.id || currentTest.title;
  return testTagStore.get(testId) || [];
}

/**
 * Check if current test has a specific tag
 * @param{string}tag - Tag to check
 * @returns{boolean}
 */
function hasTestTag(tag) {
  const tags = getTestTags();
  return tags.includes(tag);
}

/**
 * Check if current test has any of the given tags
 * @param{...string}tags - Tags to check
 * @returns{boolean}
 */
function hasAnyTestTag(...tags) {
  const testTags = getTestTags();
  return tags.some(tag => testTags.includes(tag));
}

/**
 * Check if current test has all of the given tags
 * @param{...string}tags - Tags to check
 * @returns{boolean}
 */
function hasAllTestTags(...tags) {
  const testTags = getTestTags();
  return tags.every(tag => testTags.includes(tag));
}

/**
 * Check if current test matches the runtime tag
 * @returns{boolean}
 */
function matchesRuntimeTag() {
  const runtimeTags = getAllRuntimeTags();
  const testTags = getTestTags();

  if (runtimeTags.length === 0) return true; // No runtime filter

  return runtimeTags.some(runtimeTag => testTags.includes(runtimeTag));
}

/**
 * Store tags for a test
 * @param{string}testId - Test identifier
 * @param{string[]}tags - Array of tags
 */
function storeTestTags(testId, tags) {
  if (tags && tags.length > 0) {
    testTagStore.set(testId, tags);
  }
}

/**
 * Wrap it() to capture tags from config
 */
function wrapIt(originalIt) {
  return function(title, configOrFn, fn) {
    let config = {};
    let testFn = fn;

    // Handle different signatures
    if (typeof configOrFn === 'function') {
      testFn = configOrFn;
    } else if (typeof configOrFn === 'object') {
      config = configOrFn;
      testFn = fn;
    }

    // Extract tags from config
    const tags = config.tags || [];

    return originalIt(title, config, function() {
      // Store tags for this test
      const currentTest = cy.state('test');
      if (currentTest && tags.length > 0) {
        const testId = currentTest.id || currentTest.title;
        storeTestTags(testId, tags);
      }

      // Execute the test
      if (testFn) {
        return testFn.call(this);
      }
    });
  };
}

/**
 * Wrap describe() to support tag inheritance (future enhancement)
 */
function wrapDescribe(originalDescribe) {
  return function(title, configOrFn, fn) {
    let config = {};
    let suiteFn = fn;

    // Handle different signatures
    if (typeof configOrFn === 'function') {
      suiteFn = configOrFn;
    } else if (typeof configOrFn === 'object') {
      config = configOrFn;
      suiteFn = fn;
    }

  // Note: Describe-level tags would need special handling
  // For now, we focus on test-level tags

  return originalDescribe(title, config, suiteFn);
  };
}

/**
 * Plugin setup function for cypress.config.js
 */
function setupNodeEvents(on, config) {
  // This plugin does not provide test filtering
  // For test filtering based on tags, install and configure @cypress/grep separately
  // See: https://github.com/cypress-io/cypress/tree/develop/npm/grep

  return config;
}

/**
 * Support file setup function for cypress/support/e2e.js
 */
function setupSupport() {
  // Wrap global it/test functions
  if (typeof it !== 'undefined') {
    const originalIt = it;
    global.it = wrapIt(originalIt);
    global.test = wrapIt(originalIt);

    // Preserve it.only, it.skip, etc.
    ['only', 'skip'].forEach(modifier => {
      if (originalIt[modifier]) {
        global.it[modifier] = wrapIt(originalIt[modifier]);
        global.test[modifier] = wrapIt(originalIt[modifier]);
      }
    });
  }

  // Wrap global describe/context functions (for future tag inheritance)
  if (typeof describe !== 'undefined') {
    const originalDescribe = describe;
    global.describe = wrapDescribe(originalDescribe);
    global.context = wrapDescribe(originalDescribe);

    // Preserve describe.only, describe.skip, etc.
    ['only', 'skip'].forEach(modifier => {
      if (originalDescribe[modifier]) {
        global.describe[modifier] = wrapDescribe(originalDescribe[modifier]);
        global.context[modifier] = wrapDescribe(originalDescribe[modifier]);
      }
    });
  }

  // Add custom Cypress commands for async access
  Cypress.Commands.add('getRuntimeTag', () => {
    return cy.wrap(getRuntimeTag());
  });

  Cypress.Commands.add('getAllRuntimeTags', () => {
    return cy.wrap(getAllRuntimeTags());
  });

  Cypress.Commands.add('isRuntimeTag', (tag) => {
    return cy.wrap(isRuntimeTag(tag));
  });

  Cypress.Commands.add('getTestTags', () => {
    return cy.wrap(getTestTags());
  });

  Cypress.Commands.add('hasTestTag', (tag) => {
    return cy.wrap(hasTestTag(tag));
  });

  Cypress.Commands.add('matchesRuntimeTag', () => {
    return cy.wrap(matchesRuntimeTag());
  });

  // Add global Tags API for synchronous access
  Cypress.Tags = {
    // Runtime tags (from CLI)
    getRuntime:getRuntimeTag,
    getAllRuntime:getAllRuntimeTags,
    isRuntime:isRuntimeTag,
    isAnyRuntime:isAnyRuntimeTag,
    isAllRuntime:isAllRuntimeTags,

    // Test tags (from config)
    getTest:getTestTags,
    hasTest:hasTestTag,
    hasAnyTest:hasAnyTestTag,
    hasAllTest:hasAllTestTags,

    // Combined
    matchesRuntime:matchesRuntimeTag
  };
}

module.exports = {
  setupNodeEvents,
  setupSupport,
  getRuntimeTag,
  getAllRuntimeTags,
  isRuntimeTag,
  isAnyRuntimeTag,
  isAllRuntimeTags,
  getTestTags,
  hasTestTag,
  hasAnyTestTag,
  hasAllTestTags,
  matchesRuntimeTag
};
