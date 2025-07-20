import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaCheck, FaTimes, FaTrash, FaCrown, FaUser, FaEnvelope, FaCalendar, FaTag, FaNewspaper, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import useAuth from '../../../Hook/useAuth';
import ComponentLoading from '../../../Shared/Loading/ComponentLoading';
import Swal from 'sweetalert2';

const AllArticles = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for decline modal
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // Fetch all articles using TanStack Query with pagination
  const { data: articlesData = { data: [], pagination: {} }, isLoading, error, refetch } = useQuery({
    queryKey: ['allArticles', currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await axiosSecure.get(`/api/articles?page=${currentPage}&limit=${itemsPerPage}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Extract articles and pagination data from response
  const articles = Array.isArray(articlesData.data) ? articlesData.data : [];
  const pagination = articlesData.pagination || {
    totalArticles: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  // Approve Article Mutation
  const approveArticleMutation = useMutation({
    mutationFn: async (articleId) => {
      console.log('Making API call to approve article:', articleId);
      const response = await axiosSecure.put(`/api/articles/${articleId}/approve`);
      console.log('API response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Approve success');
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      Swal.fire({
        title: 'Success!',
        text: 'Article approved successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    },
    onError: (error) => {
      console.error('Error approving article:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve article';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Decline Article Mutation
  const declineArticleMutation = useMutation({
    mutationFn: async ({ articleId, reason }) => {
      console.log('Making API call to decline article:', articleId);
      const response = await axiosSecure.put(`/api/articles/${articleId}/decline`, {
        reason,
        adminEmail: user?.email,
        adminName: user?.displayName || user?.email
      });
      console.log('API response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Decline success');
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      setShowDeclineModal(false);
      setDeclineReason('');
      setSelectedArticle(null);
      Swal.fire({
        title: 'Success!',
        text: 'Article declined successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    },
    onError: (error) => {
      console.error('Error declining article:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to decline article';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Delete Article Mutation
  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId) => {
      console.log('Making API call to delete article:', articleId);
      const response = await axiosSecure.delete(`/api/articles/${articleId}`);
      console.log('API response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Delete success');
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'Article deleted successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete article';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Premium Article Mutation
  const premiumArticleMutation = useMutation({
    mutationFn: async (articleId) => {
      console.log('Making API call to make article premium:', articleId);
      const response = await axiosSecure.put(`/api/articles/${articleId}/premium`);
      console.log('API response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Premium success');
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      Swal.fire({
        title: 'Success!',
        text: 'Article marked as premium successfully!',
        icon: 'success',
        confirmButtonColor: '#F59E0B'
      });
    },
    onError: (error) => {
      console.error('Error making article premium:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to make article premium';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Remove Premium Mutation
  const removePremiumMutation = useMutation({
    mutationFn: async (articleId) => {
      console.log('Making API call to remove premium status:', articleId);
      const response = await axiosSecure.put(`/api/articles/${articleId}/remove-premium`);
      console.log('API response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Remove premium success');
      // Invalidate and refetch articles
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      Swal.fire({
        title: 'Success!',
        text: 'Premium status removed successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    },
    onError: (error) => {
      console.error('Error removing premium status:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove premium status';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  });

  // Handle approve article
  const handleApproveArticle = (article) => {
    console.log('Approving article:', article._id, article.title);
    Swal.fire({
      title: 'Approve Article?',
      text: `Are you sure you want to approve "${article.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Mutation called with ID:', article._id);
        approveArticleMutation.mutate(article._id);
      }
    });
  };

  // Handle decline article
  const handleDeclineArticle = (article) => {
    setSelectedArticle(article);
    setShowDeclineModal(true);
  };

  // Handle delete article
  const handleDeleteArticle = (article) => {
    console.log('Deleting article:', article._id, article.title);
    Swal.fire({
      title: 'Delete Article?',
      text: `Are you sure you want to permanently delete "${article.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Delete mutation called with ID:', article._id);
        deleteArticleMutation.mutate(article._id);
      }
    });
  };

  // Handle make premium
  const handleMakePremium = (article) => {
    console.log('Making article premium:', article._id, article.title);
    Swal.fire({
      title: 'Make Premium?',
      text: `Are you sure you want to mark "${article.title}" as premium?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F59E0B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Make Premium!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Premium mutation called with ID:', article._id);
        premiumArticleMutation.mutate(article._id);
      }
    });
  };

  // Handle remove premium
  const handleRemovePremium = (article) => {
    console.log('Removing premium status:', article._id, article.title);
    Swal.fire({
      title: 'Remove Premium?',
      text: `Are you sure you want to remove premium status from "${article.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Remove Premium!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Remove premium mutation called with ID:', article._id);
        removePremiumMutation.mutate(article._id);
      }
    });
  };

  // Handle decline confirmation
  const handleDeclineConfirm = () => {
    if (!declineReason.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide a reason for declining the article.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    declineArticleMutation.mutate({
      articleId: selectedArticle._id,
      reason: declineReason.trim()
    });
  };

  // Close decline modal
  const closeDeclineModal = () => {
    setShowDeclineModal(false);
    setDeclineReason('');
    setSelectedArticle(null);
  };

  if (isLoading) return <ComponentLoading />;

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Articles</div>
          <p className="text-red-700 mb-4">Failed to load articles. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status, premium) => {
    // If article is premium, show premium badge regardless of status
    if (premium) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300">
          <span className="mr-1">👑</span>
          Premium
        </span>
      );
    }
    
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⏳' },
      'approved': { color: 'bg-green-100 text-green-800 border-green-300', icon: '✅' },
      'published': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '📰' },
      'declined': { color: 'bg-red-100 text-red-800 border-red-300', icon: '❌' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status || 'Pending'}
      </span>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6" data-aos="fade-up" data-aos-duration="600">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaNewspaper className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Articles</h1>
                <p className="text-gray-600">Manage and review all submitted articles</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Items Per Page Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="articlesPerPage" className="text-xs sm:text-sm text-gray-700 font-medium">
                  Show:
                </label>
                <select
                  id="articlesPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                >
                  <option value="5">5 articles</option>
                  <option value="10">10 articles</option>
                  <option value="15">15 articles</option>
                  <option value="20">20 articles</option>
                </select>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <span className="text-blue-800 font-semibold">Total Articles: {pagination.totalArticles}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles List - Desktop View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden" data-aos="zoom-in" data-aos-duration="500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Article Info</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article, index) => (
                  <tr 
                    key={article._id} 
                    className={`hover:bg-blue-50 transition-colors ${
                    article.premium 
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400' 
                      : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}>
                    {/* Article Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img 
                            src={article.image || '/placeholder-article.jpg'} 
                            alt={article.title}
                            className={`w-16 h-16 rounded-lg object-cover border-2 ${
                              article.premium ? 'border-amber-400 ring-2 ring-amber-200' : 'border-blue-200'
                            }`}
                          />
                          {article.premium && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-1 py-0.5 rounded-full">
                              👑
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm line-clamp-2 mb-1 ${
                            article.premium ? 'text-amber-900' : 'text-gray-900'
                          }`}>
                            {article.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaTag className="mr-1" />
                            {article.category || 'General'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Author Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={article.author?.photo || '/placeholder-user.jpg'} 
                          alt={article.author?.name || 'Author'}
                          className={`w-10 h-10 rounded-full border-2 ${
                            article.premium ? 'border-amber-300' : 'border-blue-200'
                          }`}
                          onError={(e) => {
                            e.target.src = '/placeholder-user.jpg';
                          }}
                        />
                        <div>
                          <div className={`flex items-center text-sm font-medium ${
                            article.premium ? 'text-amber-900' : 'text-gray-900'
                          }`}>
                            <FaUser className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                            {article.author?.name || 'Unknown Author'}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaEnvelope className="mr-1" />
                            {article.author?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <FaCalendar className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                          {formatDate(article.createdAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaNewspaper className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                          {article.publisher || 'Not Assigned'}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(article.status, article.premium)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* View Article button removed */}
                        {article.status !== 'published' && article.status !== 'declined' && (
                          <button 
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Approve"
                            onClick={() => handleApproveArticle(article)}
                            disabled={approveArticleMutation.isPending}
                          >
                            <FaCheck className={`text-sm group-hover:scale-110 transition-transform ${approveArticleMutation.isPending ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                        {article.status !== 'published' && article.status !== 'declined' && (
                          <button 
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Decline"
                            onClick={() => handleDeclineArticle(article)}
                          >
                            <FaTimes className="text-sm group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        {article.status !== 'declined' && (
                          article.premium ? (
                            <button 
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors group"
                              title="Remove Premium"
                              onClick={() => handleRemovePremium(article)}
                              disabled={removePremiumMutation.isPending}
                            >
                              <FaCrown className={`text-sm group-hover:scale-110 transition-transform ${removePremiumMutation.isPending ? 'animate-spin' : ''}`} />
                            </button>
                          ) : (
                            <button 
                              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors group"
                              title="Make Premium"
                              onClick={() => handleMakePremium(article)}
                              disabled={premiumArticleMutation.isPending}
                            >
                              <FaCrown className={`text-sm group-hover:scale-110 transition-transform ${premiumArticleMutation.isPending ? 'animate-spin' : ''}`} />
                            </button>
                          )
                        )}
                        <button 
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Delete"
                          onClick={() => handleDeleteArticle(article)}
                          disabled={deleteArticleMutation.isPending}
                        >
                          <FaTrash className={`text-sm group-hover:scale-110 transition-transform ${deleteArticleMutation.isPending ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Articles List - Mobile View */}
        <div className="lg:hidden space-y-4">
          {articles.map((article, index) => (
            <div 
              key={article._id} 
              className={`rounded-lg shadow-md p-4 border ${
              article.premium 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 border-l-4 border-l-amber-500' 
                : 'bg-white border-gray-200'
            }`}>
              {/* Article Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="relative">
                  <img 
                    src={article.image || '/placeholder-article.jpg'} 
                    alt={article.title}
                    className={`w-20 h-20 rounded-lg object-cover border-2 ${
                      article.premium ? 'border-amber-400 ring-2 ring-amber-200' : 'border-blue-200'
                    }`}
                  />
                  {article.premium && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-1 py-0.5 rounded-full">
                      👑
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${
                    article.premium ? 'text-amber-900' : 'text-gray-900'
                  }`}>
                    {article.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaTag className="mr-1" />
                    {article.category || 'General'}
                  </div>
                  {getStatusBadge(article.status, article.premium)}
                </div>
              </div>

              {/* Author Info */}
              <div className={`rounded-lg p-3 mb-4 ${
                article.premium ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50'
              }`}>
                <h4 className={`text-sm font-semibold mb-2 ${
                  article.premium ? 'text-amber-800' : 'text-gray-700'
                }`}>Author Information</h4>
                <div className="flex items-center space-x-3">
                  <img 
                    src={article.author?.photo || '/placeholder-user.jpg'} 
                    alt={article.author?.name || 'Author'}
                    className={`w-12 h-12 rounded-full border-2 ${
                      article.premium ? 'border-amber-300' : 'border-blue-200'
                    }`}
                    onError={(e) => {
                      e.target.src = '/placeholder-user.jpg';
                    }}
                  />
                  <div>
                    <div className={`flex items-center text-sm font-medium mb-1 ${
                      article.premium ? 'text-amber-900' : 'text-gray-900'
                    }`}>
                      <FaUser className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                      {article.author?.name || 'Unknown Author'}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <FaEnvelope className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                      {article.author?.email || 'No email'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Details */}
              <div className={`rounded-lg p-3 mb-4 ${
                article.premium ? 'bg-amber-50/50 border border-amber-200' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-semibold mb-2 ${
                  article.premium ? 'text-amber-800' : 'text-gray-700'
                }`}>Article Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendar className={`mr-2 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-medium">Posted:</span>
                    <span className="ml-1">{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaNewspaper className={`mr-2 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-medium">Publisher:</span>
                    <span className="ml-1">{article.publisher || 'Not Assigned'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`grid gap-2 ${article.status === 'published' || article.status === 'declined' ? 'grid-cols-3' : 'grid-cols-5'}`}>
                {/* View button removed */}
                {article.status !== 'published' && article.status !== 'declined' && (
                  <button 
                    className="flex flex-col items-center p-3 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    onClick={() => handleApproveArticle(article)}
                    disabled={approveArticleMutation.isPending}
                  >
                    <FaCheck className={`text-lg mb-1 ${approveArticleMutation.isPending ? 'animate-spin' : ''}`} />
                    <span className="text-xs">Approve</span>
                  </button>
                )}
                {article.status !== 'published' && article.status !== 'declined' && (
                  <button 
                    className="flex flex-col items-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    onClick={() => handleDeclineArticle(article)}
                  >
                    <FaTimes className="text-lg mb-1" />
                    <span className="text-xs">Decline</span>
                  </button>
                )}
                {article.status !== 'declined' && (
                  article.premium ? (
                    <button 
                      className="flex flex-col items-center p-3 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      onClick={() => handleRemovePremium(article)}
                      disabled={removePremiumMutation.isPending}
                    >
                      <FaCrown className={`text-lg mb-1 ${removePremiumMutation.isPending ? 'animate-spin' : ''}`} />
                      <span className="text-xs">Remove Premium</span>
                    </button>
                  ) : (
                    <button 
                      className="flex flex-col items-center p-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      onClick={() => handleMakePremium(article)}
                      disabled={premiumArticleMutation.isPending}
                    >
                      <FaCrown className={`text-lg mb-1 ${premiumArticleMutation.isPending ? 'animate-spin' : ''}`} />
                      <span className="text-xs">Make Premium</span>
                    </button>
                  )
                )}
                <button 
                  className="flex flex-col items-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  onClick={() => handleDeleteArticle(article)}
                  disabled={deleteArticleMutation.isPending}
                >
                  <FaTrash className={`text-lg mb-1 ${deleteArticleMutation.isPending ? 'animate-spin' : ''}`} />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
            <p className="text-gray-600 mb-4">There are no articles to display at the moment.</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1 sm:gap-2 bg-white p-2 rounded-lg shadow-md border border-blue-100">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  pagination.hasPrevPage 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Previous page"
              >
                <FaAngleLeft className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-all duration-200 ${
                    number === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  pagination.hasNextPage
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Next page"
              >
                <FaAngleRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Pagination Info */}
        {articles.length > 0 && (
          <div className="mt-3 text-center text-sm text-gray-600">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} 
              {" - "}
              {Math.min(currentPage * itemsPerPage, pagination.totalArticles)} of {pagination.totalArticles} articles
            </p>
          </div>
        )}
        


        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaTimes className="mr-2 text-red-500" />
                    Decline Article
                  </h3>
                  <button
                    onClick={closeDeclineModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                {/* Article Info */}
                {selectedArticle && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {selectedArticle.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      By: {selectedArticle.author?.name || 'Unknown Author'}
                    </p>
                  </div>
                )}

                {/* Reason Input */}
                <div className="mb-6">
                  <label htmlFor="declineReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Decline *
                  </label>
                  <textarea
                    id="declineReason"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    placeholder="Please provide a detailed reason for declining this article..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The author will see this reason to understand why their article was declined.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={closeDeclineModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={declineArticleMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeclineConfirm}
                    disabled={declineArticleMutation.isPending || !declineReason.trim()}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      declineArticleMutation.isPending || !declineReason.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    {declineArticleMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Declining...
                      </div>
                    ) : (
                      'Decline Article'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticles;