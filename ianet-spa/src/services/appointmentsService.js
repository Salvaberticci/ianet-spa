import { baseFetch } from "./http"

export const appointmentsService = {
  async create(payload) {
    return await baseFetch("/api/public/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
