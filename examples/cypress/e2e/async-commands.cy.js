/**
 * Examples using async Cypress commands for tag access
 */

describe('Async Command Examples', () => {
  it('should use async commands for runtime tag access', { tags: ['IS_QA', 'ASYNC'] }, () => {
    // Get runtime tag asynchronously
    cy.getRuntimeTag().then(tag => {
      cy.log(`Runtime tag: ${tag}`)
      
      if (tag === 'IS_QA') {
        cy.log('Running in QA mode (async)')
      }
    })
    
    // Get all runtime tags
    cy.getAllRuntimeTags().then(tags => {
      cy.log(`All runtime tags: ${tags.join(', ')}`)
      expect(tags).to.be.an('array')
    })
    
    // Check runtime tag IS_QA
    cy.isRuntimeTag('IS_QA').then(isQA => {
      if (isQA) {
        cy.log('Confirmed IS_QA tag (async)')
      }
    })

    // Check runtime tag ASYNC
    cy.isRuntimeTag('ASYNC').then(isAsync => {
      if (isAsync) {
        cy.log('Confirmed ASYNC tag (async)')
      }
    })
  })
  
  it('should use async commands for test tag access', { tags: ['SMOKE', 'CRITICAL'] }, () => {
    // Get test tags asynchronously
    cy.getTestTags().then(tags => {
      cy.log(`Test tags: ${tags.join(', ')}`)
      expect(tags).to.include('SMOKE')
      expect(tags).to.include('CRITICAL')
    })
    
    // Check test tag
    cy.hasTestTag('SMOKE').then(hasSmoke => {
      if (hasSmoke) {
        cy.log('This is a smoke test (async)')
      }
    })
  })
  
  it('should chain async commands', { tags: ['IS_QA', 'SMOKE'] }, () => {
    // Chain multiple async operations
    cy.getRuntimeTag()
      .then(runtimeTag => {
        cy.log(`Runtime: ${runtimeTag}`)
        return cy.getTestTags()
      })
      .then(testTags => {
        cy.log(`Test tags: ${testTags.join(', ')}`)
        return cy.matchesRuntimeTag()
      })
      .then(matches => {
        if (matches) {
          cy.log('Test matches runtime tag!')
        }
      })
  })
  
  it('should use async commands in assertions', { tags: ['IS_QA', 'VALIDATION'] }, () => {
    // Use async commands with Cypress assertions
    // Note: getRuntimeTag() can return null if no runtime tag is specified
    cy.getRuntimeTag().then(tag => {
      cy.log(`Runtime tag: ${tag || 'none'}`)
    })
    
    cy.getTestTags()
      .should('be.an', 'array')
      .and('have.length.greaterThan', 0)
    
    cy.isRuntimeTag('IS_QA').should('be.a', 'boolean')
    
    cy.hasTestTag('VALIDATION').should('equal', true)
  })
})

describe('Async vs Sync Comparison', () => {
  it('should demonstrate both approaches', { tags: ['IS_QA', 'COMPARISON'] }, () => {
    // Synchronous approach (immediate)
    const syncRuntimeTag = Cypress.Tags.getRuntime()
    const syncTestTags = Cypress.Tags.getTest()
    const syncIsQA = Cypress.Tags.isRuntime('IS_QA')
    
    cy.log('Synchronous Results:')
    cy.log(`  Runtime: ${syncRuntimeTag}`)
    cy.log(`  Test tags: ${syncTestTags.join(', ')}`)
    cy.log(`  Is QA: ${syncIsQA}`)
    
    // Asynchronous approach (chainable)
    cy.log('Asynchronous Results:')
    
    cy.getRuntimeTag().then(asyncRuntimeTag => {
      cy.log(`  Runtime: ${asyncRuntimeTag}`)
      expect(asyncRuntimeTag).to.equal(syncRuntimeTag)
    })
    
    cy.getTestTags().then(asyncTestTags => {
      cy.log(`  Test tags: ${asyncTestTags.join(', ')}`)
      expect(asyncTestTags).to.deep.equal(syncTestTags)
    })
    
    cy.isRuntimeTag('IS_QA').then(asyncIsQA => {
      cy.log(`  Is QA: ${asyncIsQA}`)
      expect(asyncIsQA).to.equal(syncIsQA)
    })
  })
})

describe('Async Command Error Handling', () => {
  it('should handle missing runtime tag gracefully', { tags: ['ERROR_HANDLING'] }, () => {
    cy.getRuntimeTag().then(tag => {
      if (tag === null) {
        cy.log('No runtime tag specified')
      } else {
        cy.log(`Runtime tag: ${tag}`)
      }
    })
  })
  
  it('should handle empty test tags', () => {
    cy.getTestTags().then(tags => {
      if (tags.length === 0) {
        cy.log('No test tags defined')
      } else {
        cy.log(`Test tags: ${tags.join(', ')}`)
      }
      expect(tags).to.be.an('array')
    })
  })
})

describe('Async Commands in Hooks', () => {
  before(() => {
    // Get runtime tag once before all tests
    cy.getRuntimeTag().then(tag => {
      cy.log(`Runtime tag for suite: ${tag || 'none'}`)
    })
  })
  
  beforeEach(function() {
    // Get test tags before each test
    cy.getTestTags().then(tags => {
      cy.log(`Test tags: ${tags.join(', ')}`)
    })
  })
  
  it('should access tags from hooks', { tags: ['HOOK_TEST_1'] }, () => {
    // Access tags directly in test body instead of from hook variables
    cy.getRuntimeTag().then(runtimeTag => {
      cy.log(`Runtime tag: ${runtimeTag || 'none'}`)
    })
    
    cy.getTestTags().then(testTags => {
      cy.log(`Test tags: ${testTags.join(', ')}`)
      expect(testTags).to.include('HOOK_TEST_1')
    })
  })
  
  it('should access different tags per test', { tags: ['HOOK_TEST_2'] }, () => {
    // Access tags directly in test body instead of from hook variables
    cy.getRuntimeTag().then(runtimeTag => {
      cy.log(`Runtime tag: ${runtimeTag || 'none'}`)
    })
    
    cy.getTestTags().then(testTags => {
      cy.log(`Test tags: ${testTags.join(', ')}`)
      expect(testTags).to.include('HOOK_TEST_2')
    })
  })
})

describe('Async Commands with Custom Commands', () => {
  it('should work with custom commands', { tags: ['IS_QA', 'CUSTOM'] }, () => {
    // Example: Create a custom command that uses tag info
    Cypress.Commands.add('loginBasedOnTag', () => {
      cy.getRuntimeTag().then(tag => {
        if (tag === 'IS_QA') {
          cy.log('Logging in with QA credentials')
          cy.wrap({ username: 'qa_user', password: 'qa_pass' })
        } else {
          cy.log('Logging in with default credentials')
          cy.wrap({ username: 'user', password: 'pass' })
        }
      })
    })
    
    // Use the custom command
    cy.loginBasedOnTag().then(credentials => {
      cy.log(`Username: ${credentials.username}`)
      expect(credentials).to.have.property('username')
    })
  })
})

describe('Async Commands with Aliases', () => {
  it('should use aliases with async commands', { tags: ['IS_QA', 'ALIAS'] }, () => {
    // Store runtime tag as alias
    cy.getRuntimeTag().as('runtimeTag')
    
    // Store test tags as alias
    cy.getTestTags().as('testTags')
    
    // Use aliases later
    cy.get('@runtimeTag').then(tag => {
      cy.log(`Runtime tag from alias: ${tag}`)
    })
    
    cy.get('@testTags').then(tags => {
      cy.log(`Test tags from alias: ${tags.join(', ')}`)
    })
  })
})

describe('Async Commands with Retries', () => {
  it('should work with Cypress retries', { tags: ['IS_QA', 'RETRY'], retries: 2 }, () => {
    // Async commands work with Cypress retry logic
    cy.getRuntimeTag().should('not.be.undefined')
    
    cy.getTestTags()
      .should('be.an', 'array')
      .and('include', 'RETRY')
    
    cy.isRuntimeTag('IS_QA').should('be.a', 'boolean')
  })
})
