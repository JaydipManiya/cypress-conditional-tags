/**
 * Basic usage examples of cypress-conditional-tags
 */

describe('Basic Runtime Tag Usage', () => {
  it('should access runtime tag from CLI', { tags: ['IS_QA', 'IS_GA'] }, () => {
    // Get the runtime tag passed via CLI
    const runtimeTag = Cypress.Tags.getRuntime()
    cy.log(`Runtime tag: ${runtimeTag}`)
    
    // Check if running with specific tag
    if (Cypress.Tags.isRuntime('IS_QA')) {
      cy.log('Running in QA mode')
    } else if (Cypress.Tags.isRuntime('IS_GA')) {
      cy.log('Running in GA mode')
    } else {
      cy.log('No runtime tag specified')
    }
  })
  
  it('should access test tags from config', { tags: ['SMOKE', 'CRITICAL'] }, () => {
    // Get tags defined in test config
    const testTags = Cypress.Tags.getTest()
    cy.log(`Test tags: ${testTags.join(', ')}`)
    
    // Verify test has expected tags
    expect(testTags).to.include('SMOKE')
    expect(testTags).to.include('CRITICAL')
  })
  
  it('should check if test matches runtime', { tags: ['IS_QA', 'SMOKE'] }, () => {
    // Check if this test should run based on runtime tag
    if (Cypress.Tags.matchesRuntime()) {
      cy.log('Test matches runtime tag - executing')
    } else {
      cy.log('Test does not match runtime tag')
    }
  })
})

describe('Environment-Specific Logic', () => {
  it('should use different URLs based on runtime tag', { tags: ['IS_QA', 'IS_PROD'] }, () => {
    // Conditional URL based on runtime tag
    let baseUrl
    
    if (Cypress.Tags.isRuntime('IS_QA')) {
      baseUrl = 'https://qa.example.com'
      cy.log('Using QA environment')
    } else if (Cypress.Tags.isRuntime('IS_PROD')) {
      baseUrl = 'https://prod.example.com'
      cy.log('Using Production environment')
    } else {
      baseUrl = 'https://dev.example.com'
      cy.log('Using Development environment')
    }
    
    cy.log(`Base URL: ${baseUrl}`)
    cy.wrap(baseUrl).should('include', 'example.com')
  })
  
  it('should use different credentials based on runtime tag', { tags: ['IS_QA', 'IS_STAGING'] }, () => {
    let username, password
    
    if (Cypress.Tags.isRuntime('IS_QA')) {
      username = 'qa_user'
      password = 'qa_password'
    } else if (Cypress.Tags.isRuntime('IS_STAGING')) {
      username = 'staging_user'
      password = 'staging_password'
    } else {
      username = 'dev_user'
      password = 'dev_password'
    }
    
    cy.log(`Using credentials for: ${username}`)
    cy.wrap({ username, password }).should('have.property', 'username')
  })
})

describe('Conditional Test Steps', () => {
  it('should skip expensive operations for FAST tag', { tags: ['FAST', 'FULL'] }, () => {
    cy.log('Starting test...')
    
    // Always run basic checks
    cy.log('Running basic validation')
    
    // Skip expensive operations for FAST tests
    if (!Cypress.Tags.isRuntime('FAST')) {
      cy.log('Running expensive operations (not FAST mode)')
      cy.log('  - Loading analytics data')
      cy.log('  - Generating reports')
      cy.log('  - Running performance tests')
    } else {
      cy.log('⚡ Skipping expensive operations (FAST mode)')
    }
    
    cy.log('Test complete')
  })
  
  it('should run detailed validation for DETAILED tag', { tags: ['SMOKE', 'DETAILED'] }, () => {
    cy.log('Running smoke test...')
    
    // Basic smoke test
    cy.log('Basic smoke checks passed')
    
    // Detailed validation only for DETAILED tag
    if (Cypress.Tags.isRuntime('DETAILED')) {
      cy.log('Running detailed validation')
      cy.log('  - Checking all UI elements')
      cy.log('  - Validating data integrity')
      cy.log('  - Testing edge cases')
    }
  })
})

describe('Multiple Tag Checks', () => {
  it('should check for any of multiple tags', { tags: ['IS_QA', 'IS_STAGING', 'IS_PROD'] }, () => {
    // Check if running in any non-production environment
    if (Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING')) {
      cy.log('Running in non-production environment')
      cy.log('  - Debug logging enabled')
      cy.log('  - Extended timeouts')
    }
    
    // Check if running in production
    if (Cypress.Tags.isRuntime('IS_PROD')) {
      cy.log('Running in PRODUCTION')
      cy.log('  - Extra validations enabled')
    }
  })
  
  it('should check for all required tags', { tags: ['SMOKE', 'CRITICAL', 'IS_QA'] }, () => {
    // Check if test has all required tags
    if (Cypress.Tags.hasAllTest('SMOKE', 'CRITICAL')) {
      cy.log('This is a critical smoke test')
    }
    
    // Check if running with multiple runtime tags
    if (Cypress.Tags.isAllRuntime('IS_QA', 'SMOKE')) {
      cy.log('Running QA smoke tests')
    }
  })
})

describe('Async Command Usage', () => {
  it('should use async commands for tag access', { tags: ['IS_QA', 'SMOKE'] }, () => {
    // Async access to runtime tag
    cy.getRuntimeTag().then(tag => {
      cy.log(`Runtime tag (async): ${tag}`)
    })
    
    // Async access to test tags
    cy.getTestTags().then(tags => {
      cy.log(`Test tags (async): ${tags.join(', ')}`)
      expect(tags).to.be.an('array')
    })
    
    // Async check for runtime tag
    cy.isRuntimeTag('IS_QA').then(isQA => {
      if (isQA) {
        cy.log('Confirmed: Running in QA mode (async)')
      }
    })
    
    // Async check for test tag
    cy.hasTestTag('SMOKE').then(hasSmoke => {
      if (hasSmoke) {
        cy.log('Confirmed: This is a smoke test (async)')
      }
    })
  })
})

// Example: Test without tags
describe('Tests Without Tags', () => {
  it('should handle tests without tags gracefully', () => {
    const testTags = Cypress.Tags.getTest()
    const runtimeTag = Cypress.Tags.getRuntime()
    
    cy.log(`Test tags: ${testTags.length === 0 ? 'none' : testTags.join(', ')}`)
    cy.log(`Runtime tag: ${runtimeTag || 'none'}`)
    
    expect(testTags).to.be.an('array')
  })
})
