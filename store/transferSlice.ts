import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Contact, Transaction, TransferRequest } from "@/lib/api/types"

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

interface TransferState {
  selectedContact: Contact | null
  amount: number
  reason: string
  comment: string
  contacts: Contact[]
  transferHistory: Transaction[]
  isLoading: boolean
  error: string | null
  transferStatus: "idle" | "pending" | "success" | "failed"
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
  transferStatus: "idle",
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
      state.transferStatus = "idle"
      state.error = null
    },
    clearError: (state) => {
      state.error = null
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
        state.contacts = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch contacts"
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
        state.transferHistory = action.payload
      })
      .addCase(fetchTransferHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch transfer history"
      })
      .addCase(processTransfer.pending, (state) => {
        state.transferStatus = "pending"
        state.error = null
      })
      .addCase(processTransfer.fulfilled, (state, action) => {
        state.transferStatus = "success"
        const newTransaction: Transaction = {
          id: action.payload.transactionId,
          type: "transfer",
          amount: -action.payload.amount,
          description: `Transferencia a ${action.payload.contactName}`,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
          category: "Transferencias",
          contactName: action.payload.contactName,
          balance: 0,
        }
        state.transferHistory.unshift(newTransaction)
      })
      .addCase(processTransfer.rejected, (state, action) => {
        state.transferStatus = "failed"
        state.error = action.error.message || "Transfer failed"
      })
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

export const { setSelectedContact, setAmount, setReason, setComment, clearTransferForm, clearError } =
  transferSlice.actions

export const transferReducer = transferSlice.reducer

export const selectTransferState = (state: { transfer: TransferState }) => state.transfer
export const selectContacts = (state: { transfer: TransferState }) => state.transfer.contacts
export const selectSelectedContact = (state: { transfer: TransferState }) => state.transfer.selectedContact
export const selectTransferHistory = (state: { transfer: TransferState }) => state.transfer.transferHistory
export const selectIsLoading = (state: { transfer: TransferState }) => state.transfer.isLoading
export const selectTransferStatus = (state: { transfer: TransferState }) => state.transfer.transferStatus
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
