import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendar, FaNewspaper, FaTag, FaCrown, FaEye, FaShare } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios';
import useAuth from '../../Hook/useAuth';
import ComponentLoading from '../../Shared/Loading/ComponentLoading';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const { user, isPremium } = useAuth();

  // Increment view count mutation
  const incrementViewMutation = useMutation({
    mutationFn: async (articleId) => {
      await axios.put(`/api/articles/${articleId}/view`);
    },
    onError: (error) => {
      console.error('Error incrementing view count:', error);
    }
  });

  // Increment view count immediately when component mounts (every visit)
  useEffect(() => {
    if (id) {
      incrementViewMutation.mutate(id);
    }
  }, [id]); // Only depends on id, runs once per article visit

  // Fetch article details
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['articleDetails', id],
    queryFn: async () => {
      const response = await axios.get(`/api/articles/${id}`);
      const article = response.data.data;
      
      // Check if article is published
      if (article.status !== 'published') {
        throw new Error('Article not available');
      }
      
      // Check premium access
      if (article.premium && !isPremium) {
        throw new Error('Premium subscription required');
      }
      
      return article;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (isLoading) return <ComponentLoading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
          <div className="text-red-600 text-4xl sm:text-6xl mb-4">❌</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {error.message === 'Premium subscription required' ? 'Premium Content' : 'Article Not Found'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {error.message === 'Premium subscription required' 
              ? 'This article requires a premium subscription to view.'
              : 'The article you\'re looking for could not be found or is not available.'}
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/all-articles')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Articles
            </button>
            {error.message === 'Premium subscription required' && (
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-600 text-white text-sm sm:text-base rounded-lg hover:bg-amber-700 transition-colors">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate('/all-articles')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2 text-sm sm:text-base" />
            Back to Articles
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <article className={`bg-white rounded-xl shadow-xl overflow-hidden ${
          article.premium ? 'ring-2 ring-amber-400 shadow-amber-100' : 'shadow-gray-200'
        }`}>
          
          {/* Premium Badge */}
          {article.premium && (
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-center">
                <FaCrown className="mr-2 sm:mr-3 text-base sm:text-lg" />
                <span className="font-bold text-sm sm:text-base lg:text-lg">PREMIUM ARTICLE</span>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column - Article Content */}
            <div className="xl:col-span-2 p-4 sm:p-6 lg:p-8">
              {/* Article Title */}
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 leading-tight ${
                article.premium ? 'text-amber-900' : 'text-gray-900'
              }`}>
                {article.title}
              </h1>

              {/* Article Image */}
              {article.image && (
                <div className="mb-6 sm:mb-8">
                  <img
                    src={article.image}
                    alt={article.title}
                    className={`w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg sm:rounded-xl shadow-lg ${
                      article.premium ? 'ring-1 sm:ring-2 ring-amber-300' : 'ring-1 ring-gray-200'
                    }`}
                    onError={(e) => {
                      e.target.src = '/placeholder-article.jpg';
                    }}
                  />
                </div>
              )}

              {/* Article Content */}
              <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none ${
                article.premium ? 'prose-amber' : 'prose-blue'
              }`}>
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg whitespace-pre-wrap">
                  {article.description}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-1 bg-gray-50 p-4 sm:p-6 lg:p-8 order-first xl:order-last">
              
              {/* Author Info */}
              <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl ${
                article.premium ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  article.premium ? 'text-amber-900' : 'text-gray-900'
                }`}>
                  About the Author
                </h3>
                <div className="flex items-start">
                  <img
                    src={article.author?.photo || '/placeholder-user.jpg'}
                    alt={article.author?.name || 'Author'}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 border-2 border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/placeholder-user.jpg';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center mb-1 sm:mb-2">
                      <FaUser className={`mr-1 sm:mr-2 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{article.author?.name || 'Unknown Author'}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{article.author?.email}</div>
                  </div>
                </div>
              </div>

              {/* Article Meta Information */}
              <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl ${
                article.premium ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  article.premium ? 'text-amber-900' : 'text-gray-900'
                }`}>
                  Article Information
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <FaCalendar className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-600">Published on</div>
                      <div className="font-medium text-sm sm:text-base">{formatDate(article.createdAt)}</div>
                    </div>
                  </div>

                  {article.publisher && (
                    <div className="flex items-start">
                      <FaNewspaper className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-600">Publisher</div>
                        <div className="font-medium text-sm sm:text-base truncate">{article.publisher}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <FaEye className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-600">Views</div>
                      <div className="font-medium text-sm sm:text-base">{article.views || 0} views</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl ${
                  article.premium ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'
                }`}>
                  <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                    article.premium ? 'text-amber-900' : 'text-gray-900'
                  }`}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          article.premium
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                        }`}
                      >
                        <FaTag className="mr-1 sm:mr-2 text-xs" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg sm:rounded-xl ${
                article.premium ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  article.premium ? 'text-amber-900' : 'text-gray-900'
                }`}>
                  Share Article
                </h3>
                <button
                  onClick={handleShare}
                  className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    article.premium
                      ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <FaShare className="mr-2 text-xs sm:text-sm" />
                  Share this Article
                </button>
              </div>

              {/* Premium Badge */}
              {article.premium && (
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
                  <FaCrown className="mx-auto text-2xl sm:text-3xl text-amber-600 mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-1 sm:mb-2">Premium Content</h3>
                  <p className="text-xs sm:text-sm text-amber-800">
                    This is exclusive premium content available to subscribers only.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Article Footer */}
          <div className={`border-t px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${
            article.premium ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'
          }`}>
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>Article ID: <span className="font-mono text-xs break-all">{article._id}</span></p>
                <p>Last updated: {formatDate(article.updatedAt || article.createdAt)}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {article.premium && (
                  <div className="flex items-center text-amber-700 text-xs sm:text-sm font-medium">
                    <FaCrown className="mr-1 sm:mr-2" />
                    Premium Content
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/all-articles')}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                    article.premium
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Read More Articles
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mr-3 sm:mr-4">Related Articles</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🔗</div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Related Articles Coming Soon</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                We're working on implementing a smart recommendation system to show you articles related to your interests.
              </p>
              <button
                onClick={() => navigate('/all-articles')}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium text-sm sm:text-base rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaNewspaper className="mr-1 sm:mr-2" />
                Browse All Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
