"use server"

import { TransferService } from "@/lib/api/services/transfer.service"
import type { TransferRequest } from "@/lib/api/types"

export async function handleTransfer(transferData: TransferRequest) {
  try {
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
