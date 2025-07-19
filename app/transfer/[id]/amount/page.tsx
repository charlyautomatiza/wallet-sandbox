"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft } from "lucide-react"
import type { RootState } from "@/store/store"
import { setAmount } from "@/store/transferSlice"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransferAmount({ params }: { params: { id: string } }) {
  const [inputAmount, setInputAmount] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()
  const account = useSelector((state: RootState) => state.account)

  const handleContinue = () => {
    const amount = Number.parseFloat(inputAmount)
    if (amount > 0 && amount <= account.balance) {
      dispatch(setAmount(amount))
      router.push(`/transfer/${params.id}/confirm`)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center p-4 border-b">
        <Link href={`/transfer/${params.id}`} className="mr-4 p-2" aria-label="Volver">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Ingresá el monto a transferir</h1>
      </div>

      <div className="p-4">
        <div className="mb-8">
          <div className="text-4xl mb-2">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="outline-none w-48"
              placeholder="0,00"
              aria-label="Monto a transferir"
              autoFocus
            />
          </div>
          <p className="text-gray-600">Disponible ${account.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          onClick={handleContinue}
          disabled={!inputAmount || Number(inputAmount) <= 0}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300"
          aria-label="Continuar con la transferencia"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

