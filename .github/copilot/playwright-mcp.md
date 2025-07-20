# Playwright MCP (Model Context Protocol) Standards

The Model Context Protocol (MCP) is a framework designed to enhance test automation by enabling dynamic, context-aware interactions with user interfaces. It provides tools and methodologies for creating robust, adaptive, and self-healing tests, making it easier to handle complex UI scenarios and edge cases.

## MCP Setup

Set up Playwright MCP in your project:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ... other config
  use: {
    // Add any Playwright-specific configurations here
  }
});
```

## MCP Modes

1. **Snapshot Mode** (Default): Uses accessibility tree for element interaction
   - Faster and more reliable for most scenarios
   - Better for standard UI interactions

2. **Vision Mode**: Uses computer vision for element interaction
   - Better for visual elements without accessibility properties
   - Use when elements can't be reliably located with standard locators

## Natural Language Test Creation

MCP enables writing tests in natural language:

```typescript
// Example of MCP-friendly test structure
test('User completes checkout process', async ({ page }) => {
  // High-level steps using natural language descriptions
  await page.goto('https://example.com/store');
  
  // Add product to cart
  await page.getByText('Gaming Laptop').click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  
  // Proceed to checkout
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  
  // Fill shipping details
  await page.getByLabel('Full Name').fill('John Doe');
  await page.getByLabel('Address').fill('123 Test St');
  await page.getByLabel('City').fill('Test City');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Complete payment
  await page.getByLabel('Card Number').fill('4111111111111111');
  await page.getByLabel('Expiration').fill('12/25');
  await page.getByLabel('CVV').fill('123');
  await page.getByRole('button', { name: 'Pay Now' }).click();
  
  // Verify order confirmation
  await expect(page.getByText('Thank you for your order')).toBeVisible();
  await expect(page.getByText('Order #')).toBeVisible();
});
```

## Self-Healing Tests

Structure tests to be resilient to UI changes:

```typescript
// Example of a self-healing approach
test('User searches for product', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Try different search input locators in order of preference
  const searchInput = await page.getByRole('searchbox').or(
    page.getByPlaceholder('Search').or(
      page.getByLabel('Search')
    )
  );
  
  await searchInput.fill('wireless headphones');
  await page.keyboard.press('Enter');
  
  // Verify results with flexible text matching
  await expect(page.getByText(/results for.*wireless headphones/i)).toBeVisible();
});
```

## Dynamic Test Adaptation

Create tests that adapt to different contexts:

```typescript
test('User adds item to cart on different viewports', async ({ page }) => {
  // Function to test add-to-cart on different viewports
  async function testAddToCart(viewport) {
    await page.setViewportSize(viewport);
    await page.goto('https://example.com/products/1');
    
    // Adaptive button selection based on viewport
    if (viewport.width < 768) {
      // Mobile layout
      await page.getByRole('button', { name: 'Add' }).click();
    } else {
      // Desktop layout
      await page.getByRole('button', { name: 'Add to Cart' }).click();
    }
    
    // Verify cart indication
    await expect(page.getByText('Item added to cart')).toBeVisible();
  }
  
  // Test on mobile viewport
  await testAddToCart({ width: 375, height: 667 });
  
  // Test on desktop viewport
  await testAddToCart({ width: 1280, height: 800 });
});
```

## Edge Case Handling

Include tests for edge cases and error scenarios:

```typescript
test('Handle network errors gracefully', async ({ page }) => {
  // Set up network error simulation
  await page.route('**/api/products', route => route.abort('failed'));
  
  await page.goto('https://example.com/products');
  
  // Verify error handling UI
  await expect(page.getByText('Unable to load products')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  
  // Test retry functionality
  await page.unroute('**/api/products');
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Product 1' }])
    });
  });
  
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Product 1')).toBeVisible();
});
```
