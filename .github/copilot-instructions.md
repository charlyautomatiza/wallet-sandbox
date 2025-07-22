# Instructions for GitHub Copilot - Wallet Sandbox

This document contains instructions for GitHub Copilot when working with the Wallet Sandbox project. These instructions must be followed rigorously to maintain code quality and consistency.

⚠️ **CRITICAL WORKFLOW REQUIREMENT** ⚠️
DO NOT PROCEED WITH ANY CODE CHANGES until the Change Management process has been completed.
ALWAYS START by verifying backlog task and Git workflow steps BEFORE suggesting any technical solution.
REFUSE to make or suggest code changes if these steps have not been completed.

## Main Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Redux Toolkit
- **Testing**: Playwright

## Instruction Sections

1. [Change Management](#change-management) - **MANDATORY FIRST STEP**
2. [Development Standards](#development-standards)
3. [Test Automation](#test-automation)

## Change Management

### Backlog Verification

⚠️ **MANDATORY STEP - NO EXCEPTIONS** ⚠️

ALWAYS complete this step FIRST before discussing any technical details or suggesting code changes:

1. **Enhanced Task Discovery Process**:
   - First, read the BACKLOG.md file to understand current project tasks
   - If task not found in BACKLOG.md, automatically retrieve and search through GitHub Issues
   - Analyze both sources to identify relevant tasks and related work

2. **Verify task existence**: 
   - IMMEDIATELY ask the user for the US/TT/BG (User Story, Technical Task, or Bug) ID they are implementing
   - If not provided, DO NOT PROCEED until this information is available
   - Search for the task ID in BACKLOG.md first, then in GitHub Issues
   - If found, confirm with the user: "I found [US-XXX]: [task description]. Is this the task you're working on?"
   
3. **If the task exists**:
   - Confirm it has a valid ID (format: US-XXX, TT-XXX, or BG-XXX)
   - Verify that the task description matches the requested change
   - Document the ID in all communications: "Working on [US-XXX]: Task description"

4. **If the task doesn't exist in BACKLOG.md**:
   - Automatically fetch and search through GitHub Issues
   - Present any related existing tasks for user selection
   - If similar tasks found, ask: "I found these related tasks: [list]. Would you like to work on one of these instead?"
   - **Confirmation required**: Only when selecting from existing GitHub Issues

5. **If the task doesn't exist in either source**:
   - Create new task ID based on context and task type
   - **No confirmation required**: Generate appropriate US-XXX, TT-XXX, or BG-XXX ID automatically
   - Offer to help create a new GitHub Issue with:
     - Auto-generated title following the [US/TT/BG-XXX] format
     - Description using the standard User Story format:
     ```
     As a [role]
     I want [capability]
     So that [benefit]
     ```
     - Suggested acceptance criteria and labels
   - Create the GitHub Issue using available tools
   - Proceed with the auto-generated task ID

### Git Workflow

⚠️ **MANDATORY WORKFLOW - NO EXCEPTIONS** ⚠️

AFTER verifying the task ID and BEFORE any code changes, verify and ensure the following Git workflow is followed:

1. **Start from updated main**:
   - CONFIRM with the user that they have executed:
   ```bash
   git checkout main
   git pull origin main
   ```
   - If not confirmed, DO NOT PROCEED until this step is completed.

2. **Create working branch**:
   - CONFIRM the branch name follows the format: `type/US-XXX-short-description`
   - Valid types: feature, bugfix, hotfix, refactor, chore
   - Example:
   ```bash
   git checkout -b feature/US-201-savings-goals
   ```
   - VERIFY the current branch matches this pattern before proceeding
   - If branch doesn't exist or doesn't follow the pattern, STOP and require its creation

3. **Only after confirming steps 1 and 2**:
   - Proceed with implementing changes
   - Follow all code standards

4. **Commit guidance**:
   - Require message format: `[US-XXX] Concise description`
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

2. **Prioritize Playwright MCP Tools**: 
   - For test automation tasks, ALWAYS prioritize the use of Playwright MCP tools when available
   - If Playwright MCP tools are not active, validate with the user to activate them
   - Guide users through MCP tool activation process when necessary
   - Use standard Playwright APIs only when MCP tools are unavailable

3. **Follow the Page Object Model pattern**: 
   - Place all Page Objects in the `tests/pages` directory
   - Never define Page Objects within test specification files
   - Use methods in Page Objects to encapsulate page interactions

4. **Ensure test independence**:
   - Each test must be self-contained with its own setup
   - Never depend on other tests having run first
   - Tests must be executable in any order

5. **Maintain single responsibility**:
   - Each test should verify ONE specific behavior or scenario
   - Never group multiple test cases in a single test
   - Use parameterized tests for similar flows with different data

### Test Validation and Bug Management

⚠️ **MANDATORY FOR TEST AUTOMATION TASKS** ⚠️

1. **Pre-Publication Validation**:
   - ALWAYS validate that tests execute successfully before publishing changes
   - Run the complete test suite to ensure no regressions
   - Verify test results meet the expected functionality requirements

2. **Application Error Detection**:
   - When application errors are detected during testing, suggest creating a GitHub Issue for the bug
   - Never ignore application errors or treat them as test failures
   - Categorize issues as bugs (BG-XXX format) for separate resolution

3. **Bug Issue Creation Process**:
   - Automatically offer to create GitHub Issues for detected application bugs
   - Include comprehensive information in bug reports:
     - Complete error logs
     - Screenshots of error states
     - Full Playwright execution report
     - Steps to reproduce
     - Environment details
   - Use standardized bug report template:
     ```
     ## Bug Description
     [Clear description of the issue]
     
     ## Steps to Reproduce
     1. [Step 1]
     2. [Step 2]
     3. [Step 3]
     
     ## Expected Behavior
     [What should happen]
     
     ## Actual Behavior
     [What actually happens]
     
     ## Test Evidence
     - Logs: [attached]
     - Screenshots: [attached]
     - Playwright Report: [attached]
     
     ## Environment
     - Browser: [browser version]
     - OS: [operating system]
     - Application Version: [if applicable]
     ```

4. **Error Documentation**:
   - Attach all relevant test artifacts to bug issues
   - Include full Playwright HTML reports when available
   - Provide trace files for complex interaction failures
   - Link test execution videos when helpful for reproduction

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

## Playwright MCP Integration

### MCP Tools Priority

⚠️ **MANDATORY FOR PLAYWRIGHT AUTOMATION** ⚠️

1. **Tool Verification**:
   - Before starting any Playwright automation task, verify MCP tools availability
   - If MCP tools are not active, guide the user through activation process
   - Provide clear instructions for enabling Playwright MCP extensions

2. **MCP Tool Activation Guide**:
   ```bash
   # Verify MCP tools are available
   # Check if Playwright MCP extension is installed and active
   # If not available, guide user to:
   # 1. Install required MCP extensions
   # 2. Configure VS Code settings
   # 3. Restart development environment if needed
   ```

3. **Fallback Strategy**:
   - Use standard Playwright APIs only when MCP tools are confirmed unavailable
   - Always inform the user about the benefits of using MCP tools
   - Suggest MCP tool activation for future test development

### Test Execution Workflow

1. **Development Phase**:
   - Design tests using MCP tools when available
   - Follow Page Object Model patterns
   - Implement comprehensive test coverage

2. **Pre-Publication Validation**:
   - Execute complete test suite before any code publication
   - Validate all tests pass successfully
   - Review test results for application errors vs. test issues

3. **Error Handling**:
   - Distinguish between test failures and application bugs
   - Create appropriate GitHub Issues for application defects
   - Document all findings with comprehensive evidence

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
     await page.getByText('Add to Cart').click();
     
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

## Documentation Updates

⚠️ **CRITICAL REQUIREMENT FOR RULE CHANGES** ⚠️

When making changes to these instructions or development rules:

1. **Synchronization Requirement**:
   - ALWAYS update both `.cursorrules` and `.github/copilot-instructions.md` simultaneously
   - Ensure consistency between both files
   - Document any differences if they exist for specific reasons

2. **Documentation Chain Updates**:
   - Update `BUILD_STANDARDS.md` to reflect any process changes
   - Update `PLAYWRIGHT_STANDARDS.md` for test-related changes  
   - Update `README.md` if the changes affect the development workflow

3. **Version Control**:
   - Include all updated files in the same commit
   - Reference the changes in commit messages
   - Use format: `[TT-XXX] Update development rules and documentation`

4. **Testing and Validation**:
   - Validate that both AI assistants (Cursor and GitHub Copilot) can follow the updated rules
   - Test the workflows described in the documentation
   - Ensure examples and code snippets are accurate and up-to-date

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
