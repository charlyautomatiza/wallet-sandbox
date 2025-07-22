import { apiClient } from "../client"
import { mockInvestments } from "../mock-data"
import type { ApiResponse, Investment } from "../types"

export class InvestmentService {
  // Get all investments
  static async getInvestments(): Promise<ApiResponse<Investment[]>> {
    try {
      const response = await apiClient.get<Investment[]>("/investments")

      return {
        success: true,
        data: mockInvestments,
        message: "Investments retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve investments",
      }
    }
  }

  // Get investment by ID
  static async getInvestment(investmentId: string): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.get<Investment>(`/investments/${investmentId}`)

      const investment = mockInvestments.find((i) => i.id === investmentId)

      if (!investment) {
        return {
          success: false,
          error: "Investment not found",
        }
      }

      return {
        success: true,
        data: investment,
        message: "Investment retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve investment",
      }
    }
  }

  // Get investments by type
  static async getInvestmentsByType(type: Investment["type"]): Promise<ApiResponse<Investment[]>> {
    try {
      const response = await apiClient.get<Investment[]>(`/investments/type/${type}`)

      const investments = mockInvestments.filter((i) => i.type === type)

      return {
        success: true,
        data: investments,
        message: `${type} investments retrieved successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve ${type} investments`,
      }
    }
  }

  // Get portfolio summary
  static async getPortfolioSummary(): Promise<
    ApiResponse<{
      totalInvested: number
      currentValue: number
      totalPerformance: number
      totalPerformancePercentage: number
      investments: Investment[]
    }>
  > {
    try {
      const response = await apiClient.get("/investments/portfolio/summary")

      const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0)
      const currentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
      const totalPerformance = currentValue - totalInvested
      const totalPerformancePercentage = totalInvested > 0 ? (totalPerformance / totalInvested) * 100 : 0

      return {
        success: true,
        data: {
          totalInvested,
          currentValue,
          totalPerformance,
          totalPerformancePercentage,
          investments: mockInvestments,
        },
        message: "Portfolio summary retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve portfolio summary",
      }
    }
  }

  // Create new investment
  static async createInvestment(
    investmentData: Omit<Investment, "id" | "currentValue" | "performance" | "performancePercentage" | "lastUpdate">,
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await apiClient.post<Investment>("/investments", investmentData)

      const newInvestment: Investment = {
        ...investmentData,
        id: `inv_${Date.now()}`,
        currentValue: investmentData.amount, // Start with same value
        performance: 0,
        performancePercentage: 0,
        lastUpdate: new Date().toISOString().split("T")[0],
      }

      mockInvestments.push(newInvestment)

      return {
        success: true,
        data: newInvestment,
        message: "Investment created successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create investment",
      }
    }
  }

  // Sell investment
  static async sellInvestment(investmentId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiClient.delete<boolean>(`/investments/${investmentId}`)

      const investmentIndex = mockInvestments.findIndex((i) => i.id === investmentId)
      if (investmentIndex === -1) {
        return {
          success: false,
          error: "Investment not found",
        }
      }

      mockInvestments.splice(investmentIndex, 1)

      return {
        success: true,
        data: true,
        message: "Investment sold successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to sell investment",
      }
    }
  }
}
