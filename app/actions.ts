"use server"

import { redirect } from "next/navigation"
import { TransferService } from "@/lib/api/services/transfer.service"
import { RequestService } from "@/lib/api/services/request.service"
import type { TransferRequest } from "@/lib/api/types"

export async function processTransfer(formData: FormData) {
  const contactId = formData.get("contactId") as string
  const contactName = formData.get("contactName") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const reason = formData.get("reason") as string
  const comment = formData.get("comment") as string

  if (!contactId || !contactName || !amount || amount <= 0) {
    throw new Error("Invalid transfer data")
  }

  const transferData: TransferRequest = {
    contactId,
    contactName,
    amount,
    reason,
    comment,
  }

  try {
    const result = await TransferService.processTransfer(transferData)

    if (!result.success) {
      throw new Error(result.error || "Transfer failed")
    }

    redirect(`/transfer/${contactId}/success?transactionId=${result.data?.transactionId}`)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Transfer failed")
  }
}

export async function handleRequestMoney(formData: FormData) {
  const contactId = formData.get("contactId") as string
  const contactName = formData.get("contactName") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const reason = formData.get("reason") as string
  const comment = formData.get("comment") as string

  if (!contactId || !contactName || !amount || amount <= 0) {
    throw new Error("Invalid request data")
  }

  const requestData = {
    contactId,
    contactName,
    amount,
    reason,
    comment,
  }

  try {
    const result = await RequestService.createMoneyRequest(requestData)

    if (!result.success) {
      throw new Error(result.error || "Money request failed")
    }

    redirect(`/request/success?requestId=${result.data?.id}`)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Money request failed")
  }
}

export async function addNewContact(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const hasUala = formData.get("hasUala") === "true"

  if (!name || !phone) {
    throw new Error("Name and phone are required")
  }

  const contactData = {
    name,
    phone,
    email: email || undefined,
    hasUala,
    initials: name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  }

  try {
    const result = await TransferService.addContact(contactData)

    if (!result.success) {
      throw new Error(result.error || "Failed to add contact")
    }

    redirect("/transfer")
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to add contact")
  }
}
