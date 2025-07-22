import { Page } from '@playwright/test';

/**
 * TransferPage Page Object Model - Represents the transfer flow pages
 */
export class TransferPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the transfer page
   */
  async goto() {
    await this.page.goto('/transfer');
  }

  /**
   * Get the tab button to filter contacts by wallet membership
   * @param hasWallet - true for users with wallet, false for users without
   */
  getWalletTabButton(hasWallet: boolean) {
    return hasWallet 
      ? this.page.getByRole('button', { name: /Tiene wallet/i })
      : this.page.getByRole('button', { name: /No tiene wallet/i });
  }

  /**
   * Get the search input field
   */
  getSearchInput() {
    return this.page.getByPlaceholder('Buscar contactos');
  }

  /**
   * Search for a contact
   * @param name - Name of the contact to search for
   */
  async searchContact(name: string) {
    await this.getSearchInput().fill(name);
  }

  /**
   * Get a contact by name
   * @param name - Name of the contact to find
   */
  getContact(name: string) {
    return this.page.getByText(name, { exact: false }).first();
  }

  /**
   * Select a contact by name
   * @param name - Name of the contact to select
   */
  async selectContact(name: string) {
    await this.getContact(name).click();
  }

  /**
   * Get the transfer button on the contact details page
   */
  getTransferButton() {
    return this.page.getByRole('link', { name: /Transferir/i });
  }

  /**
   * Get the amount input field
   */
  getAmountInput() {
    return this.page.locator('input[inputmode="numeric"]');
  }

  /**
   * Enter transfer amount
   * @param amount - Amount to transfer
   */
  async enterAmount(amount: string) {
    await this.getAmountInput().fill(amount);
  }

  /**
   * Get the continue button on the amount page
   */
  getContinueButton() {
    return this.page.getByRole('button', { name: /Continuar/i });
  }

  /**
   * Get the confirm button on the confirmation page
   */
  getConfirmButton() {
    return this.page.getByRole('button', { name: /Confirmar transferencia/i });
  }

  /**
   * Get the success message on the success page
   */
  getSuccessMessage() {
    return this.page.getByText('Transferencia exitosa');
  }

  /**
   * Complete a transfer flow
   * @param contactName - Name of the contact to transfer to
   * @param amount - Amount to transfer
   * @param hasWallet - Whether the contact has a wallet
   */
  async completeTransfer(contactName: string, amount: string, hasWallet = true) {
    await this.goto();
    
    if (!hasWallet) {
      await this.getWalletTabButton(false).click();
    }
    
    await this.searchContact(contactName);
    await this.selectContact(contactName);
    await this.getTransferButton().click();
    await this.enterAmount(amount);
    await this.getContinueButton().click();
    await this.getConfirmButton().click();
    
    // Wait for success message
    return this.getSuccessMessage();
  }

  /**
   * Get the transfer details on confirmation page
   */
  getTransferDetails() {
    return {
      recipientName: this.page.getByTestId('recipient-name'),
      amount: this.page.getByTestId('transfer-amount'),
      fee: this.page.getByTestId('transfer-fee')
    };
  }

  /**
   * Get any error message displayed during the transfer flow
   */
  getErrorMessage() {
    return this.page.getByText('Error', { exact: false }).first();
  }
}
