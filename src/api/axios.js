import axios from 'axios'

const axiosApi = axios.create({
  baseURL: 'https://job-tracker-backend-x9nc.onrender.com/api',
})

axiosApi.interceptors.request.use((config) => {
  // ✅ sessionStorage clears automatically when browser/tab closes
  const token = sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login'
      if (!isLoginPage) {
        sessionStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosApi