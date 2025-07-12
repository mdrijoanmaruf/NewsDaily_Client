import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { FaNewspaper, FaImage, FaUser, FaTags, FaFileAlt, FaUpload } from 'react-icons/fa'
import useAuth from '../../Hook/useAuth'
import useAxios from '../../Hook/useAxios'
import Swal from 'sweetalert2'

const AddArticle = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axios = useAxios()
  
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    imageUrl: '',
    publisher: '',
    tags: [],
    description: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [publishers, setPublishers] = useState([])

  // ImgBB API configuration
  const imgbbAPIKey = import.meta.env.VITE_ImgB_API_KEY
  const imgbbURL = `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`

  // Static tags options (can be fetched from API later)
  const tagOptions = [
    { value: 'breaking-news', label: 'Breaking News' },
    { value: 'politics', label: 'Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' },
    { value: 'world-news', label: 'World News' },
    { value: 'local-news', label: 'Local News' },
    { value: 'opinion', label: 'Opinion' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'crime', label: 'Crime' },
    { value: 'economy', label: 'Economy' },
    { value: 'investigation', label: 'Investigation' },
    { value: 'feature', label: 'Feature Story' }
  ]

  // Mock publishers data (will be fetched from API)
  const mockPublishers = [
    { value: 'bbc-news', label: 'BBC News' },
    { value: 'cnn', label: 'CNN' },
    { value: 'reuters', label: 'Reuters' },
    { value: 'associated-press', label: 'Associated Press' },
    { value: 'the-guardian', label: 'The Guardian' },
    { value: 'new-york-times', label: 'New York Times' },
    { value: 'washington-post', label: 'Washington Post' },
    { value: 'daily-star', label: 'Daily Star' },
    { value: 'prothom-alo', label: 'Prothom Alo' },
    { value: 'bdnews24', label: 'BDNews24' }
  ]

  useEffect(() => {
    // Simulate fetching publishers from API
    setPublishers(mockPublishers)
  }, [])

  // Function to upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    if (!imgbbAPIKey) {
      throw new Error('ImgBB API key is not configured')
    }

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch(imgbbURL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        return data.data.url
      } else {
        throw new Error(data.error?.message || 'Image upload failed')
      }
    } catch (error) {
      console.error('ImgBB upload error:', error)
      throw new Error('Failed to upload image to ImgBB')
    }
  }

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }))
        return
      }
      
      // Clear previous errors
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }))
      }

      // Start uploading
      setImageUploading(true)
      
      try {
        const imageUrl = await uploadImageToImgBB(file)
        
        setFormData(prev => ({
          ...prev,
          image: file,
          imageUrl: imageUrl
        }))

      } catch (error) {
        console.error('Image upload error:', error)
        
        setErrors(prev => ({
          ...prev,
          image: error.message || 'Failed to upload image'
        }))

        Swal.fire({
          title: 'Upload Failed',
          text: 'Failed to upload image. Please try again.',
          icon: 'error'
        })
      } finally {
        setImageUploading(false)
      }
    }
  }

  const handleTagsChange = (selectedTags) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags || []
    }))
    
    // Clear tags error
    if (errors.tags) {
      setErrors(prev => ({
        ...prev,
        tags: ''
      }))
    }
  }

  const handlePublisherChange = (selectedPublisher) => {
    setFormData(prev => ({
      ...prev,
      publisher: selectedPublisher ? selectedPublisher.value : ''
    }))
    
    // Clear publisher error
    if (errors.publisher) {
      setErrors(prev => ({
        ...prev,
        publisher: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Article title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title should be at least 10 characters long'
    }

    if (!formData.imageUrl) {
      newErrors.image = 'Article image is required'
    }

    if (!formData.publisher) {
      newErrors.publisher = 'Please select a publisher'
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Please select at least one tag'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Article description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters long'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      // Create article data object
      const articleData = {
        title: formData.title.trim(),
        image: formData.imageUrl, // Use the uploaded image URL from ImgBB
        publisher: formData.publisher,
        tags: formData.tags.map(tag => tag.value),
        description: formData.description.trim(),
        author: {
          name: user?.displayName || user?.email || 'Anonymous',
          email: user?.email,
          photo: user?.photoURL
        },
        status: 'pending', // Will be approved by admin
        views: 0,
        likes: 0,
        premium: false // Default to free article
      }

      console.log('Article Data to be submitted:', articleData)

      // Send articleData to backend API
      const response = await axios.post('/api/articles', articleData)

      if (response.data.success) {
        // Success message
        Swal.fire({
          title: 'Article Submitted!',
          text: 'Your article has been submitted for admin approval. Redirecting to home page...',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        })

        // Reset form
        setFormData({
          title: '',
          image: null,
          imageUrl: '',
          publisher: '',
          tags: [],
          description: ''
        })

        // Reset file input
        const fileInput = document.getElementById('image')
        if (fileInput) fileInput.value = ''

        // Navigate to home page
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        throw new Error(response.data.message || 'Failed to submit article')
      }

    } catch (error) {
      console.error('Article submission error:', error)
      
      Swal.fire({
        title: 'Submission Failed',
        text: 'There was a problem submitting your article. Please try again.',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      },
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e5e7eb',
      marginTop: '4px',
      backgroundColor: 'white'
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px',
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#eff6ff' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:active': {
        backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#dbeafe',
      borderRadius: '0.375rem',
      color: '#1e40af'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      fontWeight: '500',
      fontSize: '0.875rem'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      borderRadius: '0 0.375rem 0.375rem 0',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e40af'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.95rem'
    }),
    input: (provided) => ({
      ...provided,
      color: '#374151',
      fontSize: '0.95rem'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 12px'
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: '8px'
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: '#6b7280',
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: '#374151'
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-down" data-aos-duration="1000">
          <div className="flex items-center justify-center mb-4">
            <FaNewspaper className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Add New Article</h1>
          </div>
          <p className="text-lg text-gray-600">
            Share your story with the world. Submit your article for admin approval.
          </p>
        </div>

        {/* Main Container - Horizontal Layout */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Form Fields */}
            <div className="lg:w-2/3 p-8 lg:p-12" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="300">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title Field */}
                <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFileAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-input block w-full pl-10 pr-3 py-3 border ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                      placeholder="Enter your article title..."
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.title}</p>
                  )}
                </div>

                {/* Two Column Layout for Publisher and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Publisher Selection */}
                  <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="500">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Publisher *
                    </label>
                    <Select
                      options={publishers}
                      value={publishers.find(p => p.value === formData.publisher) || null}
                      onChange={handlePublisherChange}
                      placeholder="Select a publisher..."
                      styles={selectStyles}
                      className={`react-select ${errors.publisher ? 'border-red-300' : ''}`}
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      isSearchable={true}
                      isClearable={true}
                    />
                    {errors.publisher && (
                      <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.publisher}</p>
                    )}
                  </div>

                  {/* Tags Multi-Select */}
                  <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="600">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tags *
                    </label>
                    <Select
                      isMulti
                      options={tagOptions}
                      value={formData.tags}
                      onChange={handleTagsChange}
                      placeholder="Select tags..."
                      styles={selectStyles}
                      className={`react-select ${errors.tags ? 'border-red-300' : ''}`}
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      closeMenuOnSelect={false}
                      isSearchable={true}
                      isClearable={true}
                      hideSelectedOptions={false}
                    />
                    {errors.tags && (
                      <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.tags}</p>
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="700">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={10}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-input block w-full px-4 py-4 border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300`}
                    placeholder="Write your article content here... Please provide detailed information that will engage your readers."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description ? (
                      <p className="text-sm text-red-600 animate-fade-in">{errors.description}</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Minimum 50 characters required
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.description.length} characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="800">
                  <button
                    type="submit"
                    disabled={loading || imageUploading}
                    className={`hover-lift w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white ${
                      loading || imageUploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    } transition-all duration-300 transform hover:scale-105`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Submitting Article...
                      </div>
                    ) : imageUploading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Uploading Image...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaUpload className="w-5 h-5 mr-3" />
                        Submit Article for Approval
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Image Upload and Info */}
            <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-12 flex flex-col justify-center" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="400">
              
              {/* Image Upload Section */}
              <div className="mb-8" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="500">
                <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-4">
                  Article Image *
                </label>
                
                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <p className="text-xs text-green-600 mt-2 text-center">✓ Image uploaded successfully</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full ${formData.imageUrl ? 'h-24' : 'h-48'} border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                    errors.image ? 'border-red-300 bg-red-50' : 
                    imageUploading ? 'border-yellow-300 bg-yellow-50' :
                    formData.imageUrl ? 'border-green-300 bg-green-50' :
                    'border-blue-300 bg-white hover:bg-blue-50'
                  } ${imageUploading ? 'pointer-events-none' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      {imageUploading ? (
                        <>
                          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-yellow-600 font-medium">Uploading...</p>
                        </>
                      ) : formData.imageUrl ? (
                        <>
                          <FaImage className="w-8 h-8 mb-2 text-green-500" />
                          <p className="text-sm text-green-600 font-medium">Change Image</p>
                        </>
                      ) : (
                        <>
                          <FaImage className={`w-12 h-12 mb-4 ${errors.image ? 'text-red-400' : 'text-blue-400'}`} />
                          <div className="text-center">
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={imageUploading}
                    />
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.image}</p>
                )}
              </div>

              {/* Info Notice */}
              <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaNewspaper className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Article Review Process
                    </h3>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Your article will be reviewed by our admin team</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Approved articles will appear on the All Articles page</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Check status by visiting the All Articles page</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Ensure content follows community guidelines</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white" data-aos="fade-up" data-aos-duration="800" data-aos-delay="700">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaTags className="mr-2" />
                  Writing Tips
                </h3>
                <ul className="text-sm space-y-2 opacity-90">
                  <li>• Use a compelling, descriptive title</li>
                  <li>• Choose relevant tags for better discoverability</li>
                  <li>• Upload high-quality images</li>
                  <li>• Write engaging, informative content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddArticle