"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft } from "lucide-react"
import type { RootState } from "@/store/store"
import { handleRequestMoney } from "@/app/actions"
import { useFormState } from "react-dom"
import Link from "next/link"

export default function RequestMoney() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const account = useSelector((state: RootState) => state.account)
  const [state, formAction] = useFormState(handleRequestMoney, null)

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Solicitar dinero</h1>
      </div>

      <div className="p-4">
        <form action={formAction}>
          <div className="mb-8">
            <h2 className="text-2xl mb-2">Ingresá el monto a solicitar</h2>
            <div className="text-4xl mb-2">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="outline-none w-48"
                placeholder="0,00"
                required
              />
            </div>
            <p className="text-gray-600">Saldo actual ${account.balance.toLocaleString()}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Agregar un mensaje"
            />
          </div>

          <button
            type="submit"
            disabled={!amount || Number(amount) <= 0}
            className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}
