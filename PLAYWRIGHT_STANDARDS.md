# Playwright Test Automation Standards for Wallet Sandbox

This project includes a comprehensive set of instruction files that define standards and best practices for using Playwright in test automation. These standards are designed to be used with GitHub Copilot and Cursor AI to ensure consistent, maintainable, and reliable test code.

## Directory Structure

\`\`\`
wallet-sandbox/
├── .github/
│   └── copilot/                   # GitHub Copilot instruction files
│       ├── README.md              # Overview of all instruction files
│       ├── playwright-general.md  # General guidelines
│       ├── playwright-locators.md # Locator strategies
│       ├── playwright-pom.md      # Page Object Model implementation
│       ├── playwright-assertions.md # Test assertions and structure
│       ├── playwright-api-testing.md # API testing standards
│       ├── playwright-api-mocking.md # API mocking standards
│       ├── playwright-mcp.md      # Model Context Protocol usage
│       └── playwright-config.md   # Configuration and best practices
├── .cursor/
│   └── rules/                     # Cursor AI-specific rules
│       └── playwright-tests.md    # Project-specific test standards
├── .cursorrules                   # General rules for Cursor AI
\`\`\`

## Using These Standards

### For Developers

1. **When Writing New Tests**:
   - Reference the appropriate instruction files based on what you're working on
   - Follow the Page Object Model pattern as shown in `tests/pages/HomePage.js`
   - Structure tests according to the examples in `tests/specs/transfer/transfer-money.spec.js`

2. **When Using GitHub Copilot**:
   - Copilot will be guided by the standards in the `.github/copilot/` directory
   - When requesting Copilot to generate test code, mention specific aspects like "using role-based locators" or "following our POM pattern"

3. **When Using Cursor AI**:
   - The `.cursorrules` file and `.cursor/rules/` directory provide guidance to Cursor AI
   - Use prompts like "Generate a test for the payment feature following our Playwright standards"

### Setting Up Playwright

To set up Playwright in this project:

\`\`\`bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Note: If AI-assisted testing tools are required, refer to the `.github/copilot/` directory for GitHub Copilot setup or the `.cursor/rules/` directory for Cursor AI setup. Detailed instructions can also be found in the `README.md` file in the root directory.

# Run tests
npx playwright test

# Show report
npx playwright show-report
\`\`\`

### CI Integration

The Playwright tests are configured to run in CI environments. Key features:
- Retries failed tests in CI (configured in `playwright.config.ts`)
- Captures screenshots and videos on failures
- Generates HTML and JSON reports

## Key Principles to Follow

1. **Always Use TypeScript**
   - All test files must use TypeScript (.spec.ts)
   - All Page Object Models must use TypeScript (.ts)

2. **Place Page Objects in Dedicated Directory**
   - All Page Object Models MUST be in the `tests/pages` directory
   - NEVER define Page Objects within test spec files

3. **Test Independence**
   - Each test MUST be independent and not rely on other tests' results
   - Tests MUST be executable in any order
   - Each test MUST be self-contained with all necessary setup
   - Never rely on a "creation" test to exist for an "edit" test to work

4. **Single Responsibility**
   - Each test MUST verify ONE specific behavior or scenario
   - NEVER group multiple test cases in a single test
   - Use data-driven testing for similar flows with different data inputs
   - NEVER use numeric prefixes in test titles (e.g., "TC1:", "Test 2:")

5. **Use Role-Based Locators**
   \`\`\`typescript
   // Good
   await page.getByRole('button', { name: 'Submit' }).click();
   
   // Avoid
   await page.locator('#submit-button').click();
   \`\`\`

6. **Follow Page Object Model**
   \`\`\`typescript
   // Create page objects
   const loginPage = new LoginPage(page);
   
   // Use their methods
   await loginPage.login('user@example.com', 'password');
   \`\`\`
   
7. **Mock API Responses**
   \`\`\`typescript
   // Mock API responses for comprehensive test coverage
   await page.route('**/api/account/balance', (route) => {
     route.fulfill({
       status: 200,
       contentType: 'application/json',
       body: JSON.stringify({ balance: 5000 })
     });
   });
   \`\`\`

8. **Use Proper Assertions**
   \`\`\`typescript
   // Good - Uses auto-waiting
   await expect(page.getByText('Success')).toBeVisible();
   
   // Avoid
   await page.waitForTimeout(1000);
   expect(await page.getByText('Success').isVisible()).toBeTruthy();
   \`\`\`

9. **Structure Tests with AAA Pattern**
   \`\`\`typescript
   test('user can add item to cart', async ({ page }) => {
     // Arrange
     await page.goto('/products');
     
     // Act
     await page.getByText('Add to Cart').click();
     
     // Assert
     await expect(page.getByText('Item added')).toBeVisible();
   });
   \`\`\`

10. **Use MCP Effectively**
   - Use Snapshot Mode (default) for most interactions
   - Use Vision Mode only when necessary
   - Include error handling and edge cases

## Questions and Support

For questions or support regarding these test standards, please contact the QA team or refer to the detailed documentation in the `.github/copilot/` directory.
