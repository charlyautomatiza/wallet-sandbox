"use client"

import { useState, useActionState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft, Calendar, Clock, Trash2, Edit3, AlertCircle } from "lucide-react"
import type { RootState } from "@/store/store"
import { cancelScheduledTransfer, updateScheduledTransfer } from "@/store/transferSlice"
import { handleCancelScheduledTransfer, handleUpdateScheduledTransfer } from "@/app/actions"
import Link from "next/link"
import type { ScheduledTransfer } from "@/store/transferSlice"

export default function ScheduledTransfers() {
  const [selectedTransfer, setSelectedTransfer] = useState<ScheduledTransfer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    amount: "",
    scheduledDate: "",
    frequency: "",
    reason: "",
    comment: ""
  })

  const dispatch = useDispatch()
  const scheduledTransfers = useSelector((state: RootState) => state.transfer.scheduledTransfers)
  const activeTransfers = scheduledTransfers.filter(transfer => transfer.active)

  const [cancelState, cancelAction, isCancelling] = useActionState(handleCancelScheduledTransfer, null)
  const [updateState, updateAction, isUpdating] = useActionState(handleUpdateScheduledTransfer, null)

  // Handle cancel success
  if (cancelState?.success && !isCancelling && cancelState.data) {
    dispatch(cancelScheduledTransfer(cancelState.data.transferId as string))
    // Reset state
    cancelState.success = false
  }

  // Handle update success
  if (updateState?.success && !isUpdating && updateState.data) {
    dispatch(updateScheduledTransfer({
      id: updateState.data.transferId as string,
      updates: updateState.data.updates as any
    }))
    setIsEditing(false)
    setSelectedTransfer(null)
    // Reset state
    updateState.success = false
  }

  const handleCancelTransfer = (transferId: string) => {
    const formData = new FormData()
    formData.append('transferId', transferId)
    cancelAction(formData)
  }

  const handleEditTransfer = (transfer: ScheduledTransfer) => {
    setSelectedTransfer(transfer)
    setEditForm({
      amount: transfer.amount.toString(),
      scheduledDate: transfer.scheduledDate.split('T')[0],
      frequency: transfer.frequency,
      reason: transfer.reason,
      comment: transfer.comment || ""
    })
    setIsEditing(true)
  }

  const handleUpdateTransfer = () => {
    if (!selectedTransfer) return
    
    const formData = new FormData()
    formData.append('transferId', selectedTransfer.id)
    formData.append('amount', editForm.amount)
    formData.append('scheduledDate', editForm.scheduledDate)
    formData.append('frequency', editForm.frequency)
    formData.append('reason', editForm.reason)
    formData.append('comment', editForm.comment)
    
    updateAction(formData)
  }

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Una sola vez'
      case 'daily': return 'Diario'
      case 'weekly': return 'Semanal'
      case 'monthly': return 'Mensual'
      default: return frequency
    }
  }

  const getUpcomingTransfers = () => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return activeTransfers.filter(transfer => {
      const scheduledDate = new Date(transfer.scheduledDate)
      return scheduledDate <= nextWeek && scheduledDate > now
    })
  }

  const upcomingTransfers = getUpcomingTransfers()

  return (
    <div className="min-h-screen bg-white" data-testid="scheduled-transfers-page">
      <div className="flex items-center p-4 border-b" data-testid="scheduled-transfers-header">
        <Link href="/" className="mr-4 p-2" aria-label="Volver al inicio" data-testid="back-button">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6" data-testid="page-title">
          Transferencias programadas
        </h1>
      </div>

      <div className="p-4 pb-24" data-testid="scheduled-transfers-content">
        {/* Upcoming Transfers Alert */}
        {upcomingTransfers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-testid="upcoming-transfers-alert">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Próximas transferencias</h3>
                <p className="text-blue-800 text-sm">
                  Tienes {upcomingTransfers.length} transferencia{upcomingTransfers.length > 1 ? 's' : ''} programada{upcomingTransfers.length > 1 ? 's' : ''} para esta semana.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfers List */}
        {activeTransfers.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes transferencias programadas</h3>
            <p className="text-gray-600 mb-6">Programa tu primera transferencia para automatizar tus pagos.</p>
            <Link 
              href="/transfer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              data-testid="create-transfer-button"
            >
              Programar transferencia
            </Link>
          </div>
        ) : (
          <div className="space-y-4" data-testid="transfers-list">
            {activeTransfers.map((transfer) => {
              const isUpcoming = upcomingTransfers.includes(transfer)
              const scheduledDate = new Date(transfer.scheduledDate)
              
              return (
                <div
                  key={transfer.id}
                  className={`border rounded-lg p-4 ${isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                  data-testid={`transfer-item-${transfer.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold text-gray-900">{transfer.contactName}</h3>
                        {isUpcoming && (
                          <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            Próxima
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ${transfer.amount.toLocaleString()}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {scheduledDate.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatFrequency(transfer.frequency)}
                        </div>
                        <div>
                          <span className="font-medium">Motivo:</span> {transfer.reason}
                        </div>
                        {transfer.comment && (
                          <div>
                            <span className="font-medium">Comentario:</span> {transfer.comment}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleEditTransfer(transfer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        aria-label={`Editar transferencia a ${transfer.contactName}`}
                        data-testid={`edit-button-${transfer.id}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCancelTransfer(transfer.id)}
                        disabled={isCancelling}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        aria-label={`Cancelar transferencia a ${transfer.contactName}`}
                        data-testid={`cancel-button-${transfer.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="edit-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Editar transferencia</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  data-testid="close-modal-button"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Monto
                  </label>
                  <input
                    id="edit-amount"
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-amount-input"
                  />
                </div>

                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha programada
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    value={editForm.scheduledDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-date-input"
                  />
                </div>

                <div>
                  <label htmlFor="edit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia
                  </label>
                  <select
                    id="edit-frequency"
                    value={editForm.frequency}
                    onChange={(e) => setEditForm(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-frequency-select"
                  >
                    <option value="once">Una sola vez</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo
                  </label>
                  <select
                    id="edit-reason"
                    value={editForm.reason}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="edit-reason-select"
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

                <div>
                  <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comentario (opcional)
                  </label>
                  <textarea
                    id="edit-comment"
                    value={editForm.comment}
                    onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    data-testid="edit-comment-input"
                  />
                </div>

                {updateState?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="update-error">
                    <p className="text-red-800 text-sm">{updateState.error}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold"
                    data-testid="cancel-edit-button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateTransfer}
                    disabled={isUpdating}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 flex items-center justify-center"
                    data-testid="save-changes-button"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {cancelState?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4" data-testid="cancel-error">
            <p className="text-red-800 text-sm">{cancelState.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
