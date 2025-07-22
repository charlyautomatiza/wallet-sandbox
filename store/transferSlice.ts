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

interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
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
  },
})

export const { setSelectedContact, setAmount } = transferSlice.actions
export const transferReducer = transferSlice.reducer
