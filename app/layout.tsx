import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { BottomNav } from "@/components/layout/BottomNav"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-gray-50 pb-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
