import type React from "react"
import { Bell } from "lucide-react"

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">BankSandbox</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, John Doe</span>
          <Bell className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </header>
  )
}

export default Header

