import { Page } from '@playwright/test';

/**
 * HomePage Page Object Model - Represents the home page of the wallet application
 */
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Get the user greeting element
   */
  getUserGreeting() {
    return this.page.getByRole('heading', { level: 1, name: /Hola,/i });
  }

  /**
   * Get the balance label element
   */
  getBalanceLabel() {
    return this.page.getByRole('heading', { name: /Saldo disponible/i });
  }

  /**
   * Get the visible balance amount
   */
  getBalanceAmount() {
    return this.page.locator('text=$').first();
  }

  /**
   * Check if the wallet balance is visible
   * @returns Promise that resolves to true if the balance is visible (shows actual numbers), false if hidden (shows ****)
   */
  async isBalanceVisible() {
    const hiddenBalance = this.page.locator('text=$****');
    return !(await hiddenBalance.isVisible());
  }

  /**
   * Toggle balance visibility
   */
  async toggleBalanceVisibility() {
    // Note: In a real implementation, we would add data-testid="balance-toggle"
    // to the button in the actual application code
    await this.page.getByRole('button', { name: /hide|show/i }).click();
  }

  /**
   * Get cards section
   */
  getCardsSection() {
    // TODO: This is a temporary solution. In a real implementation, we would add 
    // data-testid="cards-section" to the container in the actual application code.
    // Then we would use: return this.page.getByTestId('cards-section');
    
    // Using xpath as a workaround until data-testid is implemented
    return this.page.getByRole('heading', { name: 'Mis Tarjetas' }).locator('xpath=../..');
  }

  /**
   * Get quick action buttons (Ingresar, Transferir)
   */
  getQuickActionButtons() {
    return this.page.getByRole('link', { name: /Ingresar|Transferir/i });
  }

  /**
   * Navigate to transfer page
   */
  async navigateToTransfer() {
    await this.page.getByRole('main').getByRole('link', { name: 'Transferir' }).click();
  }

  /**
   * Navigate to recharge page
   */
  async navigateToRecharge() {
    await this.page.getByRole('main').getByRole('link', { name: 'Ingresar' }).click();
  }

  /**
   * Get navigation menu item
   */
  getNavMenuItem(name: string) {
    return this.page.getByRole('link', { name });
  }
}
