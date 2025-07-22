import { test, expect } from "@playwright/test"

test.describe("Transfer Performance Tests", () => {
  test("should load transfer page quickly", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/transfer")
    await expect(page.locator("h1")).toContainText("Transferencias")

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
  })

  test("should handle rapid navigation through transfer flow", async ({ page }) => {
    const startTime = Date.now()

    // Rapid navigation through entire flow
    await page.goto("/transfer")
    await page.click('a[href="/transfer/contact_001"]')
    await page.click('a[href="/transfer/contact_001/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("1500")
    await page.click('button:has-text("Continuar")')

    await page.click('button[type="submit"]:has-text("Transferir")')
    await expect(page).toHaveURL("/transfer/contact_001/success")

    const totalTime = Date.now() - startTime
    expect(totalTime).toBeLessThan(10000) // Complete flow within 10 seconds
  })

  test("should handle multiple concurrent transfers efficiently", async ({ page }) => {
    // Simulate multiple transfer attempts
    const transfers = [
      { contactId: "contact_001", amount: "1000" },
      { contactId: "contact_002", amount: "2000" },
      { contactId: "contact_003", amount: "3000" },
    ]

    for (const transfer of transfers) {
      const startTime = Date.now()

      await page.goto("/transfer")
      await page.click(`a[href="/transfer/${transfer.contactId}"]`)
      await page.click(`a[href="/transfer/${transfer.contactId}/amount"]`)

      const amountInput = page.locator('input[type="number"]')
      await amountInput.fill(transfer.amount)
      await page.click('button:has-text("Continuar")')

      await page.click('button[type="submit"]:has-text("Transferir")')
      await expect(page).toHaveURL(`/transfer/${transfer.contactId}/success`)

      const transferTime = Date.now() - startTime
      expect(transferTime).toBeLessThan(8000) // Each transfer within 8 seconds
    }
  })

  test("should efficiently update localStorage during transfers", async ({ page }) => {
    // Monitor localStorage operations
    await page.goto("/transfer")

    // Check initial localStorage size
    const initialSize = await page.evaluate(() => {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length
        }
      }
      return total
    })

    // Complete a transfer
    await page.click('a[href="/transfer/contact_001"]')
    await page.click('a[href="/transfer/contact_001/amount"]')

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("2500")
    await page.click('button:has-text("Continuar")')

    await page.click('button[type="submit"]:has-text("Transferir")')
    await expect(page).toHaveURL("/transfer/contact_001/success")

    // Check localStorage size after transfer
    const finalSize = await page.evaluate(() => {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length
        }
      }
      return total
    })

    // Storage should have increased but not excessively
    expect(finalSize).toBeGreaterThan(initialSize)
    expect(finalSize - initialSize).toBeLessThan(10000) // Less than 10KB increase
  })

  test("should render transfer history efficiently", async ({ page }) => {
    // Add multiple transfers to history first
    const transfers = Array.from({ length: 5 }, (_, i) => ({
      contactId: "contact_001",
      amount: `${1000 + i * 500}`,
    }))

    for (const transfer of transfers) {
      await page.goto("/transfer")
      await page.click(`a[href="/transfer/${transfer.contactId}"]`)
      await page.click(`a[href="/transfer/${transfer.contactId}/amount"]`)

      const amountInput = page.locator('input[type="number"]')
      await amountInput.fill(transfer.amount)
      await page.click('button:has-text("Continuar")')

      await page.click('button[type="submit"]:has-text("Transferir")')
      await expect(page).toHaveURL(`/transfer/${transfer.contactId}/success`)
    }

    // Test history rendering performance
    const startTime = Date.now()
    await page.goto("/")

    // Wait for transfer history to load
    await expect(page.locator("text=Historial de Transferencias")).toBeVisible()
    await expect(page.locator("text=Transferencia a María González")).toBeVisible()

    const renderTime = Date.now() - startTime
    expect(renderTime).toBeLessThan(5000) // History should render within 5 seconds
  })
})
