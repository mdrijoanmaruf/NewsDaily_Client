import axios from 'axios'
import useAuth from './useAuth'

const axiosSecure = axios.create({
    baseURL : `https://news-daily-server.vercel.app`
})

const useAxiosSecure = () => {
  const { user } = useAuth()

  // Request interceptor - Add JWT token
  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      try {
        // Get fresh Firebase ID token
        const token = await user.getIdToken()
        config.headers.authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Error getting token:', error)
      }
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })
  
  return axiosSecure
}

export default useAxiosSecure