"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card } from "../components/atoms/Card"
import { Button } from "../components/atoms/Button"
import { newsService } from "../services/newsService"

export function ActualidadPage() {
  const [news, setNews] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await newsService.list({ page: currentPage, limit: 9 })
        setNews(response.news || [])
        setPagination(response.pagination)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4"
        >
          Anterior
        </Button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 rounded-2xl border border-green-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-2xl border transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 ${
              page === currentPage
                ? "bg-green-700 text-white border-green-700"
                : "border-green-300 hover:bg-green-50 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < pagination.pages && (
          <>
            {endPage < pagination.pages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(pagination.pages)}
              className="w-10 h-10 rounded-2xl border border-green-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
            >
              {pagination.pages}
            </button>
          </>
        )}

        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.pages}
          className="px-4"
        >
          Siguiente
        </Button>
      </div>
    )
  }

  return (
    <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4 text-balance">Actualidad</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Mantente informado sobre las últimas noticias, eventos y novedades de IANET.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando noticias...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar noticias</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Intentar nuevamente</Button>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-600">Vuelve pronto para ver las últimas actualizaciones.</p>
          </Card>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-lg transition-shadow duration-300 p-0 overflow-hidden flex flex-col"
                >
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
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-green-700 font-medium bg-green-50 px-3 py-1 rounded-full">
                        {item.category || "General"}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(item.publishDate)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-green-700 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{item.summary}</p>
                    <Link to={`/actualidad/${item._id}`} className="mt-auto">
                      <Button variant="secondary" className="w-full">
                        Leer más
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  )
}

export default ActualidadPage


