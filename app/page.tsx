"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Plus, Send, Download, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"
import { TransferHistory } from "@/components/TransferHistory"
import { mockAccount, mockContacts } from "@/lib/api/mock-data"

export default function HomePage() {
  const [showBalance, setShowBalance] = useState(true)
  const [account, setAccount] = useState(mockAccount)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: account.currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const recentContacts = mockContacts.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">¡Hola!</h1>
              <p className="text-blue-100">Bienvenido a tu banco</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">Saldo disponible</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/20 p-1 h-auto"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-2xl font-bold">{showBalance ? formatCurrency(account.balance) : "••••••"}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {account.currency}
                </Badge>
                <span className="text-xs text-blue-100">Cuenta: ****{account.accountNumber.slice(-4)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link href="/transfer">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Send className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Transferir</p>
                  <p className="text-xs text-gray-500">Enviar dinero</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/request">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Pedir</p>
                  <p className="text-xs text-gray-500">Solicitar dinero</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/recharge">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Plus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Recargar</p>
                  <p className="text-xs text-gray-500">Agregar dinero</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/payments">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium">Pagar</p>
                  <p className="text-xs text-gray-500">Servicios</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Contactos recientes</h2>
              <Link href="/transfer">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentContacts.map((contact) => (
                <Link key={contact.id} href={`/transfer/${contact.id}`}>
                  <div className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {contact.initials}
                    </div>
                    <span className="text-xs text-center text-gray-600 max-w-[60px] truncate">
                      {contact.name.split(" ")[0]}
                    </span>
                    {contact.hasUala && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Ualá
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Investment Summary */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Inversiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total invertido</p>
                  <p className="text-lg font-semibold text-green-600">$225.000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ganancia</p>
                  <p className="text-lg font-semibold text-green-600">+$8.500</p>
                </div>
              </div>
              <Link href="/invest">
                <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                  Ver inversiones
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Transfer History */}
          <TransferHistory />
        </div>
      </div>
    </div>
  )
}
