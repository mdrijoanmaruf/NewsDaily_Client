import React, { useState, } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaEye, FaEyeSlash, FaCamera, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'
import useAuth from '../../Hook/useAuth'
import useAxios from '../../Hook/useAxios'
import Swal from 'sweetalert2'
import { updateProfile } from 'firebase/auth'

const Register = () => {
  const { createUser, signInWithGoogle } = useAuth()
  const axios = useAxios()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Upload photo to ImgBB
  const uploadPhotoToImgBB = async (photoFile) => {
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', photoFile)
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgB_API_KEY}`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setImagePreview(data.data.url)
        return data.data.url
      } else {
        throw new Error('Photo upload failed')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  // Save user to database
  const saveUserToDatabase = async (userData) => {
    try {
      const response = await axios.post('/api/users', userData)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save user data')
      }
      
      return response.data.data
    } catch (error) {
      console.error('Error saving user to database:', error)
      throw error
    }
  }

  // Password validation function
  const validatePassword = (password) => {
    const errors = []
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time password validation
    if (name === 'password') {
      const passwordValidationErrors = validatePassword(value)
      setPasswordErrors(passwordValidationErrors)
    }
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      photo: file
    }))
    
    // Clear previous preview and upload to ImgBB immediately
    setImagePreview(null)
    if (file) {
      uploadPhotoToImgBB(file).catch(error => {
        console.error('Failed to upload image:', error)
        Swal.fire({
          title: 'Upload Failed',
          text: 'Failed to upload image. Please try again.',
          icon: 'error'
        })
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Validate form
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (passwordErrors.length > 0) {
      newErrors.password = 'Please fix password requirements'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }
    
    try {
      // Create user with email and password
      const userCredential = await createUser(formData.email, formData.password)
      
      // Update user profile with name and photo
      await updateProfile(userCredential.user, {
        displayName: formData.name,
        photoURL: imagePreview || null
      })
      
      // Prepare user data for database (without password)
      const userData = {
        name: formData.name,
        email: formData.email,
        profileImage: imagePreview, // Use the already uploaded image URL
        oauthProvider: null // Regular email/password signup
      }
      
      // Save user to database
      await saveUserToDatabase(userData)
      
      // Success alert
      Swal.fire({
        title: 'Account Created!',
        text: 'Welcome to NewsDaily! Your account has been created successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
      console.log('User registered successfully')
      navigate('/')
    } catch (error) {
      console.error('Registration error:', error)
      
      // Error alert
      Swal.fire({
        title: 'Registration Failed',
        text: error.message || 'There was a problem creating your account. Please try again.',
        icon: 'error'
      })
      
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const userCredential = await signInWithGoogle()
      
      // Prepare user data for database
      const userData = {
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email,
        profileImage: userCredential.user.photoURL || null,
        oauthProvider: 'google'
      }
      
      // Save user to database (will handle existing user check)
      try {
        await saveUserToDatabase(userData)
      } catch (dbError) {
        // If user already exists, that's fine - just continue
        if (!dbError.message.includes('already exists')) {
          throw dbError
        }
      }
      
      // Success alert
      Swal.fire({
        title: 'Welcome!',
        text: 'You have successfully signed up with Google.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      
      navigate('/')
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      // Error alert
      Swal.fire({
        title: 'Google Signup Failed',
        text: 'There was a problem signing up with Google. Please try again.',
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
        {/* Left Side - Visual Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-white relative" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="600">
              <FaUser className="w-24 h-24 mx-auto mb-6 text-blue-100 animate-float" />
              <h1 className="text-4xl font-bold mb-4">
                Welcome to <span className="text-blue-200">News</span>Daily
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of readers who stay informed with the latest breaking news, 
                trending articles, and exclusive premium content.
              </p>
            </div>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="800">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Daily Newsletter</h3>
                  <p className="text-blue-100">Get curated news delivered to your inbox</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="900">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaLock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Premium Content</h3>
                  <p className="text-blue-100">Access exclusive articles and insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="1000">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Personalized Feed</h3>
                  <p className="text-blue-100">Customize your news preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="300">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo - Only visible on smaller screens */}
            <div className="lg:hidden text-center mb-8" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="400">
              <Link to="/" className="inline-flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <FaUser className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  <span className="text-blue-600">News</span>Daily
                </span>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-8" data-aos="fade-down" data-aos-duration="1000" data-aos-delay="500">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Join NewsDaily and stay informed with the latest news
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
              {/* Name Field */}
              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="700">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input appearance-none block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.name}</p>
                )}
              </div>

              {/* Photo Upload Field */}
              <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="800">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo (Optional)
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full ${imagePreview ? 'h-16' : 'h-24'} border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}>
                    <div className="flex items-center space-x-2 py-2">
                      {uploadingImage ? (
                        <>
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaCamera className="w-5 h-5 text-gray-400" />
                          {formData.photo ? (
                            <span className="text-sm text-gray-600 truncate max-w-32">
                              {imagePreview ? 'Change photo' : formData.photo.name}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Click to upload photo
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <input
                      id="photo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Email Field */}
              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="900">
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
              <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="1000">
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
                      errors.password || passwordErrors.length > 0 ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Password Requirements */}
                {passwordErrors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-red-600 mb-1">Password Requirements:</p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-red-500 mr-1">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Register Button */}
              <div data-aos="zoom-in" data-aos-duration="800" data-aos-delay="1100">
                <button
                  type="submit"
                  disabled={loading || passwordErrors.length > 0}
                  className={`hover-lift w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    loading || passwordErrors.length > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-all duration-300 transform hover:scale-105`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
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
              <div data-aos="zoom-in" data-aos-duration="800" data-aos-delay="1200">
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

            {/* Sign In Link */}
            <div className="mt-6 text-center" data-aos="fade-up" data-aos-duration="800" data-aos-delay="1300">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="link-underline font-medium text-blue-600 hover:text-blue-500 transition-all duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register