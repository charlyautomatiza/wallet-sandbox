"use client"

import { use, useState, useActionState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import type { RootState } from "@/store/store"
import { addScheduledTransfer } from "@/store/transferSlice"
import { handleScheduleTransfer } from "@/app/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ScheduleTransfer({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Handle both Promise and regular object cases
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  const [scheduledDate, setScheduledDate] = useState("")
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once')
  const [reason, setReason] = useState("Varios")
  const [comment, setComment] = useState("")

  const dispatch = useDispatch()
  const router = useRouter()
  const selectedContact = useSelector((state: RootState) => state.transfer.selectedContact)
  const amount = useSelector((state: RootState) => state.transfer.amount)

  const [state, formAction, isPending] = useActionState(handleScheduleTransfer, null)

  // Handle success navigation
  if (state?.success && !isPending) {
    // Add to Redux state
    dispatch(addScheduledTransfer(state.data as any))
    // Navigate to success page
    router.push(`/transfer/${id}/schedule/success`)
  }

  // Redirect if no contact or amount selected
  if (!selectedContact || !amount) {
    router.push('/transfer')
    return null
  }

  // Get minimum date (tomorrow)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateString = minDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white" data-testid="schedule-transfer-page">
      <div className="flex items-center p-4 border-b" data-testid="schedule-transfer-header">
        <Link href={`/transfer/${id}/amount`} className="mr-4 p-2" aria-label="Volver" data-testid="schedule-back-button">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6" data-testid="schedule-title">Programar transferencia</h1>
      </div>

      <div className="p-4 pb-32" data-testid="schedule-content">
        {/* Transfer Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6" data-testid="transfer-summary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Para:</span>
            <span className="font-semibold">{selectedContact.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Monto:</span>
            <span className="font-semibold text-2xl">${amount.toLocaleString()}</span>
          </div>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Hidden fields for contact and amount data */}
          <input type="hidden" name="contactId" value={selectedContact.id} />
          <input type="hidden" name="contactName" value={selectedContact.name} />
          <input type="hidden" name="amount" value={amount.toString()} />
          {/* Date Selection */}
          <div data-testid="date-section">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Fecha de programación
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={minDateString}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="date-picker"
            />
            <p className="text-sm text-gray-500 mt-1">La fecha debe ser a partir de mañana</p>
          </div>

          {/* Frequency Selection */}
          <div data-testid="frequency-section">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-2" />
              Frecuencia
            </label>
            <select
              name="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="frequency-select"
            >
              <option value="once">Una sola vez</option>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {/* Reason Selection */}
          <div data-testid="reason-section">
            <label htmlFor="reason-select" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo
            </label>
            <select
              id="reason-select"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="reason-select"
            >
              <option value="Varios">Varios</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Servicios">Servicios</option>
              <option value="Préstamo">Préstamo</option>
              <option value="Comida">Comida</option>
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Transporte">Transporte</option>
              <option value="Gastos médicos">Gastos médicos</option>
              <option value="Educación">Educación</option>
              <option value="Compras">Compras</option>
            </select>
          </div>

          {/* Comment */}
          <div data-testid="comment-section">
            <label htmlFor="comment-input" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              id="comment-input"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agrega un comentario..."
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              data-testid="comment-input"
            />
          </div>

          {/* Error Display */}
          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="error-message">
              <p className="text-red-800 text-sm">{state.error}</p>
            </div>
          )}

          {/* Schedule Button */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t z-50" data-testid="schedule-button-section">
            <button
              type="submit"
              disabled={isPending || !scheduledDate}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300 shadow-lg flex items-center justify-center"
              data-testid="schedule-transfer-button"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Programando...
                </>
              ) : (
                'Programar transferencia'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
