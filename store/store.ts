import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "./authSlice"
import { accountReducer } from "./accountSlice"
import { transferReducer } from "./transferSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    transfer: transferReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

