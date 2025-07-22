import { test, expect } from "@playwright/test"
import { createTransferHelper } from "../../utils/transfer-helpers"

test.describe("Transfer Integration Tests", () => {
  test("should complete end-to-end transfer with localStorage persistence", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    // Step 1: Navigate to transfer page
    await transferHelper.navigateToTransfer()

    // Step 2: Search and select contact
    await transferHelper.searchContacts("María")
    await transferHelper.selectContact("contact_001")

    // Step 3: Verify contact details
    await transferHelper.verifyContactDetails("María González")

    // Step 4: Enter transfer amount
    await transferHelper.enterTransferAmount("7500")

    // Step 5: Verify balance display
    await transferHelper.verifyBalanceDisplay()

    // Step 6: Confirm transfer with comment
    await transferHelper.verifyTransferForm()
    await transferHelper.confirmTransfer("Pago de almuerzo")

    // Step 7: Verify success
    await transferHelper.verifyTransferSuccess("7.500", "María González")

    // Step 8: Verify transfer appears in history
    await transferHelper.verifyTransferInHistory("7.500", "María González")

    // Step 9: Test persistence by refreshing page
    await page.reload()
    await transferHelper.verifyTransferInHistory("7.500", "María González")
  })

  test("should handle multiple transfers to different contacts", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    // First transfer to María
    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_001")
    await transferHelper.enterTransferAmount("3000")
    await transferHelper.confirmTransfer("Primera transferencia")
    await transferHelper.verifyTransferSuccess("3.000", "María González")

    // Second transfer to Carlos
    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_002")
    await transferHelper.enterTransferAmount("5000")
    await transferHelper.confirmTransfer("Segunda transferencia")
    await transferHelper.verifyTransferSuccess("5.000", "Carlos Rodríguez")

    // Verify both transfers in history
    await page.goto("/")
    await expect(page.locator("text=Transferencia a María González")).toBeVisible()
    await expect(page.locator("text=Transferencia a Carlos Rodríguez")).toBeVisible()
  })

  test("should validate transfer limits and constraints", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_001")

    // Navigate to amount page
    await page.click('a[href*="/amount"]')

    // Test zero amount
    await transferHelper.verifyAmountValidation("0", false)

    // Test negative amount
    await transferHelper.verifyAmountValidation("-100", false)

    // Test valid amount
    await transferHelper.verifyAmountValidation("1000", true)

    // Test very large amount (should be disabled due to insufficient funds)
    await transferHelper.verifyAmountValidation("999999", false)
  })

  test("should maintain state during navigation", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_001")
    await transferHelper.enterTransferAmount("2000")

    // Navigate back and verify state is maintained
    await transferHelper.navigateBackInFlow()
    await expect(page).toHaveURL("/transfer/contact_001/amount")

    // Amount should still be there
    const amountInput = page.locator('input[type="number"]')
    await expect(amountInput).toHaveValue("2000")
  })

  test("should handle contact filtering correctly", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    await transferHelper.navigateToTransfer()

    // Test search functionality
    await transferHelper.searchContacts("Carlos")
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()
    await expect(page.locator("text=María González")).not.toBeVisible()

    // Clear search
    await page.locator('input[type="text"]').clear()
    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()

    // Test contact type toggle
    await transferHelper.toggleContactType(false) // No tiene Ualá
    await expect(page.locator("text=Ingresa los datos bancarios")).toBeVisible()

    await transferHelper.toggleContactType(true) // Tiene Ualá
    await expect(page.locator("text=CONTACTOS")).toBeVisible()
  })

  test("should display correct transfer history with formatting", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    // Make a transfer first
    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_001")
    await transferHelper.enterTransferAmount("12500")
    await transferHelper.confirmTransfer("Test history formatting")
    await transferHelper.verifyTransferSuccess("12.500", "María González")

    // Go to homepage and check history formatting
    await page.goto("/")

    // Verify transfer history section exists
    await expect(page.locator("text=Historial de Transferencias")).toBeVisible()

    // Verify formatted amount (should show as -$12.500)
    await expect(page.locator("text=-$12.500")).toBeVisible()

    // Verify contact name
    await expect(page.locator("text=Transferencia a María González")).toBeVisible()

    // Verify status
    await expect(page.locator("text=Completada")).toBeVisible()

    // Verify date formatting
    const today = new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
    await expect(page.locator(`text=${today}`)).toBeVisible()
  })

  test("should handle transfer errors gracefully", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    await transferHelper.navigateToTransfer()

    // Test with invalid contact ID
    await page.goto("/transfer/invalid_contact")

    // Should redirect or show error
    await expect(page).toHaveURL("/transfer")

    // Test with invalid amount page
    await page.goto("/transfer/contact_001/amount")
    await transferHelper.verifyAmountValidation("abc", false)
  })

  test("should update contact recent transfers after successful transfer", async ({ page }) => {
    const transferHelper = createTransferHelper(page)

    // Make a transfer
    await transferHelper.navigateToTransfer()
    await transferHelper.selectContact("contact_001")
    await transferHelper.enterTransferAmount("8000")
    await transferHelper.confirmTransfer("Update recent transfers test")
    await transferHelper.verifyTransferSuccess("8.000", "María González")

    // Go back to contact details
    await page.goto("/transfer/contact_001")

    // Verify the new transfer appears in recent transfers
    await expect(page.locator("text=$8.000")).toBeVisible()

    // Verify today's date appears
    const today = new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    })
    await expect(page.locator(`text=${today}`)).toBeVisible()
  })
})
