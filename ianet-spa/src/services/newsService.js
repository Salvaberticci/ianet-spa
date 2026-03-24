import { baseFetch } from "./http"

export const newsService = {
  async list({ page = 1, limit = 10, category } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (category) {
      params.append("category", category)
    }

    return await baseFetch(`/api/public/news?${params.toString()}`)
  },

  async getById(id) {
    return await baseFetch(`/api/public/news/${id}`)
  },
}
