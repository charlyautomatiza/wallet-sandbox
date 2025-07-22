export const STORAGE_KEYS = {
  TRANSFERS: "banking_transfers",
  CONTACTS: "banking_contacts",
  ACCOUNT: "banking_account",
  REQUESTS: "banking_requests",
} as const

export const storage = {
  getItem: <T>(key: string, defaultValue: T): T => {\
    if (typeof window === 'undefined') return defaultValue
    
    try {\
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error)\
      return defaultValue
    }
  },

  setItem: <T>(key: string, value: T): void => {\
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in localStorage:`, error)
    }
  },

  removeItem: (key: string): void => {\
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error)
    }
  },

  clear: (): void => {\
    if (typeof window === 'undefined') return
    
    try {
      localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  }\
}
