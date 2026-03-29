const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
const DEFAULT_TIMEOUT = 10000

export class HttpError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.data = data
  }
}

export async function baseFetch(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const url = `${BASE_URL}${path}`
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`
      let errorData = null

      try {
        errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // If JSON parsing fails, use default message
      }

      throw new HttpError(errorMessage, response.status, errorData)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      throw new HttpError("Request timeout", 408)
    }

    throw error
  }
}
