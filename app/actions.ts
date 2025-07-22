"use server"

import { TransferService } from "@/lib/api/services/transfer.service"
import { RequestService } from "@/lib/api/services/request.service"
import { AccountService } from "@/lib/api/services/account.service"
import type { TransferRequest, MoneyRequestInput } from "@/lib/api/types"

export async function handleTransfer(transferData: TransferRequest) {
  try {
    if (!transferData.contactId || !transferData.contactName) {
      return {
        success: false,
        error: "Contact information is required",
      }
    }

    if (!transferData.amount || transferData.amount <= 0) {
      return {
        success: false,
        error: "Amount must be greater than 0",
      }
    }

    if (transferData.amount > 1000000) {
      return {
        success: false,
        error: "Amount exceeds maximum limit",
      }
    }

    if (!transferData.reason) {
      return {
        success: false,
        error: "Reason is required",
      }
    }

    const result = await TransferService.processTransfer(transferData)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Transfer failed",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Transfer action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred during the transfer",
    }
  }
}

export async function handleRequestMoney(requestData: MoneyRequestInput) {
  try {
    if (!requestData.amount || requestData.amount <= 0) {
      return {
        success: false,
        error: "Amount must be greater than 0",
      }
    }

    if (requestData.amount > 500000) {
      return {
        success: false,
        error: "Request amount exceeds maximum limit",
      }
    }

    if (!requestData.description || requestData.description.trim().length === 0) {
      return {
        success: false,
        error: "Description is required",
      }
    }

    const result = await RequestService.createMoneyRequest(requestData)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create money request",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Money request action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while creating the money request",
    }
  }
}

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
        error: result.error || "Failed to accept request",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Accept request action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while accepting the request",
    }
  }
}

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
        error: result.error || "Failed to reject request",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Reject request action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while rejecting the request",
    }
  }
}

export async function getContacts() {
  try {
    const result = await TransferService.getContacts()

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to get contacts",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Get contacts action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while fetching contacts",
    }
  }
}

export async function getTransferHistory(limit = 10) {
  try {
    const result = await TransferService.getTransferHistory(limit)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to get transfer history",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Get transfer history action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while fetching transfer history",
    }
  }
}

export async function getMoneyRequests() {
  try {
    const result = await RequestService.getMoneyRequests()

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to get money requests",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Get money requests action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while fetching money requests",
    }
  }
}

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
        error: result.error || "Failed to update balance",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Update balance action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while updating balance",
    }
  }
}

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
        error: result.error || "Failed to toggle card status",
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error("Toggle card action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred while toggling card status",
    }
  }
}
