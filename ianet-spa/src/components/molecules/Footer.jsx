"use client"

import { Link } from "react-router-dom"
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-green-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>

            <Link to="/" className="flex items-left w-auto">
              <div className="flex items-left">
                <Image src="/logo-ianet-blanco.png" alt="Logo IANET" width={120} height={24} className="h-12" priority />
              </div>
            </Link>

            <p className="text-green-100 text-sm leading-relaxed">
              Instituto de Alimentación y Nutrición del Estado Trujillo. Comprometidos con la salud y nutrición de
              nuestra comunidad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/actualidad" className="text-green-100 hover:text-white text-sm transition-colors">
                  Actualidad
                </Link>
              </li>
              <li>
                <Link to="/solicitudes" className="text-green-100 hover:text-white text-sm transition-colors">
                  Solicitar Cita
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Calle 8, Valera 3101, Trujillo, Venezuela</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>contacto@ianet.gob.ve</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-600 mt-8 pt-8 text-center">
          <p className="text-green-100 text-sm">© {currentYear} IANET. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
