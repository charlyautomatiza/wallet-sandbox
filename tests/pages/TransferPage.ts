import { Page, Locator } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto() {
    await this.page.goto('/transfer');
  }

  // Tab Controls
  getHasWalletTabButton(): Locator {
    // Use first() to handle potential duplicates and be more specific
    return this.page.locator('button').filter({ hasText: 'Tiene Ualá' }).first();
  }

  getNoWalletTabButton(): Locator {
    // Use first() to handle potential duplicates and be more specific
    return this.page.locator('button').filter({ hasText: 'No tiene Ualá' }).first();
  }

  // Search Functionality
  getSearchInput(): Locator {
    return this.page.getByPlaceholder('Nombre de usuario');
  }

  async searchContact(contactName: string) {
    await this.getSearchInput().fill(contactName);
  }

  // Contact Selection
  async selectContact(contactName: string) {
    await this.page.getByRole('link').filter({ hasText: contactName }).click();
  }

  getContactItem(contactName: string): Locator {
    return this.page.getByRole('link').filter({ hasText: contactName });
  }

  // Transfer Actions
  getTransferButton(): Locator {
    // The button has an aria-label "Enviar dinero a [name]" and text "Enviar plata"
    return this.page.getByRole('button').filter({ hasText: 'Enviar plata' });
  }

  getContinueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continuar' });
  }

  getConfirmButton(): Locator {
    return this.page.getByRole('button', { name: 'Confirmar' });
  }

  // Amount Input (on amount page)
  getAmountInput(): Locator {
    return this.page.getByLabel('Monto a transferir');
  }

  async enterAmount(amount: string) {
    await this.getAmountInput().fill(amount);
  }

  // Transfer Details on Confirmation Screen
  getTransferDetails() {
    return {
      recipientName: this.page.getByTestId('recipient-name'),
      amount: this.page.getByTestId('transfer-amount'),
      fee: this.page.getByTestId('transfer-fee'),
      total: this.page.getByTestId('transfer-total')
    };
  }

  // Messages
  getSuccessMessage(): Locator {
    return this.page.getByText('Transferencia exitosa');
  }

  getErrorMessage(): Locator {
    return this.page.getByRole('alert');
  }

  // Contact Information Display
  getContactName(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  getContactInitials(): Locator {
    return this.page.locator('.bg-white.rounded-full');
  }

  // Recent Transfers
  getRecentTransfersList(): Locator {
    return this.page.getByTestId('recent-transfers');
  }

  getRecentTransferItem(index: number): Locator {
    return this.page.locator('.border-b').nth(index);
  }

  // Navigation Actions
  async goBack() {
    await this.page.getByRole('link', { name: 'Volver' }).click();
  }

  async goToHome() {
    await this.page.getByRole('link', { name: 'Inicio' }).click();
  }

  // Validation Helpers
  async isHasWalletTabActive(): Promise<boolean> {
    const tabButton = this.getHasWalletTabButton();
    const classList = await tabButton.getAttribute('class');
    return classList?.includes('bg-white') || false;
  }

  async isNoWalletTabActive(): Promise<boolean> {
    const tabButton = this.getNoWalletTabButton();
    const classList = await tabButton.getAttribute('class');
    return classList?.includes('bg-white') || false;
  }

  // Wait for specific states
  async waitForContactsToLoad() {
    // Wait for contacts section to be present
    await this.page.locator('h2:has-text("CONTACTOS")').waitFor({ state: 'visible' });
  }

  async waitForTransferSuccess() {
    await this.getSuccessMessage().waitFor({ state: 'visible' });
  }
}