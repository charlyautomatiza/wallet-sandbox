"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff, Send, QrCode, CreditCard, TrendingUp, Plus, ArrowDownLeft, Smartphone, Users } from "lucide-react"
import Link from "next/link"
import { TransferHistory } from "@/components/TransferHistory"
import { AccountService } from "@/lib/api/services/account.service"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Account, Contact } from "@/lib/api/types"

export default function HomePage() {
  const [showBalance, setShowBalance] = useState(true)
  const [account, setAccount] = useState<Account | null>(null)
  const [recentContacts, setRecentContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load account data
        const accountResponse = await AccountService.getAccount()
        if (accountResponse.success) {
          setAccount(accountResponse.data)
        }

        // Load recent contacts
        const contactsResponse = await TransferService.getContacts()
        if (contactsResponse.success) {
          // Get contacts with recent transfers (first 6)
          const contactsWithTransfers = contactsResponse.data
            .filter((contact) => contact.recentTransfers.length > 0)
            .slice(0, 6)
          setRecentContacts(contactsWithTransfers)
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance)
  }

  const quickActions = [
    {
      title: "Transferir",
      description: "Enviar dinero",
      icon: Send,
      href: "/transfer",
      color: "bg-blue-500",
    },
    {
      title: "Pedir",
      description: "Solicitar dinero",
      icon: ArrowDownLeft,
      href: "/request",
      color: "bg-green-500",
    },
    {
      title: "Escanear",
      description: "Código QR",
      icon: QrCode,
      href: "/scan",
      color: "bg-purple-500",
    },
    {
      title: "Recargar",
      description: "Celular/SUBE",
      icon: Smartphone,
      href: "/recharge",
      color: "bg-orange-500",
    },
    {
      title: "Pagos",
      description: "Servicios",
      icon: CreditCard,
      href: "/payments",
      color: "bg-red-500",
    },
    {
      title: "Invertir",
      description: "Hacer crecer tu plata",
      icon: TrendingUp,
      href: "/invest",
      color: "bg-indigo-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Balance Card Skeleton */}
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tu dinero</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{showBalance ? formatBalance(account?.balance || 0) : "••••••"}</p>
              <p className="text-blue-100 text-sm">Dinero disponible • {account?.currency || "ARS"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="text-center group cursor-pointer">
                    <div
                      className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Contactos recientes
                <Link href="/transfer">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Ver todos
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {recentContacts.map((contact) => (
                  <Link key={contact.id} href={`/transfer/${contact.id}`}>
                    <div className="text-center group cursor-pointer">
                      <div className="relative">
                        <Avatar className="w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {contact.hasUala && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0 h-5"
                          >
                            U
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name.split(" ")[0]}</p>
                      {contact.recentTransfers.length > 0 && (
                        <p className="text-xs text-gray-500">{contact.recentTransfers[0].date}</p>
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
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Inversiones
              <Link href="/invest">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Invertir
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Plazo Fijo UVA</p>
                    <p className="text-sm text-gray-500">Vence 15/06/2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$5.200</p>
                  <p className="text-xs text-gray-500">5.2% anual</p>
                </div>
              </div>
              <div className="text-center py-2">
                <Link href="/invest">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver todas las inversiones
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer History */}
        <TransferHistory />
      </div>
    </div>
  )
}
