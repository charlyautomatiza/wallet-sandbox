"use server"

import { revalidatePath } from "next/cache"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = formData.get("amount")
    const reason = formData.get("reason") || "Varios"
    const comment = formData.get("comment") || ""
    const contactId = formData.get("contactId")
    const contactName = formData.get("contactName")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful transfer
    console.log("Transfer processed:", {
      amount,
      reason,
      comment,
      contactId,
      contactName,
      timestamp: new Date().toISOString(),
    })

    revalidatePath("/transfer")
    return {
      success: true,
      data: {
        amount: Number(amount),
        reason,
        comment,
        contactId,
        contactName,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
      },
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
    const amount = formData.get("amount")
    const description = formData.get("description")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    revalidatePath("/request")
    return {
      success: true,
      data: {
        amount,
        description,
        date: new Date().toLocaleDateString(),
      },
    }
  } catch (error) {
    console.error("Request money failed:", error)
    return { error: "Failed to process request" }
  }
}

export async function handleScheduleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = formData.get("amount")
    const reason = formData.get("reason") || "Varios"
    const comment = formData.get("comment") || ""
    const contactId = formData.get("contactId")
    const contactName = formData.get("contactName")
    const scheduledDate = formData.get("scheduledDate")
    const frequency = formData.get("frequency") || "once"

    // Validar fecha (debe ser futura)
    const scheduleDate = new Date(scheduledDate as string)
    const now = new Date()
    if (scheduleDate <= now) {
      return {
        success: false,
        error: "La fecha programada debe ser futura",
      }
    }

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generar ID único para la transferencia programada
    const transferId = `scheduled_${Date.now()}`

    const scheduledTransfer = {
      id: transferId,
      amount: Number(amount),
      reason,
      comment,
      contactId,
      contactName,
      scheduledDate: scheduleDate.toISOString(),
      frequency,
      active: true,
      createdAt: new Date().toISOString(),
      nextExecution: scheduleDate.toISOString(),
    }

    console.log("Scheduled transfer created:", scheduledTransfer)

    revalidatePath("/transfer/scheduled")
    revalidatePath("/")
    return {
      success: true,
      data: scheduledTransfer,
    }
  } catch (error) {
    console.error("Failed to schedule transfer:", error)
    return {
      success: false,
      error: "No se pudo programar la transferencia. Intenta nuevamente.",
    }
  }
}

export async function handleUpdateScheduledTransfer(prevState: any, formData: FormData) {
  try {
    const transferId = formData.get("transferId")
    const amount = formData.get("amount")
    const reason = formData.get("reason")
    const comment = formData.get("comment")
    const scheduledDate = formData.get("scheduledDate")
    const frequency = formData.get("frequency")

    // Validar fecha si se proporciona
    if (scheduledDate) {
      const scheduleDate = new Date(scheduledDate as string)
      const now = new Date()
      if (scheduleDate <= now) {
        return {
          success: false,
          error: "La fecha programada debe ser futura",
        }
      }
    }

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updates = {
      ...(amount && { amount: Number(amount) }),
      ...(reason && { reason }),
      ...(comment !== undefined && { comment }),
      ...(scheduledDate && { 
        scheduledDate: new Date(scheduledDate as string).toISOString(),
        nextExecution: new Date(scheduledDate as string).toISOString()
      }),
      ...(frequency && { frequency }),
    }

    console.log("Scheduled transfer updated:", { transferId, updates })

    revalidatePath("/transfer/scheduled")
    return {
      success: true,
      data: { transferId, updates },
    }
  } catch (error) {
    console.error("Failed to update scheduled transfer:", error)
    return {
      success: false,
      error: "No se pudo actualizar la transferencia programada.",
    }
  }
}

export async function handleCancelScheduledTransfer(prevState: any, formData: FormData) {
  try {
    const transferId = formData.get("transferId")

    if (!transferId) {
      return {
        success: false,
        error: "ID de transferencia requerido",
      }
    }

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log("Scheduled transfer cancelled:", transferId)

    revalidatePath("/transfer/scheduled")
    return {
      success: true,
      data: { transferId },
    }
  } catch (error) {
    console.error("Failed to cancel scheduled transfer:", error)
    return {
      success: false,
      error: "No se pudo cancelar la transferencia programada.",
    }
  }
}
