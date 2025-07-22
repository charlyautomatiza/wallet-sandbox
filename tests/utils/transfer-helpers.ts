import { type Page, expect } from "@playwright/test"

export class TransferFlowHelper {
  constructor(private page: Page) {}

  async navigateToTransfer() {
    await this.page.goto("/transfer")
    await expect(this.page.locator("h1")).toContainText("Transferencias")
  }

  async selectContact(contactId: string) {
    const contactLink = this.page.locator(`a[href="/transfer/${contactId}"]`)
    await expect(contactLink).toBeVisible()
    await contactLink.click()
    await expect(this.page).toHaveURL(`/transfer/${contactId}`)
  }

  async enterTransferAmount(amount: string) {
    await this.page.click('a[href*="/amount"]')
    await expect(this.page).toHaveURL(/\/amount$/)

    const amountInput = this.page.locator('input[type="number"]')
    await amountInput.fill(amount)

    const continueButton = this.page.locator('button:has-text("Continuar")')
    await expect(continueButton).toBeEnabled()
    await continueButton.click()
  }

  async confirmTransfer(comment?: string) {
    await expect(this.page).toHaveURL(/\/confirm$/)

    if (comment) {
      const commentTextarea = this.page.locator('textarea[name="comment"]')
      await commentTextarea.fill(comment)
    }

    const transferButton = this.page.locator('button[type="submit"]:has-text("Transferir")')
    await expect(transferButton).toBeEnabled()
    await transferButton.click()
  }

  async verifyTransferSuccess(amount: string, contactName: string) {
    await expect(this.page).toHaveURL(/\/success$/)
    await expect(this.page.locator("h1")).toContainText("¡Transferencia exitosa!")
    await expect(this.page.locator(`text=Transferiste $${amount} a ${contactName}`)).toBeVisible()
    await expect(this.page.locator("text=Completada")).toBeVisible()
  }

  async verifyTransferInHistory(amount: string, contactName: string) {
    await this.page.goto("/")
    await expect(this.page.locator(`text=Transferencia a ${contactName}`)).toBeVisible()
    await expect(this.page.locator(`text=-$${amount}`)).toBeVisible()
  }

  async searchContacts(searchTerm: string) {
    const searchInput = this.page.locator('input[type="text"]')
    await searchInput.fill(searchTerm)
  }

  async toggleContactType(hasUala: boolean) {
    const button = hasUala
      ? this.page.locator('button:has-text("Tiene Ualá")')
      : this.page.locator('button:has-text("No tiene Ualá")')

    await button.click()
    await expect(button).toHaveClass(/bg-white/)
  }

  async verifyContactDetails(contactName: string) {
    await expect(this.page.locator("h1")).toContainText(contactName)
    await expect(this.page.locator("text=Transferencia enviada")).toBeVisible()
  }

  async verifyAmountValidation(amount: string, shouldBeEnabled: boolean) {
    const amountInput = this.page.locator('input[type="number"]')
    await amountInput.fill(amount)

    const continueButton = this.page.locator('button:has-text("Continuar")')

    if (shouldBeEnabled) {
      await expect(continueButton).toBeEnabled()
    } else {
      await expect(continueButton).toBeDisabled()
    }
  }

  async navigateBackInFlow() {
    const backButton = this.page.locator('a[href*="/transfer"]').first()
    await backButton.click()
  }

  async verifyBalanceDisplay() {
    await expect(this.page.locator("text=Disponible")).toBeVisible()
    await expect(this.page.locator("text=$")).toBeVisible()
  }

  async verifyTransferForm() {
    await expect(this.page.locator("text=Banco")).toBeVisible()
    await expect(this.page.locator("text=UALÁ")).toBeVisible()
    await expect(this.page.locator("text=Motivo")).toBeVisible()
    await expect(this.page.locator("text=Varios")).toBeVisible()
    await expect(this.page.locator('textarea[name="comment"]')).toBeVisible()
  }
}

export const createTransferHelper = (page: Page) => new TransferFlowHelper(page)
