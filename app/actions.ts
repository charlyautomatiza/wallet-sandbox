"use server"

import { TransferService } from "@/lib/api/services/transfer.service"
import { RequestService } from "@/lib/api/services/request.service"
import { AccountService } from "@/lib/api/services/account.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Transfer action
export async function handleTransfer(formData: FormData) {
  const contactId = formData.get("contactId") as string
  const contactName = formData.get("contactName") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const reason = formData.get("reason") as string
  const comment = formData.get("comment") as string

  // Validation
  if (!contactId || !contactName || !amount || amount <= 0) {
    return {
      success: false,
      error: "Todos los campos son requeridos y el monto debe ser mayor a 0",
    }
  }

  if (amount > 1000000) {
    return {
      success: false,
      error: "El monto máximo por transferencia es $1.000.000",
    }
  }

  try {
    const result = await TransferService.processTransfer({
      contactId,
      contactName,
      amount,
      reason,
      comment,
    })

    if (result.success) {
      revalidatePath("/")
      revalidatePath("/transfer")
      redirect(`/transfer/${contactId}/success?amount=${amount}&name=${encodeURIComponent(contactName)}`)
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error interno del servidor. Intenta nuevamente.",
    }
  }
}

// Request money action
export async function handleRequestMoney(formData: FormData) {
  const contactId = formData.get("contactId") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  // Validation
  if (!amount || amount <= 0) {
    return {
      success: false,
      error: "El monto debe ser mayor a 0",
    }
  }

  if (!description || description.trim().length === 0) {
    return {
      success: false,
      error: "La descripción es requerida",
    }
  }

  if (amount > 500000) {
    return {
      success: false,
      error: "El monto máximo por solicitud es $500.000",
    }
  }

  try {
    const result = await RequestService.createMoneyRequest({
      contactId,
      amount,
      description: description.trim(),
    })

    if (result.success) {
      revalidatePath("/request")
      return {
        success: true,
        message: "Solicitud de dinero enviada exitosamente",
        data: result.data,
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error interno del servidor. Intenta nuevamente.",
    }
  }
}

// Accept money request action
export async function handleAcceptRequest(requestId: string) {
  try {
    const result = await RequestService.acceptMoneyRequest(requestId)

    if (result.success) {
      revalidatePath("/request")
      return {
        success: true,
        message: "Solicitud aceptada exitosamente",
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error al aceptar la solicitud",
    }
  }
}

// Reject money request action
export async function handleRejectRequest(requestId: string) {
  try {
    const result = await RequestService.rejectMoneyRequest(requestId)

    if (result.success) {
      revalidatePath("/request")
      return {
        success: true,
        message: "Solicitud rechazada",
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error al rechazar la solicitud",
    }
  }
}

// Cancel money request action
export async function handleCancelRequest(requestId: string) {
  try {
    const result = await RequestService.cancelMoneyRequest(requestId)

    if (result.success) {
      revalidatePath("/request")
      return {
        success: true,
        message: "Solicitud cancelada exitosamente",
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error al cancelar la solicitud",
    }
  }
}

// Update account balance action
export async function handleUpdateBalance(newBalance: number) {
  try {
    const result = await AccountService.updateBalance(newBalance)

    if (result.success) {
      revalidatePath("/")
      return {
        success: true,
        message: "Saldo actualizado exitosamente",
        data: result.data,
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error al actualizar el saldo",
    }
  }
}

// Toggle card status action
export async function handleToggleCard(cardId: string) {
  try {
    const result = await AccountService.toggleCardStatus(cardId)

    if (result.success) {
      revalidatePath("/more")
      return {
        success: true,
        message: result.message,
        data: result.data,
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Error al cambiar el estado de la tarjeta",
    }
  }
}
