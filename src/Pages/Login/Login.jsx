import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaNewspaper, FaBell, FaHeart } from 'react-icons/fa'
import useAuth from '../../Hook/useAuth'
import Swal from 'sweetalert2'

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Validate form
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }
    
    try {
      await signIn(formData.email, formData.password)
      
      // Success alert
      Swal.fire({
        title: 'Welcome Back!',
        text: 'You have successfully logged in.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      
      // Error alert
      Swal.fire({
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        icon: 'error'
      })
      
      setErrors({ submit: 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      
      // Success alert
      Swal.fire({
        title: 'Welcome!',
        text: 'You have successfully logged in with Google.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
      navigate('/')
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      // Error alert
      Swal.fire({
        title: 'Google Login Failed',
        text: 'There was a problem signing in with Google. Please try again.',
        icon: 'error'
      })
      
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex bg-white rounded-2xl shadow-2xl overflow-hidden" data-aos="fade-up" data-aos-duration="1000">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo - Only visible on smaller screens */}
            <div className="lg:hidden text-center mb-8" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="300">
              <Link to="/" className="inline-flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <FaNewspaper className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  <span className="text-blue-600">News</span>Daily
                </span>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-8" data-aos="fade-down" data-aos-duration="1000" data-aos-delay="400">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to access your personalized news feed
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
              {/* Email Field */}
              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="600">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input appearance-none block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="700">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input appearance-none block w-full pl-10 pr-10 py-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Login Button */}
              <div data-aos="zoom-in" data-aos-duration="800" data-aos-delay="900">
                <button
                  type="submit"
                  disabled={loading}
                  className={`hover-lift w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-all duration-300 transform hover:scale-105`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <div data-aos="zoom-in" data-aos-duration="800" data-aos-delay="1000">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="hover-lift w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                  <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                  Continue with Google
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center" data-aos="fade-up" data-aos-duration="800" data-aos-delay="1100">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="link-underline font-medium text-blue-600 hover:text-blue-500 transition-all duration-300 hover:underline"
                >
                  Create one now
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-white relative" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="300">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="600">
              <FaNewspaper className="w-24 h-24 mx-auto mb-6 text-blue-100 animate-float" />
              <h1 className="text-4xl font-bold mb-4">
                Stay <span className="text-blue-200">Informed</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Access your personalized news feed, save articles for later, 
                and never miss the stories that matter to you.
              </p>
            </div>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="800">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaNewspaper className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Latest Breaking News</h3>
                  <p className="text-blue-100">Real-time updates on global events</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="900">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaBell className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Smart Notifications</h3>
                  <p className="text-blue-100">Get alerts for stories you care about</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="1000">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaHeart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Save & Share</h3>
                  <p className="text-blue-100">Bookmark articles and share with friends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login