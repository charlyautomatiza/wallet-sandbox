"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TransferHistory from "@/components/TransferHistory"
import { AccountService } from "@/lib/api/services/account.service"
import { TransferService } from "@/lib/api/services/transfer.service"
import {
  Send,
  Download,
  Smartphone,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  Building2,
  Zap,
} from "lucide-react"
import Link from "next/link"
import type { Account, Contact } from "@/lib/api/types"

export default function HomePage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountResult, contactsResult] = await Promise.all([
          AccountService.getAccount(),
          TransferService.getContacts(),
        ])

        if (accountResult.success) {
          setAccount(accountResult.data)
        }

        if (contactsResult.success) {
          setContacts(contactsResult.data?.slice(0, 6) || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm">Saldo disponible</p>
                <div className="flex items-center gap-2">
                  {showBalance ? (
                    <h2 className="text-2xl font-bold">{account ? formatBalance(account.balance) : "$0,00"}</h2>
                  ) : (
                    <h2 className="text-2xl font-bold">••••••</h2>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs">CBU</p>
                <p className="text-xs font-mono">{account?.cbu?.slice(-8) || "••••••••"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Alias</p>
                <p className="text-sm font-medium">{account?.alias || "BANCO.DIGITAL.UALA"}</p>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {account?.currency || "ARS"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/transfer">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-medium text-sm">Transferir</p>
                <p className="text-xs text-gray-500">Enviar dinero</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/request">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-sm">Pedir</p>
                <p className="text-xs text-gray-500">Solicitar dinero</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recharge">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                </div>
                <p className="font-medium text-sm">Recargar</p>
                <p className="text-xs text-gray-500">Celular</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/payments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <p className="font-medium text-sm">Pagar</p>
                <p className="text-xs text-gray-500">Servicios</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Contacts */}
        {contacts.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Contactos recientes
                <Link href="/transfer">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Link key={contact.id} href={`/transfer/${contact.id}`}>
                    <div className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="relative">
                        <Avatar className="w-12 h-12 mx-auto mb-2">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        {contact.hasUala && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{contact.name.split(" ")[0]}</p>
                      {contact.hasUala && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-blue-100 text-blue-800">
                          Ualá
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Inversiones
              </span>
              <Link href="/invest">
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Plazo Fijo</p>
                    <p className="text-xs text-gray-500">45 días • 8.5% TNA</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">$50.000</p>
                  <p className="text-xs text-green-600">+$1.250</p>
                </div>
              </div>

              <div className="text-center py-2">
                <Link href="/invest">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Ver todas las inversiones
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer History */}
        <TransferHistory limit={5} />
      </div>
    </div>
  )
}
