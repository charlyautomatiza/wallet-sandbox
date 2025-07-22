"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Transaction } from "@/lib/api/types"

interface TransferHistoryProps {
  limit?: number
  showTitle?: boolean
}

export function TransferHistory({ limit = 10, showTitle = true }: TransferHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransferHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await TransferService.getTransferHistory(limit)

      if (result.success) {
        setTransactions(result.data)
      } else {
        setError(result.error || "Error al cargar el historial")
      }
    } catch (err) {
      setError("Error al cargar el historial de transferencias")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransferHistory()
  }, [limit])

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
      year: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Historial de Transferencias
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-1">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>Historial de Transferencias</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadTransferHistory} variant="outline" size="sm">
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
      {showTitle && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Historial de Transferencias</CardTitle>
          <Button onClick={loadTransferHistory} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No hay transferencias registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.contactName || transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {transaction.status === "completed" ? "Completada" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
