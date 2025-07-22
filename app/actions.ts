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
      error: "Missing required fields or invalid amount",
    }
  }

  if (amount > 999999) {
    return {
      success: false,
      error: "Amount exceeds maximum limit",
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
      revalidatePath("/transfer")
      revalidatePath("/")
      redirect(`/transfer/${contactId}/success?transactionId=${result.data?.transactionId}`)
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Money request action
export async function handleRequestMoney(formData: FormData) {
  const contactId = formData.get("contactId") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  // Validation
  if (!amount || amount <= 0) {
    return {
      success: false,
      error: "Invalid amount",
    }
  }

  if (!description || description.trim().length === 0) {
    return {
      success: false,
      error: "Description is required",
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
      revalidatePath("/")
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Failed to create money request",
    }
  }
}

// Accept money request action
export async function handleAcceptRequest(requestId: string) {
  try {
    const result = await RequestService.acceptMoneyRequest(requestId)

    if (result.success) {
      revalidatePath("/request")
      revalidatePath("/")
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Failed to accept request",
    }
  }
}

// Reject money request action
export async function handleRejectRequest(requestId: string) {
  try {
    const result = await RequestService.rejectMoneyRequest(requestId)

    if (result.success) {
      revalidatePath("/request")
      revalidatePath("/")
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Failed to reject request",
    }
  }
}

// Update account balance action
export async function handleUpdateBalance(newBalance: number) {
  try {
    const result = await AccountService.updateBalance(newBalance)

    if (result.success) {
      revalidatePath("/")
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Failed to update balance",
    }
  }
}

// Toggle card status action
export async function handleToggleCard(cardId: string) {
  try {
    const result = await AccountService.toggleCardStatus(cardId)

    if (result.success) {
      revalidatePath("/more")
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: "Failed to toggle card status",
    }
  }
}
