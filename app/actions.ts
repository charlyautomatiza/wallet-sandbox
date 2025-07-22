"use server"

import { TransferService } from "@/lib/api/services/transfer.service"
import type { TransferRequest } from "@/lib/api/types"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = Number(formData.get("amount"))
    const contactId = formData.get("contactId") as string
    const contactName = formData.get("contactName") as string
    const reason = formData.get("reason") as string
    const comment = formData.get("comment") as string

    // Validate required fields
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "El monto debe ser mayor a 0",
      }
    }

    if (!contactId || !contactName) {
      return {
        success: false,
        error: "Información del contacto requerida",
      }
    }

    // Create transfer request
    const transferRequest: TransferRequest = {
      contactId,
      contactName,
      amount,
      reason: reason || "Varios",
      comment: comment || "",
    }

    // Process the transfer
    const result = await TransferService.processTransfer(transferRequest)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Error al procesar la transferencia",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Transfer error:", error)
    return {
      success: false,
      error: "Error interno del servidor",
    }
  }
}

// Action to get transfer history
export async function getTransferHistory(limit = 10) {
  try {
    const result = await TransferService.getTransferHistory(limit)
    return result
  } catch (error) {
    console.error("Get transfer history error:", error)
    return {
      success: false,
      error: "Error al obtener el historial de transferencias",
    }
  }
}

// Action to add a new contact
export async function addContact(contactData: {
  name: string
  initials: string
  hasUala: boolean
  email?: string
  phone?: string
}) {
  try {
    const result = await TransferService.addContact(contactData)
    return result
  } catch (error) {
    console.error("Add contact error:", error)
    return {
      success: false,
      error: "Error al agregar el contacto",
    }
  }
}
