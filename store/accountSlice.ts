import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AccountState {
  balance: number
  currency: "ARS" | "USD"
  cards: Array<{
    id: string
    type: string
    number: string
    balance: number
  }>
}

const initialState: AccountState = {
  balance: 330170.01,
  currency: "ARS",
  cards: [
    {
      id: "1",
      type: "Prepaga",
      number: "9796",
      balance: 330170.01,
    },
  ],
}

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<"ARS" | "USD">) => {
      state.currency = action.payload
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
  },
})

export const { setCurrency, updateBalance } = accountSlice.actions
export const accountReducer = accountSlice.reducer
