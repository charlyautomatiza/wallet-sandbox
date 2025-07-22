"use client"

import { use, useActionState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import type { RootState } from "@/store/store"
import { handleTransfer } from "@/app/actions"

export default function TransferConfirm({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Handle both Promise and regular object cases - MOVE THIS TO THE TOP
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  const router = useRouter()
  // Use the resolved id here instead of params.id
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === id))
  const amount = useSelector((state: RootState) => state.transfer.amount)
  const [state, formAction, isPending] = useActionState(handleTransfer, null)

  // Handle successful transfer
  useEffect(() => {
    if (state?.success) {
      router.push(`/transfer/${id}/success`)
    }
  }, [state, router, id])

  if (!contact || !amount) {
    router.push("/transfer")
    return null
  }

  return (
    <div className="min-h-screen bg-white" data-testid="transfer-confirm-page">
      <div className="flex items-center p-4 border-b" data-testid="transfer-confirm-header">
        <Link href={`/transfer/${id}/amount`} className="mr-4 p-2" aria-label="Volver" data-testid="transfer-confirm-back-button">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6" data-testid="transfer-confirm-title">Vas a transferir</h1>
      </div>

      <div className="p-4 pb-32" data-testid="transfer-confirm-content">
        <div className="flex flex-col items-center mb-8" data-testid="transfer-summary">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4" data-testid="transfer-amount-icon">
            <span className="text-2xl text-blue-600">$</span>
          </div>
          <span className="text-3xl font-bold mb-2" data-testid="transfer-amount-display">${amount.toLocaleString()}</span>
          <span className="text-gray-600" data-testid="transfer-recipient">a {contact.name}</span>
        </div>

        {state?.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="transfer-error-message">
            <p className="text-red-600">{state.error}</p>
          </div>
        )}

        <form action={formAction} data-testid="transfer-form">
          <input type="hidden" name="amount" value={amount} data-testid="hidden-amount" />
          <input type="hidden" name="contactId" value={id} data-testid="hidden-contact-id" />
          <input type="hidden" name="contactName" value={contact.name} data-testid="hidden-contact-name" />

          <div className="space-y-4" data-testid="transfer-details">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg" data-testid="bank-detail">
              <span className="text-gray-600" data-testid="bank-label">Banco</span>
              <span className="font-medium" data-testid="bank-name">UALÁ</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg" data-testid="reason-detail">
              <span className="text-gray-600" data-testid="reason-label">Motivo</span>
              <div className="flex items-center" data-testid="reason-value-wrapper">
                <span className="font-medium mr-2" data-testid="reason-value">Varios</span>
                <ChevronRight className="w-5 h-5 text-gray-400" data-testid="reason-arrow" />
              </div>
            </div>
            <input type="hidden" name="reason" value="Varios" data-testid="hidden-reason" />

            <div className="p-4 bg-gray-50 rounded-lg" data-testid="comment-section">
              <label htmlFor="comment" className="block text-gray-600 mb-2" data-testid="comment-label">
                Comentario
              </label>
              <textarea
                id="comment"
                name="comment"
                className="w-full bg-transparent outline-none resize-none"
                placeholder="Agregar un comentario"
                rows={3}
                data-testid="comment-input"
              />
            </div>
          </div>

          {/* Fixed Button - Above bottom navigation */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t z-50" data-testid="transfer-action-section">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label={`Transferir $${amount.toLocaleString()} a ${contact.name}`}
              data-testid="transfer-submit-button"
            >
              {isPending ? "Procesando..." : "Transferir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
