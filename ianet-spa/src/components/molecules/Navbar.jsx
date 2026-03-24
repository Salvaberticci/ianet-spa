"use client"

import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Image from 'next/image'

export function Navbar() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState('inicio')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ['inicio', 'quienes-somos', 'servicios', 'actualidad', 'contacto']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const navLinks = [
    { path: "/", label: "Inicio" },
    { path: "/actualidad", label: "Actualidad" },
    { path: "/solicitudes", label: "Solicitar Cita" },
    { path: "/#contacto", label: "Contacto", isHash: true },
  ]

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const handleHashLink = (e, path) => {
    if (path.includes("#")) {
      e.preventDefault()
      const hash = path.split("#")[1]
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <Image src="/logo-ianet-verde.png" alt="Logo IANET" width={120} height={24} className="h-12 w-auto" priority />
            </div>
          </Link>

          {/* Desktop Navigation & Republic Logo */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => link.isHash && handleHashLink(e, link.path)}
                  className={`text-sm font-medium transition-colors hover:text-green-700 ${isActive(link.path) ? "text-green-700" : "text-gray-700"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-green-100" />

            <div className="flex items-center">
              <Image src="/logo-republica2.png" alt="Logo República de Venezuela" width={120} height={24} className="h-10 w-auto" priority />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-2xl hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-green-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if (link.isHash) handleHashLink(e, link.path)
                    setIsMenuOpen(false)
                  }}
                  className={`text-sm font-medium py-2 px-3 rounded-2xl transition-colors ${isActive(link.path)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
