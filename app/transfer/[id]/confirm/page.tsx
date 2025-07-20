"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, ChevronRight, Calendar, Clock, Check } from "lucide-react"
import type { RootState } from "@/store/store"
import { addScheduledTransfer, setFrequency, setStartDate } from "@/store/transferSlice"
import { handleTransfer } from "@/app/actions"
import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function TransferConfirm({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Handle both Promise and regular object cases
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  const router = useRouter()
  const dispatch = useDispatch()
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === id))
  const amount = useSelector((state: RootState) => state.transfer.amount)
  const [state, formAction, isPending] = useActionState(handleTransfer, null)
  
  // Local state for scheduled transfers
  const [isScheduled, setIsScheduled] = useState(false)
  const [frequency, setFrequencyState] = useState<"once" | "daily" | "weekly" | "monthly">("once")
  const [startDate, setStartDateState] = useState(new Date().toISOString().split('T')[0])
  
  // Handle frequency change
  const handleFrequencyChange = (newFrequency: "once" | "daily" | "weekly" | "monthly") => {
    setFrequencyState(newFrequency)
    dispatch(setFrequency(newFrequency))
    setIsScheduled(newFrequency !== "once")
  }
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateState(e.target.value)
    dispatch(setStartDate(e.target.value))
  }

  // Handle successful transfer
  useEffect(() => {
    if (state?.success) {
      // Add scheduled transfer to redux store if it's a scheduled transfer
      if (state.isScheduled && state.data) {
        // Type assertion to ensure we have the correct fields
        dispatch(addScheduledTransfer({
          id: String(state.data.id || `st-${Date.now()}`),
          contactId: String(state.data.contactId || id),
          contactName: String(state.data.contactName || contact?.name || ""),
          amount: Number(state.data.amount),
          frequency: (state.data.frequency as "daily" | "weekly" | "monthly") || "monthly",
          startDate: String(state.data.startDate || new Date().toISOString().split('T')[0]),
          nextDate: String(state.data.nextDate || ""),
          reason: String(state.data.reason || "Varios"),
          comment: state.data.comment ? String(state.data.comment) : undefined,
          active: true
        }))
      }
      router.push(`/transfer/${id}/success`)
    }
  }, [state, router, id, dispatch, contact])

  if (!contact || !amount) {
    router.push("/transfer")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <Link href={`/transfer/${id}/amount`} className="mr-4 p-2" aria-label="Volver">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Vas a transferir</h1>
      </div>

      <div className="p-4 pb-32">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-blue-600">$</span>
          </div>
          <span className="text-3xl font-bold mb-2">${amount.toLocaleString()}</span>
          <span className="text-gray-600">a {contact.name}</span>
        </div>

        {state?.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{state.error}</p>
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="amount" value={amount} />
          <input type="hidden" name="contactId" value={id} />
          <input type="hidden" name="contactName" value={contact.name} />
          <input type="hidden" name="frequency" value={frequency} />
          <input type="hidden" name="startDate" value={startDate} />

          <div className="space-y-4">
            {/* Scheduled Transfer Section */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600 font-medium">Programar transferencia</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="scheduledToggle"
                    className="sr-only peer" 
                    checked={isScheduled}
                    onChange={() => setIsScheduled(!isScheduled)} 
                    aria-label="Activar transferencia programada"
                  />
                  <label 
                    htmlFor="scheduledToggle"
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    aria-hidden="true"
                  ></label>
                </div>
              </div>
              
              {isScheduled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <div id="frequencyLabel" className="block text-gray-600 mb-2">Frecuencia</div>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="frequencyLabel">
                      <button
                        type="button"
                        className={`p-2 rounded-lg text-center ${frequency === "daily" ? "bg-blue-100 text-blue-700" : "bg-white border"}`}
                        onClick={() => handleFrequencyChange("daily")}
                        aria-pressed={frequency === "daily"}
                      >
                        Diaria
                      </button>
                      <button
                        type="button"
                        className={`p-2 rounded-lg text-center ${frequency === "weekly" ? "bg-blue-100 text-blue-700" : "bg-white border"}`}
                        onClick={() => handleFrequencyChange("weekly")}
                        aria-pressed={frequency === "weekly"}
                      >
                        Semanal
                      </button>
                      <button
                        type="button"
                        className={`p-2 rounded-lg text-center ${frequency === "monthly" ? "bg-blue-100 text-blue-700" : "bg-white border"}`}
                        onClick={() => handleFrequencyChange("monthly")}
                        aria-pressed={frequency === "monthly"}
                      >
                        Mensual
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-gray-600 mb-2">Fecha de inicio</label>
                    <input
                      type="date"
                      id="startDate"
                      className="w-full p-2 border rounded-lg"
                      value={startDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Banco</span>
              <span className="font-medium">UALÁ</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Motivo</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">Varios</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <input type="hidden" name="reason" value="Varios" />

            <div className="p-4 bg-gray-50 rounded-lg">
              <label htmlFor="comment" className="block text-gray-600 mb-2">
                Comentario
              </label>
              <textarea
                id="comment"
                name="comment"
                className="w-full bg-transparent outline-none resize-none"
                placeholder="Agregar un comentario"
                rows={3}
              />
            </div>
          </div>

          {/* Fixed Button - Above bottom navigation */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t z-50">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label={isScheduled ? `Programar transferencia de $${amount.toLocaleString()} a ${contact.name}` : `Transferir $${amount.toLocaleString()} a ${contact.name}`}
            >
              {(() => {
                if (isPending) return "Procesando..."
                if (isScheduled) return "Programar transferencia"
                return "Transferir"
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
