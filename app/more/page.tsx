import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function More() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center mr-6">Más</h1>
      </div>

      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Próximamente</h2>
        <p className="text-gray-600 mb-8">Esta funcionalidad estará disponible pronto.</p>
        <Link href="/" className="bg-blue-600 text-white rounded-lg px-6 py-3 font-medium">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

