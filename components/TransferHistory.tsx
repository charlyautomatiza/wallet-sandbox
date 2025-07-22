"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Transaction } from "@/lib/api/types"

interface TransferHistoryProps {
  limit?: number
  showHeader?: boolean
  className?: string
}

export function TransferHistory({ limit = 10, showHeader = true, className = "" }: TransferHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchTransferHistory = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const result = await TransferService.getTransferHistory(limit)

      if (result.success && result.data) {
        setTransactions(result.data)
      } else {
        setError(result.error || "Failed to load transfer history")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Transfer history error:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTransferHistory()
  }, [limit])

  const handleRefresh = () => {
    fetchTransferHistory(true)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === "transfer") {
      return amount < 0 ? (
        <ArrowUpRight className="h-4 w-4 text-red-500" />
      ) : (
        <ArrowDownLeft className="h-4 w-4 text-green-500" />
      )
    }
    return amount < 0 ? (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Historial de Transferencias</CardTitle>
            <Skeleton className="h-9 w-9 rounded-md" />
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Historial de Transferencias</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Historial de Transferencias</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No hay transferencias recientes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Historial de Transferencias</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getTransactionIcon(transaction.type, transaction.amount)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{transaction.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  {transaction.contactName && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground truncate">{transaction.contactName}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className={`text-sm font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                  {transaction.amount < 0 ? "-" : "+"}
                  {formatAmount(transaction.amount)}
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  {getStatusIcon(transaction.status)}
                  <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                    {transaction.status === "completed"
                      ? "Completada"
                      : transaction.status === "pending"
                        ? "Pendiente"
                        : transaction.status === "failed"
                          ? "Fallida"
                          : "Desconocido"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}

        {transactions.length >= limit && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Ver más transferencias
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
