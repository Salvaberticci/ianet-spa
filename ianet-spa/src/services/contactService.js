import { baseFetch } from "./http"

export const contactService = {
  async send(payload) {
    return await baseFetch("/api/public/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
