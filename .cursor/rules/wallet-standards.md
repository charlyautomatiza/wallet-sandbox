# Standards for Wallet Sandbox - Guide for Cursor AI

This file provides guidelines and rules for Cursor AI when working with the Wallet Sandbox project.

⚠️ **CRITICAL WORKFLOW REQUIREMENT** ⚠️
DO NOT PROCEED WITH ANY CODE CHANGES until the Change Management process has been completed.
ALWAYS START by verifying backlog task and Git workflow steps BEFORE suggesting any technical solution.
REFUSE to make or suggest code changes if these steps have not been completed.

## Sections

1. [Change Management](#change-management) - MANDATORY FIRST STEP
2. [Next.js Standards](#nextjs-standards)
3. [Playwright Test Standards](#playwright-test-standards)

## Change Management

### User Story Validation

⚠️ **MANDATORY STEP - NO EXCEPTIONS** ⚠️

ALWAYS complete this step FIRST before discussing any technical details or suggesting code changes:

1. **Read and analyze available backlog**:
   - First, read the BACKLOG.md file to understand current project tasks
   - Retrieve a list of active tasks from GitHub Issues
   - Analyze these sources to identify relevant tasks

2. **Verify task in backlog**:
   - IMMEDIATELY ask the user for the US/TT/BG ID (User Story, Technical Task, Bug)
   - If not provided, DO NOT PROCEED until this information is available
   - Search for the task ID in BACKLOG.md and GitHub Issues
   - If found, confirm with the user: "I found [US-XXX]: [task description]. Is this the task you're working on?"
   - Document the ID in all communications: "Working on [US-XXX]: Task description"
   
3. **Create task if none exists**:
   - If it doesn't exist, STOP and inform the user: "I couldn't find a matching task in the backlog or GitHub Issues."
   - Help the user create a new task in GitHub Issues with:
     - Appropriate title following the [US/TT/BG-XXX] format
     - Description using the standard User Story format
     - Suggested acceptance criteria
   - Require the user to confirm the new task ID has been created before proceeding

2. **Git workflow**:
   ⚠️ **MANDATORY WORKFLOW - NO EXCEPTIONS** ⚠️
   
   AFTER verifying the task ID and BEFORE any code changes:
   
   - CONFIRM with the user that they have executed:
   ```bash
   git checkout main
   git pull origin main
   ```
   - If not confirmed, DO NOT PROCEED until this step is completed.
   
   - CONFIRM the branch name follows the format: `type/US-XXX-short-description`
   - Valid types: feature, bugfix, hotfix, refactor, chore
   ```bash
   git checkout -b feature/US-XXX-short-description
   ```
   - VERIFY the current branch matches this pattern before proceeding
   - If branch doesn't exist or doesn't follow the pattern, STOP and require its creation
   
   - Only after confirming the steps above, proceed with implementing changes
   
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
