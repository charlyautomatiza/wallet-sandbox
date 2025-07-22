export const STORAGE_KEYS = {
  TRANSFERS: "banking_transfers",
  CONTACTS: "banking_contacts",
  ACCOUNT: "banking_account",
  REQUESTS: "banking_requests",
  CARDS: "banking_cards",
  USER_PREFERENCES: "banking_preferences",
} as const

export interface StorageItem<T> {
  data: T
  timestamp: number
  version: string
}

class LocalStorage {
  private isClient = typeof window !== "undefined"
  private version = "1.0.0"

  setItem<T>(key: string, value: T): void {
    if (!this.isClient) return

    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.version,
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error)
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue

    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue

      const parsed: StorageItem<T> = JSON.parse(item)

      // Check if data is expired (older than 30 days)
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      if (parsed.timestamp < thirtyDaysAgo) {
        this.removeItem(key)
        return defaultValue
      }

      return parsed.data
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error)
      return defaultValue
    }
  }

  removeItem(key: string): void {
    if (!this.isClient) return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error)
    }
  }

  clear(): void {
    if (!this.isClient) return

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }

  getAllKeys(): string[] {
    if (!this.isClient) return []

    try {
      return Object.keys(localStorage).filter((key) => Object.values(STORAGE_KEYS).includes(key as any))
    } catch (error) {
      console.error("Error getting localStorage keys:", error)
      return []
    }
  }

  getStorageSize(): number {
    if (!this.isClient) return 0

    try {
      let total = 0
      Object.values(STORAGE_KEYS).forEach((key) => {
        const item = localStorage.getItem(key)
        if (item) {
          total += item.length
        }
      })
      return total
    } catch (error) {
      console.error("Error calculating storage size:", error)
      return 0
    }
  }
}

export const storage = new LocalStorage()
