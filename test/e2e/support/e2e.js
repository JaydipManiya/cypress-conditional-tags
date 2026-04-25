const { setupSupport } = require('../../../src/index')

// Enable runtime tag access
setupSupport()

// Add custom assertion for testing
chai.Assertion.addMethod('includeTags', function (expectedTags) {
  const obj = this._obj
  const missing = expectedTags.filter(tag => !obj.includes(tag))
  
  this.assert(
    missing.length === 0,
    `expected tags to include #{exp} but missing: ${missing.join(', ')}`,
    `expected tags not to include #{exp}`,
    expectedTags,
    obj
  )
})
