import { apiClient } from "../client"
import { mockMoneyRequests, mockContacts } from "../mock-data"
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

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const allRequests = [...storedRequests, ...mockMoneyRequests]

      const request = allRequests.find((r) => r.id === requestId)

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

      let contactName = "Usuario desconocido"

      if (requestData.contactId) {
        const contact = mockContacts.find((c) => c.id === requestData.contactId)
        if (contact) {
          contactName = contact.name
        }
      }

      const newRequest: MoneyRequest = {
        id: `req_${Date.now()}`,
        fromUserId: "user_001", // Current user
        toUserId: requestData.contactId || "unknown",
        amount: requestData.amount,
        description: requestData.description,
        status: "pending",
        createdAt: new Date().toISOString(),
        fromUserName: "Juan Pérez", // Current user name
        toUserName: contactName,
      }

      // Save to localStorage
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
        error: "Failed to create money request",
      }
    }
  }

  static async acceptMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/accept`, {}, 1500)

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const allRequests = [...storedRequests, ...mockMoneyRequests]

      const requestIndex = allRequests.findIndex((r) => r.id === requestId)

      if (requestIndex === -1) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      const request = allRequests[requestIndex]
      request.status = "completed"
      request.completedAt = new Date().toISOString()

      // Update in localStorage if it's a stored request
      const storedIndex = storedRequests.findIndex((r) => r.id === requestId)
      if (storedIndex !== -1) {
        storedRequests[storedIndex] = request
        storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)
      }

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
      await apiClient.put<MoneyRequest>(`/requests/${requestId}/reject`, {}, 1000)

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const allRequests = [...storedRequests, ...mockMoneyRequests]

      const requestIndex = allRequests.findIndex((r) => r.id === requestId)

      if (requestIndex === -1) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      const request = allRequests[requestIndex]
      request.status = "rejected"
      request.completedAt = new Date().toISOString()

      // Update in localStorage if it's a stored request
      const storedIndex = storedRequests.findIndex((r) => r.id === requestId)
      if (storedIndex !== -1) {
        storedRequests[storedIndex] = request
        storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)
      }

      return {
        success: true,
        data: request,
        message: "Money request rejected successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to reject money request",
      }
    }
  }

  static async cancelMoneyRequest(requestId: string): Promise<ApiResponse<MoneyRequest>> {
    try {
      await apiClient.delete<MoneyRequest>(`/requests/${requestId}`, 1000)

      const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
      const requestIndex = storedRequests.findIndex((r) => r.id === requestId)

      if (requestIndex === -1) {
        return {
          success: false,
          error: "Money request not found",
        }
      }

      const request = storedRequests[requestIndex]
      storedRequests.splice(requestIndex, 1)
      storage.setItem(STORAGE_KEYS.REQUESTS, storedRequests)

      return {
        success: true,
        data: request,
        message: "Money request cancelled successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to cancel money request",
      }
    }
  }

  static getPendingRequests(): MoneyRequest[] {
    const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
    const allRequests = [...storedRequests, ...mockMoneyRequests]

    return allRequests.filter((request) => request.status === "pending")
  }

  static getCompletedRequests(): MoneyRequest[] {
    const storedRequests = storage.getItem<MoneyRequest[]>(STORAGE_KEYS.REQUESTS, [])
    const allRequests = [...storedRequests, ...mockMoneyRequests]

    return allRequests.filter((request) => request.status === "completed")
  }

  static clearStoredData(): void {
    storage.removeItem(STORAGE_KEYS.REQUESTS)
  }
}
