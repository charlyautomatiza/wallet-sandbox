"use server"

import { revalidatePath } from "next/cache"

export async function handleTransfer(prevState: any, formData: FormData) {
  try {
    const amount = formData.get("amount")
    const reason = formData.get("reason")
    const comment = formData.get("comment")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    revalidatePath("/transfer")
    return {
      success: true,
      data: {
        amount,
        reason,
        comment,
        date: new Date().toLocaleDateString(),
      },
    }
  } catch (error) {
    return { error: "Failed to process transfer" }
  }
}
