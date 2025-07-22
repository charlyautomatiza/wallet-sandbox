"use server"

import { TransferService } from "@/lib/api/services/transfer.service"
import { RequestService } from "@/lib/api/services/request.service"
import { AccountService } from "@/lib/api/services/account.service"
import type { TransferRequest, MoneyRequestInput } from "@/lib/api/types"

// Transfer action
export async function handleTransfer(formData: FormData) {
  try {
    const contactId = formData.get("contactId") as string
    const contactName = formData.get("contactName") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const reason = formData.get("reason") as string
    const comment = formData.get("comment") as string

    // Validation
    if (!contactId || !contactName) {
      return {
        success: false,
        error: "Contact information is required",
      }
    }

    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Amount must be greater than 0",
      }
    }

    if (amount > 1000000) {
      return {
        success: false,
        error: "Amount exceeds maximum limit",
      }
    }

    if (!reason) {
      return {
        success: false,
        error: "Reason is required",
      }
    }

    const transferData: TransferRequest = {
      contactId,
      contactName,
      amount,
      reason,
      comment: comment || "",
    }

    const result = await TransferService.processTransfer(transferData)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
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
      error: "An unexpected error occurred",
    }
  }
}

// Money request action
export async function handleRequestMoney(formData: FormData) {
  try {
    const contactId = formData.get("contactId") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const description = formData.get("description") as string

    // Validation
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Amount must be greater than 0",
      }
    }

    if (amount > 500000) {
      return {
        success: false,
        error: "Request amount exceeds maximum limit",
      }
    }

    if (!description) {
      return {
        success: false,
        error: "Description is required",
      }
    }

    const requestData: MoneyRequestInput = {
      contactId: contactId || undefined,
      amount,
      description,
    }

    const result = await RequestService.createMoneyRequest(requestData)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Money request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Accept money request action
export async function handleAcceptRequest(requestId: string) {
  try {
    if (!requestId) {
      return {
        success: false,
        error: "Request ID is required",
      }
    }

    const result = await RequestService.acceptMoneyRequest(requestId)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Accept request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Reject money request action
export async function handleRejectRequest(requestId: string) {
  try {
    if (!requestId) {
      return {
        success: false,
        error: "Request ID is required",
      }
    }

    const result = await RequestService.rejectMoneyRequest(requestId)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Reject request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Update account balance action
export async function handleUpdateBalance(newBalance: number) {
  try {
    if (typeof newBalance !== "number" || newBalance < 0) {
      return {
        success: false,
        error: "Invalid balance amount",
      }
    }

    const result = await AccountService.updateBalance(newBalance)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Update balance error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Toggle card status action
export async function handleToggleCard(cardId: string) {
  try {
    if (!cardId) {
      return {
        success: false,
        error: "Card ID is required",
      }
    }

    const result = await AccountService.toggleCardStatus(cardId)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Toggle card error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
