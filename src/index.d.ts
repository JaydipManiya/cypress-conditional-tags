/**
 * TypeScript definitions for cypress-conditional-tags
 */

declare namespace Cypress {
     interface Chainable {
          /**
          * Get the runtime tag passed via CLI (async)
          * @example
          * cy.getRuntimeTag().then(tag => {
          *   cy.log(`Runtime tag: ${tag}`)
          * })
          */
          getRuntimeTag(): Chainable<string | null>;

          /**
          * Get all runtime tags passed via CLI (async)
          * @example
          * cy.getAllRuntimeTags().then(tags => {
          *   expect(tags).to.include('IS_QA')
          * })
          */
          getAllRuntimeTags(): Chainable<string[]>;

          /**
          * Check if runtime tag matches the given tag (async)
          * @paramtag - Tag to check
          * @example
          * cy.isRuntimeTag('IS_QA').then(matches => {
          *   if (matches) {
          *     cy.log('Running in QA mode')
          *   }
          * })
          */
          isRuntimeTag(tag:string): Chainable<boolean>;

          /**
          * Get tags for current test from config (async)
          * @example
          * cy.getTestTags().then(tags => {
          *   expect(tags).to.include('IS_QA')
          * })
          */
          getTestTags(): Chainable<string[]>;

          /**
          * Check if current test has a specific tag (async)
          * @paramtag - Tag to check
          * @example
          * cy.hasTestTag('IS_QA').then(hasIt => {
          *   if (hasIt) {
          *     cy.log('Test is tagged with IS_QA')
          *   }
          * })
          */
          hasTestTag(tag: string): Chainable<boolean>;

          /**
          * Check if current test matches the runtime tag (async)
          * @example
          * cy.matchesRuntimeTag().then(matches => {
          *   if (matches) {
          *     cy.log('Test matches runtime tag!')
          *   }
          * })
          */
          matchesRuntimeTag(): Chainable<boolean>;
     }

     interface Tags {
     /**
     * Get the runtime tag passed via CLI (synchronous)
     * @returns The runtime tag or null
     * @example
     * const tag = Cypress.Tags.getRuntime()
     * if (tag === 'IS_QA') {
     *   cy.log('Running in QA mode')
     * }
     */
     getRuntime(): string | null;

     /**
     * Get all runtime tags passed via CLI (synchronous)
     * @returns Array of runtime tags
     * @example
     * const tags = Cypress.Tags.getAllRuntime()
     * cy.log(`Runtime tags: ${tags.join(', ')}`)
     */
     getAllRuntime(): string[];

     /**
     * Check if runtime tag matches the given tag (synchronous)
     * @paramtag - Tag to check
     * @returns true if runtime tag matches
     * @example
     * if (Cypress.Tags.isRuntime('IS_QA')) {
     *   cy.log('Running in QA mode')
     * }
     */
     isRuntime(tag:string): boolean;

     /**
     * Check if runtime has any of the given tags (synchronous)
     * @paramtags - Tags to check
     * @returns true if any tag matches
     * @example
     * if (Cypress.Tags.isAnyRuntime('IS_QA', 'IS_STAGING')) {
     *   cy.log('Running in QA or Staging')
     * }
     */
     isAnyRuntime(...tags: string[]): boolean;

     /**
     * Check if runtime has all of the given tags (synchronous)
     * @paramtags - Tags to check
     * @returns true if all tags match
     * @example
     * if (Cypress.Tags.isAllRuntime('IS_QA', 'SMOKE')) {
     *   cy.log('Running QA smoke tests')
     * }
     */
     isAllRuntime(...tags: string[]): boolean;

     /**
     * Get tags for current test from config (synchronous)
     * @returns Array of test tags
     * @example
     * const tags = Cypress.Tags.getTest()
     * cy.log(`Test tags: ${tags.join(', ')}`)
     */
     getTest(): string[];

     /**
     * Check if current test has a specific tag (synchronous)
     * @paramtag - Tag to check
     * @returns true if test has the tag
     * @example
     * if (Cypress.Tags.hasTest('IS_QA')) {
     *   cy.log('Test is tagged with IS_QA')
     * }
     */
     hasTest(tag: string): boolean;

     /**
     * Check if current test has any of the given tags (synchronous)
     * @paramtags - Tags to check
     * @returns true if test has any tag
     * @example
     * if (Cypress.Tags.hasAnyTest('IS_QA', 'IS_GA')) {
     *   cy.log('Test has QA or GA tag')
     * }
     */
     hasAnyTest(...tags: string[]): boolean;

     /**
     * Check if current test has all of the given tags (synchronous)
     * @paramtags - Tags to check
     * @returns true if test has all tags
     * @example
     * if (Cypress.Tags.hasAllTest('IS_QA', 'SMOKE')) {
     *   cy.log('Test has both QA and SMOKE tags')
     * }
     */
     hasAllTest(...tags: string[]): boolean;

     /**
     * Check if current test matches the runtime tag (synchronous)
     * @returns true if test has the runtime tag
     * @example
     * if (Cypress.Tags.matchesRuntime()) {
     *   cy.log('Test matches the runtime tag!')
     * }
     */
     matchesRuntime(): boolean;
     }

     interface CypressStatic {
     /**
     * Tag utility functions for runtime and test tag access
     */
     Tags:Tags;
     }
}

/**
* Plugin configuration for cypress.config.js
*/
export function setupNodeEvents(
     on: Cypress.PluginEvents,
     config: Cypress.PluginConfigOptions
):Cypress.PluginConfigOptions;

/**
 * Support file setup for cypress/support/e2e.js
 * Call this function to enable runtime tag access
 */
export function setupSupport(): void;

/**
 * Get the runtime tag passed via CLI
 * @returns The runtime tag or null
 */
export function getRuntimeTag(): string | null;

/**
 * Get all runtime tags passed via CLI
 * @returns Array of runtime tags
 */
export function getAllRuntimeTags(): string[];

/**
 * Check if runtime tag matches the given tag
 * @paramtag - Tag to check
 * @returns true if runtime tag matches
 */
export function isRuntimeTag(tag: string): boolean;

/**
 * Check if runtime has any of the given tags
 * @paramtags - Tags to check
 * @returns true if any tag matches
 */
export function isAnyRuntimeTag(...tags: string[]): boolean;

/**
 * Check if runtime has all of the given tags
 * @paramtags - Tags to check
 * @returns true if all tags match
 */
export function isAllRuntimeTags(...tags: string[]): boolean;

/**
 * Get tags for current test from config
 * @returns Array of test tags
 */
export function getTestTags(): string[];

/**
 * Check if current test has a specific tag
 * @paramtag - Tag to check
 * @returns true if test has the tag
 */
export function hasTestTag(tag: string): boolean;

/**
 * Check if current test has any of the given tags
 * @paramtags - Tags to check
 * @returns true if test has any tag
 */
export function hasAnyTestTag(...tags: string[]): boolean;

/**
 * Check if current test has all of the given tags
 * @paramtags - Tags to check
 * @returns true if test has all tags
 */
export function hasAllTestTags(...tags: string[]): boolean;

/**
 * Check if current test matches the runtime tag
 * @returns true if test has the runtime tag
 */
export function matchesRuntimeTag(): boolean;
