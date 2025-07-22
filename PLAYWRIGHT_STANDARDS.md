# Playwright Test Automation Standards for Wallet Sandbox

This project includes a comprehensive set of instruction files that define standards and best practices for using Playwright in test automation. These standards are designed to be used with GitHub Copilot and Cursor AI to ensure consistent, maintainable, and reliable test code.

⚠️ **PLAYWRIGHT MCP INTEGRATION** ⚠️
For test automation tasks, ALWAYS prioritize the use of Playwright MCP tools when available. If MCP tools are not active, validate with the user to activate them before proceeding.

## Directory Structure

```
wallet-sandbox/
├── .github/
│   └── copilot-instructions.md    # Complete GitHub Copilot instructions
├── .cursorrules                   # Complete Cursor AI rules
├── tests/
│   ├── fixtures/                  # Test fixtures and data
│   ├── pages/                     # Page Object Models
│   ├── specs/                     # Test specifications
│   └── utils/                     # Test utilities
```

## Enhanced Test Automation Process

### MCP Tools Priority

⚠️ **MANDATORY FOR PLAYWRIGHT AUTOMATION** ⚠️

1. **Tool Verification**:
   - Before starting any Playwright automation task, verify MCP tools availability
   - If MCP tools are not active, guide the user through activation process
   - Provide clear instructions for enabling Playwright MCP extensions

2. **MCP Tool Activation Guide**:
   ```bash
   # Verify MCP tools are available
   # Check if Playwright MCP extension is installed and active
   # If not available, guide user to:
   # 1. Install required MCP extensions
   # 2. Configure VS Code settings
   # 3. Restart development environment if needed
   ```

3. **Fallback Strategy**:
   - Use standard Playwright APIs only when MCP tools are confirmed unavailable
   - Always inform the user about the benefits of using MCP tools
   - Suggest MCP tool activation for future test development

### Test Validation and Bug Management

⚠️ **MANDATORY FOR TEST AUTOMATION TASKS** ⚠️

1. **Pre-Publication Validation**:
   - ALWAYS validate that tests execute successfully before publishing changes
   - Run the complete test suite to ensure no regressions
   - Verify test results meet the expected functionality requirements

2. **Application Error Detection**:
   - When application errors are detected during testing, suggest creating a GitHub Issue for the bug
   - Never ignore application errors or treat them as test failures
   - Categorize issues as bugs (BG-XXX format) for separate resolution

3. **Bug Issue Creation Process**:
   - Automatically offer to create GitHub Issues for detected application bugs
   - Include comprehensive information in bug reports:
     - Complete error logs
     - Screenshots of error states
     - Full Playwright execution report
     - Steps to reproduce
     - Environment details

4. **Error Documentation**:
   - Attach all relevant test artifacts to bug issues
   - Include full Playwright HTML reports when available
   - Provide trace files for complex interaction failures
   - Link test execution videos when helpful for reproduction

## Using These Standards

### For Developers

1. **When Writing New Tests**:
   - **Prioritize MCP Tools**: Always check if Playwright MCP tools are available before starting
   - Follow the Page Object Model pattern with TypeScript exclusively
   - Structure tests according to AAA pattern (Arrange-Act-Assert)
   - Ensure each test is independent and has single responsibility

2. **When Using GitHub Copilot**:
   - Copilot follows the complete instructions in `.github/copilot-instructions.md`
   - Copilot will automatically prioritize MCP tools and guide through activation if needed
   - Request specific test types like "Generate transfer test with error handling"

3. **When Using Cursor AI**:
   - Cursor follows the rules in `.cursorrules` file
   - Cursor will verify MCP tools availability and guide activation process
   - Use prompts like "Create end-to-end test for wallet transfer with bug detection"

4. **Task Management Integration**:
   - Always start with task verification (US-XXX, TT-XXX, or BG-XXX)
   - If testing reveals application bugs, create GitHub Issues with comprehensive reports
   - Follow Git workflow requirements before implementing test changes

### Setting Up Playwright

To set up Playwright in this project:

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Note: If AI-assisted testing tools are required, refer to the `.github/copilot/` directory for GitHub Copilot setup or the `.cursor/rules/` directory for Cursor AI setup. Detailed instructions can also be found in the `README.md` file in the root directory.

# Run tests
npx playwright test

# Show report
npx playwright show-report
```

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
   ```typescript
   // Good
   await page.getByRole('button', { name: 'Submit' }).click();
   
   // Avoid
   await page.locator('#submit-button').click();
   ```

6. **Follow Page Object Model**
   ```typescript
   // Create page objects
   const loginPage = new LoginPage(page);
   
   // Use their methods
   await loginPage.login('user@example.com', 'password');
   ```
   
7. **Mock API Responses**
   ```typescript
   // Mock API responses for comprehensive test coverage
   await page.route('**/api/account/balance', (route) => {
     route.fulfill({
       status: 200,
       contentType: 'application/json',
       body: JSON.stringify({ balance: 5000 })
     });
   });
   ```

8. **Use Proper Assertions**
   ```typescript
   // Good - Uses auto-waiting
   await expect(page.getByText('Success')).toBeVisible();
   
   // Avoid
   await page.waitForTimeout(1000);
   expect(await page.getByText('Success').isVisible()).toBeTruthy();
   ```

9. **Structure Tests with AAA Pattern**
   ```typescript
   test('user can add item to cart', async ({ page }) => {
     // Arrange
     await page.goto('/products');
     
     // Act
     await page.getByText('Add to Cart').click();
     
     // Assert
     await expect(page.getByText('Item added')).toBeVisible();
   });
   ```

10. **Use MCP Effectively**
   - Use Snapshot Mode (default) for most interactions
   - Use Vision Mode only when necessary
   - Include error handling and edge cases

## Questions and Support

For questions or support regarding these test standards, please contact the QA team or refer to the detailed documentation in the `.github/copilot/` directory.
