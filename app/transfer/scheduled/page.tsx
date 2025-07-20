"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, Calendar, Clock, Trash2, Edit, AlertCircle } from "lucide-react"
import type { RootState } from "@/store/store"
import { removeScheduledTransfer, toggleScheduledTransferActive } from "@/store/transferSlice"
import Link from "next/link"

export default function ScheduledTransfers() {
  const dispatch = useDispatch()
  const scheduledTransfers = useSelector((state: RootState) => state.transfer.scheduledTransfers)
  
  // Format frequency for display
  const formatFrequency = (frequency: string): string => {
    switch (frequency) {
      case "daily": return "Diaria"
      case "weekly": return "Semanal"
      case "monthly": return "Mensual"
      default: return "Única"
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
  
  // Handle toggle active state
  const handleToggleActive = (id: string) => {
    dispatch(toggleScheduledTransferActive(id))
  }
  
  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro que deseas eliminar esta transferencia programada?")) {
      dispatch(removeScheduledTransfer(id))
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

      <div className="p-4 pb-32">
        {scheduledTransfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No tienes transferencias programadas</h2>
            <p className="text-gray-500 mb-8">
              Programa transferencias recurrentes para automatizar tus pagos periódicos.
            </p>
            <Link href="/transfer" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
              Crear transferencia programada
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-600 mb-4">
              Administra tus transferencias programadas. Puedes activar, desactivar o eliminar según necesites.
            </p>
            
            {scheduledTransfers.map((transfer) => (
              <div key={transfer.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{transfer.contactName}</h3>
                    <p className="text-lg font-bold text-blue-700">${transfer.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleToggleActive(transfer.id)}
                      className={`p-2 rounded-full ${transfer.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                      aria-label={transfer.active ? "Desactivar transferencia programada" : "Activar transferencia programada"}
                    >
                      {transfer.active ? <Clock /> : <AlertCircle />}
                    </button>
                    <button 
                      onClick={() => handleDelete(transfer.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600"
                      aria-label="Eliminar transferencia programada"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 block">Frecuencia</span>
                    <span>{formatFrequency(transfer.frequency)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Próxima fecha</span>
                    <span>{formatDate(transfer.nextDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Estado</span>
                    <span className={transfer.active ? "text-green-600" : "text-gray-600"}>
                      {transfer.active ? "Activa" : "Pausada"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Motivo</span>
                    <span>{transfer.reason || "Varios"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
