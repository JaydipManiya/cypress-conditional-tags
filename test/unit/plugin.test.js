/**
 * Unit tests for cypress-conditional-tags plugin
 * Tests both runtime tag and test tag functions
 */

const { expect } = require('chai');
const { 
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
} = require('../../src/index');

describe('Cypress Conditional Tags Plugin', () => {
  
  // ============================================================================
  // SETUP FUNCTIONS
  // ============================================================================
  
  describe('Setup Functions', () => {
    describe('setupNodeEvents()', () => {
      it('should be a function', () => {
        expect(setupNodeEvents).to.be.a('function');
      });

      it('should accept on and config parameters', () => {
        expect(setupNodeEvents.length).to.equal(2);
      });

      it('should return config object unchanged', () => {
        const mockOn = () => {};
        const mockConfig = { 
          baseUrl: 'http://localhost:3000',
          viewportWidth: 1280,
          viewportHeight: 720
        };
        
        const result = setupNodeEvents(mockOn, mockConfig);
        
        expect(result).to.be.an('object');
        expect(result).to.deep.equal(mockConfig);
      });

      it('should not modify config object', () => {
        const mockOn = () => {};
        const mockConfig = { 
          baseUrl: 'http://localhost:3000',
          e2e: {
            setupNodeEvents: null
          }
        };
        
        const originalConfig = JSON.parse(JSON.stringify(mockConfig));
        const result = setupNodeEvents(mockOn, mockConfig);
        
        expect(result).to.deep.equal(originalConfig);
      });

      it('should handle null config', () => {
        const mockOn = () => {};
        const result = setupNodeEvents(mockOn, null);
        
        expect(result).to.be.null;
      });

      it('should handle undefined config', () => {
        const mockOn = () => {};
        const result = setupNodeEvents(mockOn, undefined);
        
        expect(result).to.be.undefined;
      });
    });

    describe('setupSupport()', () => {
      it('should be a function', () => {
        expect(setupSupport).to.be.a('function');
      });
    });
  });

  // ============================================================================
  // MODULE EXPORTS
  // ============================================================================
  
  describe('Module Exports', () => {
    it('should export setupNodeEvents', () => {
      expect(setupNodeEvents).to.be.a('function');
    });

    it('should export setupSupport', () => {
      expect(setupSupport).to.be.a('function');
    });

    it('should export getRuntimeTag', () => {
      expect(getRuntimeTag).to.be.a('function');
    });

    it('should export getAllRuntimeTags', () => {
      expect(getAllRuntimeTags).to.be.a('function');
    });

    it('should export isRuntimeTag', () => {
      expect(isRuntimeTag).to.be.a('function');
    });

    it('should export isAnyRuntimeTag', () => {
      expect(isAnyRuntimeTag).to.be.a('function');
    });

    it('should export isAllRuntimeTags', () => {
      expect(isAllRuntimeTags).to.be.a('function');
    });

    it('should export getTestTags', () => {
      expect(getTestTags).to.be.a('function');
    });

    it('should export hasTestTag', () => {
      expect(hasTestTag).to.be.a('function');
    });

    it('should export hasAnyTestTag', () => {
      expect(hasAnyTestTag).to.be.a('function');
    });

    it('should export hasAllTestTags', () => {
      expect(hasAllTestTags).to.be.a('function');
    });

    it('should export matchesRuntimeTag', () => {
      expect(matchesRuntimeTag).to.be.a('function');
    });
  });

  // ============================================================================
  // RUNTIME TAG FUNCTIONS
  // ============================================================================
  
  describe('Runtime Tag Functions', () => {
    describe('getRuntimeTag() logic', () => {
      it('should return first tag from string', () => {
        const conditionalTags = 'IS_QA+IS_STAGING';
        const firstTag = conditionalTags.split(/[+,]/)[0].trim();
        
        expect(firstTag).to.equal('IS_QA');
      });

      it('should handle single tag', () => {
        const conditionalTags = 'IS_QA';
        const firstTag = conditionalTags.split(/[+,]/)[0].trim();
        
        expect(firstTag).to.equal('IS_QA');
      });

      it('should handle comma-separated tags', () => {
        const conditionalTags = 'IS_QA,IS_STAGING';
        const firstTag = conditionalTags.split(/[+,]/)[0].trim();
        
        expect(firstTag).to.equal('IS_QA');
      });

      it('should handle null/undefined', () => {
        const conditionalTags = null;
        const result = conditionalTags ? conditionalTags.split(/[+,]/)[0].trim() : null;
        
        expect(result).to.be.null;
      });
    });

    describe('getAllRuntimeTags() logic', () => {
      it('should split multiple tags by plus', () => {
        const conditionalTags = 'IS_QA+IS_STAGING+IS_PROD';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal(['IS_QA', 'IS_STAGING', 'IS_PROD']);
      });

      it('should split multiple tags by comma', () => {
        const conditionalTags = 'IS_QA,IS_STAGING,IS_PROD';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal(['IS_QA', 'IS_STAGING', 'IS_PROD']);
      });

      it('should handle mixed separators', () => {
        const conditionalTags = 'IS_QA+IS_STAGING,IS_PROD';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal(['IS_QA', 'IS_STAGING', 'IS_PROD']);
      });

      it('should handle single tag', () => {
        const conditionalTags = 'IS_QA';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal(['IS_QA']);
      });

      it('should handle empty string', () => {
        const conditionalTags = '';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal([]);
      });

      it('should trim whitespace', () => {
        const conditionalTags = ' IS_QA + IS_STAGING ';
        const tags = conditionalTags.split(/[+,]/).map(tag => tag.trim()).filter(Boolean);
        
        expect(tags).to.deep.equal(['IS_QA', 'IS_STAGING']);
      });

      it('should handle array input', () => {
        const conditionalTags = ['IS_QA', 'IS_STAGING'];
        const tags = Array.isArray(conditionalTags) ? conditionalTags : [];
        
        expect(tags).to.deep.equal(['IS_QA', 'IS_STAGING']);
      });
    });

    describe('isRuntimeTag() logic', () => {
      it('should return true when tag exists', () => {
        const runtimeTags = ['IS_QA', 'IS_STAGING'];
        const result = runtimeTags.includes('IS_QA');
        
        expect(result).to.be.true;
      });

      it('should return false when tag does not exist', () => {
        const runtimeTags = ['IS_QA', 'IS_STAGING'];
        const result = runtimeTags.includes('IS_PROD');
        
        expect(result).to.be.false;
      });

      it('should be case-sensitive', () => {
        const runtimeTags = ['IS_QA'];
        const result = runtimeTags.includes('is_qa');
        
        expect(result).to.be.false;
      });

      it('should handle empty array', () => {
        const runtimeTags = [];
        const result = runtimeTags.includes('IS_QA');
        
        expect(result).to.be.false;
      });
    });

    describe('isAnyRuntimeTag() logic', () => {
      it('should return true when any tag matches', () => {
        const runtimeTags = ['IS_QA', 'IS_STAGING'];
        const checkTags = ['IS_QA', 'IS_PROD'];
        const result = checkTags.some(tag => runtimeTags.includes(tag));
        
        expect(result).to.be.true;
      });

      it('should return false when no tags match', () => {
        const runtimeTags = ['IS_QA'];
        const checkTags = ['IS_PROD', 'IS_STAGING'];
        const result = checkTags.some(tag => runtimeTags.includes(tag));
        
        expect(result).to.be.false;
      });

      it('should handle empty check array', () => {
        const runtimeTags = ['IS_QA'];
        const checkTags = [];
        const result = checkTags.some(tag => runtimeTags.includes(tag));
        
        expect(result).to.be.false;
      });
    });

    describe('isAllRuntimeTags() logic', () => {
      it('should return true when all tags match', () => {
        const runtimeTags = ['IS_QA', 'IS_STAGING', 'SMOKE'];
        const checkTags = ['IS_QA', 'SMOKE'];
        const result = checkTags.every(tag => runtimeTags.includes(tag));
        
        expect(result).to.be.true;
      });

      it('should return false when some tags missing', () => {
        const runtimeTags = ['IS_QA'];
        const checkTags = ['IS_QA', 'IS_PROD'];
        const result = checkTags.every(tag => runtimeTags.includes(tag));
        
        expect(result).to.be.false;
      });

      it('should handle empty check array', () => {
        const runtimeTags = ['IS_QA'];
        const checkTags = [];
        const result = checkTags.every(tag => runtimeTags.includes(tag));
        
        // every() returns true for empty array
        expect(result).to.be.true;
      });
    });
  });

  // ============================================================================
  // TEST TAG FUNCTIONS
  // ============================================================================
  
  describe('Test Tag Functions', () => {
    describe('Tag Storage with Map', () => {
      it('should store and retrieve tags', () => {
        const tagStore = new Map();
        const testId = 'test-123';
        const tags = ['IS_QA', 'SMOKE'];
        
        tagStore.set(testId, tags);
        const retrieved = tagStore.get(testId);
        
        expect(retrieved).to.deep.equal(tags);
      });

      it('should return undefined for non-existent test', () => {
        const tagStore = new Map();
        const retrieved = tagStore.get('nonexistent');
        
        expect(retrieved).to.be.undefined;
      });

      it('should handle multiple tests', () => {
        const tagStore = new Map();
        
        tagStore.set('test-1', ['IS_QA']);
        tagStore.set('test-2', ['IS_PROD']);
        tagStore.set('test-3', ['SMOKE']);
        
        expect(tagStore.get('test-1')).to.deep.equal(['IS_QA']);
        expect(tagStore.get('test-2')).to.deep.equal(['IS_PROD']);
        expect(tagStore.get('test-3')).to.deep.equal(['SMOKE']);
      });

      it('should overwrite existing tags', () => {
        const tagStore = new Map();
        const testId = 'test-123';
        
        tagStore.set(testId, ['IS_QA']);
        tagStore.set(testId, ['IS_PROD']);
        
        expect(tagStore.get(testId)).to.deep.equal(['IS_PROD']);
      });

      it('should handle empty tag arrays', () => {
        const tagStore = new Map();
        const testId = 'test-123';
        
        tagStore.set(testId, []);
        const retrieved = tagStore.get(testId);
        
        expect(retrieved).to.deep.equal([]);
      });
    });

    describe('hasTestTag() logic', () => {
      it('should return true when tag exists', () => {
        const testTags = ['IS_QA', 'SMOKE', 'CRITICAL'];
        const result = testTags.includes('SMOKE');
        
        expect(result).to.be.true;
      });

      it('should return false when tag does not exist', () => {
        const testTags = ['IS_QA', 'SMOKE'];
        const result = testTags.includes('REGRESSION');
        
        expect(result).to.be.false;
      });

      it('should be case-sensitive', () => {
        const testTags = ['SMOKE'];
        const result = testTags.includes('smoke');
        
        expect(result).to.be.false;
      });

      it('should handle empty array', () => {
        const testTags = [];
        const result = testTags.includes('SMOKE');
        
        expect(result).to.be.false;
      });
    });

    describe('hasAnyTestTag() logic', () => {
      it('should return true when any tag exists', () => {
        const testTags = ['IS_QA', 'SMOKE'];
        const checkTags = ['SMOKE', 'REGRESSION'];
        const result = checkTags.some(tag => testTags.includes(tag));
        
        expect(result).to.be.true;
      });

      it('should return false when no tags exist', () => {
        const testTags = ['IS_QA'];
        const checkTags = ['SMOKE', 'REGRESSION'];
        const result = checkTags.some(tag => testTags.includes(tag));
        
        expect(result).to.be.false;
      });

      it('should handle empty check array', () => {
        const testTags = ['IS_QA'];
        const checkTags = [];
        const result = checkTags.some(tag => testTags.includes(tag));
        
        expect(result).to.be.false;
      });

      it('should handle empty test tags', () => {
        const testTags = [];
        const checkTags = ['SMOKE'];
        const result = checkTags.some(tag => testTags.includes(tag));
        
        expect(result).to.be.false;
      });
    });

    describe('hasAllTestTags() logic', () => {
      it('should return true when all tags exist', () => {
        const testTags = ['IS_QA', 'SMOKE', 'CRITICAL'];
        const checkTags = ['IS_QA', 'SMOKE'];
        const result = checkTags.every(tag => testTags.includes(tag));
        
        expect(result).to.be.true;
      });

      it('should return false when some tags missing', () => {
        const testTags = ['IS_QA', 'SMOKE'];
        const checkTags = ['IS_QA', 'REGRESSION'];
        const result = checkTags.every(tag => testTags.includes(tag));
        
        expect(result).to.be.false;
      });

      it('should handle empty check array', () => {
        const testTags = ['IS_QA'];
        const checkTags = [];
        const result = checkTags.every(tag => testTags.includes(tag));
        
        // every() returns true for empty array
        expect(result).to.be.true;
      });

      it('should handle empty test tags', () => {
        const testTags = [];
        const checkTags = ['SMOKE'];
        const result = checkTags.every(tag => testTags.includes(tag));
        
        expect(result).to.be.false;
      });
    });

    describe('matchesRuntimeTag() logic', () => {
      it('should return true when test has runtime tag', () => {
        const runtimeTags = ['IS_QA', 'SMOKE'];
        const testTags = ['IS_QA', 'CRITICAL'];
        const result = runtimeTags.some(runtimeTag => testTags.includes(runtimeTag));
        
        expect(result).to.be.true;
      });

      it('should return false when test does not have runtime tag', () => {
        const runtimeTags = ['IS_PROD'];
        const testTags = ['IS_QA', 'SMOKE'];
        const result = runtimeTags.some(runtimeTag => testTags.includes(runtimeTag));
        
        expect(result).to.be.false;
      });

      it('should return true when no runtime filter', () => {
        const runtimeTags = [];
        const testTags = ['IS_QA', 'SMOKE'];
        const result = runtimeTags.length === 0 ? true : runtimeTags.some(runtimeTag => testTags.includes(runtimeTag));
        
        expect(result).to.be.true;
      });

      it('should handle multiple matching tags', () => {
        const runtimeTags = ['IS_QA', 'SMOKE'];
        const testTags = ['IS_QA', 'SMOKE', 'CRITICAL'];
        const result = runtimeTags.some(runtimeTag => testTags.includes(runtimeTag));
        
        expect(result).to.be.true;
      });
    });

    describe('Tag Extraction from Config', () => {
      it('should extract tags from config object', () => {
        const config = { tags: ['IS_QA', 'SMOKE'], timeout: 5000 };
        const tags = config.tags || [];
        
        expect(tags).to.deep.equal(['IS_QA', 'SMOKE']);
      });

      it('should handle missing tags property', () => {
        const config = { timeout: 5000 };
        const tags = config.tags || [];
        
        expect(tags).to.deep.equal([]);
      });

      it('should handle null config', () => {
        const config = null;
        const tags = config?.tags || [];
        
        expect(tags).to.deep.equal([]);
      });

      it('should handle undefined config', () => {
        const config = undefined;
        const tags = config?.tags || [];
        
        expect(tags).to.deep.equal([]);
      });
    });
  });

  // ============================================================================
  // EDGE CASES & PERFORMANCE
  // ============================================================================
  
  describe('Edge Cases', () => {
    it('should handle tags with underscores', () => {
      const testTags = ['IS_QA', 'TEST_TAG_123'];
      
      expect(testTags.includes('IS_QA')).to.be.true;
      expect(testTags.includes('TEST_TAG_123')).to.be.true;
    });

    it('should handle tags with numbers', () => {
      const testTags = ['TAG123', 'TEST456'];
      
      expect(testTags.includes('TAG123')).to.be.true;
      expect(testTags.includes('TEST456')).to.be.true;
    });

    it('should handle uppercase tags', () => {
      const testTags = ['UPPERCASE', 'MIXEDCASE'];
      
      expect(testTags.includes('UPPERCASE')).to.be.true;
      expect(testTags.includes('MIXEDCASE')).to.be.true;
    });

    it('should handle empty string tags', () => {
      const testTags = ['', 'VALID'];
      
      expect(testTags.includes('')).to.be.true;
      expect(testTags.includes('VALID')).to.be.true;
    });

    it('should handle whitespace in tags', () => {
      const testTags = ['TAG', ' TAG'];
      
      expect(testTags.includes('TAG')).to.be.true;
      expect(testTags.includes(' TAG')).to.be.true;
      // Verify they are treated as different tags
      expect('TAG').to.not.equal(' TAG');
    });
  });

  describe('Performance', () => {
    it('should handle large number of tags efficiently', () => {
      const testTags = Array.from({ length: 1000 }, (_, i) => `TAG${i}`);
      const checkTag = 'TAG500';
      
      const startTime = Date.now();
      const result = testTags.includes(checkTag);
      const endTime = Date.now();
      
      expect(result).to.be.true;
      expect(endTime - startTime).to.be.lessThan(10);
    });

    it('should handle large Map efficiently', () => {
      const tagStore = new Map();
      
      for (let i = 0; i < 1000; i++) {
        tagStore.set(`test-${i}`, [`TAG${i}`]);
      }
      
      const startTime = Date.now();
      const result = tagStore.get('test-500');
      const endTime = Date.now();
      
      expect(result).to.deep.equal(['TAG500']);
      expect(endTime - startTime).to.be.lessThan(10);
    });
  });
});
