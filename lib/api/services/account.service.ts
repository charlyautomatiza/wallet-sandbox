import { apiClient } from "../client"
import { mockAccount, mockCards } from "../mock-data"
import type { ApiResponse, Account, Card } from "../types"

export class AccountService {
  // Get account information
  static async getAccount(): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.get<Account>("/account")

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

  // Get account balance
  static async getBalance(): Promise<ApiResponse<{ balance: number; currency: string }>> {
    try {
      const response = await apiClient.get<{ balance: number; currency: string }>("/account/balance")

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

  // Update account balance
  static async updateBalance(newBalance: number): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.put<Account>("/account/balance", { balance: newBalance })

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

  // Get cards
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

  // Block/Unblock card
  static async toggleCardStatus(cardId: string): Promise<ApiResponse<Card>> {
    try {
      const response = await apiClient.put<Card>(`/account/cards/${cardId}/toggle`)

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

  // Get account statement
  static async getStatement(startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>(`/account/statement?start=${startDate}&end=${endDate}`)

      // Mock statement data
      const statement = [
        {
          date: "2024-01-15",
          description: "Transferencia a Elyer Saitest",
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

  // Update account settings
  static async updateAccountSettings(settings: Partial<Account>): Promise<ApiResponse<Account>> {
    try {
      const response = await apiClient.put<Account>("/account/settings", settings)

      // Update mock account with new settings
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
