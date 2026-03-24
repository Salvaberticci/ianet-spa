import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import NewsForm from "@/components/news-form"
import { notFound } from "next/navigation"

async function getNews(id) {
  await dbConnect()
  const news = await News.findById(id).lean()
  if (!news) return null
  return JSON.parse(JSON.stringify(news))
}

export default async function EditarNoticiaPage({ params }) {
  await requireAuth()
  const resolvedParams = await params
  const news = await getNews(resolvedParams.id)

  if (!news) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Noticia</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewsForm initialData={news} />
      </div>
    </div>
  )
}
