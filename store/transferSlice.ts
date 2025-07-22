import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { storage, STORAGE_KEYS } from "../lib/storage"

interface Contact {
  id: string
  name: string
  initials: string
  hasUala: boolean
  recentTransfers: Array<{
    amount: number
    date: string
    type: "sent" | "received"
  }>
}

interface TransferState {
  contacts: Contact[]
  selectedContact: Contact | null
  amount: number
}

// Initial contacts with more variety
const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Elyer Saitest",
    initials: "ES",
    hasUala: true,
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
    recentTransfers: [{ amount: 35000, date: "17/01", type: "received" }],
  },
  {
    id: "5",
    name: "Lucía Fernández",
    initials: "LF",
    hasUala: true,
    recentTransfers: [],
  },
  {
    id: "6",
    name: "Diego Morales",
    initials: "DM",
    hasUala: true,
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
    recentTransfers: [{ amount: 60000, date: "16/01", type: "sent" }],
  },
  {
    id: "8",
    name: "Roberto Silva",
    initials: "RS",
    hasUala: false,
    recentTransfers: [],
  },
  {
    id: "9",
    name: "Carmen López",
    initials: "CL",
    hasUala: false,
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
    recentTransfers: [],
  },
  {
    id: "12",
    name: "Sebastián Torres",
    initials: "ST",
    hasUala: false,
    recentTransfers: [{ amount: 17000, date: "09/01", type: "received" }],
  },
]

// Load contacts from localStorage or use initial contacts
const loadContacts = (): Contact[] => {
  const storedContacts = storage.getItem<Contact[]>(STORAGE_KEYS.CONTACTS, [])

  // Merge initial contacts with stored contacts, avoiding duplicates
  const allContacts = [...initialContacts]
  storedContacts.forEach((storedContact) => {
    if (!allContacts.find((contact) => contact.id === storedContact.id)) {
      allContacts.push(storedContact)
    }
  })

  return allContacts
}

const initialState: TransferState = {
  contacts: loadContacts(),
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
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload)
      // Save to localStorage
      storage.setItem(STORAGE_KEYS.CONTACTS, state.contacts)
    },
    updateContactTransfers: (
      state,
      action: PayloadAction<{
        contactId: string
        transfer: { amount: number; date: string; type: "sent" | "received" }
      }>,
    ) => {
      const { contactId, transfer } = action.payload
      const contact = state.contacts.find((c) => c.id === contactId)
      if (contact) {
        contact.recentTransfers.unshift(transfer)
        // Keep only last 5 transfers
        contact.recentTransfers = contact.recentTransfers.slice(0, 5)
        // Save to localStorage
        storage.setItem(STORAGE_KEYS.CONTACTS, state.contacts)
      }
    },
    loadContactsFromStorage: (state) => {
      state.contacts = loadContacts()
    },
  },
})

export const { setSelectedContact, setAmount, addContact, updateContactTransfers, loadContactsFromStorage } =
  transferSlice.actions
export const transferReducer = transferSlice.reducer
