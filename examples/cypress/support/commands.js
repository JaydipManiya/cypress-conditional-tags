// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example: Custom command that uses tags
Cypress.Commands.add('loginBasedOnTags', () => {
  if (Cypress.Tags.has('fast') || Cypress.Tags.has('smoke')) {
    // Use fast login for smoke tests
    cy.log('Using fast login')
    cy.request('POST', '/api/fast-login', {
      token: 'test-token'
    })
  } else {
    // Use standard login for other tests
    cy.log('Using standard login')
    cy.visit('/login')
    cy.get('[data-cy=username]').type('testuser')
    cy.get('[data-cy=password]').type('password')
    cy.get('[data-cy=submit]').click()
  }
})
