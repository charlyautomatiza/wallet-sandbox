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

interface ScheduledTransfer {
  id: string
  contactId: string
  contactName: string
  amount: number
  reason: string
  comment?: string
  scheduledDate: string // ISO format
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  active: boolean
  createdAt: string
  nextExecution?: string
}

interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
  scheduledTransfers: ScheduledTransfer[]
}

const initialState: TransferState = {
  contacts: [
    // Contactos que tienen Ualá
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
      initials: "PF",
      hasUala: true,
      recentTransfers: [],
    },
    {
      id: "3",
      name: "María González",
      initials: "MG",
      hasUala: true,
      recentTransfers: [
        { amount: 15000, date: "20/01" },
        { amount: 25000, date: "10/01" },
      ],
    },
    {
      id: "4",
      name: "Carlos Méndez",
      initials: "CM",
      hasUala: true,
      recentTransfers: [
        { amount: 60000, date: "15/01" },
      ],
    },
    {
      id: "5",
      name: "Ana Silva",
      initials: "AS",
      hasUala: true,
      recentTransfers: [],
    },
    {
      id: "6",
      name: "Roberto López",
      initials: "RL",
      hasUala: true,
      recentTransfers: [
        { amount: 20000, date: "22/01" },
        { amount: 35000, date: "05/01" },
        { amount: 12000, date: "28/12/2024" },
      ],
    },
    {
      id: "7",
      name: "Laura Fernández",
      initials: "LF",
      hasUala: true,
      recentTransfers: [
        { amount: 8000, date: "19/01" },
      ],
    },
    // Contactos que NO tienen Ualá
    {
      id: "8",
      name: "Diego Martínez",
      initials: "DM",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "9",
      name: "Patricia Ruiz",
      initials: "PR",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "10",
      name: "Fernando Castro",
      initials: "FC",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "11",
      name: "Gabriela Torres",
      initials: "GT",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "12",
      name: "Miguel Herrera",
      initials: "MH",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "13",
      name: "Valeria Morales",
      initials: "VM",
      hasUala: false,
      recentTransfers: [],
    },
    {
      id: "14",
      name: "Andrés Jiménez",
      initials: "AJ",
      hasUala: false,
      recentTransfers: [],
    },
  ],
  selectedContact: null,
  amount: 0,
  scheduledTransfers: [
    // Ejemplo de transferencias programadas para demostración
    {
      id: "sched_1",
      contactId: "1",
      contactName: "Elyer Saitest",
      amount: 25000,
      reason: "Pago mensual",
      comment: "Alquiler apartamento",
      scheduledDate: "2025-07-30T10:00:00.000Z",
      frequency: "monthly",
      active: true,
      createdAt: "2025-07-23T12:00:00.000Z",
      nextExecution: "2025-07-30T10:00:00.000Z"
    },
    {
      id: "sched_2", 
      contactId: "3",
      contactName: "María González",
      amount: 10000,
      reason: "Gastos compartidos",
      comment: "Servicios del hogar",
      scheduledDate: "2025-07-25T14:00:00.000Z",
      frequency: "weekly",
      active: true,
      createdAt: "2025-07-22T15:30:00.000Z",
      nextExecution: "2025-07-25T14:00:00.000Z"
    }
  ],
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
    addScheduledTransfer: (state, action: PayloadAction<ScheduledTransfer>) => {
      state.scheduledTransfers.push(action.payload)
    },
    updateScheduledTransfer: (state, action: PayloadAction<{ id: string; updates: Partial<ScheduledTransfer> }>) => {
      const { id, updates } = action.payload
      const index = state.scheduledTransfers.findIndex(transfer => transfer.id === id)
      if (index !== -1) {
        state.scheduledTransfers[index] = { ...state.scheduledTransfers[index], ...updates }
      }
    },
    cancelScheduledTransfer: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const index = state.scheduledTransfers.findIndex(transfer => transfer.id === id)
      if (index !== -1) {
        state.scheduledTransfers[index].active = false
      }
    },
    removeScheduledTransfer: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.scheduledTransfers = state.scheduledTransfers.filter(transfer => transfer.id !== id)
    },
  },
})

export const { 
  setSelectedContact, 
  setAmount,
  addScheduledTransfer,
  updateScheduledTransfer,
  cancelScheduledTransfer,
  removeScheduledTransfer
} = transferSlice.actions
export const transferReducer = transferSlice.reducer

// Export types for use in components
export type { ScheduledTransfer, Contact }
