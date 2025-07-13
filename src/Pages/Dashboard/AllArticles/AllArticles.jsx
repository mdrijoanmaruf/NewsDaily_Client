import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaCheck, FaTimes, FaTrash, FaCrown, FaUser, FaEnvelope, FaCalendar, FaTag, FaNewspaper } from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import ComponentLoading from '../../../Shared/Loading/ComponentLoading';
import Swal from 'sweetalert2';

const AllArticles = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all articles using TanStack Query
  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['allArticles'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/articles');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '⏳' },
      'approved': { color: 'bg-green-100 text-green-800 border-green-300', icon: '✅' },
      'published': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '📰' },
      'declined': { color: 'bg-red-100 text-red-800 border-red-300', icon: '❌' },
      'premium': { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '👑' }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
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
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-semibold">Total Articles: {articles.length}</span>
            </div>
          </div>
        </div>

        {/* Articles List - Desktop View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
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
                  <tr key={article._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    {/* Article Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={article.image || '/placeholder-article.jpg'} 
                          alt={article.title}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-blue-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
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
                          src={article.authorPhoto || '/placeholder-user.jpg'} 
                          alt={article.authorName}
                          className="w-10 h-10 rounded-full border-2 border-blue-200"
                        />
                        <div>
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <FaUser className="mr-1 text-blue-600" />
                            {article.authorName}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaEnvelope className="mr-1" />
                            {article.authorEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <FaCalendar className="mr-1 text-blue-600" />
                          {formatDate(article.createdAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaNewspaper className="mr-1 text-blue-600" />
                          {article.publisher || 'Not Assigned'}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(article.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors group"
                          title="View Article"
                        >
                          <FaEye className="text-sm group-hover:scale-110 transition-transform" />
                        </button>
                        {article.status !== 'published' && (
                          <button 
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Approve"
                            onClick={() => handleApproveArticle(article)}
                            disabled={approveArticleMutation.isPending}
                          >
                            <FaCheck className={`text-sm group-hover:scale-110 transition-transform ${approveArticleMutation.isPending ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                        <button 
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Decline"
                        >
                          <FaTimes className="text-sm group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors group"
                          title="Make Premium"
                        >
                          <FaCrown className="text-sm group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Delete"
                        >
                          <FaTrash className="text-sm group-hover:scale-110 transition-transform" />
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
          {articles.map((article) => (
            <div key={article._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              {/* Article Header */}
              <div className="flex items-start space-x-3 mb-4">
                <img 
                  src={article.image || '/placeholder-article.jpg'} 
                  alt={article.title}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaTag className="mr-1" />
                    {article.category || 'General'}
                  </div>
                  {getStatusBadge(article.status)}
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Author Information</h4>
                <div className="flex items-center space-x-3">
                  <img 
                    src={article.authorPhoto || '/placeholder-user.jpg'} 
                    alt={article.authorName}
                    className="w-12 h-12 rounded-full border-2 border-blue-200"
                  />
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                      <FaUser className="mr-1 text-blue-600" />
                      {article.authorName}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <FaEnvelope className="mr-1 text-blue-600" />
                      {article.authorEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Details */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Article Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendar className="mr-2 text-blue-600" />
                    <span className="font-medium">Posted:</span>
                    <span className="ml-1">{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaNewspaper className="mr-2 text-blue-600" />
                    <span className="font-medium">Publisher:</span>
                    <span className="ml-1">{article.publisher || 'Not Assigned'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`grid gap-2 ${article.status === 'published' ? 'grid-cols-4' : 'grid-cols-5'}`}>
                <button className="flex flex-col items-center p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <FaEye className="text-lg mb-1" />
                  <span className="text-xs">View</span>
                </button>
                {article.status !== 'published' && (
                  <button 
                    className="flex flex-col items-center p-3 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    onClick={() => handleApproveArticle(article)}
                    disabled={approveArticleMutation.isPending}
                  >
                    <FaCheck className={`text-lg mb-1 ${approveArticleMutation.isPending ? 'animate-spin' : ''}`} />
                    <span className="text-xs">Approve</span>
                  </button>
                )}
                <button className="flex flex-col items-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <FaTimes className="text-lg mb-1" />
                  <span className="text-xs">Decline</span>
                </button>
                <button className="flex flex-col items-center p-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <FaCrown className="text-lg mb-1" />
                  <span className="text-xs">Premium</span>
                </button>
                <button className="flex flex-col items-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <FaTrash className="text-lg mb-1" />
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
      </div>
    </div>
  );
};

export default AllArticles;