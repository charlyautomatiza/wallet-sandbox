# Standards for Wallet Sandbox - Guide for Cursor AI

This file provides guidelines and rules for Cursor AI when working with the Wallet Sandbox project.

## Sections

1. [Change Management](#change-management)
2. [Next.js Standards](#nextjs-standards)
3. [Playwright Test Standards](#playwright-test-standards)

## Change Management

### User Story Validation

Before implementing any change:

1. **Verify task in backlog**:
   - Ask the user for the US/TT/BG ID (User Story, Technical Task, Bug)
   - Verify existence in the BACKLOG.md file or in GitHub Issues
   - If it doesn't exist, suggest creating a new task following the standard format

2. **Git workflow**:
   - Always start from the updated main branch
   ```bash
   git checkout main
   git pull origin main
   ```
   
   - Create branch with descriptive name
   ```bash
   git checkout -b feature/US-XXX-short-description
   ```
   
   - Use convention for commit messages
   ```bash
   git commit -m "[US-XXX] Concise description of the change"
   ```
   
   - Request confirmation before publishing changes
   ```bash
   git push origin feature/US-XXX-short-description
   ```
   
   - Create PR and include GitHub Copilot as reviewer
   - Prioritize and address Copilot suggestions

## Next.js Standards

### File Structure

```
app/
├── (auth)/login/page.tsx  # Route groups
├── transfer/[id]/page.tsx # Dynamic routes
├── actions.ts            # Server Actions
└── layout.tsx            # Layouts

components/
├── ui/                   # shadcn (do not modify)
├── layout/               # Structural components
└── features/             # Feature-specific components

store/
├── store.ts              # Redux configuration
└── slices/               # Slices by functionality
```

### Next.js 15 App Router Patterns

1. **Dynamic Routes**:
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // ALWAYS await params
  const { id } = await params
  
  // Implementation
}
```

2. **Server Actions**:
```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function serverAction(prevState: any, formData: FormData) {
  try {
    // Validation and processing
    revalidatePath('/relevant-path')
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'User-friendly error message' }
  }
}
```

3. **Client Components**:
```typescript
'use client'

import { useActionState } from 'react'

export function ClientComponent() {
  const [state, formAction, isPending] = useActionState(serverAction, null)
  
  // Implementation
}
```

### Component Structure

```typescript
'use client' // Only when necessary

interface Props {
  title: string
  amount: number
}

export function Component({ title, amount }: Props) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Handlers
  const handleClick = () => {}
  
  // 3. Early returns
  if (!title) return null
  
  // 4. Rendering
  return <div>{title}</div>
}
```

### Redux Toolkit Pattern

```typescript
// Slice
export const slice = createSlice({
  name: 'feature',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 }
  }
})

// Store
export const store = configureStore({
  reducer: { feature: slice.reducer }
})
```

## Playwright Test Standards

### Test Structure

- ALWAYS use TypeScript for all test files (.spec.ts)
- All Page Object Models MUST be placed in the `tests/pages` directory
- NEVER define Page Objects within test spec files
- Follow the Page Object Model pattern for organizing tests
- Structure tests using the Arrange-Act-Assert pattern
- Use descriptive names for tests and functions

### Test Independence

- Each test MUST be completely independent and self-contained
- NEVER create tests that depend on other tests having run first
- Each test MUST create its own test data and state
- Tests MUST be executable in any order, including in isolation
- Each test MUST have a single responsibility (test ONE thing)
- For similar scenarios with different data, use parameterized tests

### Test Naming

- Test names MUST be descriptive and explain the behavior being tested
- NEVER use numeric prefixes in test titles (e.g., "TC1:", "Test 2:", etc.)
- Test names should not imply any execution order
- Example: Use `test('User cannot login with invalid credentials')` instead of `test('TC2: User cannot login with invalid credentials')`

### Locator Preferences

1. Use role-based locators whenever possible:
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
```

2. Use test IDs when role-based locators are insufficient:
```typescript
await page.getByTestId('submit-button').click();
```

3. Use text content as a last resort:
```typescript
await page.getByText('Welcome').isVisible();
```

4. Avoid CSS selectors and XPath when possible

### Page Object Implementation

Generate page objects following this pattern:
```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  readonly path = '/login';
  
  constructor(private page: Page) {}
  
  // Locators
  private get emailInput() { return this.page.getByRole('textbox', { name: 'Email' }); }
  private get passwordInput() { return this.page.getByRole('textbox', { name: 'Password' }); }
  private get loginButton() { return this.page.getByRole('button', { name: 'Login' }); }
  
  // Actions
  async goto() {
    await this.page.goto(this.path);
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Assertion Preferences

- Use built-in Playwright assertions
- Prefer auto-waiting assertions over manual waits
- Check visibility before interacting with elements

```typescript
// Preferred
await expect(page.getByText('Success')).toBeVisible();

// Avoid
await page.waitForTimeout(1000);
```

### API Mocking

Use Playwright's route handling to mock API responses:

```typescript
// Mock API responses
await page.route('**/api/endpoint', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ key: 'value' })
  });
});
```

Create test cases that use mocked API responses:
- Mock success responses for happy path tests
- Mock error responses to test error handling
- Mock empty responses to test edge cases
- Validate request payloads when testing form submissions
