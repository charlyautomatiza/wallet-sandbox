import type { Account, Card, Contact, Transaction, Investment, PaymentService, MoneyRequest } from "./types"

// Mock Account Data
export const mockAccount: Account = {
  id: "acc_001",
  balance: 330170.01,
  currency: "ARS",
  accountNumber: "0000-0000-0000-9796",
  accountType: "Cuenta Corriente",
}

// Mock Cards Data
export const mockCards: Card[] = [
  {
    id: "card_001",
    type: "Prepaga",
    number: "9796",
    balance: 330170.01,
    expiryDate: "12/27",
    holderName: "Usuario Demo",
    isActive: true,
  },
  {
    id: "card_002",
    type: "Crédito",
    number: "4521",
    balance: 150000.0,
    expiryDate: "08/26",
    holderName: "Usuario Demo",
    isActive: true,
  },
]

// Mock Contacts Data - Extended with more contacts
export const mockContacts: Contact[] = [
  // Contacts with Ualá
  {
    id: "1",
    name: "Elyer Saitest",
    initials: "ES",
    hasUala: true,
    email: "elyer@example.com",
    phone: "+54 9 11 1234-5678",
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
    email: "pato@example.com",
    phone: "+54 9 11 8765-4321",
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
    email: "ana.martinez@example.com",
    phone: "+54 9 11 2222-3333",
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
    email: "carlos.rodriguez@example.com",
    phone: "+54 9 11 4444-5555",
    recentTransfers: [{ amount: 35000, date: "17/01", type: "received" }],
  },
  {
    id: "5",
    name: "Lucía Fernández",
    initials: "LF",
    hasUala: true,
    email: "lucia.fernandez@example.com",
    phone: "+54 9 11 6666-7777",
    recentTransfers: [],
  },
  {
    id: "6",
    name: "Diego Morales",
    initials: "DM",
    hasUala: true,
    email: "diego.morales@example.com",
    phone: "+54 9 11 8888-9999",
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
    email: "maria.gonzalez@example.com",
    phone: "+54 9 11 5555-1234",
    recentTransfers: [{ amount: 60000, date: "16/01", type: "sent" }],
  },
  {
    id: "8",
    name: "Roberto Silva",
    initials: "RS",
    hasUala: false,
    email: "roberto.silva@example.com",
    phone: "+54 9 11 7777-8888",
    recentTransfers: [],
  },
  {
    id: "9",
    name: "Carmen López",
    initials: "CL",
    hasUala: false,
    email: "carmen.lopez@example.com",
    phone: "+54 9 11 9999-0000",
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
    email: "fernando.ruiz@example.com",
    phone: "+54 9 11 1111-2222",
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
    email: "valentina.castro@example.com",
    phone: "+54 9 11 3333-4444",
    recentTransfers: [],
  },
  {
    id: "12",
    name: "Sebastián Torres",
    initials: "ST",
    hasUala: false,
    email: "sebastian.torres@example.com",
    phone: "+54 9 11 5555-6666",
    recentTransfers: [{ amount: 17000, date: "09/01", type: "received" }],
  },
]

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "transfer",
    amount: -40000,
    description: "Transferencia a Elyer Saitest",
    date: "2025-01-18",
    status: "completed",
    category: "Transferencias",
    contactName: "Elyer Saitest",
    balance: 330170.01,
  },
  {
    id: "txn_002",
    type: "deposit",
    amount: 100000,
    description: "Depósito en efectivo",
    date: "2025-01-17",
    status: "completed",
    category: "Depósitos",
    balance: 370170.01,
  },
  {
    id: "txn_003",
    type: "payment",
    amount: -15000,
    description: "Pago de servicios - Luz",
    date: "2025-01-16",
    status: "completed",
    category: "Servicios",
    balance: 270170.01,
  },
  {
    id: "txn_004",
    type: "transfer",
    amount: 30000,
    description: "Transferencia recibida de Pato Free Range",
    date: "2025-01-15",
    status: "completed",
    category: "Transferencias",
    contactName: "Pato Free Range",
    balance: 285170.01,
  },
  {
    id: "txn_005",
    type: "transfer",
    amount: -75000,
    description: "Transferencia a Ana Martínez",
    date: "2025-01-14",
    status: "completed",
    category: "Transferencias",
    contactName: "Ana Martínez",
    balance: 255170.01,
  },
  {
    id: "txn_006",
    type: "transfer",
    amount: -60000,
    description: "Transferencia a María González",
    date: "2025-01-13",
    status: "completed",
    category: "Transferencias",
    contactName: "María González",
    balance: 195170.01,
  },
]

// Mock Investments Data
export const mockInvestments: Investment[] = [
  {
    id: "inv_001",
    name: "Fondo Común de Inversión",
    type: "funds",
    amount: 50000,
    currentValue: 52500,
    performance: 2500,
    performancePercentage: 5.0,
    lastUpdate: "2025-01-22",
  },
  {
    id: "inv_002",
    name: "Acciones AAPL",
    type: "stocks",
    amount: 25000,
    currentValue: 23750,
    performance: -1250,
    performancePercentage: -5.0,
    lastUpdate: "2025-01-22",
  },
  {
    id: "inv_003",
    name: "Bitcoin",
    type: "crypto",
    amount: 30000,
    currentValue: 33600,
    performance: 3600,
    performancePercentage: 12.0,
    lastUpdate: "2025-01-22",
  },
]

// Mock Payment Services Data
export const mockPaymentServices: PaymentService[] = [
  {
    id: "service_001",
    name: "Edesur",
    category: "Servicios",
    icon: "⚡",
    isAvailable: true,
  },
  {
    id: "service_002",
    name: "Telecom",
    category: "Telecomunicaciones",
    icon: "📞",
    isAvailable: true,
  },
  {
    id: "service_003",
    name: "Netflix",
    category: "Entretenimiento",
    icon: "🎬",
    isAvailable: true,
  },
  {
    id: "service_004",
    name: "Spotify",
    category: "Entretenimiento",
    icon: "🎵",
    isAvailable: false,
  },
]

// Mock Money Requests Data
export const mockMoneyRequests: MoneyRequest[] = [
  {
    id: "req_001",
    amount: 15000,
    description: "Cena del viernes",
    requesterId: "1",
    requesterName: "Elyer Saitest",
    status: "pending",
    createdAt: "2025-01-22T10:00:00Z",
    expiresAt: "2025-01-29T10:00:00Z",
  },
  {
    id: "req_002",
    amount: 8000,
    description: "Taxi compartido",
    requesterId: "2",
    requesterName: "Pato Free Range",
    status: "accepted",
    createdAt: "2025-01-21T15:30:00Z",
    expiresAt: "2025-01-28T15:30:00Z",
  },
]
