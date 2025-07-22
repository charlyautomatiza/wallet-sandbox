import { apiClient } from "../client"
import { mockTransactions } from "../mock-data"
import type { ApiResponse, Transaction } from "../types"

export class TransactionService {
  // Get all transactions
  static async getTransactions(limit = 20, offset = 0): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/transactions?limit=${limit}&offset=${offset}`)

      const transactions = mockTransactions.slice(offset, offset + limit)

      return {
        success: true,
        data: transactions,
        message: "Transactions retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve transactions",
      }
    }
  }

  // Get transactions by type
  static async getTransactionsByType(type: Transaction["type"], limit = 10): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/transactions/type/${type}?limit=${limit}`)

      const transactions = mockTransactions.filter((t) => t.type === type).slice(0, limit)

      return {
        success: true,
        data: transactions,
        message: `${type} transactions retrieved successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve ${type} transactions`,
      }
    }
  }

  // Get transaction by ID
  static async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    try {
      const response = await apiClient.get<Transaction>(`/transactions/${transactionId}`)

      const transaction = mockTransactions.find((t) => t.id === transactionId)

      if (!transaction) {
        return {
          success: false,
          error: "Transaction not found",
        }
      }

      return {
        success: true,
        data: transaction,
        message: "Transaction retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve transaction",
      }
    }
  }

  // Get transactions by date range
  static async getTransactionsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/transactions/range?start=${startDate}&end=${endDate}`)

      const start = new Date(startDate)
      const end = new Date(endDate)

      const transactions = mockTransactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate >= start && transactionDate <= end
      })

      return {
        success: true,
        data: transactions,
        message: "Transactions retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve transactions for date range",
      }
    }
  }

  // Get recent transactions for dashboard
  static async getRecentTransactions(limit = 5): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/transactions/recent?limit=${limit}`)

      const recentTransactions = mockTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)

      return {
        success: true,
        data: recentTransactions,
        message: "Recent transactions retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve recent transactions",
      }
    }
  }
}
