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
    return { error: "Failed to process request" }
  }
}
