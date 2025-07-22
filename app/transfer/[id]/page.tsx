"use client"

import { use } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft, MoreVertical } from "lucide-react"
import type { RootState } from "@/store/store"
import Link from "next/link"

export default function TransferDetails({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Handle both Promise and regular object cases
  const resolvedParams = params instanceof Promise ? use(params) : params
  const { id } = resolvedParams

  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === id))

  if (!contact) return null

  return (
    <div className="min-h-screen bg-blue-600" data-testid="transfer-details-page">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white" data-testid="transfer-details-header">
        <Link href="/transfer" className="p-2" aria-label="Volver" data-testid="transfer-details-back-button">
          <ArrowLeft size={24} />
        </Link>
        <button className="p-2" aria-label="Más opciones" data-testid="transfer-details-menu-button">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center text-white mb-8" data-testid="contact-profile-section">
        <div 
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-semibold mb-4"
          data-testid="contact-profile-avatar"
        >
          {contact.initials}
        </div>
        <h1 className="text-2xl font-semibold" data-testid="contact-profile-name">{contact.name}</h1>
      </div>

      {/* Transfer History */}
      <div className="bg-white flex-1 rounded-t-3xl p-4 pb-32" data-testid="transfer-history-section">
        <div className="space-y-4" data-testid="transfer-history-list">
          {contact.recentTransfers.map((transfer, index) => (
            <div key={`transfer-${contact.id}-${transfer.date}-${transfer.amount}`} className="flex items-center justify-between py-4 border-b" data-testid={`transfer-history-item-${index}`}>
              <div data-testid={`transfer-history-info-${index}`}>
                <p className="font-semibold" data-testid={`transfer-history-recipient-${index}`}>{contact.name}</p>
                <p className="text-sm text-gray-500" data-testid={`transfer-history-type-${index}`}>Transferencia enviada</p>
              </div>
              <div className="text-right" data-testid={`transfer-history-amount-info-${index}`}>
                <p className="font-semibold" data-testid={`transfer-history-amount-${index}`}>${transfer.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500" data-testid={`transfer-history-date-${index}`}>{transfer.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Button - Above bottom navigation */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t z-50" data-testid="send-money-section">
        <Link
          href={`/transfer/${id}/amount`}
          className="block w-full bg-blue-600 text-white py-4 rounded-lg text-center font-semibold shadow-lg"
          aria-label={`Enviar dinero a ${contact.name}`}
          data-testid="send-money-button"
        >
          Enviar plata
        </Link>
      </div>
    </div>
  )
}
