"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Clock } from "lucide-react"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Transaction } from "@/lib/api/types"

export function TransferHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransferHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await TransferService.getTransferHistory(20)

      if (response.success) {
        setTransactions(response.data || [])
      } else {
        setError(response.error || "Failed to load transfer history")
      }
    } catch (err) {
      setError("Failed to load transfer history")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransferHistory()
  }, [])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getTransactionIcon = (amount: number) => {
    return amount < 0 ? (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completada", variant: "default" as const },
      pending: { label: "Pendiente", variant: "secondary" as const },
      failed: { label: "Fallida", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Transferencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando historial...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Transferencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadTransferHistory} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Transferencias
        </CardTitle>
        <Button onClick={loadTransferHistory} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay transferencias registradas</p>
            <p className="text-sm">Las transferencias aparecerán aquí una vez que las realices</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getTransactionIcon(transaction.amount)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      {transaction.contactName && (
                        <p className="text-xs text-muted-foreground mt-1">{transaction.contactName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      {transaction.amount < 0 ? "-" : "+"}
                      {formatAmount(transaction.amount)}
                    </p>
                    {transaction.balance !== undefined && (
                      <p className="text-xs text-muted-foreground">Saldo: {formatAmount(transaction.balance)}</p>
                    )}
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
