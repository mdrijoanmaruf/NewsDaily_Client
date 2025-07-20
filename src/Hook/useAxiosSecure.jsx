import axios from 'axios'
import useAuth from './useAuth'
import { useEffect } from 'react'

const axiosSecure = axios.create({
    // baseURL : `http://localhost:5000`
    baseURL : `https://news-daily-server.vercel.app`
})

const useAxiosSecure = () => {
  const { user } = useAuth()

  useEffect(() => {
    // When user changes, update token in localStorage
    const updateToken = async () => {
      if (user) {
        try {
          // Get fresh Firebase ID token
          const token = await user.getIdToken(true)
          localStorage.setItem('newsDaily-token', token)
        } catch (error) {
          console.error('Error getting token:', error)
          localStorage.removeItem('newsDaily-token')
        }
      } else {
        // Remove token when user logs out
        localStorage.removeItem('newsDaily-token')
      }
    }
    
    updateToken()
    
    // Set up token refresh interval (every 55 minutes)
    const intervalId = setInterval(updateToken, 55 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [user])

  // Request interceptor - Add JWT token from localStorage
  axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem('newsDaily-token')
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })
  
  return axiosSecure
}

export default useAxiosSecure