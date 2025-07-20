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

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/transfer/scheduled" 
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-2 bg-blue-100 rounded-full">
              <span role="img" aria-label="Calendario" className="text-xl">⏰</span>
            </div>
            <span className="text-sm font-medium text-center">Transferencias Programadas</span>
          </Link>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center mb-2 bg-gray-100 rounded-full">
              <span role="img" aria-label="Perfil" className="text-xl">👤</span>
            </div>
            <span className="text-sm font-medium text-center text-gray-400">Perfil</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center mb-2 bg-gray-100 rounded-full">
              <span role="img" aria-label="Configuración" className="text-xl">⚙️</span>
            </div>
            <span className="text-sm font-medium text-center text-gray-400">Configuración</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center mb-2 bg-gray-100 rounded-full">
              <span role="img" aria-label="Ayuda" className="text-xl">❓</span>
            </div>
            <span className="text-sm font-medium text-center text-gray-400">Ayuda</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Próximamente</h2>
          <p className="text-gray-600 text-sm">Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia.</p>
        </div>
      </div>
    </div>
  )
}
