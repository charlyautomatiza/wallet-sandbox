"use client"

import { useSelector } from "react-redux"
import { ArrowLeft, MoreVertical } from "lucide-react"
import type { RootState } from "@/store/store"
import Link from "next/link"

export default function TransferDetails({ params }: { params: { id: string } }) {
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === params.id))

  if (!contact) return null

  return (
    <div className="min-h-screen bg-blue-600 pb-24">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white">
        <Link href="/transfer" className="p-2" aria-label="Volver">
          <ArrowLeft size={24} />
        </Link>
        <button className="p-2" aria-label="Más opciones">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center text-white mb-8">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-semibold mb-4">
          {contact.initials}
        </div>
        <h1 className="text-2xl font-semibold">{contact.name}</h1>
      </div>

      {/* Transfer History */}
      <div className="bg-white flex-1 rounded-t-3xl p-4">
        <div className="mb-24">
          {contact.recentTransfers.map((transfer, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b">
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-500">Transferencia enviada</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${transfer.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{transfer.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Link
          href={`/transfer/${params.id}/amount`}
          className="block w-full bg-blue-600 text-white py-4 rounded-lg text-center font-semibold"
          role="button"
          aria-label={`Enviar dinero a ${contact.name}`}
        >
          Enviar plata
        </Link>
      </div>
    </div>
  )
}

