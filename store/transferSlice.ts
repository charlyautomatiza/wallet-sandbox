import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Contact {
  id: string
  name: string
  initials: string
  hasUala: boolean
  recentTransfers: Array<{
    amount: number
    date: string
  }>
}

type TransferFrequency = 'once' | 'daily' | 'weekly' | 'monthly'
type TransferStatus = 'pending' | 'completed' | 'cancelled'

export interface ScheduledTransfer {
  id: string
  contactId: string
  contactName: string
  amount: number
  reason: string
  comment?: string
  scheduledDate: string
  frequency: TransferFrequency
  status: TransferStatus
  createdAt: string
}

interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
  isScheduled: boolean
  scheduledDate: string | null
  frequency: TransferFrequency
  scheduledTransfers: ScheduledTransfer[]
}

const initialState: TransferState = {
  contacts: [
    {
      id: "1",
      name: "Elyer Saitest",
      initials: "ES",
      hasUala: true,
      recentTransfers: [
        { amount: 40000, date: "18/01" },
        { amount: 30000, date: "03/01" },
        { amount: 50000, date: "19/12/2024" },
      ],
    },
    {
      id: "2",
      name: "Pato Free Range",
      initials: "FR",
      hasUala: true,
      recentTransfers: [],
    },
  ],
  selectedContact: null,
  amount: 0,
  isScheduled: false,
  scheduledDate: null,
  frequency: 'once',
  scheduledTransfers: []
}

export const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
    },
    setIsScheduled: (state, action: PayloadAction<boolean>) => {
      state.isScheduled = action.payload
    },
    setScheduledDate: (state, action: PayloadAction<string | null>) => {
      state.scheduledDate = action.payload
    },
    setFrequency: (state, action: PayloadAction<TransferFrequency>) => {
      state.frequency = action.payload
    },
    addScheduledTransfer: (state, action: PayloadAction<ScheduledTransfer>) => {
      state.scheduledTransfers.push(action.payload)
    },
    updateScheduledTransfer: (state, action: PayloadAction<{id: string, updates: Partial<ScheduledTransfer>}>) => {
      const { id, updates } = action.payload
      const transferIndex = state.scheduledTransfers.findIndex(t => t.id === id)
      if (transferIndex !== -1) {
        state.scheduledTransfers[transferIndex] = {
          ...state.scheduledTransfers[transferIndex],
          ...updates
        }
      }
    },
    cancelScheduledTransfer: (state, action: PayloadAction<string>) => {
      const transferId = action.payload
      const transferIndex = state.scheduledTransfers.findIndex(t => t.id === transferId)
      if (transferIndex !== -1) {
        state.scheduledTransfers[transferIndex].status = 'cancelled'
      }
    },
    resetTransferSchedule: (state) => {
      state.isScheduled = false
      state.scheduledDate = null
      state.frequency = 'once'
    }
  },
})

export const { 
  setSelectedContact, 
  setAmount, 
  setIsScheduled, 
  setScheduledDate, 
  setFrequency,
  addScheduledTransfer,
  updateScheduledTransfer,
  cancelScheduledTransfer,
  resetTransferSchedule
} = transferSlice.actions
export const transferReducer = transferSlice.reducer
