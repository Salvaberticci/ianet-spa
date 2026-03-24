import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import Link from "next/link"
import { Plus } from "lucide-react"
import NewsTable from "@/components/news-table"

async function getNews(searchParams) {
  await dbConnect()

  const search = searchParams.search || ""
  const status = searchParams.status || ""
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 10

  const query = {}

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { summary: { $regex: search, $options: "i" } }]
  }

  if (status) {
    query.status = status
  }

  const skip = (page - 1) * limit

  const [news, total] = await Promise.all([
    News.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "name").lean(),
    News.countDocuments(query),
  ])

  return {
    news: JSON.parse(JSON.stringify(news)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function NoticiasPage({ searchParams }) {
  await requireAuth()
  const { news, pagination } = await getNews(searchParams)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Noticias</h1>
        <Link
          href="/admin/noticias/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Noticia
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <NewsTable news={news} pagination={pagination} />
      </div>
    </div>
  )
}
