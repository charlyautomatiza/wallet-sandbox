# Playwright Locator Strategies

## Preferred Selector Order

1. Role-based locators (most preferred)
2. Test IDs 
3. Accessible attributes
4. Text content
5. CSS selectors (least preferred)
6. XPath (avoid unless absolutely necessary)

## Role-Based Locators

Prefer role-based locators for better accessibility and test reliability:

```typescript
// Preferred
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');

// Avoid
await page.locator('#submit-button').click();
await page.locator('input[type="email"]').fill('user@example.com');
```

## Test IDs

When role-based locators aren't sufficient, use data-testid attributes:

```typescript
// In your HTML/JSX
<button data-testid="submit-button">Submit</button>

// In your test
await page.getByTestId('submit-button').click();
```

## Text Content

Use text content for elements that don't have roles or test IDs:

```typescript
await page.getByText('Welcome to our platform').isVisible();
await page.getByText('Error message').isVisible();
```

## Locator Chaining

Chain locators to narrow down the scope:

```typescript
const form = page.getByRole('form');
await form.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
await form.getByRole('button', { name: 'Submit' }).click();
```

## Avoiding Brittle Selectors

- Don't use selectors that depend on UI structure (like nth-child)
- Don't use selectors that depend on CSS classes that might change
- Don't use selectors based on implementation details
