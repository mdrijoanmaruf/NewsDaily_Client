import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendar, FaNewspaper, FaTag, FaCrown, FaEye, FaShare } from 'react-icons/fa';
import useAxiosSecure from '../../Hook/useAxiosSecure';
import useAuth from '../../Hook/useAuth';
import ComponentLoading from '../../Shared/Loading/ComponentLoading';
import AOS from 'aos';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosSecure();
  const { user, isPremium } = useAuth();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out'
    });
  }, []);

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
    retry: false,
    onSuccess: () => {
      // Refresh AOS when article loads
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
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
        <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto" data-aos="zoom-in">
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
              data-aos="fade-up" data-aos-delay="100"
            >
              Back to Articles
            </button>
            {error.message === 'Premium subscription required' && (
              <button 
                onClick={() => navigate('/subscription')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-600 text-white text-sm sm:text-base rounded-lg hover:bg-amber-700 transition-colors"
                data-aos="fade-up" data-aos-delay="200"
              >
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-50" data-aos="fade-down" data-aos-duration="400">
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
        }`} data-aos="fade-up" data-aos-duration="600">
          
          {/* Premium Badge */}
          {article.premium && (
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4" data-aos="fade-down" data-aos-delay="100">
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
              }`} data-aos="fade-right" data-aos-delay="200">
                {article.title}
              </h1>

              {/* Article Image */}
              {article.image && (
                <div className="mb-6 sm:mb-8" data-aos="zoom-in" data-aos-delay="300">
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
              }`} data-aos="fade-up" data-aos-delay="400">
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
              }`} data-aos="fade-left" data-aos-delay="200">
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
              }`} data-aos="fade-left" data-aos-delay="300">
                <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  article.premium ? 'text-amber-900' : 'text-gray-900'
                }`}>
                  Article Information
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start" data-aos="fade-left" data-aos-delay="350">
                    <FaCalendar className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-600">Published on</div>
                      <div className="font-medium text-sm sm:text-base">{formatDate(article.createdAt)}</div>
                    </div>
                  </div>

                  {article.publisher && (
                    <div className="flex items-start" data-aos="fade-left" data-aos-delay="400">
                      <FaNewspaper className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-600">Publisher</div>
                        <div className="font-medium text-sm sm:text-base truncate">{article.publisher}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start" data-aos="fade-left" data-aos-delay="450">
                    <FaEye className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-600">Views</div>
                      <div className="font-medium text-sm sm:text-base">{article.views || 0}</div>
                    </div>
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-start" data-aos="fade-left" data-aos-delay="500">
                      <FaTag className={`mr-2 sm:mr-3 mt-1 text-sm ${article.premium ? 'text-amber-600' : 'text-blue-600'} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-600">Tags</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {article.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${
                                article.premium ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium ${
                  article.premium ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                } transition-colors`}
                data-aos="fade-up" data-aos-delay="600"
              >
                <FaShare className="mr-2" />
                Share This Article
              </button>
            </div>
          </div>
          
          {/* Related Articles or Comments Section */}
          <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200" data-aos="fade-up" data-aos-delay="700">
            <h2 className={`text-xl font-bold mb-4 ${article.premium ? 'text-amber-900' : 'text-gray-900'}`}>
              More from NewsDaily
            </h2>
            <p className="text-gray-600">
              Continue exploring our collection of articles for more quality content.
            </p>
            <button
              onClick={() => navigate('/all-articles')}
              className={`mt-4 px-6 py-2 rounded-lg ${
                article.premium ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
              data-aos="fade-up" data-aos-delay="750"
            >
              Browse Articles
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetails;
