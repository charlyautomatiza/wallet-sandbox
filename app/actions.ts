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
