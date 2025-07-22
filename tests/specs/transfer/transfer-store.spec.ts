import { test, expect } from "@playwright/test"

test.describe("Transfer Store Integration", () => {
  test("should update Redux store during transfer flow", async ({ page }) => {
    // Navigate to transfer page
    await page.goto("/transfer")

    // Select contact - this should update selectedContact in store
    await page.click('a[href="/transfer/contact_001"]')

    // Verify contact details are loaded from store
    await expect(page.locator("h1")).toContainText("María González")

    // Go to amount page
    await page.click('a[href="/transfer/contact_001/amount"]')

    // Enter amount - this should update amount in store
    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("4500")

    // Continue to confirmation
    await page.click('button:has-text("Continuar")')

    // Verify amount is displayed from store
    await expect(page.locator("text=$4.500")).toBeVisible()
    await expect(page.locator("text=a María González")).toBeVisible()

    // Add comment - this should update comment in store
    const commentTextarea = page.locator('textarea[name="comment"]')
    await commentTextarea.fill("Store integration test")

    // Submit transfer
    await page.click('button[type="submit"]:has-text("Transferir")')

    // Verify success page shows data from store
    await expect(page).toHaveURL("/transfer/contact_001/success")
    await expect(page.locator("text=Transferiste $4.500 a María González")).toBeVisible()
  })

  test("should persist store state across page navigation", async ({ page }) => {
    // Start transfer flow
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_002"]') // Carlos
    await page.click('a[href="/transfer/contact_002/amount"]')

    // Enter amount
    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("6000")

    // Navigate away and back
    await page.goto("/")
    await page.goto("/transfer/contact_002/confirm")

    // Store should maintain the amount
    await expect(page.locator("text=$6.000")).toBeVisible()
    await expect(page.locator("text=a Carlos Rodríguez")).toBeVisible()
  })

  test("should clear store state after successful transfer", async ({ page }) => {
    // Complete a transfer
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_001"]')
    await page.click('a[href="/transfer/contact_001/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("3500")
    await page.click('button:has-text("Continuar")')

    await page.click('button[type="submit"]:has-text("Transferir")')

    // Wait for success
    await expect(page).toHaveURL("/transfer/contact_001/success")

    // Start new transfer - store should be cleared
    await page.goto("/transfer/contact_002/amount")

    // Amount input should be empty
    const newAmountInput = page.locator('input[type="number"]')
    await expect(newAmountInput).toHaveValue("")
  })

  test("should handle store errors gracefully", async ({ page }) => {
    // Test with invalid contact ID
    await page.goto("/transfer/invalid_contact/amount")

    // Should handle gracefully (redirect or show error)
    await expect(page).toHaveURL("/transfer")

    // Test with missing amount
    await page.goto("/transfer/contact_001/confirm")

    // Should redirect to amount page or transfer list
    await expect(page).toHaveURL(/\/transfer/)
  })

  test("should update transfer history in store after successful transfer", async ({ page }) => {
    // Complete a transfer
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_003"]') // Ana
    await page.click('a[href="/transfer/contact_003/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("9500")
    await page.click('button:has-text("Continuar")')

    const commentTextarea = page.locator('textarea[name="comment"]')
    await commentTextarea.fill("History update test")

    await page.click('button[type="submit"]:has-text("Transferir")')

    // Wait for success
    await expect(page).toHaveURL("/transfer/contact_003/success")

    // Go to homepage and verify history is updated
    await page.goto("/")

    // Transfer should appear in history
    await expect(page.locator("text=Transferencia a Ana Martínez")).toBeVisible()
    await expect(page.locator("text=-$9.500")).toBeVisible()
    await expect(page.locator("text=Completada")).toBeVisible()
  })

  test("should maintain contact list in store", async ({ page }) => {
    // Navigate to transfer page
    await page.goto("/transfer")

    // Verify contacts are loaded from store
    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()
    await expect(page.locator("text=Ana Martínez")).toBeVisible()

    // Search should filter contacts in store
    const searchInput = page.locator('input[type="text"]')
    await searchInput.fill("María")

    await expect(page.locator("text=María González")).toBeVisible()
    await expect(page.locator("text=Carlos Rodríguez")).not.toBeVisible()

    // Clear search should restore all contacts
    await searchInput.clear()
    await expect(page.locator("text=Carlos Rodríguez")).toBeVisible()
  })
})
