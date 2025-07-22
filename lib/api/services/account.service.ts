import { apiClient } from "../client"
import { mockAccount, mockCards } from "../mock-data"
import type { ApiResponse, Account, Card } from "../types"

export class AccountService {
  static async getAccount(): Promise<ApiResponse<Account>> {
    try {
      await apiClient.get<Account>("/account")

      return {
        success: true,
        data: mockAccount,
        message: "Account information retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve account information",
      }
    }
  }

  static async getBalance(): Promise<ApiResponse<{ balance: number; currency: string }>> {
    try {
      await apiClient.get<{ balance: number; currency: string }>("/account/balance")

      return {
        success: true,
        data: {
          balance: mockAccount.balance,
          currency: mockAccount.currency,
        },
        message: "Balance retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve balance",
      }
    }
  }

  static async updateBalance(newBalance: number): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account/balance", { balance: newBalance })

      mockAccount.balance = newBalance
      mockAccount.updatedAt = new Date().toISOString()

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

  static async getCards(): Promise<ApiResponse<Card[]>> {
    try {
      await apiClient.get<Card[]>("/account/cards")

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

  static async toggleCardStatus(cardId: string): Promise<ApiResponse<Card>> {
    try {
      await apiClient.put<Card>(`/account/cards/${cardId}/toggle`)

      const card = mockCards.find((c) => c.id === cardId)
      if (!card) {
        return {
          success: false,
          error: "Card not found",
        }
      }

      card.isActive = !card.isActive

      return {
        success: true,
        data: card,
        message: `Card ${card.isActive ? "activated" : "blocked"} successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to toggle card status",
      }
    }
  }

  static async getStatement(startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    try {
      await apiClient.get<any[]>(`/account/statement?start=${startDate}&end=${endDate}`)

      const statement = [
        {
          date: "2024-01-15",
          description: "Transferencia a María González",
          amount: -15000,
          balance: 125430.5,
        },
        {
          date: "2024-01-14",
          description: "Depósito en efectivo",
          amount: 50000,
          balance: 140430.5,
        },
        {
          date: "2024-01-13",
          description: "Pago de servicios - Luz",
          amount: -8500,
          balance: 90430.5,
        },
      ]

      return {
        success: true,
        data: statement,
        message: "Statement retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve statement",
      }
    }
  }

  static async updateAccountSettings(settings: Partial<Account>): Promise<ApiResponse<Account>> {
    try {
      await apiClient.put<Account>("/account/settings", settings)

      Object.assign(mockAccount, settings, { updatedAt: new Date().toISOString() })

      return {
        success: true,
        data: mockAccount,
        message: "Account settings updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update account settings",
      }
    }
  }
}
