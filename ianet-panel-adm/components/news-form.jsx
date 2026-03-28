"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"

export default function NewsForm({ initialData = null }) {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    imageUrl: initialData?.imageUrl || "",
    status: initialData?.status || "borrador",
    publishDate: initialData?.publishDate
      ? new Date(initialData.publishDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es demasiado grande (máximo 5MB)")
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let currentImageUrl = formData.imageUrl

      // 1. Subir imagen si hay un archivo nuevo
      if (imageFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json()
          throw new Error(errorData.error || "Error al subir la imagen")
        }

        const uploadData = await uploadRes.json()
        currentImageUrl = uploadData.url
        setUploading(false)
      }

      const url = initialData ? `/api/admin/news/${initialData._id}` : "/api/admin/news"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: currentImageUrl
        }),
      })

      if (res.ok) {
        const isPublished = formData.status === "publicada"
        toast.success(initialData ? "Noticia actualizada" : (isPublished ? "Noticia publicada exitosamente" : "Noticia guardada como borrador"), {
          description: `"${formData.title}"`,
          icon: isPublished ? "📰" : "📝",
        })
        setTimeout(() => {
          router.push("/admin/noticias")
          router.refresh()
        }, 500)
      } else {
        const data = await res.json()
        const msg = data.error || "Error al guardar la noticia"
        toast.error(msg, { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al guardar la noticia.", { icon: "⚠️" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
          Resumen *
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={3}
          value={formData.summary}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Contenido *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          value={formData.content}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen de la Noticia
          </label>
          <div 
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className={`relative group h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
              imagePreview ? "border-green-500 bg-green-50/10" : "border-gray-300 hover:border-green-500 hover:bg-green-50/50 cursor-pointer"
            }`}
          >
            {imagePreview ? (
              <div className="relative w-full h-full p-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full mb-2 group-hover:bg-green-100 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                </div>
                <p className="text-sm text-gray-500 group-hover:text-green-600">Haz clic para subir imagen</p>
                <p className="text-xs text-gray-400 mt-1">Sugerido: 1200x630px (máx 5MB)</p>
              </>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center backdrop-blur-[1px] z-10">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                <p className="text-sm font-medium text-gray-600">Subiendo imagen...</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="borrador">Borrador</option>
            <option value="publicada">Publicada</option>
          </select>
        </div>

        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Publicación *
          </label>
          <input
            id="publishDate"
            name="publishDate"
            type="date"
            required
            value={formData.publishDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
