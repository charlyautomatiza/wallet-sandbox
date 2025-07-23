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
  Calendar,
  Clock,
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
  const scheduledTransfers = useSelector((state: RootState) => state.transfer.scheduledTransfers)
  
  // Get upcoming transfers (next 7 days)
  const getUpcomingTransfers = () => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return scheduledTransfers
      .filter(transfer => transfer.active)
      .filter(transfer => {
        const scheduledDate = new Date(transfer.scheduledDate)
        return scheduledDate <= nextWeek && scheduledDate > now
      })
      .slice(0, 2) // Show only first 2 upcoming transfers
  }

  const upcomingTransfers = getUpcomingTransfers()

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Una vez'
      case 'daily': return 'Diario'
      case 'weekly': return 'Semanal'  
      case 'monthly': return 'Mensual'
      default: return frequency
    }
  }

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
    <div className="min-h-screen bg-blue-600" data-testid="home-page">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white" data-testid="home-header">
        <div className="flex items-center space-x-3" data-testid="user-info">
          <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl font-semibold" data-testid="user-avatar">
            {user?.initials}
          </div>
          <div data-testid="user-greeting">
            <h1 className="text-xl font-semibold" data-testid="user-name">Hola, {user?.name}</h1>
            <div className="flex items-center">
              <span className="text-sm" data-testid="user-points">⭐ {user?.points.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4" data-testid="header-actions">
          <Bell size={24} data-testid="notifications-button" />
          <HelpCircle size={24} data-testid="help-button" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 rounded-t-3xl mt-4" data-testid="main-content">
        {/* Currency Toggle */}
        <div className="flex p-4 border-b" data-testid="currency-toggle">
          <button className="flex-1 text-center font-medium text-blue-600 border-b-2 border-blue-600 pb-2" data-testid="pesos-tab">
            Pesos
          </button>
          <button className="flex-1 text-center text-gray-600" data-testid="dollars-tab">
            Dólares <span className="text-green-500 text-sm">¡Nuevo!</span>
          </button>
        </div>

        {/* Balance */}
        <div className="p-4" data-testid="balance-section">
          <div className="flex justify-between items-center mb-2" data-testid="balance-header">
            <h2 className="text-xl text-gray-700" data-testid="balance-title">Saldo disponible</h2>
            <span className="text-green-500 text-sm" data-testid="balance-change">+35%</span>
          </div>
          <div className="flex items-center space-x-2 mb-4" data-testid="balance-display">
            <span className="text-3xl font-bold" data-testid="balance-amount">${showBalance ? account.balance.toLocaleString() : "****"}</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400" data-testid="balance-toggle">
              {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4 mb-8" data-testid="quick-actions">
            <Link href="/deposit" className="flex-1 bg-blue-600 text-white rounded-lg py-3 px-4 text-center" data-testid="deposit-button">
              Ingresar
            </Link>
            <Link
              href="/transfer"
              className="flex-1 border border-blue-600 text-blue-600 rounded-lg py-3 px-4 text-center"
              data-testid="transfer-button"
            >
              Transferir
            </Link>
          </div>

          {/* Upcoming Scheduled Transfers */}
          {upcomingTransfers.length > 0 && (
            <div className="mb-8" data-testid="upcoming-transfers-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700" data-testid="upcoming-transfers-title">
                  Próximas transferencias
                </h2>
                <Link 
                  href="/transfer/scheduled"
                  className="text-blue-600 text-sm font-medium"
                  data-testid="view-all-scheduled-link"
                >
                  Ver todas
                </Link>
              </div>
              <div className="space-y-3" data-testid="upcoming-transfers-list">
                {upcomingTransfers.map((transfer) => {
                  const scheduledDate = new Date(transfer.scheduledDate)
                  const isToday = scheduledDate.toDateString() === new Date().toDateString()
                  const isTomorrow = scheduledDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
                  
                  return (
                    <div 
                      key={transfer.id}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      data-testid={`upcoming-transfer-${transfer.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-900">{transfer.contactName}</span>
                            {isToday && (
                              <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                                Hoy
                              </span>
                            )}
                            {isTomorrow && (
                              <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                                Mañana
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                              ${transfer.amount.toLocaleString()}
                            </span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {scheduledDate.toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatFrequency(transfer.frequency)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8" data-testid="features-grid">
            <Link href="/business" className="flex flex-col items-center space-y-2" data-testid="business-link">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Tu Negocio</span>
            </Link>
            <Link href="/recharge" className="flex flex-col items-center space-y-2" data-testid="recharge-link">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Recargar</span>
            </Link>
            <Link href="/credits" className="flex flex-col items-center space-y-2" data-testid="credits-link">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Créditos</span>
            </Link>
            <Link href="/invest" className="flex flex-col items-center space-y-2" data-testid="invest-link">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-center text-blue-600">Invertir</span>
            </Link>
          </div>

          {/* Cards Section */}
          <div className="mb-8" data-testid="cards-section">
            <h2 className="text-xl text-gray-700 mb-4" data-testid="cards-title">Mis Tarjetas</h2>
            <div className="relative" data-testid="cards-carousel">
              <div className={`bg-gradient-to-r ${cards[currentCard].color} rounded-xl p-6 text-white`} data-testid={`card-${currentCard}`}>
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
                {cards.map((card, index) => (
                  <div
                    key={card.id}
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
