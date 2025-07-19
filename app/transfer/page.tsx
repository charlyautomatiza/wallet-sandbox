"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ChevronRight, ArrowLeft } from "lucide-react"
import type { RootState } from "@/store/store"
import { setSelectedContact } from "@/store/transferSlice"
import { handleTransfer } from "@/app/actions"
import Link from "next/link"
import { useFormState } from "react-dom"

export default function Transfer() {
  const [hasUala, setHasUala] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch()
  const contacts = useSelector((state: RootState) => state.transfer.contacts)
  const [state, formAction] = useFormState(handleTransfer, null)

  const filteredContacts = contacts.filter(
    (contact) => contact.hasUala === hasUala && contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Transferencias</h1>
      </div>

      <div className="p-4">
        {/* Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${hasUala ? "bg-white shadow-sm" : ""}`}
            onClick={() => setHasUala(true)}
          >
            Tiene Ualá
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${!hasUala ? "bg-white shadow-sm" : ""}`}
            onClick={() => setHasUala(false)}
          >
            No tiene Ualá
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            {hasUala ? "Si tiene Ualá, buscalo por su nombre de usuario" : "Ingresa los datos bancarios"}
          </p>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contacts */}
        {hasUala && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">CONTACTOS</h2>
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/transfer/${contact.id}`}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                  onClick={() => dispatch(setSelectedContact(contact))}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {contact.initials}
                  </div>
                  <span className="flex-1">{contact.name}</span>
                  <ChevronRight className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
