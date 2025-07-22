import { apiClient } from "../client"
import { mockAccount, mockCards } from "../mock-data"
import type { ApiResponse, Account, Card } from "../types"

export class AccountService {
  // Get account information
  static async getAccount(): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.get<Account>("/account")

      // Return mock data for now
      return {
        success: true,
        data: mockAccount,
        message: "Account retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve account information",
      }
    }
  }

  // Get user cards
  static async getCards(): Promise<ApiResponse<Card[]>> {
    try {
      const response = await apiClient.get<Card[]>("/account/cards")

      return {
        success: true,
        data: mockCards,
        message: "Cards retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve cards",
      }
    }
  }

  // Update account balance
  static async updateBalance(newBalance: number): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.put<Account>("/account/balance", { balance: newBalance })

      // Update mock data
      mockAccount.balance = newBalance

      return {
        success: true,
        data: mockAccount,
        message: "Balance updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update balance",
      }
    }
  }

  // Change currency
  static async changeCurrency(currency: "ARS" | "USD"): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.put<Account>("/account/currency", { currency })

      // Update mock data
      mockAccount.currency = currency

      return {
        success: true,
        data: mockAccount,
        message: "Currency updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update currency",
      }
    }
  }

  // Block/Unblock card
  static async toggleCardStatus(cardId: string, isActive: boolean): Promise<ApiResponse<Card>> {
    try {
      const response = await apiClient.put<Card>(`/account/cards/${cardId}/status`, { isActive })

      // Update mock data
      const card = mockCards.find((c) => c.id === cardId)
      if (card) {
        card.isActive = isActive
      }

      return {
        success: true,
        data: card!,
        message: `Card ${isActive ? "activated" : "blocked"} successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update card status",
      }
    }
  }
}
