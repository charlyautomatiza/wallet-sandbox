import type React from "react"
import Link from "next/link"
import { Home, Send, CreditCard, QrCode, MoreHorizontal } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t fixed bottom-0 w-full">
      <nav className="container mx-auto">
        <ul className="flex justify-between items-center p-4">
          <li>
            <Link href="/" className="flex flex-col items-center text-blue-600">
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/transfers" className="flex flex-col items-center text-gray-600">
              <Send className="w-6 h-6" />
              <span className="text-xs">Transfers</span>
            </Link>
          </li>
          <li>
            <Link href="/payments" className="flex flex-col items-center text-gray-600">
              <CreditCard className="w-6 h-6" />
              <span className="text-xs">Payments</span>
            </Link>
          </li>
          <li>
            <Link href="/scan" className="flex flex-col items-center text-gray-600">
              <QrCode className="w-6 h-6" />
              <span className="text-xs">Scan QR</span>
            </Link>
          </li>
          <li>
            <Link href="/more" className="flex flex-col items-center text-gray-600">
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-xs">More</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
