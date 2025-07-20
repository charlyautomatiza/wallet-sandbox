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

type TransferFrequency = "once" | "daily" | "weekly" | "monthly"

interface ScheduledTransfer {
  id: string
  contactId: string
  contactName: string
  amount: number
  frequency: TransferFrequency
  startDate: string
  nextDate: string
  reason: string
  comment?: string
  active: boolean
}

interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
  frequency: TransferFrequency
  startDate: string
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
  frequency: "once",
  startDate: new Date().toISOString().split('T')[0],
  scheduledTransfers: [
    {
      id: "st1",
      contactId: "1",
      contactName: "Elyer Saitest",
      amount: 15000,
      frequency: "monthly",
      startDate: "2025-06-15",
      nextDate: "2025-08-15",
      reason: "Alquiler",
      comment: "Pago mensual de alquiler",
      active: true
    }
  ]
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
    setFrequency: (state, action: PayloadAction<TransferFrequency>) => {
      state.frequency = action.payload
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload
    },
    addScheduledTransfer: (state, action: PayloadAction<ScheduledTransfer>) => {
      state.scheduledTransfers.push(action.payload)
    },
    updateScheduledTransfer: (state, action: PayloadAction<ScheduledTransfer>) => {
      const index = state.scheduledTransfers.findIndex(transfer => transfer.id === action.payload.id)
      if (index !== -1) {
        state.scheduledTransfers[index] = action.payload
      }
    },
    removeScheduledTransfer: (state, action: PayloadAction<string>) => {
      state.scheduledTransfers = state.scheduledTransfers.filter(transfer => transfer.id !== action.payload)
    },
    toggleScheduledTransferActive: (state, action: PayloadAction<string>) => {
      const transfer = state.scheduledTransfers.find(t => t.id === action.payload)
      if (transfer) {
        transfer.active = !transfer.active
      }
    }
  },
})

export const { 
  setSelectedContact, 
  setAmount, 
  setFrequency, 
  setStartDate, 
  addScheduledTransfer, 
  updateScheduledTransfer,
  removeScheduledTransfer,
  toggleScheduledTransferActive 
} = transferSlice.actions
export const transferReducer = transferSlice.reducer
