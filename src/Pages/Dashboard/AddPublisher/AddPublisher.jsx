import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FaNewspaper, FaImage, FaUpload, FaSpinner, FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';
import AOS from 'aos';

const AddPublisher = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out'
    });
  }, []);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logo: null
  });
  
  // UI state
  const [logoPreview, setLogoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch all publishers using TanStack Query
  const { data: publishers = [], isLoading: isLoadingPublishers, refetch } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/publishers');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: () => {
      // Refresh AOS when data loads
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  });

  // Add Publisher Mutation
  const addPublisherMutation = useMutation({
    mutationFn: async (publisherData) => {
      const response = await axiosSecure.post('/api/publishers', publisherData);
      return response.data;
    },
    onSuccess: () => {
      // Reset form
      setFormData({ name: '', logo: null });
      setLogoPreview(null);
      
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Publisher added successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
      
      // Invalidate any publisher queries if needed
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
    },
    onError: (error) => {
      console.error('Error adding publisher:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add publisher';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Delete Publisher Mutation
  const deletePublisherMutation = useMutation({
    mutationFn: async (publisherId) => {
      const response = await axiosSecure.delete(`/api/publishers/${publisherId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch publishers
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'Publisher deleted successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    },
    onError: (error) => {
      console.error('Error deleting publisher:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete publisher';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection and upload to ImgBB
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File!',
        text: 'Please select an image file.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large!',
        text: 'Please select an image smaller than 5MB.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create form data for ImgBB
      const imageData = new FormData();
      imageData.append('image', file);

      // Upload to ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgB_API_KEY}`, {
        method: 'POST',
        body: imageData
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.data.url;
        setFormData(prev => ({
          ...prev,
          logo: imageUrl
        }));
        setLogoPreview(imageUrl);
        
        Swal.fire({
          title: 'Upload Successful!',
          text: 'Logo uploaded successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        title: 'Upload Failed!',
        text: 'Failed to upload logo. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please enter a publisher name.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    if (!formData.logo) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please upload a publisher logo.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    // Submit form
    addPublisherMutation.mutate({
      name: formData.name.trim(),
      logo: formData.logo
    });
  };

  // Handle delete publisher
  const handleDeletePublisher = (publisher) => {
    Swal.fire({
      title: 'Delete Publisher?',
      text: `Are you sure you want to delete "${publisher.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deletePublisherMutation.mutate(publisher._id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-aos="fade-down" data-aos-duration="600">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaNewspaper className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add Publisher</h1>
              <p className="text-gray-600">Add a new publisher/brand to your news platform</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Publisher Name Field */}
            <div data-aos="fade-right" data-aos-delay="300">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Publisher Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter publisher name (e.g., BBC News, CNN, TechCrunch)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed as the publisher/brand name for articles.
              </p>
            </div>

            {/* Publisher Logo Field */}
            <div data-aos="fade-left" data-aos-delay="400">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Publisher Logo *
              </label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {logoPreview ? (
                  <div className="space-y-4" data-aos="zoom-in" data-aos-anchor-placement="center-bottom">
                    <img 
                      src={logoPreview} 
                      alt="Publisher Logo Preview" 
                      className="w-32 h-32 object-contain mx-auto rounded-lg border border-gray-200"
                    />
                    <div className="flex items-center justify-center text-green-600">
                      <FaCheckCircle className="mr-2" />
                      <span className="text-sm font-medium">Logo uploaded successfully</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setFormData(prev => ({ ...prev, logo: null }));
                      }}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <FaImage className="text-4xl text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">Upload publisher logo</p>
                      <p className="text-xs text-gray-500 mb-4">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                
                {!logoPreview && (
                  <label
                    htmlFor="logo"
                    className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      isUploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Choose Logo
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4" data-aos="fade-up" data-aos-delay="500">
              <button
                type="submit"
                disabled={addPublisherMutation.isPending || isUploading || !formData.name.trim() || !formData.logo}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  addPublisherMutation.isPending || isUploading || !formData.name.trim() || !formData.logo
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {addPublisherMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Adding Publisher...
                  </div>
                ) : (
                  'Add Publisher'
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200" data-aos="fade-up" data-aos-delay="600">
            <div className="flex items-start space-x-3">
              <FaNewspaper className="text-blue-600 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">About Publishers</h4>
                <p className="text-xs text-blue-700">
                  Publishers represent news brands or categories. Each article will be associated with a publisher 
                  to help organize and categorize content. The logo will be displayed alongside articles from this publisher.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All Publishers Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6" data-aos="fade-up" data-aos-delay="700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaNewspaper className="text-xl text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Publishers</h2>
                <p className="text-gray-600">Manage existing publishers</p>
              </div>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-200">
              <span className="text-green-800 font-semibold text-sm">
                Total: {publishers.length}
              </span>
            </div>
          </div>

          {isLoadingPublishers ? (
            <div className="flex items-center justify-center py-12" data-aos="fade">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaSpinner className="animate-spin text-xl" />
                <span>Loading publishers...</span>
              </div>
            </div>
          ) : publishers.length === 0 ? (
            <div className="text-center py-12" data-aos="zoom-in">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Publishers Found</h3>
              <p className="text-gray-600">Add your first publisher using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishers.map((publisher, index) => (
                <div 
                  key={publisher._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                  data-aos="fade-up"
                  data-aos-delay={100 + (index * 50)}
                  data-aos-offset="10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <img
                        src={publisher.logo}
                        alt={publisher.name}
                        className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white"
                        onError={(e) => {
                          e.target.src = '/placeholder-logo.png';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {publisher.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Added: {new Date(publisher.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeletePublisher(publisher)}
                        disabled={deletePublisherMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                        title="Delete Publisher"
                      >
                        <FaTrash className={`text-sm group-hover:scale-110 transition-transform ${
                          deletePublisherMutation.isPending ? 'animate-spin' : ''
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Publisher Stats */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(publisher.createdAt).toLocaleDateString()}</span>
                      {publisher.updatedAt !== publisher.createdAt && (
                        <span>Updated: {new Date(publisher.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPublisher;