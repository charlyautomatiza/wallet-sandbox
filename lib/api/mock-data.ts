import type { Account, Contact, Transaction, Investment, MoneyRequest } from "./types"

// Mock account data
export const mockAccount: Account = {
  id: "acc_123456789",
  balance: 125430.5,
  currency: "ARS",
  accountNumber: "1234567890123456",
  accountType: "savings",
  isActive: true,
  createdAt: "2023-01-15T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
}

// Extended mock contacts with and without Ualá
export const mockContacts: Contact[] = [
  // Contacts WITH Ualá
  {
    id: "contact_1",
    name: "Elyer Saitest",
    initials: "ES",
    hasUala: true,
    email: "elyer.saitest@example.com",
    phone: "+54 9 11 1234-5678",
    recentTransfers: [
      { amount: 5000, date: "15/01", type: "sent" },
      { amount: 2500, date: "12/01", type: "received" },
      { amount: 1200, date: "08/01", type: "sent" },
    ],
  },
  {
    id: "contact_2",
    name: "Pato Free Range",
    initials: "PF",
    hasUala: true,
    email: "pato.freerange@example.com",
    phone: "+54 9 11 2345-6789",
    recentTransfers: [
      { amount: 8000, date: "14/01", type: "received" },
      { amount: 3500, date: "10/01", type: "sent" },
    ],
  },
  {
    id: "contact_3",
    name: "Ana Martínez",
    initials: "AM",
    hasUala: true,
    email: "ana.martinez@example.com",
    phone: "+54 9 11 3456-7890",
    recentTransfers: [
      { amount: 12000, date: "16/01", type: "sent" },
      { amount: 4500, date: "13/01", type: "received" },
      { amount: 2800, date: "09/01", type: "sent" },
    ],
  },
  {
    id: "contact_4",
    name: "Carlos Rodriguez",
    initials: "CR",
    hasUala: true,
    email: "carlos.rodriguez@example.com",
    phone: "+54 9 11 4567-8901",
    recentTransfers: [
      { amount: 6500, date: "17/01", type: "received" },
      { amount: 1800, date: "11/01", type: "sent" },
    ],
  },
  {
    id: "contact_5",
    name: "Lucía Fernández",
    initials: "LF",
    hasUala: true,
    email: "lucia.fernandez@example.com",
    phone: "+54 9 11 5678-9012",
    recentTransfers: [
      { amount: 9200, date: "18/01", type: "sent" },
      { amount: 3200, date: "14/01", type: "received" },
      { amount: 1500, date: "07/01", type: "sent" },
    ],
  },
  {
    id: "contact_6",
    name: "Diego Morales",
    initials: "DM",
    hasUala: true,
    email: "diego.morales@example.com",
    phone: "+54 9 11 6789-0123",
    recentTransfers: [
      { amount: 4800, date: "19/01", type: "received" },
      { amount: 2100, date: "15/01", type: "sent" },
    ],
  },

  // Contacts WITHOUT Ualá
  {
    id: "contact_7",
    name: "María González",
    initials: "MG",
    hasUala: false,
    email: "maria.gonzalez@example.com",
    phone: "+54 9 11 7890-1234",
    recentTransfers: [
      { amount: 15000, date: "20/01", type: "sent" },
      { amount: 7500, date: "16/01", type: "received" },
    ],
  },
  {
    id: "contact_8",
    name: "Roberto Silva",
    initials: "RS",
    hasUala: false,
    email: "roberto.silva@example.com",
    phone: "+54 9 11 8901-2345",
    recentTransfers: [
      { amount: 22000, date: "21/01", type: "received" },
      { amount: 5500, date: "17/01", type: "sent" },
      { amount: 3300, date: "12/01", type: "sent" },
    ],
  },
  {
    id: "contact_9",
    name: "Carmen López",
    initials: "CL",
    hasUala: false,
    email: "carmen.lopez@example.com",
    phone: "+54 9 11 9012-3456",
    recentTransfers: [
      { amount: 18500, date: "22/01", type: "sent" },
      { amount: 4200, date: "18/01", type: "received" },
    ],
  },
  {
    id: "contact_10",
    name: "Fernando Ruiz",
    initials: "FR",
    hasUala: false,
    email: "fernando.ruiz@example.com",
    phone: "+54 9 11 0123-4567",
    recentTransfers: [
      { amount: 11200, date: "23/01", type: "received" },
      { amount: 6800, date: "19/01", type: "sent" },
      { amount: 2900, date: "14/01", type: "sent" },
    ],
  },
  {
    id: "contact_11",
    name: "Valentina Castro",
    initials: "VC",
    hasUala: false,
    email: "valentina.castro@example.com",
    phone: "+54 9 11 1234-5670",
    recentTransfers: [
      { amount: 8900, date: "24/01", type: "sent" },
      { amount: 3700, date: "20/01", type: "received" },
    ],
  },
  {
    id: "contact_12",
    name: "Sebastián Torres",
    initials: "ST",
    hasUala: false,
    email: "sebastian.torres@example.com",
    phone: "+54 9 11 2345-6701",
    recentTransfers: [
      { amount: 13400, date: "25/01", type: "received" },
      { amount: 5100, date: "21/01", type: "sent" },
      { amount: 2600, date: "16/01", type: "sent" },
    ],
  },
]

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "transfer",
    amount: -5000,
    description: "Transferencia a Elyer Saitest",
    date: "2024-01-15",
    status: "completed",
    category: "Transferencias",
    contactName: "Elyer Saitest",
    balance: 125430.5,
  },
  {
    id: "txn_002",
    type: "deposit",
    amount: 25000,
    description: "Depósito desde cuenta bancaria",
    date: "2024-01-14",
    status: "completed",
    category: "Depósitos",
    balance: 130430.5,
  },
  {
    id: "txn_003",
    type: "transfer",
    amount: -8000,
    description: "Transferencia a Ana Martínez",
    date: "2024-01-13",
    status: "completed",
    category: "Transferencias",
    contactName: "Ana Martínez",
    balance: 105430.5,
  },
  {
    id: "txn_004",
    type: "payment",
    amount: -1200,
    description: "Pago de servicios - Luz",
    date: "2024-01-12",
    status: "completed",
    category: "Servicios",
    balance: 113430.5,
  },
  {
    id: "txn_005",
    type: "transfer",
    amount: 3500,
    description: "Transferencia recibida de Carlos Rodriguez",
    date: "2024-01-11",
    status: "completed",
    category: "Transferencias",
    contactName: "Carlos Rodriguez",
    balance: 114630.5,
  },
]

// Mock investments
export const mockInvestments: Investment[] = [
  {
    id: "inv_001",
    name: "Plazo Fijo UVA",
    type: "fixed_deposit",
    amount: 50000,
    currentValue: 52500,
    returnRate: 5.0,
    maturityDate: "2024-03-15",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "inv_002",
    name: "Fondo Común de Inversión",
    type: "mutual_fund",
    amount: 25000,
    currentValue: 26200,
    returnRate: 4.8,
    status: "active",
    createdAt: "2024-01-10T00:00:00Z",
  },
]

// Mock money requests
export const mockMoneyRequests: MoneyRequest[] = [
  {
    id: "req_001",
    amount: 5000,
    description: "Cena del viernes",
    status: "pending",
    createdAt: "2024-01-20T18:30:00Z",
    expiresAt: "2024-01-27T18:30:00Z",
    contactId: "contact_1",
    contactName: "Elyer Saitest",
  },
  {
    id: "req_002",
    amount: 12000,
    description: "Alquiler compartido",
    status: "completed",
    createdAt: "2024-01-18T10:00:00Z",
    completedAt: "2024-01-19T14:30:00Z",
    contactId: "contact_3",
    contactName: "Ana Martínez",
  },
]
