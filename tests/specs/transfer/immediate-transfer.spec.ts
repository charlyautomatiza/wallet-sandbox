import { test, expect } from '@playwright/test';
import { TransferPage } from '../../pages/TransferPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Immediate Transfer Flow', () => {
  
  test('should complete immediate transfer to wallet user successfully', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const transferPage = new TransferPage(page);
    const recipientName = 'María López';
    const transferAmount = '100';
    
    // Act - Navigate to home and then to transfers
    await homePage.goto();
    await page.getByRole('link', { name: /transferir/i }).click();
    
    // Complete the full transfer flow
    await transferPage.getWalletTabButton(true).click();
    await transferPage.searchContact(recipientName);
    await transferPage.selectContact(recipientName);
    await transferPage.getTransferButton().click();
    await transferPage.enterAmount(transferAmount);
    await transferPage.getContinueButton().click();
    
    // Assert - Verify confirmation page details
    const transferDetails = transferPage.getTransferDetails();
    await expect(transferDetails.recipientName).toContainText(recipientName);
    await expect(transferDetails.amount).toContainText(transferAmount);
    
    // Complete transfer
    await transferPage.getConfirmButton().click();
    
    // Verify success
    await expect(transferPage.getSuccessMessage()).toBeVisible();
    expect(page.url()).toContain('/success');
  });

  test('should validate minimum transfer amount', async ({ page }) => {
    // Arrange
    const transferPage = new TransferPage(page);
    const recipientName = 'Juan Pérez';
    const invalidAmount = '0.5'; // Assuming minimum is $1
    
    // Act - Start transfer process
    await transferPage.goto();
    await transferPage.selectContact(recipientName);
    await transferPage.getTransferButton().click();
    await transferPage.enterAmount(invalidAmount);
    await transferPage.getContinueButton().click();
    
    // Assert
    await expect(transferPage.getErrorMessage()).toBeVisible();
    await expect(transferPage.getErrorMessage()).toContainText('mínimo');
  });

  test('should validate maximum transfer amount', async ({ page }) => {
    // Arrange
    const transferPage = new TransferPage(page);
    const recipientName = 'Juan Pérez';
    const invalidAmount = '100000'; // Assuming maximum is less than this
    
    // Act - Start transfer process
    await transferPage.goto();
    await transferPage.selectContact(recipientName);
    await transferPage.getTransferButton().click();
    await transferPage.enterAmount(invalidAmount);
    await transferPage.getContinueButton().click();
    
    // Assert
    await expect(transferPage.getErrorMessage()).toBeVisible();
    await expect(transferPage.getErrorMessage()).toContainText('máximo');
  });

  test('should show confirmation screen with correct transfer details', async ({ page }) => {
    // Arrange
    const transferPage = new TransferPage(page);
    const recipientName = 'Juan Pérez';
    const transferAmount = '500';
    
    // Act - Complete transfer until confirmation screen
    await transferPage.goto();
    await transferPage.selectContact(recipientName);
    await transferPage.getTransferButton().click();
    await transferPage.enterAmount(transferAmount);
    await transferPage.getContinueButton().click();
    
    // Assert - Verify all details on confirmation screen
    const transferDetails = transferPage.getTransferDetails();
    await expect(transferDetails.recipientName).toContainText(recipientName);
    await expect(transferDetails.amount).toContainText(transferAmount);
    await expect(transferDetails.fee).toBeVisible();
    expect(page.url()).toContain('/confirm');
  });

  test('should be able to transfer to non-wallet user', async ({ page }) => {
    // Arrange
    const transferPage = new TransferPage(page);
    const recipientName = 'Pedro Gómez'; // Non-wallet user
    const transferAmount = '200';
    
    // Act - Complete transfer to non-wallet user
    await transferPage.goto();
    await transferPage.getWalletTabButton(false).click();
    await transferPage.searchContact(recipientName);
    await transferPage.selectContact(recipientName);
    await transferPage.getTransferButton().click();
    await transferPage.enterAmount(transferAmount);
    await transferPage.getContinueButton().click();
    await transferPage.getConfirmButton().click();
    
    // Assert
    await expect(transferPage.getSuccessMessage()).toBeVisible();
  });
});
