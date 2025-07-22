import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransferHistory } from "@/components/TransferHistory"
import {
  ArrowUpRight,
  CreditCard,
  Smartphone,
  TrendingUp,
  Eye,
  EyeOff,
  Send,
  Download,
  QrCode,
  Building,
  PiggyBank,
  MoreHorizontal,
} from "lucide-react"

export default function HomePage() {
  const balance = 125430.5
  const isBalanceVisible = true

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const quickActions = [
    { icon: Send, label: "Transferir", href: "/transfer", color: "bg-blue-500" },
    { icon: Download, label: "Pedir", href: "/request", color: "bg-green-500" },
    { icon: QrCode, label: "Escanear", href: "/scan", color: "bg-purple-500" },
    { icon: Smartphone, label: "Recargar", href: "/recharge", color: "bg-orange-500" },
  ]

  const services = [
    { icon: CreditCard, label: "Pagos", href: "/payments", color: "bg-red-500" },
    { icon: Building, label: "Negocios", href: "/business", color: "bg-indigo-500" },
    { icon: TrendingUp, label: "Invertir", href: "/invest", color: "bg-emerald-500" },
    { icon: PiggyBank, label: "Créditos", href: "/credits", color: "bg-yellow-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">JD</span>
              </div>
              <div>
                <p className="text-sm opacity-90">Hola,</p>
                <p className="font-semibold">Juan Pérez</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Balance Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Saldo disponible</p>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
                  {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-3xl font-bold">{isBalanceVisible ? formatCurrency(balance) : "••••••"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.5%
                </Badge>
                <span className="text-xs opacity-75">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Services */}
          <h2 className="text-lg font-semibold mb-4">Servicios</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {services.map((service, index) => (
              <Link key={index} href={service.href}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${service.color} text-white`}>
                        <service.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{service.label}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Actividad reciente</h2>
              <Link href="/transfer">
                <Button variant="ghost" size="sm">
                  Ver todo
                </Button>
              </Link>
            </div>

            <TransferHistory limit={5} showTitle={false} />
          </div>

          {/* Investment Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inversiones</span>
                <Link href="/invest">
                  <Button variant="ghost" size="sm">
                    Ver todo
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(78700)}</p>
                  <p className="text-sm text-gray-500">Total invertido</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="font-semibold">+4.8%</span>
                  </div>
                  <p className="text-xs text-gray-500">Rendimiento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
