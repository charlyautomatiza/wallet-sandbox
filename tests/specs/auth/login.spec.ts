import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page', () => {
  test('should load the home page and display user greeting', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    
    // Act
    await homePage.goto();
    
    // Assert - Verificamos elementos clave de la página
    await expect(homePage.getUserGreeting()).toBeVisible();
    await expect(homePage.getBalanceLabel()).toBeVisible();
  });

  test('should display quick action buttons', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    
    // Act
    await homePage.goto();
    
    // Assert
    const quickActionButtons = homePage.getQuickActionButtons();
    await expect(quickActionButtons.first()).toBeVisible();
    await expect(quickActionButtons.nth(1)).toBeVisible();
  });

  test('should show cards section', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    
    // Act
    await homePage.goto();
    
    // Assert
    await expect(homePage.getCardsSection()).toBeVisible();
  });
});
