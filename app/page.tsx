"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  QrCode,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
  Users,
  DollarSign,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { TransferHistory } from "@/components/TransferHistory"
import { AccountService } from "@/lib/api/services/account.service"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Account, Contact } from "@/lib/api/types"

export default function HomePage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [accountResult, contactsResult] = await Promise.all([
          AccountService.getAccount(),
          TransferService.getContacts(),
        ])

        if (accountResult.success && accountResult.data) {
          setAccount(accountResult.data)
        }

        if (contactsResult.success && contactsResult.data) {
          setContacts(contactsResult.data.filter((contact) => contact.isFrequent))
        }
      } catch (err) {
        setError("Error al cargar los datos")
        console.error("Homepage data fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)
  }

  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Balance Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Error al cargar</h3>
                  <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()}>Reintentar</Button>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium opacity-90">Saldo disponible</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBalanceVisibility}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {isBalanceVisible && account ? formatBalance(account.balance) : "••••••"}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  Cuenta {account?.accountNumber ? `****${account.accountNumber.slice(-4)}` : "****"}
                </p>
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
              <Link href="/transfer">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <ArrowUpRight className="h-6 w-6" />
                  <span className="text-sm">Transferir</span>
                </Button>
              </Link>
              <Link href="/request">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <ArrowDownLeft className="h-6 w-6" />
                  <span className="text-sm">Solicitar</span>
                </Button>
              </Link>
              <Link href="/scan">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <QrCode className="h-6 w-6" />
                  <span className="text-sm">Escanear</span>
                </Button>
              </Link>
              <Link href="/recharge">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Recargar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Contactos</p>
                  <p className="text-xl font-semibold">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Activo</p>
                  <Badge variant="default" className="text-xs">
                    Verificado
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Contacts */}
        {contacts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Contactos frecuentes</CardTitle>
              <Link href="/transfer">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {contacts.slice(0, 6).map((contact) => (
                  <Link key={contact.id} href={`/transfer/${contact.id}`}>
                    <div className="flex flex-col items-center space-y-2 min-w-[60px] cursor-pointer hover:opacity-75 transition-opacity">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {getContactInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-center font-medium truncate w-full">{contact.name.split(" ")[0]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Inversiones</CardTitle>
            <Link href="/invest">
              <Button variant="ghost" size="sm">
                Ver más
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Plazo Fijo</p>
                    <p className="text-xs text-muted-foreground">30 días • 45% TNA</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">$50.000</p>
                  <p className="text-xs text-green-600">+$1.850</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Fondo Común</p>
                    <p className="text-xs text-muted-foreground">Renta Variable</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">$25.000</p>
                  <p className="text-xs text-red-600">-$320</p>
                </div>
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
