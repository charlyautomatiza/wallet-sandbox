import { test, expect } from '@playwright/test';
import { TransferPage } from '../../pages/TransferPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Wallet Contact Transfer Tests', () => {
  let transferPage: TransferPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    // Set mobile viewport for wallet app testing
    await page.setViewportSize({ width: 375, height: 667 });
    
    transferPage = new TransferPage(page);
    homePage = new HomePage(page);
    
    // Navigate to transfer page
    await homePage.goto();
    await homePage.navigateToTransfer();
  });

  test('should navigate to transfer page and display wallet contacts correctly', async ({ page }) => {
    // Assert - Verify we're on transfer page with correct elements
    await expect(page.getByRole('heading', { name: 'Transferencias' })).toBeVisible();
    await expect(transferPage.getHasWalletTabButton()).toBeVisible();
    await expect(transferPage.getNoWalletTabButton()).toBeVisible();
    await expect(transferPage.getSearchInput()).toBeVisible();
    
    // Verify wallet tab is active by default
    await expect(transferPage.getHasWalletTabButton()).toHaveClass(/bg-white/);
    
    // Verify contacts are displayed
    await transferPage.waitForContactsToLoad();
    await expect(page.getByRole('link').filter({ hasText: 'Elyer Saitest' })).toBeVisible();
    await expect(page.getByRole('link').filter({ hasText: 'Pato Free Range' })).toBeVisible();
  });

  test('should be able to search and filter wallet contacts', async ({ page }) => {
    // Arrange
    await transferPage.waitForContactsToLoad();
    
    // Act - Search for specific contact
    await transferPage.searchContact('Elyer');
    
    // Assert - Verify filtering works
    await expect(page.getByRole('link').filter({ hasText: 'Elyer Saitest' })).toBeVisible();
  });

  test('should navigate to contact details when selecting a contact', async ({ page }) => {
    // Arrange
    await transferPage.waitForContactsToLoad();
    
    // Act - Select a contact
    await transferPage.selectContact('Elyer Saitest');
    
    // Assert - Verify we're on contact details page
    await expect(page.getByRole('heading', { name: 'Elyer Saitest' })).toBeVisible();
    await expect(transferPage.getTransferButton()).toBeVisible();
    
    // Verify contact details are displayed
    await expect(page.getByText('ES').first()).toBeVisible(); // Contact initials
    await expect(page.getByText('Transferencia enviada').first()).toBeVisible(); // Transfer history
  });

  test('should navigate to amount entry from contact details', async ({ page }) => {
    // Arrange
    await transferPage.waitForContactsToLoad();
    await transferPage.selectContact('Elyer Saitest');
    
    // Act - Click transfer button
    await transferPage.getTransferButton().click();
    
    // Assert - Verify we're on amount entry page
    await expect(page.getByRole('heading', { name: 'Ingresá el monto a transferir' })).toBeVisible();
    await expect(transferPage.getAmountInput()).toBeVisible();
    await expect(transferPage.getContinueButton()).toBeVisible();
  });

  test('should be able to enter transfer amount', async ({ page }) => {
    // Arrange
    const testAmount = '100';
    await transferPage.waitForContactsToLoad();
    await transferPage.selectContact('Elyer Saitest');
    await transferPage.getTransferButton().click();
    
    // Act - Enter amount
    await transferPage.enterAmount(testAmount);
    
    // Assert - Verify amount is entered correctly
    await expect(transferPage.getAmountInput()).toHaveValue(testAmount);
    
    // Verify continue button is available
    await expect(transferPage.getContinueButton()).toBeVisible();
  });

  test('should switch between wallet and non-wallet tabs', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('button:has-text("Tiene Ualá")', { state: 'visible' });
    
    // Assert - Initially wallet tab should be active
    const hasWalletButton = page.locator('button:has-text("Tiene Ualá")').first();
    const noWalletButton = page.locator('button:has-text("No tiene Ualá")').first();
    
    await expect(hasWalletButton).toHaveClass(/bg-white/);
    
    // Act - Switch to non-wallet tab
    await noWalletButton.click();
    
    // Wait for state change
    await page.waitForTimeout(100);
    
    // Assert - Non-wallet tab should now be active
    await expect(noWalletButton).toHaveClass(/bg-white/);
    await expect(hasWalletButton).not.toHaveClass(/bg-white/);
    
    // Act - Switch back to wallet tab
    await hasWalletButton.click();
    
    // Wait for state change
    await page.waitForTimeout(100);
    
    // Assert - Wallet tab should be active again
    await expect(hasWalletButton).toHaveClass(/bg-white/);
    await expect(noWalletButton).not.toHaveClass(/bg-white/);
  });

  test('should display contact information correctly', async ({ page }) => {
    // Arrange
    await transferPage.waitForContactsToLoad();
    
    // Assert - Verify first contact has proper structure
    const firstContact = page.getByRole('link').filter({ hasText: 'Elyer Saitest' });
    await expect(firstContact).toBeVisible();
    
    // Verify contact has initials
    await expect(firstContact.getByText('ES').first()).toBeVisible();
    
    // Verify contact has name
    await expect(firstContact).toContainText('Elyer Saitest');
  });

  test('should navigate back from contact details to transfer list', async ({ page }) => {
    // Arrange
    await transferPage.waitForContactsToLoad();
    await transferPage.selectContact('Elyer Saitest');
    
    // Verify we're on contact details
    await expect(page.getByRole('heading', { name: 'Elyer Saitest' })).toBeVisible();
    
    // Act - Navigate back
    await transferPage.goBack();
    
    // Assert - Verify we're back on transfer list
    await expect(page.getByRole('heading', { name: 'Transferencias' })).toBeVisible();
    await expect(transferPage.getSearchInput()).toBeVisible();
  });

  test('should handle empty search results appropriately', async ({ page }) => {
    // Arrange
    const nonExistentContact = 'Usuario Inexistente';
    
    // Act
    await transferPage.searchContact(nonExistentContact);
    
    // Assert - Verify no contacts are shown for invalid search
    await expect(transferPage.getContactItem(nonExistentContact)).not.toBeVisible();
    
    // Verify search input still contains the search term
    await expect(transferPage.getSearchInput()).toHaveValue(nonExistentContact);
  });
});
