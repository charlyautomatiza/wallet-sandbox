import type { ApiResponse } from "./types"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulate API errors occasionally
const shouldSimulateError = (errorRate = 0.05) => Math.random() < errorRate

// Base API client configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  retries: 3,
  defaultDelay: 1000,
}

// Generic API client
export class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    simulatedDelay: number = API_CONFIG.defaultDelay,
  ): Promise<ApiResponse<T>> {
    try {
      // Simulate network delay
      await delay(simulatedDelay)

      // Simulate occasional errors
      if (shouldSimulateError()) {
        throw new Error("Simulated network error")
      }

      // In a real implementation, this would make an actual HTTP request
      // For now, we'll simulate the response structure
      const response: ApiResponse<T> = {
        success: true,
        data: {} as T, // This will be overridden by specific methods
        message: "Operation completed successfully",
      }

      return response
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  // GET request
  async get<T>(endpoint: string, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, delay)
  }

  // POST request
  async post<T>(endpoint: string, data: any, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      delay,
    )
  }

  // PUT request
  async put<T>(endpoint: string, data: any, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      delay,
    )
  }

  // DELETE request
  async delete<T>(endpoint: string, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" }, delay)
  }
}

// Singleton instance
export const apiClient = new ApiClient()
