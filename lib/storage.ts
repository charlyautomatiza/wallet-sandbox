// Storage utility for localStorage operations with error handling
export const STORAGE_KEYS = {
  TRANSFERS: "banking_transfers",
  CONTACTS: "banking_contacts",
  ACCOUNT: "banking_account",
  USER_PREFERENCES: "banking_preferences",
} as const

export const storage = {
  // Get item from localStorage with fallback
  getItem: <T>(key: string, fallback: T): T => {\
    if (typeof window === 'undefined') return fallback
    
    try {\
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)\
      return fallback
    }
  },

  // Set item in localStorage
  setItem: <T>(key: string, value: T): void => {\
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {\
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  },

  // Clear all storage
  clear: (): void => {\
    if (typeof window === 'undefined') return
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }\
}
