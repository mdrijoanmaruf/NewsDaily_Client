import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaInfoCircle, FaNewspaper, FaCrown, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';
import useAxios from '../../Hook/useAxios';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MyArticles = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // TanStack Query for articles
  const {
    data: allArticles = [],
    isLoading: loading,
    isError,
    error
  } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axios.get('/api/articles');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch articles');
    }
  });

  // Filter articles by current user's email
  const articles = React.useMemo(() => {
    return allArticles.filter(
      article => article.author?.email === user?.email
    );
  }, [allArticles, user]);
  const [declineReasonModal, setDeclineReasonModal] = useState({ isOpen: false, reason: '', articleTitle: '' });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);


  // Handle article details navigation
  const handleViewDetails = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // Handle article update navigation
  const handleUpdate = (articleId) => {
    navigate(`/update-article/${articleId}`);
  };

  // Handle article deletion
  const handleDelete = async (articleId, articleTitle) => {
    const result = await Swal.fire({
      title: '🗑️ Delete Article?',
      text: `Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/articles/${articleId}`);
        Swal.fire({
          title: '🎉 Deleted!',
          text: 'Article has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
        // Invalidate and refetch articles query
        queryClient.invalidateQueries(['articles']);
      } catch (error) {
        console.error('Error deleting article:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete article. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Handle decline reason modal
  const showDeclineReason = (reason, articleTitle) => {
    setDeclineReasonModal({
      isOpen: true,
      reason,
      articleTitle
    });
  };

  const closeDeclineReasonModal = () => {
    setDeclineReasonModal({ isOpen: false, reason: '', articleTitle: '' });
  };

  // Get status display with appropriate styling
  const getStatusDisplay = (article) => {
    const status = article.status || 'pending';
    
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Approved
          </span>
        );
      case 'declined':
        return (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <FaTimesCircle className="mr-1" />
              Declined
            </span>
            <button
              onClick={() => showDeclineReason(article.declineReason, article.title)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="View decline reason"
            >
              <FaInfoCircle />
            </button>
          </div>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" />
            Pending
          </span>
        );
    }
  };

  // Get premium status display
  const getPremiumDisplay = (isPremium) => {
    return isPremium ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
        <FaCrown className="mr-1" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        No
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8" data-aos="fade-down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <FaNewspaper className="text-2xl sm:text-3xl text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">My Articles</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage all your submitted articles</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{articles.length}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Articles</p>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center" data-aos="zoom-in">
            <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h2>
            <p className="text-gray-600 mb-6">You haven't submitted any articles yet. Start writing to see them here!</p>
            <button
              onClick={() => navigate('/add-article')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Write Your First Article
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Is Premium
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article, index) => (
                    <tr 
                      key={article._id} 
                      className={`transition-colors ${
                        article.premium
                          ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-l-4 border-amber-400 hover:bg-amber-100'
                          : 'hover:bg-gray-50'
                      }`}
                      data-aos="fade-right"
                      data-aos-delay={index * 50}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${article.premium ? 'text-amber-900' : 'text-gray-900'}`}>{index + 1}</td>
                      <td className={`px-6 py-4 text-sm ${article.premium ? 'text-amber-900' : 'text-gray-900'}`}>
                        <div className="max-w-xs">
                          <p className="font-medium truncate" title={article.title}>{article.title}</p>
                          <p className={`mt-1 text-xs ${article.premium ? 'text-amber-700' : 'text-gray-500'}`}>{new Date(article.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(article._id)}
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${article.premium ? 'text-amber-800 bg-amber-100 hover:bg-amber-200' : 'text-blue-700 bg-blue-100 hover:bg-blue-200'} transition-colors`}
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusDisplay(article)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getPremiumDisplay(article.premium)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(article._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors"
                            title="Update Article"
                          >
                            <FaEdit className="mr-1" />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(article._id, article.title)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                            title="Delete Article"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Decline Reason Modal */}
        {declineReasonModal.isOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">


            <div 
              className="bg-white rounded-lg max-w-md w-full p-6"
              data-aos="zoom-in"
              data-aos-duration="300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Article Decline Reason</h3>
                <button
                  onClick={closeDeclineReasonModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Article:</p>
                <p className="font-medium text-gray-900">{declineReasonModal.articleTitle}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Decline Reason:</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800">{declineReasonModal.reason}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeDeclineReasonModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;