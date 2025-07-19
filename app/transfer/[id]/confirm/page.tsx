"use client"

import { useSelector } from "react-redux"
import { ArrowLeft, ChevronRight } from "lucide-react"
import type { RootState } from "@/store/store"
import { handleTransfer } from "@/app/actions"
import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransferConfirm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const contact = useSelector((state: RootState) => state.transfer.contacts.find((c) => c.id === params.id))
  const amount = useSelector((state: RootState) => state.transfer.amount)
  const [state, action] = useActionState(handleTransfer, null)

  if (!contact || !amount) {
    router.push("/transfer")
    return null
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await action(formData)
    if (result?.success) {
      router.push(`/transfer/${params.id}/success`)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="flex items-center p-4 border-b">
        <Link href={`/transfer/${params.id}/amount`} className="mr-4 p-2" aria-label="Volver">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Vas a transferir</h1>
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-blue-600">$</span>
          </div>
          <span className="text-3xl font-bold mb-2">${amount.toLocaleString()}</span>
          <span className="text-gray-600">a {contact.name}</span>
        </div>

        <form action={handleSubmit}>
          <input type="hidden" name="amount" value={amount} />

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Banco</span>
              <span className="font-medium">UALÁ</span>
            </div>

            <button
              type="button"
              className="flex justify-between items-center w-full p-4 bg-gray-50 rounded-lg"
              aria-label="Seleccionar motivo"
            >
              <span className="text-gray-600">Motivo</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">Varios</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label htmlFor="comment" className="block text-gray-600 mb-2">
                Comentario
              </label>
              <textarea
                id="comment"
                name="comment"
                className="w-full bg-transparent outline-none"
                placeholder="Agregar un comentario"
                rows={3}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          type="submit"
          form="transfer-form"
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold"
          aria-label={`Transferir $${amount.toLocaleString()} a ${contact.name}`}
        >
          Transferir
        </button>
      </div>
    </div>
  )
}
