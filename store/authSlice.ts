import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  isAuthenticated: boolean
  user: {
    name: string
    initials: string
    points: number
  } | null
}

const initialState: AuthState = {
  isAuthenticated: true, // For demo purposes
  user: {
    name: "Carlos",
    initials: "CA",
    points: 40933,
  },
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, logout } = authSlice.actions
export const authReducer = authSlice.reducer

