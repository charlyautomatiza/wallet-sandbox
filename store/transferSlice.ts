import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Contact, Transaction, TransferRequest } from "@/lib/api/types"

// Async thunks
export const fetchContacts = createAsyncThunk("transfer/fetchContacts", async () => {
  const response = await TransferService.getContacts()
  if (!response.success) {
    throw new Error(response.error)
  }
  return response.data
})

export const fetchContact = createAsyncThunk("transfer/fetchContact", async (contactId: string) => {
  const response = await TransferService.getContact(contactId)
  if (!response.success) {
    throw new Error(response.error)
  }
  return response.data
})

export const processTransfer = createAsyncThunk("transfer/processTransfer", async (transferData: TransferRequest) => {
  const response = await TransferService.processTransfer(transferData)
  if (!response.success) {
    throw new Error(response.error)
  }
  return response.data
})

export const fetchTransferHistory = createAsyncThunk("transfer/fetchTransferHistory", async (limit = 10) => {
  const response = await TransferService.getTransferHistory(limit)
  if (!response.success) {
    throw new Error(response.error)
  }
  return response.data
})

export const addContact = createAsyncThunk(
  "transfer/addContact",
  async (contactData: Omit<Contact, "id" | "recentTransfers">) => {
    const response = await TransferService.addContact(contactData)
    if (!response.success) {
      throw new Error(response.error)
    }
    return response.data
  },
)

// State interface
interface TransferState {
  // Transfer form state
  amount: number
  contactId: string | null
  contactName: string | null
  reason: string
  comment: string

  // Data state
  contacts: Contact[]
  transferHistory: Transaction[]

  // UI state
  isLoading: boolean
  isProcessing: boolean
  error: string | null

  // Filter state
  showOnlyUala: boolean
  searchQuery: string
}

// Initial state
const initialState: TransferState = {
  amount: 0,
  contactId: null,
  contactName: null,
  reason: "",
  comment: "",
  contacts: [],
  transferHistory: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  showOnlyUala: false,
  searchQuery: "",
}

// Slice
const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    // Form actions
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
      state.error = null
    },
    setContact: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.contactId = action.payload.id
      state.contactName = action.payload.name
      state.error = null
    },
    setReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload
      state.error = null
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },

    // Filter actions
    setShowOnlyUala: (state, action: PayloadAction<boolean>) => {
      state.showOnlyUala = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    // Reset actions
    resetTransfer: (state) => {
      state.amount = 0
      state.contactId = null
      state.contactName = null
      state.reason = ""
      state.comment = ""
      state.isLoading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },

    // Local storage sync
    syncWithLocalStorage: (state) => {
      const combinedTransactions = TransferService.getCombinedTransactions()
      state.transferHistory = combinedTransactions.filter((t) => t.type === "transfer")
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false
        state.contacts = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch contacts"
      })

    // Fetch contact
    builder
      .addCase(fetchContact.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.isLoading = false
        state.contactId = action.payload.id
        state.contactName = action.payload.name
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch contact"
      })

    // Fetch transfer history
    builder
      .addCase(fetchTransferHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransferHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.transferHistory = action.payload
      })
      .addCase(fetchTransferHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch transfer history"
      })

    // Process transfer
    builder
      .addCase(processTransfer.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(processTransfer.fulfilled, (state, action) => {
        state.isProcessing = false
        // Reset form after successful transfer
        state.amount = 0
        state.contactId = null
        state.contactName = null
        state.reason = ""
        state.comment = ""
        // Sync with localStorage to get updated history
        const combinedTransactions = TransferService.getCombinedTransactions()
        state.transferHistory = combinedTransactions.filter((t) => t.type === "transfer")
      })
      .addCase(processTransfer.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.error.message || "Failed to process transfer"
      })

    // Add contact
    builder
      .addCase(addContact.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.isLoading = false
        state.contacts.push(action.payload)
      })
      .addCase(addContact.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to add contact"
      })
  },
})

// Export actions
export const {
  setAmount,
  setContact,
  setReason,
  setComment,
  setShowOnlyUala,
  setSearchQuery,
  resetTransfer,
  clearError,
  syncWithLocalStorage,
} = transferSlice.actions

// Export reducer
export const transferReducer = transferSlice.reducer

// Selectors
export const selectTransferState = (state: { transfer: TransferState }) => state.transfer
export const selectContacts = (state: { transfer: TransferState }) => state.transfer.contacts
export const selectContactId = (state: { transfer: TransferState }) => state.transfer.contactId
export const selectContactName = (state: { transfer: TransferState }) => state.transfer.contactName
export const selectTransferHistory = (state: { transfer: TransferState }) => state.transfer.transferHistory
export const selectIsLoading = (state: { transfer: TransferState }) => state.transfer.isLoading
export const selectIsProcessing = (state: { transfer: TransferState }) => state.transfer.isProcessing
export const selectError = (state: { transfer: TransferState }) => state.transfer.error

// Filtered selectors
export const selectFilteredContacts = (state: { transfer: TransferState }) => {
  const { contacts, showOnlyUala, searchQuery } = state.transfer

  let filtered = contacts

  if (showOnlyUala) {
    filtered = filtered.filter((contact) => contact.hasUala)
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query),
    )
  }

  return filtered
}
