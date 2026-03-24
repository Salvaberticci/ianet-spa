"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card } from "../components/atoms/Card"
import { Button } from "../components/atoms/Button"
import { newsService } from "../services/newsService"

export function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await newsService.getById(id)
        setNews(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando noticia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar la noticia</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()} variant="secondary">
                Intentar nuevamente
              </Button>
              <Link to="/actualidad">
                <Button>Volver a noticias</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Noticia no encontrada</h3>
            <p className="text-gray-600 mb-6">La noticia que buscas no existe o ha sido eliminada.</p>
            <Link to="/actualidad">
              <Button>Volver a noticias</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-8 focus:outline-none focus:ring-2 focus:ring-green-600 rounded-2xl px-3 py-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Volver</span>
        </button>

        {/* Article Card */}
        <Card className="overflow-hidden">
          {/* Featured Image */}
          {news.imageUrl && (
            <div className="w-full aspect-video overflow-hidden -m-6 mb-6">
              <img src={news.imageUrl || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {news.category && (
                <span className="text-sm text-green-700 font-medium bg-green-50 px-4 py-1.5 rounded-full">
                  {news.category}
                </span>
              )}
              <span className="text-sm text-gray-500">{formatDate(news.publishDate)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-balance">{news.title}</h1>

            {news.summary && (
              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-green-700 pl-4 italic">
                {news.summary}
              </p>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{news.content}</div>
          </div>

          {/* Share Section (Optional) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Compartir esta noticia:</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: news.title,
                      text: news.summary,
                      url: window.location.href,
                    })
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span className="text-sm font-medium">Compartir</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link to="/actualidad">
            <Button variant="secondary">Ver todas las noticias</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage


