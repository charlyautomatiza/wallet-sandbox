import { apiClient } from "../client"
import { mockMoneyRequests, mockContacts } from "../mock-data"
import type { ApiResponse, MoneyRequest, MoneyRequestInput } from "../types"

export class RequestService {
  static async getMoneyRequests(): Promise<ApiResponse<MoneyRequest[]>> {
    try {
      await apiClient.get<MoneyRequest[]>("/requests")

      return {
        success: true,
        data: mockMoneyRequests,
        message: "Money requests retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve money requests",
      }
    }
  }

  static async createMoneyRequest(requestData: MoneyRequestInput): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.post<MoneyRequest>("/requests", requestData, 1000)

      let requesterName = "Usuario Anónimo"
      if (requestData.contactId) {
        const contact = mockContacts.find((c) => c.id === requestData.contactId)
        if (contact) {
          requesterName = contact.name
        }
      }

      const newRequest: MoneyRequest = {
        id: `req_${Date.now()}`,
        amount: requestData.amount,
        description: requestData.description,
        requesterId: requestData.contactId || "anonymous",
        requesterName,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      mockMoneyRequests.unshift(newRequest)

      return {
        success: true,
        data: newRequest,
        message: "Money request created successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create money request",
      }
    }
  }

  static async acceptMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/accept`, {})

      const request = mockMoneyRequests.find((r) => r.id === requestId)
      if (!request) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      request.status = "accepted"

      return {
        success: true,
        data: request,
        message: "Money request accepted successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to accept money request",
      }
    }
  }

  static async rejectMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/reject`, {})

      const request = mockMoneyRequests.find((r) => r.id === requestId)
      if (!request) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      request.status = "rejected"

      return {
        success: true,
        data: request,
        message: "Money request rejected",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to reject money request",
      }
    }
  }

  static async cancelMoneyRequest(requestId: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete<boolean>(`/requests/${requestId}`)

      const requestIndex = mockMoneyRequests.findIndex((r) => r.id === requestId)
      if (requestIndex === -1) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      mockMoneyRequests.splice(requestIndex, 1)

      return {
        success: true,
        data: true,
        message: "Money request cancelled successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to cancel money request",
      }
    }
  }
}
