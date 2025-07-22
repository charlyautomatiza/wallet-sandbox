"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Send,
  Download,
  Scan,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  Users,
  DollarSign,
  Activity,
} from "lucide-react"
import { fetchContacts, fetchTransferHistory } from "@/store/transferSlice"
import { AccountService } from "@/lib/api/services/account.service"
import TransferHistory from "@/components/TransferHistory"
import type { RootState, AppDispatch } from "@/store/store"
import type { Account } from "@/lib/api/types"

export default function HomePage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { contacts, transferHistory, isLoading } = useSelector((state: RootState) => state.transfer)

  const [account, setAccount] = useState<Account | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [accountLoading, setAccountLoading] = useState(true)

  useEffect(() => {
    // Fetch account data
    const fetchAccount = async () => {
      try {
        const response = await AccountService.getAccount()
        if (response.success) {
          setAccount(response.data)
        }
      } catch (error) {
        console.error("Error fetching account:", error)
      } finally {
        setAccountLoading(false)
      }
    }

    fetchAccount()
    dispatch(fetchContacts())
    dispatch(fetchTransferHistory(5))
  }, [dispatch])

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
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const frequentContacts = contacts.filter((contact) => contact.isFrequent).slice(0, 4)
  const recentTransfers = transferHistory.slice(0, 3)

  const quickActions = [
    {
      icon: Send,
      label: "Transferir",
      description: "Enviar dinero",
      href: "/transfer",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Download,
      label: "Pedir",
      description: "Solicitar dinero",
      href: "/request",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Scan,
      label: "Escanear",
      description: "Código QR",
      href: "/scan",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: CreditCard,
      label: "Recargar",
      description: "Agregar dinero",
      href: "/recharge",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">¡Hola!</h1>
              <p className="text-blue-100">Bienvenido a tu banco digital</p>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
          </div>

          {/* Balance Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm">Saldo disponible</p>
                  <div className="flex items-center space-x-2">
                    {accountLoading ? (
                      <Skeleton className="h-8 w-32 bg-white/20" />
                    ) : (
                      <h2 className="text-3xl font-bold">
                        {showBalance ? formatBalance(account?.balance || 0) : "••••••"}
                      </h2>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:bg-white/20"
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Cuenta</p>
                  <p className="text-lg font-semibold">
                    {account?.accountNumber ? `****${account.accountNumber.slice(-4)}` : "****"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+2.5% este mes</span>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30">
                  Activa
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all bg-transparent"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`p-3 rounded-full text-white ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contactos</p>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transferencias</p>
                  <p className="text-2xl font-bold">{transferHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Este mes</p>
                  <p className="text-2xl font-bold">
                    {
                      transferHistory.filter((t) => {
                        const transactionDate = new Date(t.date)
                        const currentDate = new Date()
                        return transactionDate.getMonth() === currentDate.getMonth()
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Contacts */}
        {frequentContacts.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Contactos frecuentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/transfer")}>
                Ver todos
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {frequentContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    onClick={() => router.push(`/transfer/${contact.id}`)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-semibold text-sm truncate w-full">{contact.name}</p>
                      {contact.recentTransfers.length > 0 && (
                        <p className="text-xs text-muted-foreground">Último: {contact.recentTransfers[0].date}</p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de inversiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Rendimiento total</p>
                <p className="text-2xl font-bold text-green-600">+$12,450</p>
                <p className="text-sm text-green-600">+8.2% este año</p>
              </div>
              <Button
                onClick={() => router.push("/invest")}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Ver detalles
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transfer History */}
        <TransferHistory limit={5} />
      </div>
    </div>
  )
}
