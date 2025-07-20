# Playwright Test Automation Standards for Wallet Sandbox

## General Guidelines

When generating Playwright tests for this project, follow these key principles:

1. **Use TypeScript exclusively**: Always generate tests with `.spec.ts` extension and Page Object Models with `.ts` extension.

2. **Follow Page Object Model pattern**: 
   - Place all Page Objects in the `tests/pages` directory
   - Never define Page Objects within test spec files
   - Use methods in Page Objects to encapsulate page interactions

3. **Ensure test independence**:
   - Each test must be self-contained with its own setup
   - Never rely on other tests having run first
   - Tests must be executable in any order

4. **Maintain single responsibility**:
   - Each test should verify ONE specific behavior or scenario
   - Never group multiple test cases in a single test
   - Use data-driven testing for similar flows with different data

## Test Structure and Naming

1. **Use descriptive test names**:
   - Names should clearly describe the behavior being tested
   - Never use numeric prefixes (e.g., "TC1:", "Test 2:")
   - Use action-oriented descriptions

2. **Structure using AAA pattern** (Arrange-Act-Assert):
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

## Locators and Selectors

1. **Prioritize role-based locators**:
   ```typescript
   // Good
   await page.getByRole('button', { name: 'Submit' }).click();
   
   // Avoid
   await page.locator('#submit-button').click();
   ```

2. **Use data-testid for complex UI elements**:
   ```typescript
   await page.getByTestId('transfer-form').fill('100');
   ```

## Assertions and Error Handling

1. **Use auto-waiting assertions**:
   ```typescript
   // Good - Uses auto-waiting
   await expect(page.getByText('Success')).toBeVisible();
   
   // Avoid
   await page.waitForTimeout(1000);
   expect(await page.getByText('Success').isVisible()).toBeTruthy();
   ```

2. **Include appropriate error handling**:
   - Add proper error messages in assertions
   - Use try/catch blocks when appropriate for complex scenarios

## API Testing and Mocking

1. **Mock API responses when needed**:
   ```typescript
   await page.route('**/api/account/balance', (route) => {
     route.fulfill({
       status: 200,
       contentType: 'application/json',
       body: JSON.stringify({ balance: 5000 })
     });
   });
   ```

2. **Use standardized error responses**:
   ```typescript
   await page.route('**/api/validate-recipient', (route) => {
     route.fulfill({
       status: 404,
       contentType: 'application/json',
       body: JSON.stringify({ 
         error: { 
           code: 'RECIPIENT_NOT_FOUND', 
           message: 'Recipient not found', 
           details: null 
         } 
       })
     });
   });
   ```

## Mobile Testing

1. **Prioritize mobile viewports**:
   ```typescript
   test.beforeEach(async ({ page }) => {
     // Set mobile viewport
     await page.setViewportSize({ width: 375, height: 667 });
   });
   ```

2. **Test responsive elements**:
   - Verify that UI elements adapt correctly to different screen sizes
   - Test touch interactions for mobile scenarios

## Data-Driven Testing

Use data-driven patterns for testing similar flows with different inputs:

```typescript
const transferScenarios = [
  { recipient: 'John Doe', amount: 100, expectSuccess: true },
  { recipient: 'Jane Smith', amount: 50000, expectSuccess: false }
];

for (const scenario of transferScenarios) {
  test(`Transfer to ${scenario.recipient} with amount $${scenario.amount}`, async ({ page }) => {
    // Test implementation using scenario data
  });
}
```

## Project Structure

Follow this directory structure for tests:
```
tests/
├── fixtures/           # Common test fixtures
├── pages/              # Page Object Models
│   ├── HomePage.ts
│   ├── TransferPage.ts
│   └── ...
├── utils/              # Utility functions
├── api/                # API tests
└── specs/              # Test specifications
    ├── auth/           # Authentication tests
    ├── transfer/       # Money transfer tests
    └── ...
```
