"use server"

import { revalidatePath } from "next/cache"
import { TransferService, RequestService } from "@/lib/api"
import type { TransferRequest, MoneyRequestInput } from "@/lib/api/types"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const transferData: TransferRequest = {
      contactId: formData.get("contactId") as string,
      contactName: formData.get("contactName") as string,
      amount: Number(formData.get("amount")),
      reason: (formData.get("reason") as string) || "Varios",
      comment: (formData.get("comment") as string) || "",
    }

    // Validate required fields
    if (!transferData.amount || transferData.amount <= 0) {
      return {
        success: false,
        error: "El monto debe ser mayor a 0",
      }
    }

    if (!transferData.contactId || !transferData.contactName) {
      return {
        success: false,
        error: "Información del contacto requerida",
      }
    }

    // Use the API service instead of direct logic
    const result = await TransferService.processTransfer(transferData)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to process transfer",
      }
    }

    revalidatePath("/transfer")
    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error("Transfer failed:", error)
    return {
      success: false,
      error: "Failed to process transfer. Please try again.",
    }
  }
}

export async function handleRequestMoney(prevState: any, formData: FormData) {
  try {
    const requestData: MoneyRequestInput = {
      amount: Number(formData.get("amount")),
      description: (formData.get("description") as string) || "",
      contactId: (formData.get("contactId") as string) || undefined,
    }

    // Validate required fields
    if (!requestData.amount || requestData.amount <= 0) {
      return {
        success: false,
        error: "El monto debe ser mayor a 0",
      }
    }

    // Use the API service instead of direct logic
    const result = await RequestService.createMoneyRequest(requestData)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to process request",
      }
    }

    revalidatePath("/request")
    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error("Request failed:", error)
    return {
      success: false,
      error: "Failed to process request",
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
