import axios from 'axios'

const AUTH_BASE = import.meta.env.DEV ? '/auth' : import.meta.env.VITE_AUTH_BASE_URL
const API_BASE = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE_URL
const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_API_CLIENT_SECRET

// Axios instance with base URL and default headers
export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

let cachedToken = null
let tokenExpiresAt = null
let tokenPromise = null

async function getAccessToken() {
  const now = Date.now()
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken
  }

  // Prevent concurrent token requests — reuse in-flight promise
  if (tokenPromise) return tokenPromise

  tokenPromise = axios
    .post(`${AUTH_BASE}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    })
    .then(({ data }) => {
      cachedToken = data.access_token
      tokenExpiresAt = Date.now() + (data.expires_in - 30) * 1000
      return cachedToken
    })
    .finally(() => {
      tokenPromise = null
    })

  return tokenPromise
}

// Request interceptor: inject Bearer token automatically
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: retry on 401 (up to 3 times with delay)
// First retries use same token (backend propagation delay),
// last retry fetches a fresh token in case the token itself is invalid.
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const retryCount = originalRequest._retryCount || 0

    if (error.response?.status === 401 && retryCount < MAX_RETRIES) {
      originalRequest._retryCount = retryCount + 1
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * originalRequest._retryCount))

      // Only fetch fresh token on the last retry
      if (originalRequest._retryCount === MAX_RETRIES) {
        cachedToken = null
        tokenExpiresAt = null
      }
      const token = await getAccessToken()
      originalRequest.headers.Authorization = `Bearer ${token}`
      return api(originalRequest)
    }
    return Promise.reject(error)
  }
)
