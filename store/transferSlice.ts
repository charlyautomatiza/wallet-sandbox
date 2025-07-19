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
