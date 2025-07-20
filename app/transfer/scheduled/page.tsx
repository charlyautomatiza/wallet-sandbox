"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import type { RootState } from "@/store/store"
import { cancelScheduledTransfer } from "@/store/transferSlice"
import Link from "next/link"

export default function ScheduledTransfers() {
  const dispatch = useDispatch()
  const scheduledTransfers = useSelector((state: RootState) => state.transfer.scheduledTransfers)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')
  
  const filteredTransfers = scheduledTransfers.filter(transfer => {
    if (statusFilter === 'all') return true
    return transfer.status === statusFilter
  })
  
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Una sola vez'
      case 'daily': return 'Diariamente'
      case 'weekly': return 'Semanalmente'
      case 'monthly': return 'Mensualmente'
      default: return 'Una sola vez'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'completed': return 'Completada'
      case 'cancelled': return 'Cancelada'
      default: return 'Desconocido'
    }
  }
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-500'
      case 'completed': return 'text-green-500'
      case 'cancelled': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const handleCancelTransfer = (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta transferencia programada?')) {
      dispatch(cancelScheduledTransfer(id))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Transferencias Programadas</h1>
      </div>

      <div className="p-4">
        {/* Filter tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${statusFilter === 'all' ? "bg-white shadow-sm" : ""}`}
            onClick={() => setStatusFilter('all')}
          >
            Todas
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${statusFilter === 'pending' ? "bg-white shadow-sm" : ""}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pendientes
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${statusFilter === 'completed' ? "bg-white shadow-sm" : ""}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completadas
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${statusFilter === 'cancelled' ? "bg-white shadow-sm" : ""}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Canceladas
          </button>
        </div>

        {/* Scheduled Transfers List */}
        {filteredTransfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700">No hay transferencias programadas</h2>
            <p className="text-gray-500 text-center mt-2">
              {statusFilter === 'all' 
                ? "Programa tu primera transferencia desde la sección de transferencias" 
                : `No hay transferencias ${(() => {
                    if (statusFilter === 'pending') return 'pendientes';
                    if (statusFilter === 'completed') return 'completadas';
                    return 'canceladas';
                  })()}`
              }
            </p>
            <Link 
              href="/transfer" 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Programar transferencia
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransfers.map((transfer) => (
              <div key={transfer.id} className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{transfer.contactName}</h3>
                    <p className="text-2xl font-bold">${transfer.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(transfer.status)}
                    <span className={`ml-1 text-sm ${getStatusClass(transfer.status)}`}>
                      {getStatusText(transfer.status)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(transfer.scheduledDate).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Frecuencia: {getFrequencyText(transfer.frequency)}</span>
                  </div>
                </div>
                
                {transfer.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t">
                    <button
                      onClick={() => handleCancelTransfer(transfer.id)}
                      className="text-red-600 text-sm font-medium"
                    >
                      Cancelar transferencia
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
