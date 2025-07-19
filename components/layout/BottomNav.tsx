import { Home, ArrowDownUp, QrCode, Receipt, Grid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 ${isActive("/") ? "text-blue-600" : "text-gray-600"}`}
        >
          <Home size={24} />
          <span className="text-xs">Inicio</span>
        </Link>
        <Link
          href="/transfer"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/transfer") ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <ArrowDownUp size={24} />
          <span className="text-xs">Transferir</span>
        </Link>
        <Link
          href="/scan"
          className={`flex flex-col items-center space-y-1 ${isActive("/scan") ? "text-blue-600" : "text-gray-600"}`}
        >
          <div className="bg-blue-600 p-3 rounded-full -mt-5">
            <QrCode size={24} className="text-white" />
          </div>
        </Link>
        <Link
          href="/payments"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/payments") ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Receipt size={24} />
          <span className="text-xs">Pagos</span>
        </Link>
        <Link
          href="/more"
          className={`flex flex-col items-center space-y-1 ${isActive("/more") ? "text-blue-600" : "text-gray-600"}`}
        >
          <Grid size={24} />
          <span className="text-xs">Más</span>
        </Link>
      </div>
    </nav>
  )
}

