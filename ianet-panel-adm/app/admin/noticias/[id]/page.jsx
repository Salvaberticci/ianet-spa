import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import { notFound } from "next/navigation"
import NewsDetail from "@/components/news-detail"

async function getNews(id) {
  try {
    await dbConnect()
    const news = await News.findById(id).populate("author", "name email").lean()
    
    if (!news) return null
    
    // Convert Mongoose document to plain object for Client Components
    return JSON.parse(JSON.stringify(news))
  } catch (error) {
    console.error("Error fetching news:", error)
    return null
  }
}

export default async function NewsDetailPage({ params }) {
  // 1. Verificar autenticación
  await requireAuth()

  // 2. Await params (Next.js 15+ requirement)
  const resolvedParams = await params
  const { id } = resolvedParams

  // 3. Obtener los datos de la noticia
  const news = await getNews(id)

  // 4. Si no existe, mostrar 404
  if (!news) {
    notFound()
  }

  // 5. Renderizar el detalle
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsDetail news={news} />
    </div>
  )
}
