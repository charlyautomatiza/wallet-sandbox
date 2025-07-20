"use server"

import { revalidatePath } from "next/cache"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = formData.get("amount")
    const reason = formData.get("reason") || "Varios"
    const comment = formData.get("comment") || ""
    const contactId = formData.get("contactId")
    const contactName = formData.get("contactName")
    const isScheduled = formData.get("isScheduled") === "true"
    const scheduledDate = formData.get("scheduledDate") as string || null
    const frequency = formData.get("frequency") as string || "once"
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const timestamp = new Date().toISOString()
    
    // Handle scheduled transfer
    if (isScheduled && scheduledDate) {
      console.log("Scheduled transfer created:", {
        amount,
        reason,
        comment,
        contactId,
        contactName,
        scheduledDate,
        frequency,
        timestamp,
      })
      
      revalidatePath("/transfer")
      return {
        success: true,
        isScheduled: true,
        data: {
          id: crypto.randomUUID(),
          amount: Number(amount),
          reason,
          comment,
          contactId,
          contactName,
          scheduledDate,
          frequency,
          status: 'pending',
          createdAt: timestamp,
        },
      }
    }
    
    // Handle immediate transfer
    console.log("Transfer processed:", {
      amount,
      reason,
      comment,
      contactId,
      contactName,
      timestamp,
    })

    revalidatePath("/transfer")
    return {
      success: true,
      isScheduled: false,
      data: {
        amount: Number(amount),
        reason,
        comment,
        contactId,
        contactName,
        date: new Date().toLocaleDateString(),
        timestamp,
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
    return { 
      success: false,
      error: "Failed to process request. Please try again." 
    }
  }
}
