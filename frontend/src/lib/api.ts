import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  r => r,
  err => {
    console.error('[API Error]', err?.response?.data ?? err.message)
    return Promise.reject(err)
  }
)

export default api