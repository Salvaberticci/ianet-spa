"use client"

import { ArrowLeft, Edit, Calendar, Tag, Info } from "lucide-react"
import Link from "next/link"

export default function NewsDetail({ news }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/noticias"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors group"
        >
          <div className="p-1 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Volver a la lista
        </Link>
        <Link
          href={`/admin/noticias/${news._id}/editar`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm hover:shadow-md font-medium"
        >
          <Edit className="w-4 h-4" />
          Editar Noticia
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Imagen Destacada */}
        {news.imageUrl ? (
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100 text-gray-400 italic">
            Sin imagen destacada
          </div>
        )}

        {/* Contenido */}
        <div className="p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                news.status === "publicada" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              }`}>
                {news.status}
              </span>
              {news.category && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {news.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                <Calendar className="w-3 h-3" />
                {new Date(news.publishDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {news.title}
            </h1>
            
            <p className="text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-green-500 pl-6 italic bg-green-50/30 py-4 rounded-r-xl">
              {news.summary}
            </p>
          </div>

          <hr className="border-gray-100" />

          <div className="prose prose-lg max-w-none text-gray-700">
            <div className="whitespace-pre-wrap leading-relaxed">
              {news.content}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Detalles técnicos</h4>
          <p className="text-blue-700 text-sm">
            Esta noticia fue creada el {new Date(news.createdAt).toLocaleDateString("es-ES")} y se actualizó por última vez el {new Date(news.updatedAt).toLocaleDateString("es-ES")}.
            {news.author && ` Autor: ${news.author.name || news.author.email || "Administrador"}`}
          </p>
        </div>
      </div>
    </div>
  )
}
