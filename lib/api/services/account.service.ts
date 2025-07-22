import { apiClient } from "../client"
import { mockAccount, mockCards } from "../mock-data"
import { storage, STORAGE_KEYS } from "../../storage"
import type { ApiResponse, Account, Card } from "../types"

export class AccountService {
  static async getAccount(): Promise<ApiResponse<Account>> {
    try {
      await apiClient.get<Account>("/account")

      const storedAccount = storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null)
      const account = storedAccount || mockAccount

      return {
        success: true,
        data: account,
        message: "Account retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve account information",
      }
    }
  }

  static async updateBalance(newBalance: number): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account/balance", { balance: newBalance }, 1500)

      const currentAccount = storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null) || mockAccount
      const updatedAccount: Account = {
        ...currentAccount,
        balance: newBalance,
        updatedAt: new Date().toISOString(),
      }

      storage.setItem(STORAGE_KEYS.ACCOUNT, updatedAccount)

      // Also update the mock account for consistency
      mockAccount.balance = newBalance
      mockAccount.updatedAt = new Date().toISOString()

      return {
        success: true,
        data: updatedAccount,
        message: "Account balance updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update account balance",
      }
    }
  }

  static async getCards(): Promise<ApiResponse<Card[]>> {
    try {
      await apiClient.get<Card[]>("/account/cards")

      const storedCards = storage.getItem<Card[]>(STORAGE_KEYS.CARDS, [])
      const allCards = storedCards.length > 0 ? storedCards : mockCards

      return {
        success: true,
        data: allCards,
        message: "Cards retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve cards",
      }
    }
  }

  static async toggleCardStatus(cardId: string): Promise<ApiResponse<Card>> {
    try {
      await apiClient.put<Card>(`/account/cards/${cardId}/toggle`, {}, 1500)

      const storedCards = storage.getItem<Card[]>(STORAGE_KEYS.CARDS, [])
      const allCards = storedCards.length > 0 ? storedCards : [...mockCards]

      const cardIndex = allCards.findIndex((card) => card.id === cardId)

      if (cardIndex === -1) {
        return {
          success: false,
          error: "Card not found",
        }
      }

      allCards[cardIndex] = {
        ...allCards[cardIndex],
        isBlocked: !allCards[cardIndex].isBlocked,
      }

      storage.setItem(STORAGE_KEYS.CARDS, allCards)

      return {
        success: true,
        data: allCards[cardIndex],
        message: `Card ${allCards[cardIndex].isBlocked ? "blocked" : "unblocked"} successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to toggle card status",
      }
    }
  }

  static async updateAccountInfo(accountData: Partial<Account>): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account", accountData, 2000)

      const currentAccount = storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null) || mockAccount
      const updatedAccount: Account = {
        ...currentAccount,
        ...accountData,
        updatedAt: new Date().toISOString(),
      }

      storage.setItem(STORAGE_KEYS.ACCOUNT, updatedAccount)

      return {
        success: true,
        data: updatedAccount,
        message: "Account information updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update account information",
      }
    }
  }

  static getStoredAccount(): Account | null {
    return storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null)
  }

  static clearStoredData(): void {
    storage.removeItem(STORAGE_KEYS.ACCOUNT)
    storage.removeItem(STORAGE_KEYS.CARDS)
  }

  static async deactivateAccount(): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account/deactivate", {}, 2500)

      const currentAccount = storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null) || mockAccount
      const deactivatedAccount: Account = {
        ...currentAccount,
        isActive: false,
        updatedAt: new Date().toISOString(),
      }

      storage.setItem(STORAGE_KEYS.ACCOUNT, deactivatedAccount)

      return {
        success: true,
        data: deactivatedAccount,
        message: "Account deactivated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to deactivate account",
      }
    }
  }

  static async reactivateAccount(): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account/reactivate", {}, 2500)

      const currentAccount = storage.getItem<Account | null>(STORAGE_KEYS.ACCOUNT, null) || mockAccount
      const reactivatedAccount: Account = {
        ...currentAccount,
        isActive: true,
        updatedAt: new Date().toISOString(),
      }

      storage.setItem(STORAGE_KEYS.ACCOUNT, reactivatedAccount)

      return {
        success: true,
        data: reactivatedAccount,
        message: "Account reactivated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to reactivate account",
      }
    }
  }
}
