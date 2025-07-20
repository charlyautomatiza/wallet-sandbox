# Playwright Test Standards for Wallet Sandbox

## Overview

These rules provide guidance for generating and maintaining Playwright tests for the Wallet Sandbox application.

## Change Management and Git Workflow

Before implementing any automation test:

1. **Verify User Story**:
   - ALWAYS ask for the US/TT/BG (User Story, Technical Task, Bug) being automated
   - Verify its existence in GitHub Issues
   - If it doesn't exist, suggest creating a new issue in GitHub Issues following the standard format

2. **Git Workflow**:
   - ALWAYS start from an updated main branch
   ```bash
   git checkout main
   git pull origin main
   ```
   - Create branch with descriptive name for tests
   ```bash
   git checkout -b test/US-XXX-test-description
   ```
   - Make commits with descriptive messages
   ```bash
   git commit -m "[Test][US-XXX] Add transfer tests"
   ```
   - Request confirmation before publishing
   - Add GitHub Copilot as reviewer in PRs

## Test Independence and Single Responsibility

- Each test MUST be completely independent of all other tests
- Each test MUST be self-contained with all necessary setup and data
- Each test MUST test exactly ONE behavior or scenario
- NEVER create tests that rely on other tests having run first
- For example: A test that edits a transfer must create that transfer within the same test
- NEVER assume that data exists from a previous test run
- Use data-driven testing for similar flows with different inputs

## Test Naming Standards

- Test names MUST clearly describe the scenario or behavior being tested
- NEVER use numeric prefixes or ordering in test names:
  - ❌ BAD: `test('TC1: No debe permitir transferencias con montos inválidos')`
  - ✅ GOOD: `test('No debe permitir transferencias con montos inválidos')`
- Use action-oriented, descriptive names that explain what the test is verifying
- Names should make sense regardless of the order tests are executed

## Project-Specific Test Structure

Tests should be organized in the following structure:
```
tests/
├── fixtures/           # Common test fixtures
├── pages/              # Page Object Models
│   ├── HomePage.ts
│   ├── TransferPage.ts
│   ├── PaymentsPage.ts
│   └── ...
├── utils/              # Utility functions
├── api/                # API tests
└── specs/              # Test specifications
    ├── auth/           # Authentication tests
    ├── transfer/       # Money transfer tests
    ├── payments/       # Payment flow tests
    └── ...
```

## Application-Specific Locators

For this application, follow these guidelines:
1. Use getByRole when possible
2. Use data-testid attributes for complex UI elements
3. For wallet-specific components, use the following patterns:

```typescript
// Currency input fields
const amountInput = page.getByRole('textbox', { name: /amount/i });

// Transaction buttons
const sendButton = page.getByRole('button', { name: /send|transfer/i });
const requestButton = page.getByRole('button', { name: /request/i });

// Navigation
const paymentTab = page.getByRole('tab', { name: /payments/i });
const transferTab = page.getByRole('tab', { name: /transfer/i });
```

## Test Scenarios

Include tests for the following common wallet scenarios:

1. User authentication flows
2. Money transfer between accounts
3. Payment processing
4. Balance checking
5. Transaction history viewing
6. Profile and settings management

## Mobile Testing Focus

Given the mobile-first nature of this application:
1. Prioritize mobile viewport testing (e.g. iPhone, Android dimensions)
2. Test responsive design elements
3. Verify touch interactions work properly

## Authentication Testing

Use the following pattern for authentication in tests - each test should set up its own authentication:

```typescript
// Self-contained authentication within each test
test('authenticated user can view balance', async ({ page }) => {
  // Arrange - Set up authentication in THIS test
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  
  // Act/Assert - Test the actual functionality
  await expect(page.getByText(/balance/i)).toBeVisible();
});
```

## Data-Driven Testing Example

Use data-driven patterns for testing similar flows with different inputs:

```typescript
// Test data
const transferScenarios = [
  { 
    recipient: 'John Doe', 
    amount: 100, 
    note: 'Gift',
    expectSuccess: true 
  },
  { 
    recipient: 'Jane Smith', 
    amount: 50000, 
    note: 'Large payment',
    expectSuccess: false,
    errorMessage: 'Exceeds daily limit'
  },
  { 
    recipient: 'Invalid User', 
    amount: 25, 
    note: 'Test',
    expectSuccess: false,
    errorMessage: 'Recipient not found' 
  }
];

// Data-driven test
for (const scenario of transferScenarios) {
  test(`Transfer to ${scenario.recipient} with amount $${scenario.amount}`, async ({ page }) => {
    // Arrange - Set up mocked API responses based on scenario
    if (scenario.recipient === 'Invalid User') {
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
    }

    // Set up balance check response
    await page.route('**/api/balance', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ balance: scenario.expectSuccess ? scenario.amount * 2 : 10 })
      });
    });
    
    // Login and navigate (must be in each test)
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Act - Perform transfer
    await page.getByRole('link', { name: 'Transfer' }).click();
    await page.getByLabel('Recipient').fill(scenario.recipient);
    await page.getByLabel('Amount').fill(scenario.amount.toString());
    await page.getByLabel('Note').fill(scenario.note);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Assert - Check expected outcome based on scenario
    if (scenario.expectSuccess) {
      await expect(page.getByText('Transfer successful')).toBeVisible();
    } else {
      await expect(page.getByText(scenario.errorMessage)).toBeVisible();
    }
  });
}
```

## Visual Testing

For this wallet application, focus visual testing on:
1. Currency formatting
2. Transaction status indicators
3. Security elements (e.g., masked account numbers)
4. Confirmation screens

## Performance Metrics

Include performance testing for critical flows:
1. Page load times should be under 2 seconds
2. Transaction processing should provide feedback within 1 second
3. Navigation between sections should be immediate

For more details, refer to the complete documentation in .github/copilot/
