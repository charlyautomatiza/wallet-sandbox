# Playwright Assertions and Test Structure

## Test Structure

Follow the AAA pattern:
1. **Arrange**: Set up test data and conditions
2. **Act**: Perform the action being tested
3. **Assert**: Verify the expected outcomes

## Test Independence Requirements

Each test must be completely independent and self-contained:

- Tests MUST create any data they need to operate on
- Tests MUST NOT rely on other tests having run first
- Tests MUST be executable in any order, including in isolation
- Tests MUST clean up after themselves when necessary
- Tests MUST NOT share state or data between them

## Test Naming Conventions

- Test names should clearly describe the behavior being tested
- Do NOT use numeric prefixes (like "TC1:", "Test 1:", etc.) in test titles
- Test titles should stand on their own without implying execution order

```typescript
// ❌ BAD: Using numeric prefixes
test('TC1: User can login with valid credentials', async ({ page }) => { /* ... */ });
test('TC2: User cannot login with invalid credentials', async ({ page }) => { /* ... */ });

// ✅ GOOD: Descriptive titles without ordering
test('User can login with valid credentials', async ({ page }) => { /* ... */ });
test('User cannot login with invalid credentials', async ({ page }) => { /* ... */ });
```

### Example of Independent Test

```typescript
// ✅ GOOD: Each test is fully self-contained
test('user can edit their profile', async ({ page }) => {
  // Setup - Create the user and login
  await page.route('**/api/auth', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', userId: '123' })
    });
  });
  
  // Create profile data to edit
  await page.route('**/api/user/123', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ 
        name: 'Original Name',
        email: 'original@example.com'
      })
    });
  });
  
  // Login and navigate to profile
  await page.goto('/login');
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  
  // Act - Edit the profile
  await page.getByLabel('Name').fill('Updated Name');
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Assert - Verify changes
  await expect(page.getByText('Profile updated')).toBeVisible();
});

// ❌ BAD: Dependent test that relies on a previous test
test('user can edit their profile - BAD EXAMPLE', async ({ page }) => {
  // This assumes another test has already created the user and data
  await page.goto('/login');
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  
  // Act - Edit the profile
  await page.getByLabel('Name').fill('Updated Name');
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Assert - Verify changes
  await expect(page.getByText('Profile updated')).toBeVisible();
});
```

```typescript
test('user can add item to cart', async ({ page }) => {
  // Arrange
  const productPage = new ProductPage(page);
  await productPage.goto('product-123');
  
  // Act
  await productPage.addToCart();
  
  // Assert
  expect(await productPage.isItemAddedToCart()).toBeTruthy();
  expect(await productPage.getCartCount()).toBe('1');
});
```

## Assertions

Use Playwright's built-in assertions from `expect` library:

```typescript
import { test, expect } from '@playwright/test';

// Basic assertions
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toContain(expected);

// Asynchronous assertions
expect(await page.getByText('Welcome')).toBeVisible();
expect(await page.locator('#error')).toBeHidden();
```

## Soft Assertions

For tests that should continue after a failure, use soft assertions:

```typescript
test('validate multiple elements on page', async ({ page }) => {
  // This will continue even if one assertion fails
  await expect.soft(page.getByText('Header')).toBeVisible();
  await expect.soft(page.getByRole('button')).toBeEnabled();
  await expect.soft(page.getByText('Footer')).toBeVisible();
});
```

## Custom Assertions

Create custom assertions for complex validations:

```typescript
async function expectModalToContainText(page, text) {
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByText(text)).toBeVisible();
}

test('show confirmation modal', async ({ page }) => {
  await page.getByRole('button', { name: 'Delete' }).click();
  await expectModalToContainText(page, 'Are you sure?');
});
```

## Waiting for Conditions

Prefer auto-waiting built into Playwright over explicit waits:

```typescript
// Good - Playwright auto-waits
await page.getByRole('button').click();
await expect(page.getByText('Success')).toBeVisible();

// Avoid - Explicit waiting
await page.getByRole('button').click();
await page.waitForTimeout(1000); // Bad practice
await expect(page.getByText('Success')).toBeVisible();
```

## Timeout Configuration

Adjust timeouts for specific assertions when needed:

```typescript
// Longer timeout for slow operations
await expect(page.getByText('Processing')).toBeHidden({ timeout: 30000 });

// For performance tests, use stricter timeouts
await expect(page.getByText('Results')).toBeVisible({ timeout: 1000 });
```
