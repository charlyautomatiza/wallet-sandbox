import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Contact, Transaction, TransferRequest } from "@/lib/api/types"

export const fetchContacts = createAsyncThunk("transfer/fetchContacts", async (_, { rejectWithValue }) => {
  try {
    const result = await TransferService.getContacts()
    if (!result.success) {
      return rejectWithValue(result.error)
    }
    return result.data
  } catch (error) {
    return rejectWithValue("Failed to fetch contacts")
  }
})

export const fetchContact = createAsyncThunk("transfer/fetchContact", async (contactId: string) => {
  const response = await TransferService.getContact(contactId)
  if (!response.success) {
    throw new Error(response.error)
  }
  return response.data
})

export const processTransfer = createAsyncThunk(
  "transfer/processTransfer",
  async (transferData: TransferRequest, { rejectWithValue }) => {
    try {
      const result = await TransferService.processTransfer(transferData)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return result.data
    } catch (error) {
      return rejectWithValue("Failed to process transfer")
    }
  },
)

export const fetchTransferHistory = createAsyncThunk(
  "transfer/fetchTransferHistory",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const result = await TransferService.getTransferHistory(limit)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return result.data
    } catch (error) {
      return rejectWithValue("Failed to fetch transfer history")
    }
  },
)

export const addContact = createAsyncThunk(
  "transfer/addContact",
  async (contactData: Omit<Contact, "id" | "recentTransfers">, { rejectWithValue }) => {
    try {
      const result = await TransferService.addContact(contactData)
      if (!result.success) {
        return rejectWithValue(result.error)
      }
      return result.data
    } catch (error) {
      return rejectWithValue("Failed to add contact")
    }
  },
)

interface TransferState {
  selectedContact: Contact | null
  amount: number
  reason: string
  comment: string
  contacts: Contact[]
  transferHistory: Transaction[]
  isLoading: boolean
  error: string | null
  isTransferring: boolean
}

const initialState: TransferState = {
  selectedContact: null,
  amount: 0,
  reason: "",
  comment: "",
  contacts: [],
  transferHistory: [],
  isLoading: false,
  error: null,
  isTransferring: false,
}

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload
      state.error = null
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
      state.error = null
    },
    setReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload
      state.error = null
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },
    clearTransferForm: (state) => {
      state.selectedContact = null
      state.amount = 0
      state.reason = ""
      state.comment = ""
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    updateContactRecentTransfer: (state, action: PayloadAction<{ contactId: string; amount: number }>) => {
      const { contactId, amount } = action.payload
      const contact = state.contacts.find((c) => c.id === contactId)
      if (contact) {
        contact.recentTransfers.unshift({
          amount,
          date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
          type: "sent",
        })
        contact.recentTransfers = contact.recentTransfers.slice(0, 5)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false
        state.contacts = action.payload || []
        state.error = null
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchContact.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedContact = action.payload
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch contact"
      })
      .addCase(fetchTransferHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransferHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.transferHistory = action.payload || []
        state.error = null
      })
      .addCase(fetchTransferHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(processTransfer.pending, (state) => {
        state.isTransferring = true
        state.error = null
      })
      .addCase(processTransfer.fulfilled, (state, action) => {
        state.isTransferring = false
        state.error = null
        state.selectedContact = null
        state.amount = 0
        state.reason = ""
        state.comment = ""
        if (state.selectedContact) {
          const contact = state.contacts.find((c) => c.id === state.selectedContact?.id)
          if (contact) {
            contact.recentTransfers.unshift({
              amount: state.amount,
              date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
              type: "sent",
            })
            contact.recentTransfers = contact.recentTransfers.slice(0, 5)
          }
        }
      })
      .addCase(processTransfer.rejected, (state, action) => {
        state.isTransferring = false
        state.error = action.payload as string
      })
      .addCase(addContact.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.contacts.push(action.payload)
        }
        state.error = null
      })
      .addCase(addContact.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setSelectedContact,
  setAmount,
  setReason,
  setComment,
  clearTransferForm,
  clearError,
  updateContactRecentTransfer,
} = transferSlice.actions

export const transferReducer = transferSlice.reducer

export const selectTransferState = (state: { transfer: TransferState }) => state.transfer
export const selectContacts = (state: { transfer: TransferState }) => state.transfer.contacts
export const selectSelectedContact = (state: { transfer: TransferState }) => state.transfer.selectedContact
export const selectTransferHistory = (state: { transfer: TransferState }) => state.transfer.transferHistory
export const selectIsLoading = (state: { transfer: TransferState }) => state.transfer.isLoading
export const selectError = (state: { transfer: TransferState }) => state.transfer.error

export const selectFilteredContacts = (state: { transfer: TransferState }) => {
  const { contacts, searchQuery } = state.transfer

  let filtered = contacts

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

export default transferSlice.reducer
