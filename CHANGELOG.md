# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-05-03

### Fixed
- Fixed typo in the getRunTime() method

## [1.0.0] - 2026-03-21

### Added
- Initial release of cypress-conditional-tags
- Runtime tag access in Cypress tests
- Synchronous API (`Cypress.Tags.get()`, `has()`, `hasAny()`, `hasAll()`)
- Asynchronous API (`cy.getTags()`, `cy.hasTag()`, `cy.hasAnyTag()`, `cy.hasAllTags()`)
- Tag inheritance from parent `describe` blocks
- Support for tags with numbers and underscores
- Full TypeScript definitions
- Comprehensive documentation and examples
- Test suite for plugin functionality

### Features
- Parse tags from test titles using `@tagname` syntax
- Store tags at runtime for conditional test logic
- Enable environment-specific test behavior
- Support for multiple tag checks (any/all)
- Clean test titles in output (tags removed)
- Preserve Cypress modifiers (`.only`, `.skip`)

### Documentation
- README.md with comprehensive usage guide
- QUICK_START.md for rapid setup
- ARCHITECTURE.md explaining internal design
- TESTING.md for testing the plugin
- Multiple example files demonstrating real-world usage

### Examples
- Basic usage examples
- Advanced usage scenarios (e-commerce, performance, security)
- Async command examples
- Custom command integration

### Compatibility
- Cypress >= 10.0.0
- Tested with Cypress 15.12.0
- Node.js >= 14.0.0
- Full TypeScript support

## [Unreleased]

### Planned
- Tag metadata support (priority, owner, etc.)
- Tag validation and warnings
- Integration with test reporters
- Tag-based test grouping
- Performance optimizations
- Additional examples and use cases

---

## Version History

### Version 1.0.0
First stable release with core functionality for runtime tag access in Cypress tests.