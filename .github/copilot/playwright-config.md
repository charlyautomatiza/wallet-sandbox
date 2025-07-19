# Playwright Configuration and Best Practices

## Test Isolation Configuration

Configure Playwright to ensure test isolation:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Other configuration...
  
  // Ensure tests are isolated
  fullyParallel: true, // Run tests in parallel - tests must be fully isolated
  workers: process.env.CI ? 1 : undefined, // Control concurrency
  
  // Isolate browser context for each test
  use: {
    // Create a new context for each test
    contextOptions: {
      // Isolate storage between tests
      storageState: undefined
    }
  }
});
```

## Playwright Config File

Use a well-structured playwright.config.ts file:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/json-report.json' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

## Fixtures

Create custom fixtures for common test setups:

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

// Extend the test with custom fixtures
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loggedInPage: async ({ page }, use) => {
    // Create a logged-in state
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await use(page);
  }
});

export { expect } from '@playwright/test';
```

## Test Data Management

Handle test data efficiently:

```typescript
// testData.ts
export const users = {
  admin: {
    email: 'admin@example.com',
    password: 'adminPass123',
    role: 'admin'
  },
  customer: {
    email: 'customer@example.com',
    password: 'customerPass123',
    role: 'customer'
  }
};

export const products = [
  { id: 1, name: 'Product 1', price: 19.99 },
  { id: 2, name: 'Product 2', price: 29.99 }
];

// Using test data in tests
import { test } from './fixtures';
import { users, products } from './testData';

test('admin can view all orders', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.admin.email, users.admin.password);
  // Test continues...
});
```

## Visual Testing

Implement visual testing for UI components:

```typescript
import { test, expect } from '@playwright/test';

test('component visual regression test', async ({ page }) => {
  await page.goto('/component-library');
  
  // Take screenshot of specific component
  await expect(page.getByTestId('button-primary')).toHaveScreenshot('button-primary.png');
  await expect(page.getByTestId('dropdown-menu')).toHaveScreenshot('dropdown-menu.png');
});
```

## Parallel Testing

Configure tests to run in parallel:

```typescript
// Make tests independent with isolated storage states
test.describe('User profile tests', () => {
  // Use separate user accounts for each test
  test('user can update profile', async ({ page }) => {
    // Test with unique user data
  });
  
  test('user can change password', async ({ page }) => {
    // Test with different unique user data
  });
});
```

## CI Integration

Set up Playwright for continuous integration:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Performance Testing

Include basic performance metrics in tests:

```typescript
test('page loads within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/dashboard');
  
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // Page should load in under 3 seconds
  
  // Additional performance checks
  const performanceMetrics = await page.evaluate(() => JSON.stringify(window.performance));
  console.log(`Performance metrics: ${performanceMetrics}`);
});
```
