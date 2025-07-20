"use client"

import { use } from "react"
import { useSelector } from "react-redux"
import { CheckCircle2, Share, Download } from "lucide-react"
import type { RootState } from "@/store/store"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransferSuccess({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Handle both Promise and regular object cases
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  const router = useRouter()
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === id))
  const amount = useSelector((state: RootState) => state.transfer.amount)
  const isScheduled = useSelector((state: RootState) => state.transfer.isScheduled)
  const scheduledDate = useSelector((state: RootState) => state.transfer.scheduledDate)
  const frequency = useSelector((state: RootState) => state.transfer.frequency)

  if (!contact || !amount) {
    router.push("/transfer")
    return null
  }

  const currentDate = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  // Format the scheduled date if present
  let formattedScheduledDate = ""
  if (scheduledDate) {
    formattedScheduledDate = new Date(scheduledDate).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-40">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          {scheduledDate ? "¡Transferencia programada!" : "¡Transferencia exitosa!"}
        </h1>
        <p className="text-gray-600 mb-8 text-center text-lg">
          {scheduledDate ? (
            <>
              Has programado transferir <span className="font-semibold">${amount.toLocaleString()}</span> a{" "}
              <span className="font-semibold">{contact.name}</span>
            </>
          ) : (
            <>
              Transferiste <span className="font-semibold">${amount.toLocaleString()}</span> a{" "}
              <span className="font-semibold">{contact.name}</span>
            </>
          )}
        </p>

        {/* Transfer Details Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-lg p-6 mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Destinatario:</span>
              <span className="font-medium">{contact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">${amount.toLocaleString()}</span>
            </div>
            {scheduledDate ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha programada:</span>
                  <span className="font-medium">
                    {new Date(scheduledDate).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia:</span>
                  <span className="font-medium">
                    {(() => {
                      switch (frequency) {
                        case 'once': return 'Una sola vez';
                        case 'daily': return 'Diariamente';
                        case 'weekly': return 'Semanalmente';
                        case 'monthly': return 'Mensualmente';
                        default: return 'Una sola vez';
                      }
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-blue-600">Programada</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{currentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-green-600">Completada</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
            <Share className="w-4 h-4" />
            <span>Compartir</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </button>
        </div>
      </div>

      {/* Fixed Buttons - Above bottom navigation */}
      <div className="fixed bottom-20 left-0 right-0 p-4 space-y-3 bg-white border-t z-50">
        <Link
          href="/"
          className="block w-full bg-blue-600 text-white py-4 rounded-lg text-center font-semibold shadow-lg"
        >
          Volver al inicio
        </Link>
        <Link
          href={`/transfer/${id}`}
          className="block w-full border border-blue-600 text-blue-600 py-4 rounded-lg text-center font-semibold shadow-lg"
        >
          Nueva transferencia
        </Link>
      </div>
    </div>
  )
}
