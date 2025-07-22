import { apiClient } from "../client"
import { mockPaymentServices, mockTransactions, mockAccount } from "../mock-data"
import type { ApiResponse, PaymentRequest, Transaction } from "../types"

export class PaymentService {
  // Get available payment services
  static async getPaymentServices(): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>("/payments/services")

      return {
        success: true,
        data: mockPaymentServices,
        message: "Payment services retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve payment services",
      }
    }
  }

  // Get payment services by category
  static async getPaymentServicesByCategory(category: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<any[]>(`/payments/services/category/${category}`)

      const services = mockPaymentServices.filter((s) => s.category === category)

      return {
        success: true,
        data: services,
        message: `${category} services retrieved successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve ${category} services`,
      }
    }
  }

  // Process payment
  static async processPayment(paymentData: PaymentRequest): Promise<ApiResponse<Transaction>> {
    try {
      const response = await apiClient.post<Transaction>("/payments", paymentData, 1500)

      const service = mockPaymentServices.find((s) => s.id === paymentData.serviceId)
      if (!service) {
        return {
          success: false,
          error: "Payment service not found",
        }
      }

      if (!service.isAvailable) {
        return {
          success: false,
          error: "Payment service is currently unavailable",
        }
      }

      // Update mock account balance
      mockAccount.balance -= paymentData.amount

      // Create transaction record
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: "payment",
        amount: -paymentData.amount,
        description: `Pago de ${service.name}${paymentData.reference ? ` - ${paymentData.reference}` : ""}`,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        category: service.category,
        balance: mockAccount.balance,
      }

      mockTransactions.unshift(newTransaction)

      return {
        success: true,
        data: newTransaction,
        message: "Payment processed successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to process payment",
      }
    }
  }

  // Get payment history
  static async getPaymentHistory(limit = 10): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/payments/history?limit=${limit}`)

      const paymentTransactions = mockTransactions.filter((t) => t.type === "payment").slice(0, limit)

      return {
        success: true,
        data: paymentTransactions,
        message: "Payment history retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve payment history",
      }
    }
  }

  // Get service details
  static async getServiceDetails(serviceId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<any>(`/payments/services/${serviceId}`)

      const service = mockPaymentServices.find((s) => s.id === serviceId)

      if (!service) {
        return {
          success: false,
          error: "Payment service not found",
        }
      }

      return {
        success: true,
        data: service,
        message: "Service details retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve service details",
      }
    }
  }
}
