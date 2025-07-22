"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TransferHistory } from "@/components/TransferHistory"
import { ArrowUpRight, ArrowDownLeft, Plus, QrCode, CreditCard, TrendingUp, Eye, EyeOff, RefreshCw } from "lucide-react"
import type { RootState } from "@/store/store"
import { AccountService } from "@/lib/api/services/account.service"
import type { Account } from "@/lib/api/types"

export default function HomePage() {
  const dispatch = useDispatch()
  const { contacts } = useSelector((state: RootState) => state.transfer)

  const [account, setAccount] = useState<Account | null>(null)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const response = await AccountService.getAccount()
        if (response.success) {
          setAccount(response.data || null)
        }
      } catch (error) {
        console.error("Failed to load account data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAccountData()
  }, [])

  const formatBalance = (balance: number) => {
    if (!isBalanceVisible) return "••••••"

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(balance)
  }

  const recentContacts = contacts.filter((contact) => contact.recentTransfers.length > 0).slice(0, 4)

  const quickActions = [
    {
      title: "Transferir",
      description: "Enviar dinero",
      icon: ArrowUpRight,
      href: "/transfer",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pedir",
      description: "Solicitar dinero",
      icon: ArrowDownLeft,
      href: "/request",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Escanear",
      description: "Código QR",
      icon: QrCode,
      href: "/scan",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Recargar",
      description: "Agregar dinero",
      icon: Plus,
      href: "/recharge",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando...</span>
          </div>
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
              <div>
                <p className="text-blue-100 text-sm">Saldo disponible</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold">{formatBalance(account?.balance || 0)}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Cuenta Principal
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                <span>•••• {account?.accountNumber?.slice(-4) || "1234"}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>+5.2% este mes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`p-3 rounded-full ${action.bgColor} mb-2`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground text-center">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Contactos recientes</CardTitle>
              <Link href="/transfer">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentContacts.map((contact, index) => (
                  <div key={contact.id}>
                    <Link href={`/transfer/${contact.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">{contact.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{contact.name}</p>
                          <div className="flex items-center gap-2">
                            {contact.hasUala && (
                              <Badge variant="secondary" className="text-xs">
                                Ualá
                              </Badge>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {contact.recentTransfers.length} transferencia
                              {contact.recentTransfers.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                    {index < recentContacts.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transfer History */}
        <TransferHistory />

        {/* Investment Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Inversiones</CardTitle>
            <Link href="/invest">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Fondo Común de Inversión</p>
                  <p className="text-xs text-muted-foreground">Renta mixta</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+5.0%</p>
                  <p className="text-xs text-muted-foreground">$525.000</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Plazo Fijo UVA</p>
                  <p className="text-xs text-muted-foreground">30 días</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">+5.0%</p>
                  <p className="text-xs text-muted-foreground">$315.000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
