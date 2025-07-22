// localStorage utility functions
export const storage = {
  // Get item from localStorage with error handling
  getItem: <T>(key: string, defaultValue: T): T => {\
    if (typeof window === 'undefined') return defaultValue
    
    try {\
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)\
      return defaultValue
    }
  },

  // Set item in localStorage with error handling
  setItem: <T>(key: string, value: T): void => {\
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {\
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error)
    }
  }
}

// Storage keys
export const STORAGE_KEYS = {\
  TRANSFERS: 'banking_transfers',
  CONTACTS: 'banking_contacts',
  ACCOUNT: 'banking_account'\
} as const
