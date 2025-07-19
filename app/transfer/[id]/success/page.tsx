"use client"

import { useSelector } from "react-redux"
import { CheckCircle2 } from "lucide-react"
import type { RootState } from "@/store/store"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransferSuccess({ params }: { params: { id: string } }) {
  const router = useRouter()
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === params.id))
  const amount = useSelector((state: RootState) => state.transfer.amount)

  if (!contact || !amount) {
    router.push("/transfer")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">¡Transferencia exitosa!</h1>
        <p className="text-gray-600 mb-8">
          Transferiste ${amount.toLocaleString()} a {contact.name}
        </p>

        <div className="fixed bottom-0 left-0 right-0 p-4 space-y-4 bg-white border-t">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-4 rounded-lg text-center font-semibold"
            role="button"
            aria-label="Volver al inicio"
          >
            Volver al inicio
          </Link>
          <Link
            href={`/transfer/${params.id}`}
            className="block w-full border border-blue-600 text-blue-600 py-4 rounded-lg text-center font-semibold"
            role="button"
            aria-label="Realizar nueva transferencia"
          >
            Nueva transferencia
          </Link>
        </div>
      </div>
    </div>
  )
}
