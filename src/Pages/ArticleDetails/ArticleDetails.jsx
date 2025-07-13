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
  const { user } = useAuth();

  // Check if user has premium subscription
  const hasPremiumSubscription = user?.premiumTaken || false;

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
      if (article.premium && !hasPremiumSubscription) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md w-full">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error.message === 'Premium subscription required' ? 'Premium Content' : 'Article Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message === 'Premium subscription required' 
              ? 'This article requires a premium subscription to view.'
              : 'The article you\'re looking for could not be found or is not available.'}
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/all-articles')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Articles
            </button>
            {error.message === 'Premium subscription required' && (
              <button className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/all-articles')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Articles
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className={`bg-white rounded-lg shadow-lg overflow-hidden ${
          article.premium ? 'ring-2 ring-amber-400' : ''
        }`}>
          
          {/* Premium Badge */}
          {article.premium && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-3">
              <div className="flex items-center justify-center">
                <FaCrown className="mr-2" />
                <span className="font-bold">PREMIUM ARTICLE</span>
              </div>
            </div>
          )}

          {/* Article Header */}
          <div className="p-8">
            {/* Article Title */}
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${
              article.premium ? 'text-amber-900' : 'text-gray-900'
            }`}>
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <img
                  src={article.author?.photo || '/placeholder-user.jpg'}
                  alt={article.author?.name || 'Author'}
                  className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = '/placeholder-user.jpg';
                  }}
                />
                <div>
                  <div className="flex items-center">
                    <FaUser className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-medium">{article.author?.name || 'Unknown Author'}</span>
                  </div>
                  <div className="text-xs text-gray-500">{article.author?.email}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FaCalendar className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                <span>Published on {formatDate(article.createdAt)}</span>
              </div>

              {article.publisher && (
                <div className="flex items-center">
                  <FaNewspaper className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                  <span className="font-medium">{article.publisher}</span>
                </div>
              )}

              <div className="flex items-center">
                <FaEye className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                <span>{article.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      article.premium
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    <FaTag className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleShare}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  article.premium
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <FaShare className="mr-2" />
                Share Article
              </button>
            </div>
          </div>

          {/* Article Image */}
          {article.image && (
            <div className="px-8 mb-8">
              <img
                src={article.image}
                alt={article.title}
                className={`w-full h-64 md:h-96 object-cover rounded-lg shadow-md ${
                  article.premium ? 'ring-2 ring-amber-300' : ''
                }`}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="px-8 pb-8">
            <div className={`prose prose-lg max-w-none ${
              article.premium ? 'prose-amber' : 'prose-blue'
            }`}>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.description}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className={`border-t px-8 py-6 ${
            article.premium ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Article ID: {article._id}</p>
                <p>Last updated: {formatDate(article.updatedAt || article.createdAt)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {article.premium && (
                  <div className="flex items-center text-amber-700 text-sm font-medium">
                    <FaCrown className="mr-1" />
                    Premium Content
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/all-articles')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Related Articles Section (placeholder) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Related articles feature coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
