"use server"

import { revalidatePath } from "next/cache"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = formData.get("amount")
    const reason = formData.get("reason") || "Varios"
    const comment = formData.get("comment") || ""
    const contactId = formData.get("contactId")
    const contactName = formData.get("contactName")
    const frequency = formData.get("frequency") || "once"
    const startDate = formData.get("startDate") || new Date().toISOString().split('T')[0]
    
    // Check if this is a scheduled transfer
    const isScheduled = frequency !== "once"

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (isScheduled) {
      // Calculate next date based on frequency
      let nextDate = new Date(startDate as string);
      switch(frequency) {
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
      }
      
      // Simulate scheduled transfer creation
      console.log("Scheduled Transfer created:", {
        amount,
        reason,
        comment,
        contactId,
        contactName,
        frequency,
        startDate,
        nextDate: nextDate.toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
      })
      
      revalidatePath("/transfer")
      return {
        success: true,
        isScheduled: true,
        data: {
          id: `st-${Date.now()}`,
          amount: Number(amount),
          reason,
          comment,
          contactId,
          contactName,
          frequency,
          startDate: startDate as string,
          nextDate: nextDate.toISOString().split('T')[0],
          active: true,
          date: new Date().toLocaleDateString(),
          timestamp: new Date().toISOString(),
        },
      }
    } else {
      // Regular immediate transfer
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
        isScheduled: false,
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
