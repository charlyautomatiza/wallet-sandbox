"use client"

import { useEffect, useState } from "react"
import { TransferService } from "@/lib/api/services/transfer.service"
import type { Transaction } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export function TransferHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransferHistory = async () => {
      try {
        const result = await TransferService.getTransferHistory(20)
        if (result.success && result.data) {
          setTransactions(result.data)
        }
      } catch (error) {
        console.error("Error loading transfer history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTransferHistory()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0
    const absoluteAmount = Math.abs(amount)
    return {
      formatted: `$${absoluteAmount.toLocaleString()}`,
      isNegative,
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Transferencias</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay transferencias registradas</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const { formatted, isNegative } = formatAmount(transaction.amount)

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${isNegative ? "bg-red-100" : "bg-green-100"}`}>
                      {isNegative ? (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                      {transaction.contactName && <p className="text-xs text-gray-400">{transaction.contactName}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}>
                      {isNegative ? "-" : "+"}
                      {formatted}
                    </p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status === "completed" ? "Completada" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
