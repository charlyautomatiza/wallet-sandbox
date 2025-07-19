"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import {
  Bell,
  HelpCircle,
  Store,
  Smartphone,
  CreditCardIcon,
  TrendingUp,
  Eye,
  EyeOff,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { RootState } from "@/store/store"
import Image from "next/image"
import Link from "next/link"

const cards = [
  {
    id: 1,
    type: "Débito",
    number: "4552",
    network: "visa",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 2,
    type: "Crédito",
    number: "9796",
    network: "mastercard",
    color: "from-pink-500 to-red-500",
  },
]

export default function Home() {
  const [showBalance, setShowBalance] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const user = useSelector((state: RootState) => state.auth.user)
  const account = useSelector((state: RootState) => state.account)

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const movements = [
    { id: 1, type: "Rendimientos", description: "Operación exitosa", amount: 487.27, date: "09/02" },
    { id: 2, type: "Rendimientos", description: "Operación exitosa", amount: 486.84, date: "08/02" },
    { id: 3, type: "Rendimientos", description: "Operación exitosa", amount: 486.42, date: "07/02" },
  ]

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl font-semibold">
            {user?.initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold">Hola, {user?.name}</h1>
            <div className="flex items-center">
              <span className="text-sm">⭐ {user?.points.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell size={24} />
          <HelpCircle size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 rounded-t-3xl mt-4">
        {/* Currency Toggle */}
        <div className="flex p-4 border-b">
          <button className="flex-1 text-center font-medium text-blue-600 border-b-2 border-blue-600 pb-2">
            Pesos
          </button>
          <button className="flex-1 text-center text-gray-600">
            Dólares <span className="text-green-500 text-sm">¡Nuevo!</span>
          </button>
        </div>

        {/* Balance */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl text-gray-700">Saldo disponible</h2>
            <span className="text-green-500 text-sm">+35%</span>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl font-bold">${showBalance ? account.balance.toLocaleString() : "****"}</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400">
              {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4 mb-8">
            <Link href="/deposit" className="flex-1 bg-blue-600 text-white rounded-lg py-3 px-4 text-center">
              Ingresar
            </Link>
            <Link
              href="/transfer"
              className="flex-1 border border-blue-600 text-blue-600 rounded-lg py-3 px-4 text-center"
            >
              Transferir
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Link href="/business" className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Tu Negocio</span>
            </Link>
            <Link href="/recharge" className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Recargar</span>
            </Link>
            <Link href="/credits" className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Créditos</span>
            </Link>
            <Link href="/invest" className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Invertir</span>
            </Link>
          </div>

          {/* Cards Section */}
          <div className="mb-8">
            <h2 className="text-xl text-gray-700 mb-4">Mis Tarjetas</h2>
            <div className="relative">
              <div className={`bg-gradient-to-r ${cards[currentCard].color} rounded-xl p-6 text-white`}>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg">{cards[currentCard].type}</span>
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-6 h-6" />
                    <Image
                      src={`/placeholder.svg?network=${cards[currentCard].network}`}
                      alt={cards[currentCard].network}
                      width={40}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold">{cards[currentCard].number}</div>
              </div>

              {/* Card Navigation */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button onClick={prevCard} className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button onClick={nextCard} className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Card Indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentCard ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Movements Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-700">Movimientos</h2>
              <Link href="/movements" className="text-blue-600 text-sm">
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {movements.map((movement) => (
                <div key={movement.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{movement.type}</p>
                    <p className="text-sm text-gray-500">{movement.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+${movement.amount}</p>
                    <p className="text-sm text-gray-500">{movement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
