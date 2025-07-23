"use client"

import { CheckCircle, Home, Calendar } from "lucide-react"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function ScheduleSuccess() {
  const selectedContact = useSelector((state: RootState) => state.transfer.selectedContact)
  const amount = useSelector((state: RootState) => state.transfer.amount)
  const scheduledTransfers = useSelector((state: RootState) => state.transfer.scheduledTransfers)
  
  // Get the most recent scheduled transfer (should be the one just created)
  const latestScheduled = scheduledTransfers[scheduledTransfers.length - 1]

  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="schedule-success-page">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Success Icon */}
        <div className="mb-8" data-testid="success-icon">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        {/* Success Message */}
        <div className="text-center mb-8" data-testid="success-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="success-title">
            ¡Transferencia programada con éxito!
          </h1>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-sm" data-testid="transfer-details">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Para:</span>
                <span className="font-semibold">{selectedContact?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-bold text-2xl text-green-600">${amount?.toLocaleString()}</span>
              </div>
              {latestScheduled && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha programada:</span>
                    <span className="font-semibold">
                      {new Date(latestScheduled.scheduledDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia:</span>
                    <span className="font-semibold">
                      {latestScheduled.frequency === 'once' && 'Una sola vez'}
                      {latestScheduled.frequency === 'daily' && 'Diario'}
                      {latestScheduled.frequency === 'weekly' && 'Semanal'}
                      {latestScheduled.frequency === 'monthly' && 'Mensual'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motivo:</span>
                    <span className="font-semibold">{latestScheduled.reason}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-center max-w-sm" data-testid="success-description">
            Tu transferencia ha sido programada exitosamente. Recibirás una notificación antes de que se ejecute.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pb-24 space-y-3" data-testid="action-buttons">
        <Link 
          href="/transfer/scheduled"
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center"
          data-testid="view-scheduled-button"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Ver transferencias programadas
        </Link>
        
        <Link 
          href="/"
          className="w-full bg-gray-100 text-gray-800 py-4 rounded-lg font-semibold flex items-center justify-center border"
          data-testid="home-button"
        >
          <Home className="h-5 w-5 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
