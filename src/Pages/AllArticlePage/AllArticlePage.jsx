import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaNewspaper, FaUser, FaCalendar, FaTag, FaEye, FaCrown, FaLock } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios';
import useAuth from '../../Hook/useAuth';
import ComponentLoading from '../../Shared/Loading/ComponentLoading';

const AllArticlePage = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch published articles only
  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['publishedArticles'],
    queryFn: async () => {
      const response = await axios.get('/api/articles');
      // Filter only published articles
      const publishedArticles = response.data.data.filter(article => article.status === 'published');
      return publishedArticles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (article.tags && article.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())));
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from articles
  const categories = ['all', ...new Set(articles.flatMap(article => article.tags || []))];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if user has premium subscription (you can modify this logic based on your user schema)
  const hasPremiumSubscription = user?.premiumTaken || false;

  // Handle article details navigation
  const handleViewDetails = (article) => {
    if (article.premium && !hasPremiumSubscription) {
      // Premium article but user doesn't have subscription - disable button
      return;
    }
    // Navigate to article details page (you'll need to create this route)
    navigate(`/article/${article._id}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <FaNewspaper className="text-4xl text-blue-600 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">All Articles</h1>
            </div>
            <p className="text-lg text-gray-600">
              Discover the latest news and stories from our community
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Articles Count */}
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-semibold">
                {filteredArticles.length} Article{filteredArticles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article._id}
                className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  article.premium
                    ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 relative'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Premium Badge */}
                {article.premium && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                      <FaCrown className="mr-1" />
                      PREMIUM
                    </div>
                  </div>
                )}

                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image || '/placeholder-article.jpg'}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
                      article.premium ? 'ring-2 ring-amber-400' : ''
                    }`}
                  />
                  {article.premium && (
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Article Title */}
                  <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
                    article.premium ? 'text-amber-900' : 'text-gray-900'
                  }`}>
                    {article.title}
                  </h3>

                  {/* Article Meta Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                    <div className="flex items-center">
                      <FaUser className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                      <span>{article.author?.name || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>

                  {/* Publisher Info */}
                  {article.publisher && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FaNewspaper className={`mr-1 ${article.premium ? 'text-amber-600' : 'text-blue-600'}`} />
                      <span className="font-medium">{article.publisher}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            article.premium
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          <FaTag className="mr-1" />
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Article Description */}
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    article.premium ? 'text-amber-800' : 'text-gray-700'
                  }`}>
                    {article.description}
                  </p>

                  {/* Details Button */}
                  <button
                    onClick={() => handleViewDetails(article)}
                    disabled={article.premium && !hasPremiumSubscription}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center ${
                      article.premium && !hasPremiumSubscription
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : article.premium
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {article.premium && !hasPremiumSubscription ? (
                      <>
                        <FaLock className="mr-2" />
                        Premium Required
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-2" />
                        View Details
                      </>
                    )}
                  </button>

                  {/* Premium Notice */}
                  {article.premium && !hasPremiumSubscription && (
                    <p className="text-xs text-amber-700 mt-2 text-center">
                      Subscribe to premium to access this article
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No articles match your search criteria. Try adjusting your search or filter.'
                : 'There are no published articles at the moment.'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Premium Articles Info Section */}
        {articles.some(article => article.premium) && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaCrown className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Premium Content Available
                </h3>
                <p className="text-amber-800 text-sm">
                  Some articles are marked as premium content. {!hasPremiumSubscription && 
                  'Subscribe to our premium plan to access exclusive articles and features.'}
                </p>
                {!hasPremiumSubscription && (
                  <button className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticlePage;