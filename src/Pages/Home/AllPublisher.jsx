import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCalendarAlt, FaEye, FaSpinner, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../Hook/useAxios';

const AllPublisher = () => {
  const [publishers, setPublishers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // Fetch publishers from API
  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosSecure.get('/api/publishers');
        
        if (response.data.success) {
          setPublishers(response.data.data);
        } else {
          setError('Failed to fetch publishers');
        }
      } catch (error) {
        console.error('Error fetching publishers:', error);
        setError('Failed to load publishers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishers();
  }, [axiosSecure]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our
              </span>
              <span className="ml-2 text-gray-800">Publishers</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
              <p className="text-gray-600 text-lg">Loading publishers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our
              </span>
              <span className="ml-2 text-gray-800">Publishers</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No publishers state
  if (publishers.length === 0) {
    return (
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our
              </span>
              <span className="ml-2 text-gray-800">Publishers</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaBuilding className="text-6xl text-gray-400 mb-4 mx-auto" />
              <p className="text-gray-600 text-lg">No publishers available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="publisher-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#publisher-grid)" className="text-gray-200" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <FaBuilding className="mr-2" />
            Trusted Publishers
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Publishers</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the trusted news organizations and media outlets that contribute quality content to our platform.
          </p>
        </div>

        {/* Publishers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {publishers.map((publisher, index) => (
            <div
              key={publisher._id}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              
              {/* Publisher Logo */}
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <img
                    src={publisher.logo || 'https://via.placeholder.com/80x80?text=Logo'}
                    alt={`${publisher.name} logo`}
                    className="w-12 h-12 object-contain rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center" style={{ display: 'none' }}>
                    <FaBuilding className="text-white text-xl" />
                  </div>
                </div>
              </div>

              {/* Publisher Info */}
              <div className="relative z-10 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {publisher.name}
                </h3>
                
                {/* Publisher Stats */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Added {formatDate(publisher.createdAt)}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-6">
                  <button 
                    onClick={() => navigate('/all-articles')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    View Articles
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
            </div>
          ))}
        </div>

        {/* Publisher Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Publisher Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {publishers.length}+
              </div>
              <p className="text-gray-600">Trusted Publishers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                24/7
              </div>
              <p className="text-gray-600">News Coverage</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <p className="text-gray-600">Verified Sources</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Join Our Publisher Network?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Are you a media organization looking to reach a wider audience? Contact us to become a trusted publisher on NewsDaily.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPublisher;