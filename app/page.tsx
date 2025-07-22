"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import TransferHistory from "@/components/TransferHistory"
import { AccountService } from "@/lib/api/services/account.service"
import { TransferService } from "@/lib/api/services/transfer.service"
import {
  Eye,
  EyeOff,
  Send,
  QrCode,
  CreditCard,
  PiggyBank,
  MoreHorizontal,
  ArrowUpRight,
  Smartphone,
  Plus,
} from "lucide-react"
import Link from "next/link"
import type { Account, Contact } from "@/lib/api/types"

export default function HomePage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch account data
        const accountResponse = await AccountService.getAccount()
        if (accountResponse.success) {
          setAccount(accountResponse.data)
        }

        // Fetch contacts
        const contactsResponse = await TransferService.getContacts()
        if (contactsResponse.success) {
          setContacts(contactsResponse.data.filter((c) => c.isFrequent).slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Balance Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Contacts Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100">Saldo disponible</span>
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
              <h2 className="text-3xl font-bold">{showBalance ? formatBalance(account?.balance || 0) : "••••••"}</h2>
              <p className="text-blue-100 text-sm">Cuenta: {account?.accountNumber || "••••-••••-••••-••••"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/transfer">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <Send className="h-6 w-6" />
                  <span className="text-sm">Transferir</span>
                </Button>
              </Link>

              <Link href="/request">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <ArrowUpRight className="h-6 w-6" />
                  <span className="text-sm">Pedir dinero</span>
                </Button>
              </Link>

              <Link href="/scan">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <QrCode className="h-6 w-6" />
                  <span className="text-sm">Escanear QR</span>
                </Button>
              </Link>

              <Link href="/recharge">
                <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                  <Smartphone className="h-6 w-6" />
                  <span className="text-sm">Recargar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contactos frecuentes</span>
              <Link href="/transfer">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ver todos
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay contactos frecuentes</p>
                <Link href="/transfer">
                  <Button variant="link" className="mt-2">
                    Agregar contactos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Link key={contact.id} href={`/transfer/${contact.id}`}>
                    <Button
                      variant="outline"
                      className="h-16 flex items-center space-x-3 w-full justify-start p-4 bg-transparent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {contact.hasUala && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              Ualá
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inversiones</span>
              <Link href="/invest">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <PiggyBank className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">Total invertido</p>
                  <p className="text-sm text-muted-foreground">$77,500 ARS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">+$4,250</p>
                <p className="text-xs text-muted-foreground">+5.8% este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer History */}
        <TransferHistory limit={5} />

        {/* Additional Services */}
        <Card>
          <CardHeader>
            <CardTitle>Más servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/payments">
                <Button variant="outline" className="h-16 flex-col space-y-2 w-full bg-transparent">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Pagos</span>
                </Button>
              </Link>

              <Link href="/credits">
                <Button variant="outline" className="h-16 flex-col space-y-2 w-full bg-transparent">
                  <PiggyBank className="h-5 w-5" />
                  <span className="text-xs">Créditos</span>
                </Button>
              </Link>

              <Link href="/business">
                <Button variant="outline" className="h-16 flex-col space-y-2 w-full bg-transparent">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-xs">Negocios</span>
                </Button>
              </Link>

              <Link href="/more">
                <Button variant="outline" className="h-16 flex-col space-y-2 w-full bg-transparent">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-xs">Más</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
