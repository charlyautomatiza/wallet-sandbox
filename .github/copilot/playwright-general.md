# Playwright Test Automation Standards

## General Guidelines

- Always use TypeScript for test files
- Follow the Page Object Model (POM) pattern for test organization
- Store test files in a `tests` or `e2e` directory at the root of the project
- Use descriptive test and function names that explain the behavior being tested
- Implement proper error handling with informative error messages
- Follow AAA pattern: Arrange, Act, Assert

## Test Independence Requirements

- Each test MUST be completely independent from other tests
- Tests MUST NOT rely on the state or result of previous tests
- Tests MUST be able to run in any order, including in isolation
- Each test MUST be self-contained with all necessary setup and data
- For example: A test that edits a resource must create that resource within the same test, not rely on a "creation" test to have run first

## Single Responsibility Principle

- Each test MUST verify ONE specific behavior or scenario
- NEVER combine multiple test cases or assertions for different features in one test
- If testing similar flows with different data, use data-driven testing patterns
- Keep tests focused and concise to make failures easier to diagnose

## Test Naming Conventions

- Use descriptive, action-oriented test names that clearly indicate what's being tested
- NEVER use numeric prefixes in test titles (e.g., "TC1:", "Test 2:", etc.)
- Test titles should not imply any execution order
- Focus on the behavior or requirement being tested

Examples:
```typescript
// ❌ BAD: Using numeric prefixes
test('TC1: User registration with valid data', async ({ page }) => { /* ... */ });

// ✅ GOOD: Descriptive titles
test('User can register with valid data', async ({ page }) => { /* ... */ });
test('System displays error for duplicate email during registration', async ({ page }) => { /* ... */ });
```

## Project Structure

```
├── tests/
│   ├── fixtures/     # Common test fixtures and helpers
│   ├── pages/        # Page Object Models
│   ├── utils/        # Utility functions and helpers
│   ├── data/         # Test data 
│   └── specs/        # Test specifications
│       ├── auth/     # Authentication tests
│       ├── payment/  # Payment flow tests
│       └── ...
```

## Test File Naming

- Use kebab-case for file names
- End test files with `.spec.ts`
- Name test files according to the feature being tested

Examples:
- `login-flow.spec.ts`
- `payment-processing.spec.ts`
- `account-management.spec.ts`
