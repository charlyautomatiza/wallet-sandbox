# Playwright API Mocking and Route Handling

## Overview

API mocking is essential for testing applications without relying on real backend services. Playwright's route handling capabilities allow you to:

- Mock API responses for specific endpoints
- Test error conditions and edge cases
- Ensure tests remain consistent regardless of backend state
- Create tests for scenarios that would be difficult to set up with real data

## Route Handling Basics

Use Playwright's `page.route()` method to intercept and modify network requests:

\`\`\`typescript
// Mock an API response
test('display user profile', async ({ page }) => {
  await page.route('**/api/user/profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      })
    });
  });

  await page.goto('/profile');
  await expect(page.getByText('Test User')).toBeVisible();
});
\`\`\`

## Structure for Route Mocks

### Mock Fixture Approach

For reusable API mocks, create a fixture:

\`\`\`typescript
// fixtures.ts
import { test as base } from '@playwright/test';

// Define the fixture interface
interface MockedAPIs {
  mockUserProfile: (userData?: object) => Promise<void>;
  mockAccountBalance: (balance?: number) => Promise<void>;
}

// Create a test fixture with mocked APIs
export const test = base.extend<{ mockedApis: MockedAPIs }>({
  mockedApis: async ({ page }, use) => {
    // Create mock API object with methods
    const mockedApis: MockedAPIs = {
      mockUserProfile: async (userData = {}) => {
        await page.route('**/api/user/profile', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              ...userData
            })
          });
        });
      },
      
      mockAccountBalance: async (balance = 1000) => {
        await page.route('**/api/account/balance', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ balance, currency: 'USD' })
          });
        });
      }
    };

    await use(mockedApis);
  }
});

export { expect } from '@playwright/test';
\`\`\`

### Using Mock Fixtures in Tests

\`\`\`typescript
// transfer.spec.ts
import { test, expect } from '../fixtures';

test('user can see account balance', async ({ page, mockedApis }) => {
  // Mock the API response with specific balance
  await mockedApis.mockAccountBalance(5000);
  await mockedApis.mockUserProfile({ name: 'John Doe' });
  
  // Visit the page
  await page.goto('/dashboard');
  
  // Verify the mocked data appears
  await expect(page.getByText('$5,000.00')).toBeVisible();
  await expect(page.getByText('John Doe')).toBeVisible();
});
\`\`\`

## Mock API Response Files

For complex or large API responses, store mock data in JSON files:

\`\`\`typescript
// fixtures/mockData/userProfile.json
{
  "name": "Test User",
  "email": "test@example.com",
  "accountDetails": {
    "accountNumber": "1234567890",
    "accountType": "Savings"
  },
  "transactions": [
    {
      "id": "tx1",
      "amount": 100,
      "date": "2025-07-01T10:30:00Z"
    },
    {
      "id": "tx2",
      "amount": 50,
      "date": "2025-07-05T14:20:00Z"
    }
  ]
}

// In test file
import userProfileMock from '../fixtures/mockData/userProfile.json';

test('display user details', async ({ page }) => {
  await page.route('**/api/user/profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userProfileMock)
    });
  });
  
  await page.goto('/profile');
  // Test assertions
});
\`\`\`

## Testing Different Response Scenarios

Mock different API responses to test various scenarios:

\`\`\`typescript
test('handle error response', async ({ page }) => {
  // Mock error response
  await page.route('**/api/transfer', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  await page.goto('/transfer');
  await page.getByRole('button', { name: 'Send' }).click();
  
  // Verify error handling
  await expect(page.getByText('Something went wrong')).toBeVisible();
});

test('handle network timeout', async ({ page }) => {
  // Simulate network timeout
  await page.route('**/api/slow-endpoint', (route) => {
    // Never fulfill - will timeout
    // The test timeout will handle this
  });
  
  await page.goto('/data-loading');
  
  // Verify loading state
  await expect(page.getByText('Loading...')).toBeVisible();
  
  // Wait for timeout error UI
  await expect(page.getByText('Request timed out')).toBeVisible({ timeout: 10000 });
});
\`\`\`

## Dynamic Response Based on Request

Create mocks that respond differently based on the request:

\`\`\`typescript
test('search functionality', async ({ page }) => {
  await page.route('**/api/search**', async (route) => {
    const url = route.request().url();
    const searchParams = new URLSearchParams(new URL(url).search);
    const query = searchParams.get('q') || '';
    
    if (query.includes('found')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Found Item 1' },
          { id: 2, name: 'Found Item 2' }
        ])
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    }
  });
  
  // Test search with results
  await page.goto('/search');
  await page.getByRole('textbox').fill('found item');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Found Item 1')).toBeVisible();
  
  // Test search with no results
  await page.getByRole('textbox').fill('not found');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('No results found')).toBeVisible();
});
\`\`\`

## Request Validation

Validate API request payloads:

\`\`\`typescript
test('transfer form sends correct data', async ({ page }) => {
  // Store request data for validation
  let requestData = null;
  
  await page.route('**/api/transfer', (route) => {
    // Store the request payload
    requestData = JSON.parse(route.request().postData() || '{}');
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
  
  // Fill and submit the form
  await page.goto('/transfer');
  await page.getByLabel('Recipient').fill('John Doe');
  await page.getByLabel('Amount').fill('100');
  await page.getByLabel('Note').fill('Test payment');
  await page.getByRole('button', { name: 'Transfer' }).click();
  
  // Validate the request data
  expect(requestData).toEqual({
    recipient: 'John Doe',
    amount: 100,
    note: 'Test payment'
  });
});
\`\`\`

## API Mocking for Test Isolation

Using API mocking is essential for creating independent, self-contained tests:

\`\`\`typescript
test('user can edit their profile', async ({ page }) => {
  // Mock the API to always return a specific user, regardless of database state
  await page.route('**/api/users/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'user-123',
        name: 'Original Name',
        email: 'user@example.com',
        createdAt: '2025-01-01T00:00:00Z'
      })
    });
  });
  
  // Mock the update API to simulate success
  await page.route('**/api/users/me', (route) => {
    // Only intercept PUT/PATCH requests
    if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Profile updated successfully'
        })
      });
    }
  });
  
  // Test continues with user actions...
});
\`\`\`

## Using API Mocks for Self-Contained Tests

To ensure tests are fully independent, mock all external dependencies:

\`\`\`typescript
test('user can view order history', async ({ page }) => {
  // Mock authentication API
  await page.route('**/api/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', userId: 'user-123' })
    });
  });
  
  // Mock order history API
  await page.route('**/api/orders', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'order-1',
          date: '2025-07-01',
          total: 99.99,
          status: 'delivered'
        },
        {
          id: 'order-2',
          date: '2025-06-15',
          total: 49.99,
          status: 'processing'
        }
      ])
    });
  });
  
  // Test continues with user login and actions...
});
\`\`\`

## Best Practices for API Mocking

1. **Use Specific URL Patterns**: Target specific APIs rather than broad patterns
   \`\`\`typescript
   // Good
   await page.route('**/api/users/123', handler);
   
   // Avoid
   await page.route('**/*', handler); // Too broad
   \`\`\`

2. **Mock Only Necessary APIs**: Only mock APIs that your test requires
   \`\`\`typescript
   // Only mock what you need for the current test
   await page.route('**/api/account/balance', balanceHandler);
   \`\`\`

3. **Organize Mock Data**: Keep mock data organized and reusable
   \`\`\`typescript
   // Create mock data factories
   function createUserMock(overrides = {}) {
     return {
       id: 'user-123',
       name: 'Test User',
       email: 'test@example.com',
       ...overrides
     };
   }
   \`\`\`

4. **Test Edge Cases**: Use API mocking to test error handling and edge cases
   \`\`\`typescript
   // Test empty responses, error states, and boundary conditions
   test('handle empty response', async ({ page }) => {
     await page.route('**/api/users', (route) => {
       route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify([])
       });
     });
     
     await page.goto('/users');
     await expect(page.getByText('No users found')).toBeVisible();
   });
   \`\`\`

5. **Clean Up Routes**: For complex tests with multiple route handlers, clean up routes when done
   \`\`\`typescript
   test('complex test with multiple mocks', async ({ page }) => {
     await page.route('**/api/resource1', handler1);
     await page.route('**/api/resource2', handler2);
     
     // Test actions...
     
     // Clean up routes when done
     await page.unroute('**/api/resource1');
     await page.unroute('**/api/resource2');
   });
   \`\`\`
