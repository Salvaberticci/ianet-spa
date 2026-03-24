import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/components/auth-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "IANET - Panel Administrativo",
  description: "Panel de administración del Instituto de Alimentación y Nutrición del Estado Trujillo",
  generator: 'ianet-admin-panel'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            expand={false}
            duration={4000}
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontSize: "14px",
              },
              classNames: {
                success: "border-l-4 border-green-500",
                error: "border-l-4 border-red-500",
                info: "border-l-4 border-blue-500",
                warning: "border-l-4 border-orange-500",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
