import { apiClient } from "../client"
import { mockContacts, mockTransactions, mockAccount } from "../mock-data"
import { storage, STORAGE_KEYS } from "../../storage"
import type { ApiResponse, Contact, TransferRequest, TransferResponse, Transaction } from "../types"

export class TransferService {
  static async getContacts(): Promise<ApiResponse<Contact[]>> {
    try {
      await apiClient.get<Contact[]>("/transfers/contacts")

      const storedContacts = storage.getItem<Contact[]>(STORAGE_KEYS.CONTACTS, [])
      const allContacts = [...mockContacts]

      storedContacts.forEach((storedContact) => {
        if (!allContacts.find((contact) => contact.id === storedContact.id)) {
          allContacts.push(storedContact)
        }
      })

      return {
        success: true,
        data: allContacts,
        message: "Contacts retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve contacts",
      }
    }
  }

  static async getContact(contactId: string): Promise<ApiResponse<Contact>> {
    try {
      await apiClient.get<Contact>(`/transfers/contacts/${contactId}`)

      let contact = mockContacts.find((c) => c.id === contactId)

      if (!contact) {
        const storedContacts = storage.getItem<Contact[]>(STORAGE_KEYS.CONTACTS, [])
        contact = storedContacts.find((c) => c.id === contactId)
      }

      if (!contact) {
        return {
          success: false,
          error: "Contact not found",
        }
      }

      return {
        success: true,
        data: contact,
        message: "Contact retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve contact",
      }
    }
  }

  static getStoredTransactions(): Transaction[] {
    return storage.getItem<Transaction[]>(STORAGE_KEYS.TRANSFERS, [])
  }

  static saveTransaction(transaction: Transaction): void {
    const storedTransactions = this.getStoredTransactions()
    storedTransactions.unshift(transaction)
    storage.setItem(STORAGE_KEYS.TRANSFERS, storedTransactions)
  }

  static getCombinedTransactions(): Transaction[] {
    const storedTransactions = this.getStoredTransactions()
    const allTransactions = [...storedTransactions, ...mockTransactions]
    return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static async processTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferResponse>> {
    try {
      await apiClient.post<TransferResponse>("/transfers", transferData, 2000)

      const transferResponse: TransferResponse = {
        id: `transfer_${Date.now()}`,
        amount: transferData.amount,
        reason: transferData.reason,
        comment: transferData.comment || "",
        contactId: transferData.contactId,
        contactName: transferData.contactName,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
        status: "completed",
        transactionId: `txn_${Date.now()}`,
      }

      const currentBalance = mockAccount.balance
      const newBalance = currentBalance - transferData.amount
      mockAccount.balance = newBalance

      const newTransaction: Transaction = {
        id: transferResponse.transactionId,
        type: "transfer",
        amount: -transferData.amount,
        description: `Transferencia a ${transferData.contactName}`,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        category: "Transferencias",
        contactName: transferData.contactName,
        balance: newBalance,
      }

      this.saveTransaction(newTransaction)

      const contact = mockContacts.find((c) => c.id === transferData.contactId)
      if (contact) {
        contact.recentTransfers.unshift({
          amount: transferData.amount,
          date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
          type: "sent",
        })
        contact.recentTransfers = contact.recentTransfers.slice(0, 5)
      }

      return {
        success: true,
        data: transferResponse,
        message: "Transfer completed successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to process transfer. Please try again.",
      }
    }
  }

  static async getTransferHistory(limit = 10): Promise<ApiResponse<Transaction[]>> {
    try {
      await apiClient.get<Transaction[]>(`/transfers/history?limit=${limit}`)

      const allTransactions = this.getCombinedTransactions()
      const transferTransactions = allTransactions.filter((t) => t.type === "transfer").slice(0, limit)

      return {
        success: true,
        data: transferTransactions,
        message: "Transfer history retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve transfer history",
      }
    }
  }

  static async addContact(contactData: Omit<Contact, "id" | "recentTransfers">): Promise<ApiResponse<Contact>> {
    try {
      await apiClient.post<Contact>("/transfers/contacts", contactData)

      const newContact: Contact = {
        ...contactData,
        id: `contact_${Date.now()}`,
        recentTransfers: [],
      }

      const storedContacts = storage.getItem<Contact[]>(STORAGE_KEYS.CONTACTS, [])
      storedContacts.push(newContact)
      storage.setItem(STORAGE_KEYS.CONTACTS, storedContacts)

      return {
        success: true,
        data: newContact,
        message: "Contact added successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to add contact",
      }
    }
  }

  static clearStoredData(): void {
    storage.removeItem(STORAGE_KEYS.TRANSFERS)
    storage.removeItem(STORAGE_KEYS.CONTACTS)
  }
}
