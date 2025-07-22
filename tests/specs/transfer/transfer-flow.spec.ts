import { test, expect } from "@playwright/test"

test.describe("Transfer Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/")

    // Wait for the page to load
    await page.waitForLoadState("networkidle")
  })

  test("should complete full transfer flow successfully", async ({ page }) => {
    // Step 1: Navigate to transfer page from homepage
    await page.click('[data-testid="transfer-button"], a[href="/transfer"]')
    await expect(page).toHaveURL("/transfer")

    // Verify transfer page loaded
    await expect(page.locator("h1")).toContainText("Transferencias")

    // Step 2: Verify "Tiene Ualá" tab is selected by default
    const tieneUalaButton = page.locator('button:has-text("Tiene Ualá")')
    await expect(tieneUalaButton).toHaveClass(/bg-white/)

    // Step 3: Select a contact (María González)
    const mariaContact = page.locator('[data-testid="contact-contact_001"], a[href="/transfer/contact_001"]')
    await expect(mariaContact).toBeVisible()
    await mariaContact.click()

    // Step 4: Verify contact details page
    await expect(page).toHaveURL("/transfer/contact_001")
    await expect(page.locator("h1")).toContainText("María González")

    // Verify contact profile information
    await expect(page.locator(".text-2xl")).toContainText("María González")
    await expect(page.locator('[data-testid="contact-initials"], .text-2xl:has-text("MG")')).toBeVisible()

    // Step 5: Click "Enviar plata" button
    const sendMoneyButton = page.locator('a[href="/transfer/contact_001/amount"], button:has-text("Enviar plata")')
    await sendMoneyButton.click()

    // Step 6: Enter transfer amount
    await expect(page).toHaveURL("/transfer/contact_001/amount")
    await expect(page.locator("h1")).toContainText("Ingresá el monto a transferir")

    // Enter amount (5000)
    const amountInput = page.locator('input[type="number"], input[placeholder="0,00"]')
    await amountInput.fill("5000")

    // Verify available balance is shown
    await expect(page.locator("text=Disponible")).toBeVisible()

    // Click continue button
    const continueButton = page.locator('button:has-text("Continuar")')
    await expect(continueButton).toBeEnabled()
    await continueButton.click()

    // Step 7: Confirm transfer details
    await expect(page).toHaveURL("/transfer/contact_001/confirm")
    await expect(page.locator("h1")).toContainText("Vas a transferir")

    // Verify transfer amount and recipient
    await expect(page.locator("text=$5.000")).toBeVisible()
    await expect(page.locator("text=a María González")).toBeVisible()

    // Verify bank information
    await expect(page.locator("text=UALÁ")).toBeVisible()
    await expect(page.locator("text=Varios")).toBeVisible()

    // Add a comment (optional)
    const commentTextarea = page.locator('textarea[name="comment"], textarea[placeholder*="comentario"]')
    await commentTextarea.fill("Pago de cena")

    // Step 8: Submit transfer
    const transferButton = page.locator('button[type="submit"]:has-text("Transferir")')
    await expect(transferButton).toBeEnabled()
    await transferButton.click()

    // Wait for processing
    await expect(page.locator('button:has-text("Procesando")')).toBeVisible()

    // Step 9: Verify success page
    await expect(page).toHaveURL("/transfer/contact_001/success")
    await expect(page.locator("h1")).toContainText("¡Transferencia exitosa!")

    // Verify success details
    await expect(page.locator("text=Transferiste $5.000 a María González")).toBeVisible()
    await expect(page.locator("text=Completada")).toBeVisible()

    // Verify action buttons are present
    await expect(page.locator('button:has-text("Compartir")')).toBeVisible()
    await expect(page.locator('button:has-text("Descargar")')).toBeVisible()

    // Step 10: Return to homepage
    const backToHomeButton = page.locator('a[href="/"], button:has-text("Volver al inicio")')
    await backToHomeButton.click()

    // Verify we're back on homepage
    await expect(page).toHaveURL("/")

    // Step 11: Verify transfer appears in history
    const transferHistory = page.locator('[data-testid="transfer-history"]')
    await expect(transferHistory).toBeVisible()

    // Look for the recent transfer in the history
    await expect(page.locator("text=Transferencia a María González")).toBeVisible()
    await expect(page.locator("text=-$5.000")).toBeVisible()
  })

  test("should handle insufficient funds error", async ({ page }) => {
    // Navigate to transfer page
    await page.goto("/transfer")

    // Select a contact
    await page.click('a[href="/transfer/contact_001"]')

    // Go to amount page
    await page.click('a[href="/transfer/contact_001/amount"]')

    // Enter amount higher than available balance
    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("999999")

    // Try to continue
    const continueButton = page.locator('button:has-text("Continuar")')

    // Button should be disabled for insufficient funds
    await expect(continueButton).toBeDisabled()
  })

  test("should validate required fields", async ({ page }) => {
    // Navigate to transfer page
    await page.goto("/transfer")

    // Select a contact
    await page.click('a[href="/transfer/contact_001"]')

    // Go to amount page
    await page.click('a[href="/transfer/contact_001/amount"]')

    // Try to continue without entering amount
    const continueButton = page.locator('button:has-text("Continuar")')
    await expect(continueButton).toBeDisabled()

    // Enter zero amount
    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("0")

    // Button should still be disabled
    await expect(continueButton).toBeDisabled()
  })

  test("should allow navigation back through transfer flow", async ({ page }) => {
    // Complete flow up to confirmation page
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_001"]')
    await page.click('a[href="/transfer/contact_001/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("1000")

    await page.click('button:has-text("Continuar")')

    // From confirmation page, go back to amount page
    await page.click('a[href="/transfer/contact_001/amount"]')
    await expect(page).toHaveURL("/transfer/contact_001/amount")

    // From amount page, go back to contact details
    await page.click('a[href="/transfer/contact_001"]')
    await expect(page).toHaveURL("/transfer/contact_001")

    // From contact details, go back to transfer list
    await page.click('a[href="/transfer"]')
    await expect(page).toHaveURL("/transfer")
  })

  test("should filter contacts by search term", async ({ page }) => {
    await page.goto("/transfer")

    // Verify all contacts are visible initially
    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()

    // Search for specific contact
    const searchInput = page.locator('input[placeholder*="usuario"], input[type="text"]')
    await searchInput.fill("María")

    // Verify filtered results
    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).not.toBeVisible()

    // Clear search
    await searchInput.clear()

    // Verify all contacts are visible again
    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()
  })

  test('should toggle between "Tiene Ualá" and "No tiene Ualá" tabs', async ({ page }) => {
    await page.goto("/transfer")

    // Verify "Tiene Ualá" is selected by default
    const tieneUalaButton = page.locator('button:has-text("Tiene Ualá")')
    const noTieneUalaButton = page.locator('button:has-text("No tiene Ualá")')

    await expect(tieneUalaButton).toHaveClass(/bg-white/)

    // Click "No tiene Ualá" tab
    await noTieneUalaButton.click()
    await expect(noTieneUalaButton).toHaveClass(/bg-white/)

    // Verify contacts list changes (should show different UI for non-Ualá users)
    await expect(page.locator("text=Ingresa los datos bancarios")).toBeVisible()

    // Switch back to "Tiene Ualá"
    await tieneUalaButton.click()
    await expect(tieneUalaButton).toHaveClass(/bg-white/)

    // Verify contacts are visible again
    await expect(page.locator("text=CONTACTOS")).toBeVisible()
  })

  test("should display recent transfers for selected contact", async ({ page }) => {
    await page.goto("/transfer/contact_001")

    // Verify contact name
    await expect(page.locator("h1")).toContainText("María González")

    // Verify recent transfers section exists
    await expect(page.locator("text=Transferencia enviada")).toBeVisible()

    // Verify transfer amounts and dates are displayed
    await expect(page.locator("text=$15.000")).toBeVisible()
    await expect(page.locator("text=15/01")).toBeVisible()
  })

  test("should persist transfer data in localStorage", async ({ page }) => {
    // Complete a transfer
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_001"]')
    await page.click('a[href="/transfer/contact_001/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("2500")
    await page.click('button:has-text("Continuar")')

    const commentTextarea = page.locator('textarea[name="comment"]')
    await commentTextarea.fill("Test transfer")

    await page.click('button[type="submit"]:has-text("Transferir")')

    // Wait for success page
    await expect(page).toHaveURL("/transfer/contact_001/success")

    // Go back to homepage
    await page.click('a[href="/"]')

    // Refresh the page to test persistence
    await page.reload()

    // Verify transfer appears in history after refresh
    await expect(page.locator("text=Transferencia a María González")).toBeVisible()
    await expect(page.locator("text=-$2.500")).toBeVisible()
  })
})
