import { apiClient } from "../client"
import { mockMoneyRequests } from "../mock-data"
import { storage, STORAGE_KEYS } from "../../storage"
import type { ApiResponse, MoneyRequest, MoneyRequestInput } from "../types"

export class RequestService {
  static async getMoneyRequests(): Promise<ApiResponse<MoneyRequest[]>> {
    try {
      await apiClient.get<MoneyRequest[]>("/requests")

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const allRequests = [...storedRequests, ...mockMoneyRequests]

      // Sort by creation date (newest first)
      allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return {
        success: true,
        data: allRequests,
        message: "Money requests retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve money requests",
      }
    }
  }

  static async getMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.get<MoneyRequest>(`/requests/${requestId}`)

      let request = mockMoneyRequests.find((r) => r.id === requestId)

      if (!request) {
        const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
        request = storedRequests.find((r) => r.id === requestId)
      }

      if (!request) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      return {
        success: true,
        data: request,
        message: "Money request retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve money request",
      }
    }
  }

  static async createMoneyRequest(requestData: MoneyRequestInput): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.post<MoneyRequest>("/requests", requestData, 1500)

      const newRequest: MoneyRequest = {
        id: `req_${Date.now()}`,
        fromUserId: "user_001",
        fromUserName: "Juan Pérez",
        toUserId: requestData.toUserId || "user_unknown",
        toUserName: requestData.toUserName || "Usuario Desconocido",
        amount: requestData.amount,
        description: requestData.description,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      storedRequests.unshift(newRequest)
      storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)

      return {
        success: true,
        data: newRequest,
        message: "Money request created successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create money request. Please try again.",
      }
    }
  }

  static async acceptMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/accept`, {}, 2000)

      // Find the request in stored data
      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const requestIndex = storedRequests.findIndex((r) => r.id === requestId)

      let updatedRequest: MoneyRequest | undefined

      if (requestIndex !== -1) {
        storedRequests[requestIndex] = {
          ...storedRequests[requestIndex],
          status: "accepted",
          acceptedAt: new Date().toISOString(),
        }
        updatedRequest = storedRequests[requestIndex]
        storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)
      } else {
        // Check mock data
        const mockRequest = mockMoneyRequests.find((r) => r.id === requestId)
        if (mockRequest) {
          updatedRequest = {
            ...mockRequest,
            status: "accepted",
            acceptedAt: new Date().toISOString(),
          }
        }
      }

      if (!updatedRequest) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      return {
        success: true,
        data: updatedRequest,
        message: "Money request accepted successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to accept money request. Please try again.",
      }
    }
  }

  static async rejectMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/reject`, {}, 1500)

      // Find the request in stored data
      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const requestIndex = storedRequests.findIndex((r) => r.id === requestId)

      let updatedRequest: MoneyRequest | undefined

      if (requestIndex !== -1) {
        storedRequests[requestIndex] = {
          ...storedRequests[requestIndex],
          status: "rejected",
          rejectedAt: new Date().toISOString(),
        }
        updatedRequest = storedRequests[requestIndex]
        storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)
      } else {
        // Check mock data
        const mockRequest = mockMoneyRequests.find((r) => r.id === requestId)
        if (mockRequest) {
          updatedRequest = {
            ...mockRequest,
            status: "rejected",
            rejectedAt: new Date().toISOString(),
          }
        }
      }

      if (!updatedRequest) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      return {
        success: true,
        data: updatedRequest,
        message: "Money request rejected successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to reject money request. Please try again.",
      }
    }
  }

  static async cancelMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.delete<MoneyRequest>(`/requests/${requestId}`, 1000)

      // Find the request in stored data
      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const requestIndex = storedRequests.findIndex((r) => r.id === requestId)

      let updatedRequest: MoneyRequest | undefined

      if (requestIndex !== -1) {
        storedRequests[requestIndex] = {
          ...storedRequests[requestIndex],
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
        }
        updatedRequest = storedRequests[requestIndex]
        storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)
      }

      if (!updatedRequest) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      return {
        success: true,
        data: updatedRequest,
        message: "Money request cancelled successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to cancel money request. Please try again.",
      }
    }
  }

  static getPendingRequests(): MoneyRequest[] {
    const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
    const allRequests = [...storedRequests, ...mockMoneyRequests]

    return allRequests.filter((request) => request.status === "pending")
  }

  static getRequestHistory(): MoneyRequest[] {
    const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
    const allRequests = [...storedRequests, ...mockMoneyRequests]

    return allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static clearStoredData(): void {
    storage.removeItem(STORAGE_KEYS.REQUESTS)
  }
}
