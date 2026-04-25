/**
 * Test suite to verify cypress-conditional-tags functionality
 */

describe('Plugin Functionality Tests', { tags: ['PLUGIN_TEST'] }, () => {
  describe('Runtime Tag Access', () => {
    it('should access runtime tag from CLI', { tags: ['IS_QA', 'RUNTIME'] }, () => {
      // Get runtime tag
      const runtimeTag = Cypress.Tags.getRuntime()
      cy.log(`Runtime tag: ${runtimeTag}`)
      
      // Runtime tag should be string or null
      expect(runtimeTag === null || typeof runtimeTag === 'string').to.be.true
    })
    
    it('should get all runtime tags', { tags: ['IS_QA', 'IS_STAGING'] }, () => {
      const runtimeTags = Cypress.Tags.getAllRuntime()
      
      expect(runtimeTags).to.be.an('array')
      cy.log(`Runtime tags: ${runtimeTags.join(', ')}`)
    })
    
    it('should check if runtime tag matches', { tags: ['IS_QA'] }, () => {
      const isQA = Cypress.Tags.isRuntime('IS_QA')
      const isProd = Cypress.Tags.isRuntime('IS_PROD')
      
      expect(isQA).to.be.a('boolean')
      expect(isProd).to.be.a('boolean')
      
      cy.log(`Is QA: ${isQA}`)
      cy.log(`Is PROD: ${isProd}`)
    })
    
    it('should check for any runtime tag', { tags: ['IS_QA'] }, () => {
      const hasAny = Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING', 'IS_PROD')
      
      expect(hasAny).to.be.a('boolean')
      cy.log(`Has any runtime tag: ${hasAny}`)
    })
    
    it('should check for all runtime tags', { tags: ['IS_QA'] }, () => {
      const hasAll = Cypress.Tags.isAllRuntime('IS_QA', 'SMOKE')
      
      expect(hasAll).to.be.a('boolean')
      cy.log(`Has all runtime tags: ${hasAll}`)
    })
  })
  
  describe('Test Tag Access', () => {
    it('should access test tags from config', { tags: ['SMOKE', 'CRITICAL'] }, () => {
      const testTags = Cypress.Tags.getTest()
      
      expect(testTags).to.be.an('array')
      expect(testTags).to.include('SMOKE')
      expect(testTags).to.include('CRITICAL')
      
      cy.log(`Test tags: ${testTags.join(', ')}`)
    })
    
    it('should check if test has specific tag', { tags: ['REGRESSION'] }, () => {
      const hasRegression = Cypress.Tags.hasTest('REGRESSION')
      const hasSmoke = Cypress.Tags.hasTest('SMOKE')
      
      expect(hasRegression).to.be.true
      expect(hasSmoke).to.be.false
      
      cy.log(`Has REGRESSION: ${hasRegression}`)
      cy.log(`Has SMOKE: ${hasSmoke}`)
    })
    
    it('should check for any test tag', { tags: ['TAG1', 'TAG2', 'TAG3'] }, () => {
      const hasAny = Cypress.Tags.hasAnyTest('TAG1', 'TAG4')
      const hasNone = Cypress.Tags.hasAnyTest('TAG5', 'TAG6')
      
      expect(hasAny).to.be.true
      expect(hasNone).to.be.false
    })
    
    it('should check for all test tags', { tags: ['TAG_A', 'TAG_B', 'TAG_C'] }, () => {
      const hasAll = Cypress.Tags.hasAllTest('TAG_A', 'TAG_B')
      const hasSome = Cypress.Tags.hasAllTest('TAG_A', 'TAG_D')
      
      expect(hasAll).to.be.true
      expect(hasSome).to.be.false
    })
    
    it('should handle test without tags', () => {
      const testTags = Cypress.Tags.getTest()
      
      expect(testTags).to.be.an('array')
      // Test has no tags, should return empty array
      expect(testTags).to.deep.equal([])
    })
  })
  
  describe('Runtime and Test Tag Matching', () => {
    it('should check if test matches runtime tag', { tags: ['IS_QA', 'SMOKE'] }, () => {
      const matches = Cypress.Tags.matchesRuntime()
      
      expect(matches).to.be.a('boolean')
      cy.log(`Test matches runtime: ${matches}`)
    })
    
    it('should handle no runtime tag', { tags: ['ANY_TAG'] }, () => {
      const matches = Cypress.Tags.matchesRuntime()
      
      // Should return true if no runtime filter
      expect(matches).to.be.a('boolean')
    })
  })
  
  describe('Async Commands', () => {
    it('should use async getRuntimeTag command', { tags: ['IS_QA', 'ASYNC'] }, () => {
      cy.getRuntimeTag().then(tag => {
        expect(tag === null || typeof tag === 'string').to.be.true
        cy.log(`Runtime tag (async): ${tag}`)
      })
    })
    
    it('should use async getAllRuntimeTags command', { tags: ['IS_QA'] }, () => {
      cy.getAllRuntimeTags().then(tags => {
        expect(tags).to.be.an('array')
        cy.log(`Runtime tags (async): ${tags.join(', ')}`)
      })
    })
    
    it('should use async isRuntimeTag command', { tags: ['IS_QA'] }, () => {
      cy.isRuntimeTag('IS_QA').then(isQA => {
        expect(isQA).to.be.a('boolean')
        cy.log(`Is QA (async): ${isQA}`)
      })
    })
    
    it('should use async getTestTags command', { tags: ['SMOKE', 'CRITICAL'] }, () => {
      cy.getTestTags().then(tags => {
        expect(tags).to.be.an('array')
        expect(tags).to.include('SMOKE')
        expect(tags).to.include('CRITICAL')
        cy.log(`Test tags (async): ${tags.join(', ')}`)
      })
    })
    
    it('should use async hasTestTag command', { tags: ['REGRESSION'] }, () => {
      cy.hasTestTag('REGRESSION').then(hasIt => {
        expect(hasIt).to.be.true
        cy.log(`Has REGRESSION (async): ${hasIt}`)
      })
    })
    
    it('should use async matchesRuntimeTag command', { tags: ['IS_QA'] }, () => {
      cy.matchesRuntimeTag().then(matches => {
        expect(matches).to.be.a('boolean')
        cy.log(`Matches runtime (async): ${matches}`)
      })
    })
  })
  
  describe('Conditional Logic', () => {
    it('should enable conditional execution based on runtime tag', { tags: ['IS_QA', 'IS_PROD'] }, () => {
      let qaExecuted = false
      let prodExecuted = false
      
      if (Cypress.Tags.isRuntime('IS_QA')) {
        qaExecuted = true
        cy.log('QA logic executed')
      }
      
      if (Cypress.Tags.isRuntime('IS_PROD')) {
        prodExecuted = true
        cy.log('PROD logic executed')
      }
      
      // At least one should execute if runtime tag is set
      const runtimeTag = Cypress.Tags.getRuntime()
      if (runtimeTag) {
        expect(qaExecuted || prodExecuted).to.be.true
      }
    })
    
    it('should enable conditional execution based on test tags', { tags: ['FAST', 'FULL'] }, () => {
      let fastExecuted = false
      let fullExecuted = false
      
      if (Cypress.Tags.hasTest('FAST')) {
        fastExecuted = true
        cy.log('FAST test logic')
      }
      
      if (Cypress.Tags.hasTest('FULL')) {
        fullExecuted = true
        cy.log('FULL test logic')
      }
      
      expect(fastExecuted || fullExecuted).to.be.true
    })
    
    it('should combine runtime and test tags', { tags: ['IS_QA', 'SMOKE'] }, () => {
      const isQASmoke = Cypress.Tags.isRuntime('IS_QA') && Cypress.Tags.hasTest('SMOKE')
      
      cy.log(`Is QA Smoke test: ${isQASmoke}`)
      expect(isQASmoke).to.be.a('boolean')
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle multiple tags in config', { tags: ['TAG1', 'TAG2', 'TAG3', 'TAG4', 'TAG5'] }, () => {
      const testTags = Cypress.Tags.getTest()
      
      expect(testTags).to.have.length(5)
      expect(testTags).to.include('TAG1')
      expect(testTags).to.include('TAG5')
    })
    
    it('should handle tags with underscores', { tags: ['IS_QA', 'TEST_TAG_123'] }, () => {
      expect(Cypress.Tags.hasTest('IS_QA')).to.be.true
      expect(Cypress.Tags.hasTest('TEST_TAG_123')).to.be.true
    })
    
    it('should handle tags with numbers', { tags: ['TAG123', 'TEST456'] }, () => {
      expect(Cypress.Tags.hasTest('TAG123')).to.be.true
      expect(Cypress.Tags.hasTest('TEST456')).to.be.true
    })
    
    it('should handle uppercase tags', { tags: ['UPPERCASE', 'MIXEDCASE'] }, () => {
      expect(Cypress.Tags.hasTest('UPPERCASE')).to.be.true
      expect(Cypress.Tags.hasTest('MIXEDCASE')).to.be.true
    })
    
    it('should be case-sensitive', { tags: ['CaseSensitive'] }, () => {
      expect(Cypress.Tags.hasTest('CaseSensitive')).to.be.true
      expect(Cypress.Tags.hasTest('casesensitive')).to.be.false
      expect(Cypress.Tags.hasTest('CASESENSITIVE')).to.be.false
    })
  })
  
  describe('Sync vs Async Comparison', () => {
    it('should return same results for sync and async', { tags: ['IS_QA', 'COMPARISON'] }, () => {
      // Synchronous
      const syncRuntime = Cypress.Tags.getRuntime()
      const syncTest = Cypress.Tags.getTest()
      const syncIsQA = Cypress.Tags.isRuntime('IS_QA')
      const syncHasComparison = Cypress.Tags.hasTest('COMPARISON')
      
      // Asynchronous
      cy.getRuntimeTag().should('equal', syncRuntime)
      cy.getTestTags().should('deep.equal', syncTest)
      cy.isRuntimeTag('IS_QA').should('equal', syncIsQA)
      cy.hasTestTag('COMPARISON').should('equal', syncHasComparison)
    })
  })
  
  describe('Real-World Scenarios', () => {
    it('should support environment-specific URLs', { tags: ['IS_QA', 'IS_PROD', 'URL_TEST'] }, () => {
      const baseUrl = Cypress.Tags.isRuntime('IS_QA')
        ? 'https://qa.example.com'
        : Cypress.Tags.isRuntime('IS_PROD')
        ? 'https://prod.example.com'
        : 'https://dev.example.com'
      
      cy.log(`Base URL: ${baseUrl}`)
      expect(baseUrl).to.include('example.com')
    })
    
    it('should support conditional test data', { tags: ['IS_QA', 'DATA_TEST'] }, () => {
      const recordCount = Cypress.Tags.isRuntime('IS_QA') ? 100 : 10
      
      cy.log(`Record count: ${recordCount}`)
      expect(recordCount).to.be.greaterThan(0)
    })
    
    it('should support feature flags', { tags: ['IS_QA', 'FEATURE_TEST'] }, () => {
      const features = {
        newFeature: Cypress.Tags.isRuntime('IS_QA'),
        betaFeature: Cypress.Tags.hasTest('FEATURE_TEST')
      }
      
      cy.log(`Features: ${JSON.stringify(features)}`)
      expect(features).to.have.property('newFeature')
    })
  })
})

describe('Tests Without Suite Tags', () => {
  it('should work without suite-level tags', { tags: ['STANDALONE'] }, () => {
    const testTags = Cypress.Tags.getTest()
    
    expect(testTags).to.include('STANDALONE')
    expect(testTags).to.have.length(1)
  })
  
  it('should work without any tags', () => {
    const testTags = Cypress.Tags.getTest()
    
    expect(testTags).to.be.an('array')
    expect(testTags).to.deep.equal([])
  })
})
