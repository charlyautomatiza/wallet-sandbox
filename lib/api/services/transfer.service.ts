import { apiClient } from "../client"
import { mockContacts, mockTransactions, mockAccount } from "../mock-data"
import type { ApiResponse, Contact, TransferRequest, TransferResponse, Transaction } from "../types"

export class TransferService {
  // Get contacts list
  static async getContacts(): Promise<ApiResponse<Contact[]>> {
    try {
      const response = await apiClient.get<Contact[]>("/transfers/contacts")

      return {
        success: true,
        data: mockContacts,
        message: "Contacts retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to retrieve contacts",
      }
    }
  }

  // Get contact by ID
  static async getContact(contactId: string): Promise<ApiResponse<Contact>> {
    try {
      const response = await apiClient.get<Contact>(`/transfers/contacts/${contactId}`)

      const contact = mockContacts.find((c) => c.id === contactId)

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

  // Process transfer
  static async processTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferResponse>> {
    try {
      // Simulate processing delay
      const response = await apiClient.post<TransferResponse>("/transfers", transferData, 2000)

      // Generate mock response
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

      // Update mock account balance
      mockAccount.balance -= transferData.amount

      // Add transaction to mock data
      const newTransaction: Transaction = {
        id: transferResponse.transactionId,
        type: "transfer",
        amount: -transferData.amount,
        description: `Transferencia a ${transferData.contactName}`,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        category: "Transferencias",
        contactName: transferData.contactName,
        balance: mockAccount.balance,
      }

      mockTransactions.unshift(newTransaction)

      // Update contact's recent transfers
      const contact = mockContacts.find((c) => c.id === transferData.contactId)
      if (contact) {
        contact.recentTransfers.unshift({
          amount: transferData.amount,
          date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
          type: "sent",
        })

        // Keep only last 5 transfers
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

  // Get transfer history
  static async getTransferHistory(limit = 10): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get<Transaction[]>(`/transfers/history?limit=${limit}`)

      const transferTransactions = mockTransactions.filter((t) => t.type === "transfer").slice(0, limit)

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

  // Add new contact
  static async addContact(contactData: Omit<Contact, "id" | "recentTransfers">): Promise<ApiResponse<Contact>> {
    try {
      const response = await apiClient.post<Contact>("/transfers/contacts", contactData)

      const newContact: Contact = {
        ...contactData,
        id: `contact_${Date.now()}`,
        recentTransfers: [],
      }

      mockContacts.push(newContact)

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
}
