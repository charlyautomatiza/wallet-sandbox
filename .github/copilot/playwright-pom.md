# Playwright Page Object Model (POM) Standards

## Page Object Structure

- Each page/component MUST have its own Page Object class in the `tests/pages` directory
- NEVER define Page Objects within test files, as this prevents reuse
- ALWAYS use TypeScript for Page Objects
- Page objects should encapsulate the UI elements and actions
- Use protected properties for locators
- Use public methods for actions
- Include validation methods in page objects

## Sample Page Object

\`\`\`typescript
// File: tests/pages/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  // Page URL
  readonly path = '/login';
  
  // Constructor
  constructor(private page: Page) {}
  
  // Locators
  private get emailInput() { return this.page.getByRole('textbox', { name: 'Email' }); }
  private get passwordInput() { return this.page.getByRole('textbox', { name: 'Password' }); }
  private get loginButton() { return this.page.getByRole('button', { name: 'Login' }); }
  private get errorMessage() { return this.page.getByRole('alert'); }
  
  // Actions
  async goto() {
    await this.page.goto(this.path);
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  
  // Validations
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
  
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}
\`\`\`

## Using Page Objects in Tests

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  
  // Additional assertions
});

test('invalid credentials show error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('invalid@example.com', 'wrongpassword');
  
  expect(await loginPage.isErrorVisible()).toBeTruthy();
  expect(await loginPage.getErrorText()).toContain('Invalid credentials');
});
\`\`\`

## Component Objects

For reusable UI components, create component objects:

\`\`\`typescript
// HeaderComponent.ts
import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  private readonly root: Locator;
  
  constructor(page: Page) {
    this.root = page.getByRole('navigation');
  }
  
  get logo() { return this.root.getByRole('link', { name: 'Logo' }); }
  get profileMenu() { return this.root.getByRole('button', { name: 'Profile' }); }
  
  async navigateToHome() {
    await this.logo.click();
  }
  
  async openProfileMenu() {
    await this.profileMenu.click();
  }
}
\`\`\`
