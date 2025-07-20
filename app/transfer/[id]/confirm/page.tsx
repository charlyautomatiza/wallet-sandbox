"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft, ChevronRight } from "lucide-react"
import type { RootState } from "@/store/store"
import { handleTransfer } from "@/app/actions"
import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"

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

          <div className="space-y-4">
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
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Programar transferencia</span>
              <label htmlFor="isScheduled" className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="isScheduled"
                  className="sr-only peer" 
                  name="isScheduled"
                  value="true"
                  aria-label="Programar transferencia"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    document.getElementById("scheduleOptions")?.classList.toggle("hidden", !isChecked);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div id="scheduleOptions" className="space-y-4 hidden">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label htmlFor="scheduledDate" className="block text-gray-600 mb-2">
                  Fecha de la transferencia
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  className="w-full bg-white p-2 border border-gray-300 rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label htmlFor="frequency" className="block text-gray-600 mb-2">
                  Frecuencia
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="w-full bg-white p-2 border border-gray-300 rounded-md"
                >
                  <option value="once">Una sola vez</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensualmente</option>
                </select>
              </div>
            </div>

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
              aria-label={`Transferir $${amount.toLocaleString()} a ${contact.name}`}
            >
              {isPending ? "Procesando..." : "Transferir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
