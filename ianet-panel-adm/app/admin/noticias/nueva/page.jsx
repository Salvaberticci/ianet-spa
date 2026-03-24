import { requireAuth } from "@/lib/auth"
import NewsForm from "@/components/news-form"

export default async function NuevaNoticiaPage() {
  await requireAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nueva Noticia</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewsForm />
      </div>
    </div>
  )
}
