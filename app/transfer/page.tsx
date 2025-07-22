"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ChevronRight, ArrowLeft } from "lucide-react"
import type { RootState } from "@/store/store"
import { setSelectedContact } from "@/store/transferSlice"
import Link from "next/link"

export default function Transfer() {
  const [hasUala, setHasUala] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch()
  const contacts = useSelector((state: RootState) => state.transfer.contacts)

  const filteredContacts = contacts.filter(
    (contact) => contact.hasUala === hasUala && contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white" data-testid="transfer-page">
      <div className="flex items-center p-4 border-b" data-testid="transfer-header">
        <Link href="/" className="mr-4" data-testid="back-button">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6" data-testid="transfer-title">Transferencias</h1>
      </div>

      <div className="p-4" data-testid="transfer-content">
        {/* Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6" data-testid="contact-type-toggle">
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${hasUala ? "bg-white shadow-sm" : ""}`}
            onClick={() => setHasUala(true)}
            data-testid="has-uala-tab"
          >
            Tiene Ualá
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm ${!hasUala ? "bg-white shadow-sm" : ""}`}
            onClick={() => setHasUala(false)}
            data-testid="no-uala-tab"
          >
            No tiene Ualá
          </button>
        </div>

        {/* Search */}
        <div className="mb-6" data-testid="search-section">
          <p className="text-sm text-gray-600 mb-2" data-testid="search-instructions">
            {hasUala ? "Si tiene Ualá, buscalo por su nombre de usuario" : "Ingresa los datos bancarios"}
          </p>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="contact-search-input"
          />
        </div>

        {/* Contacts */}
        {hasUala && (
          <div data-testid="contacts-section">
            <h2 className="text-sm font-semibold text-gray-600 mb-2" data-testid="contacts-title">CONTACTOS</h2>
            <div className="space-y-2" data-testid="contacts-list">
              {filteredContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/transfer/${contact.id}`}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                  onClick={() => dispatch(setSelectedContact(contact))}
                  data-testid={`contact-item-${contact.id}`}
                >
                  <div 
                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold"
                    data-testid={`contact-avatar-${contact.id}`}
                  >
                    {contact.initials}
                  </div>
                  <span className="flex-1" data-testid={`contact-name-${contact.id}`}>{contact.name}</span>
                  <ChevronRight className="text-gray-400" data-testid={`contact-arrow-${contact.id}`} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Ualá Section */}
        {!hasUala && (
          <div data-testid="no-uala-section">
            <h2 className="text-sm font-semibold text-gray-600 mb-2" data-testid="no-uala-contacts-title">CONTACTOS SIN UALÁ</h2>
            <div className="space-y-2" data-testid="no-uala-contacts-list">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                  data-testid={`no-uala-contact-item-${contact.id}`}
                >
                  <div 
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold"
                    data-testid={`no-uala-contact-avatar-${contact.id}`}
                  >
                    {contact.initials}
                  </div>
                  <div className="flex-1" data-testid={`no-uala-contact-info-${contact.id}`}>
                    <span className="block" data-testid={`no-uala-contact-name-${contact.id}`}>{contact.name}</span>
                    <span className="text-sm text-gray-500" data-testid={`no-uala-contact-status-${contact.id}`}>Sin Ualá</span>
                  </div>
                  <button 
                    className="text-blue-600 text-sm font-medium"
                    data-testid={`invite-contact-button-${contact.id}`}
                  >
                    Invitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
