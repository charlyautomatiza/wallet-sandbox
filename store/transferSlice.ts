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

// State interface
interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
  reason: string
  comment: string
  transferHistory: Transaction[]
  isLoading: boolean
  error: string | null
  transferStep: "select-contact" | "enter-amount" | "confirm" | "success"
}

// Initial state
const initialState: TransferState = {
  contacts: [],
  selectedContact: null,
  amount: 0,
  reason: "Varios",
  comment: "",
  transferHistory: [],
  isLoading: false,
  error: null,
  transferStep: "select-contact",
}

// Slice
const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact>) => {
      state.selectedContact = action.payload
      state.transferStep = "enter-amount"
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
    },
    setReason: (state, action: PayloadAction<string>) => {
      state.reason = action.payload
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload
    },
    setTransferStep: (state, action: PayloadAction<TransferState["transferStep"]>) => {
      state.transferStep = action.payload
    },
    clearTransferData: (state) => {
      state.selectedContact = null
      state.amount = 0
      state.reason = "Varios"
      state.comment = ""
      state.transferStep = "select-contact"
      state.error = null
    },
    clearError: (state) => {
      state.error = null
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
        state.selectedContact = action.payload
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch contact"
      })

    // Process transfer
    builder
      .addCase(processTransfer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(processTransfer.fulfilled, (state, action) => {
        state.isLoading = false
        state.transferStep = "success"
      })
      .addCase(processTransfer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to process transfer"
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
  },
})

// Export actions
export const { setSelectedContact, setAmount, setReason, setComment, setTransferStep, clearTransferData, clearError } =
  transferSlice.actions

// Export reducer
export const transferReducer = transferSlice.reducer

// Export default
export default transferSlice.reducer
