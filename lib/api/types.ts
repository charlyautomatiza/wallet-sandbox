// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Account Types
export interface Account {
  id: string
  balance: number
  currency: "ARS" | "USD"
  accountNumber: string
  accountType: string
}

export interface Card {
  id: string
  type: string
  number: string
  balance: number
  expiryDate: string
  holderName: string
  isActive: boolean
}

// Transfer Types
export interface Contact {
  id: string
  name: string
  initials: string
  hasUala: boolean
  email?: string
  phone?: string
  recentTransfers: RecentTransfer[]
}

export interface RecentTransfer {
  amount: number
  date: string
  type: "sent" | "received"
}

export interface TransferRequest {
  contactId: string
  contactName: string
  amount: number
  reason: string
  comment?: string
}

export interface TransferResponse {
  id: string
  amount: number
  reason: string
  comment: string
  contactId: string
  contactName: string
  date: string
  timestamp: string
  status: "pending" | "completed" | "failed"
  transactionId: string
}

// Request Money Types
export interface MoneyRequest {
  id: string
  amount: number
  description: string
  requesterId: string
  requesterName: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  expiresAt: string
}

export interface MoneyRequestInput {
  amount: number
  description: string
  contactId?: string
}

// Transaction Types
export interface Transaction {
  id: string
  type: "transfer" | "payment" | "deposit" | "withdrawal" | "request"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  category: string
  contactName?: string
  balance: number
}

// Investment Types
export interface Investment {
  id: string
  name: string
  type: "stocks" | "bonds" | "crypto" | "funds"
  amount: number
  currentValue: number
  performance: number
  performancePercentage: number
  lastUpdate: string
}

// Payment Types
export interface PaymentService {
  id: string
  name: string
  category: string
  icon: string
  isAvailable: boolean
}

export interface PaymentRequest {
  serviceId: string
  amount: number
  accountNumber?: string
  reference?: string
}
