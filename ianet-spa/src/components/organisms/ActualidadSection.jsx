"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card } from "../atoms/Card"
import { Button } from "../atoms/Button"
import { newsService } from "../../services/newsService"

export function ActualidadSection() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await newsService.list({ page: 1, limit: 6 })
        setNews(response.news || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const visibleNews = 3
  const canGoNext = currentIndex + visibleNews < news.length
  const canGoPrev = currentIndex > 0

  const goNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const goPrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  if (loading) {
    return (
      <section id="actualidad" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando noticias...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="actualidad" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">Error al cargar noticias: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section id="actualidad" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">No hay noticias disponibles en este momento.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="actualidad" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-balance">Actualidad</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Mantente informado sobre las últimas noticias y novedades de IANET.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {news.length > visibleNews && (
            <>
              <button
                onClick={goPrev}
                disabled={!canGoPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-green-700 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Noticias anteriores"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goNext}
                disabled={!canGoNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-green-700 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Siguientes noticias"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* News Grid */}
          <div className="overflow-hidden">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-transform duration-500"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleNews)}%)`,
              }}
            >
              {news.map((item) => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow duration-300 p-0 overflow-hidden">
                  {item.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-green-700 font-medium bg-green-50 px-3 py-1 rounded-full">
                        {item.category || "General"}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(item.publishDate)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-green-700 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{item.summary}</p>
                    <Link to={`/actualidad/${item._id}`}>
                      <Button variant="secondary" className="w-full">
                        Leer más
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/actualidad">
            <Button>Ver todas las noticias</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
