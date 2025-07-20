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
    await this.page.getByRole('button').filter({ has: this.page.locator('svg').first() }).click();
  }

  /**
   * Get cards section
   */
  getCardsSection() {
    return this.page.getByRole('heading', { name: 'Mis Tarjetas' }).locator('..').locator('..');
  }

  /**
   * Get quick action buttons (Ingresar, Transferir)
   */
  getQuickActionButtons() {
    return this.page.getByRole('link', { name: /Ingresar|Transferir/i });
  }
}
