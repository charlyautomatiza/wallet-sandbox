# Playwright API Testing Standards

## API Test Structure

- Store API tests in a separate directory (`tests/api/`)
- Group API tests by resource or endpoint
- Use request fixtures for common API operations
- Mock API responses for frontend testing when appropriate

## API Request Handling

```typescript
import { test, expect } from '@playwright/test';

test('API should return user data', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data.name).toBe('John Doe');
  expect(data.email).toContain('@example.com');
});
```

## API Authentication

```typescript
import { test as base, expect } from '@playwright/test';

// Create a fixture for authenticated requests
const test = base.extend({
  authenticatedRequest: async ({ request }, use) => {
    // Get authentication token
    const loginResponse = await request.post('/api/login', {
      data: {
        username: 'testuser',
        password: 'testpass'
      }
    });
    const { token } = await loginResponse.json();
    
    // Create a new request context with auth headers
    const authenticatedRequest = request.extend({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    await use(authenticatedRequest);
  }
});

// Use the authenticated request in tests
test('fetch protected resource', async ({ authenticatedRequest }) => {
  const response = await authenticatedRequest.get('/api/protected-resource');
  expect(response.status()).toBe(200);
});
```

## API Response Validation

Use strong typing for API responses:

```typescript
interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

test('API should return correctly typed user data', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.status()).toBe(200);
  
  const data = await response.json() as UserResponse;
  expect(typeof data.id).toBe('number');
  expect(typeof data.name).toBe('string');
  expect(typeof data.email).toBe('string');
  expect(data.email).toMatch(/@.+\..+/); // Basic email format validation
});
```

## Mock API Responses

For frontend tests, mock API responses to isolate the UI:

```typescript
test('shows user profile with mocked API data', async ({ page }) => {
  // Mock the API response
  await page.route('**/api/users/*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      })
    });
  });
  
  // Navigate to page that calls this API
  await page.goto('/profile');
  
  // Verify the UI displays the mocked data
  await expect(page.getByText('Test User')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

## API Error Handling

Test API error scenarios:

```typescript
test('handle API error gracefully', async ({ page }) => {
  // Mock API error response
  await page.route('**/api/users/*', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' })
    });
  });
  
  // Navigate to page that calls this API
  await page.goto('/profile');
  
  // Verify error is displayed properly
  await expect(page.getByText('Something went wrong')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```
