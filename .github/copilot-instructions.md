# Instructions for GitHub Copilot - Wallet Sandbox

This document contains instructions for GitHub Copilot when working with the Wallet Sandbox project. These instructions must be followed rigorously to maintain code quality and consistency.

## Main Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Redux Toolkit
- **Testing**: Playwright

## Instruction Sections

1. [Change Management](#change-management)
2. [Development Standards](#development-standards)
3. [Test Automation](#test-automation)

## Change Management

### Backlog Verification

Before implementing any code changes:

1. **Verify task existence**: Ask the user for the US/TT/BG (User Story, Technical Task, or Bug) they are implementing.
   
2. **If the task exists**:
   - Confirm it has a valid ID (format: US-XXX, TT-XXX, or BG-XXX)
   - Verify that the task description matches the requested change

3. **If the task doesn't exist**:
   - Recommend creating a new task
   - Help the user formulate an appropriate description following the standard User Story format:
     ```
     As a [role]
     I want [capability]
     So that [benefit]
     ```
   - Suggest relevant acceptance criteria

### Git Workflow

For any code modification, require the following flow:

1. **Start from updated main**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create working branch**:
   - Name format: `type/US-XXX-short-description`
   - Types: feature, bugfix, hotfix, refactor, chore
   ```bash
   git checkout -b feature/US-201-savings-goals
   ```

3. **Implement changes**:
   - Develop the required functionality
   - Follow all code standards

4. **Commit**:
   - Message format: `[US-XXX] Concise description`
   ```bash
   git add .
   git commit -m "[US-201] Implement savings goals creation"
   ```

5. **Review and Publication**:
   - Ask for user confirmation before publishing changes
   - Verify that the changes meet expectations
   ```bash
   git push origin feature/US-201-savings-goals
   ```

6. **Pull Request**:
   - Help create PR with appropriate title and description
   - Ensure Copilot is included as reviewer
   - Title format: `[US-XXX] Brief description`

7. **Review Management**:
   - List and prioritize Copilot's suggestions
   - Help the user implement necessary corrections

## Development Standards

### Next.js 15 App Router

- **Always** use App Router with the following practices:
  ```typescript
  // Dynamic routes - ALWAYS await params
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // Component logic
  }
  
  // Server Actions
  'use server'
  
  import { revalidatePath } from 'next/cache'
  
  export async function handleAction(prevState: any, formData: FormData) {
    try {
      // Validation and processing
      revalidatePath('/relevant-path')
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: 'User-friendly error message' }
    }
  }
  ```

- **Client Components** - Use only when necessary:
  ```typescript
  'use client'
  
  import { useActionState } from 'react'
  
  export function InteractiveComponent() {
    const [state, formAction, isPending] = useActionState(serverAction, null)
    // Component logic
  }
  ```

## Test Automation

### General Principles

1. **Use TypeScript exclusively**: Always generate tests with `.spec.ts` extension and Page Object Models with `.ts` extension.

2. **Follow the Page Object Model pattern**: 
   - Place all Page Objects in the `tests/pages` directory
   - Never define Page Objects within test specification files
   - Use methods in Page Objects to encapsulate page interactions

3. **Ensure test independence**:
   - Each test must be self-contained with its own setup
   - Never depend on other tests having run first
   - Tests must be executable in any order

4. **Maintain single responsibility**:
   - Each test should verify ONE specific behavior or scenario
   - Never group multiple test cases in a single test
   - Use parameterized tests for similar flows with different data

### TypeScript

- **Strict typing**:
  ```typescript
  // Define appropriate interfaces
  interface TransferData {
    amount: number
    recipientId: string
    description?: string
  }
  
  // Avoid 'any' - use appropriate types
  const handleTransfer = (data: TransferData): Promise<ApiResponse<Transfer>> => {
    // Implementation
  }
  ```

### Components

- **Component Structure**:
  ```typescript
  'use client' // Only when necessary
  
  interface ComponentProps {
    title: string
    amount: number
    onConfirm: () => void
    className?: string
  }
  
  export function ComponentName({
    title,
    amount,
    onConfirm,
    className
  }: ComponentProps) {
    // 1. Hooks first
    const [loading, setLoading] = useState(false)
    
    // 2. Event handlers
    const handleConfirmation = async () => {
      setLoading(true)
      try {
        await onConfirm()
      } finally {
        setLoading(false)
      }
    }
    
    // 3. Early returns
    if (!title) return null
    
    // 4. Main rendering
    return (
      <Card className={cn("p-6", className)}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-2xl font-bold mb-6">${amount.toFixed(2)}</p>
        <Button 
          onClick={handleConfirmation} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </Card>
    )
  }
  ```

## Test Structure and Naming

1. **Use descriptive names**:
   - Names should clearly describe the behavior being tested
   - Never use numeric prefixes (e.g., "TC1:", "Test 2:")
   - Use action-oriented descriptions

2. **Structure using the AAA pattern** (Arrange-Act-Assert):
   ```typescript
   test('user can add item to cart', async ({ page }) => {
     // Arrange
     await page.goto('/products');
     
     // Act
     await page.getByText('Add to cart').click();
     
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
