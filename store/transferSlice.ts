import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Transaction, TransferRequest, TransferResponse } from "@/lib/api/types"
import { storage, STORAGE_KEYS } from "../lib/storage"

interface TransferState {
  contacts: any[]
  selectedContact: any | null
  transferHistory: Transaction[]
  isLoading: boolean
  error: string | null
  lastTransfer: TransferResponse | null
}

// Initial contacts with more variety
const initialContacts = [
  {
    id: "1",
    name: "Elyer Saitest",
    initials: "ES",
    hasUala: true,
    recentTransfers: [
      { amount: 40000, date: "18/01", type: "sent" },
      { amount: 30000, date: "03/01", type: "received" },
      { amount: 50000, date: "19/12/2024", type: "sent" },
    ],
  },
  {
    id: "2",
    name: "Pato Free Range",
    initials: "PF",
    hasUala: true,
    recentTransfers: [
      { amount: 25000, date: "15/01", type: "received" },
      { amount: 12000, date: "10/01", type: "sent" },
    ],
  },
  {
    id: "3",
    name: "Ana Martínez",
    initials: "AM",
    hasUala: true,
    recentTransfers: [
      { amount: 75000, date: "20/01", type: "sent" },
      { amount: 15000, date: "12/01", type: "received" },
    ],
  },
  {
    id: "4",
    name: "Carlos Rodriguez",
    initials: "CR",
    hasUala: true,
    recentTransfers: [{ amount: 35000, date: "17/01", type: "received" }],
  },
  {
    id: "5",
    name: "Lucía Fernández",
    initials: "LF",
    hasUala: true,
    recentTransfers: [],
  },
  {
    id: "6",
    name: "Diego Morales",
    initials: "DM",
    hasUala: true,
    recentTransfers: [
      { amount: 22000, date: "14/01", type: "sent" },
      { amount: 18000, date: "08/01", type: "received" },
      { amount: 45000, date: "02/01", type: "sent" },
    ],
  },
  // Contacts without Ualá
  {
    id: "7",
    name: "María González",
    initials: "MG",
    hasUala: false,
    recentTransfers: [{ amount: 60000, date: "16/01", type: "sent" }],
  },
  {
    id: "8",
    name: "Roberto Silva",
    initials: "RS",
    hasUala: false,
    recentTransfers: [],
  },
  {
    id: "9",
    name: "Carmen López",
    initials: "CL",
    hasUala: false,
    recentTransfers: [
      { amount: 28000, date: "13/01", type: "received" },
      { amount: 33000, date: "05/01", type: "sent" },
    ],
  },
  {
    id: "10",
    name: "Fernando Ruiz",
    initials: "FR",
    hasUala: false,
    recentTransfers: [
      { amount: 95000, date: "19/01", type: "sent" },
      { amount: 42000, date: "11/01", type: "received" },
    ],
  },
  {
    id: "11",
    name: "Valentina Castro",
    initials: "VC",
    hasUala: false,
    recentTransfers: [],
  },
  {
    id: "12",
    name: "Sebastián Torres",
    initials: "ST",
    hasUala: false,
    recentTransfers: [{ amount: 17000, date: "09/01", type: "received" }],
  },
]

// Load contacts from localStorage or use initial contacts
const loadContacts = (): any[] => {
  const storedContacts = storage.getItem<any[]>(STORAGE_KEYS.CONTACTS, [])

  // Merge initial contacts with stored contacts, avoiding duplicates
  const allContacts = [...initialContacts]
  storedContacts.forEach((storedContact) => {
    if (!allContacts.find((contact) => contact.id === storedContact.id)) {
      allContacts.push(storedContact)
    }
  })

  return allContacts
}

const initialState: TransferState = {
  contacts: loadContacts(),
  selectedContact: null,
  transferHistory: [],
  isLoading: false,
  error: null,
  lastTransfer: null,
}

// Async thunks
export const fetchContacts = createAsyncThunk("transfer/fetchContacts", async () => {
  const response = await TransferService.getContacts()
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch contacts")
  }
  return response.data
})

export const fetchContact = createAsyncThunk("transfer/fetchContact", async (contactId: string) => {
  const response = await TransferService.getContact(contactId)
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch contact")
  }
  return response.data
})

export const fetchTransferHistory = createAsyncThunk("transfer/fetchTransferHistory", async (limit = 10) => {
  const response = await TransferService.getTransferHistory(limit)
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch transfer history")
  }
  return response.data
})

export const processTransfer = createAsyncThunk("transfer/processTransfer", async (transferData: TransferRequest) => {
  const response = await TransferService.processTransfer(transferData)
  if (!response.success) {
    throw new Error(response.error || "Failed to process transfer")
  }
  return response.data
})

export const addContact = createAsyncThunk("transfer/addContact", async (contactData: any) => {
  const response = await TransferService.addContact(contactData)
  if (!response.success) {
    throw new Error(response.error || "Failed to add contact")
  }
  return response.data
})

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<any | null>) => {
      state.selectedContact = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearLastTransfer: (state) => {
      state.lastTransfer = null
    },
    // Add a transaction to the history (for localStorage integration)
    addTransactionToHistory: (state, action: PayloadAction<Transaction>) => {
      state.transferHistory.unshift(action.payload)
    },
    // Update contacts with localStorage data
    updateContacts: (state, action: PayloadAction<any[]>) => {
      state.contacts = action.payload
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
        state.isLoading = true
        state.error = null
      })
      .addCase(processTransfer.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastTransfer = action.payload

        // Add the new transaction to history
        const newTransaction: Transaction = {
          id: action.payload.transactionId,
          type: "transfer",
          amount: -action.payload.amount,
          description: `Transferencia a ${action.payload.contactName}`,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
          category: "Transferencias",
          contactName: action.payload.contactName,
          balance: 0, // This would be updated by the backend in a real app
        }

        state.transferHistory.unshift(newTransaction)
      })
      .addCase(processTransfer.rejected, (state, action) => {
        state.isLoading = false
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

export const { setSelectedContact, clearError, clearLastTransfer, addTransactionToHistory, updateContacts } =
  transferSlice.actions

export default transferSlice.reducer
