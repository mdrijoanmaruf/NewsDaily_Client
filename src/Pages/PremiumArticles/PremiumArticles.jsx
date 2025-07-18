import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaNewspaper, FaUser, FaCalendar, FaCrown, FaEye, FaLock } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios';
import useAuth from '../../Hook/useAuth';
import ComponentLoading from '../../Shared/Loading/ComponentLoading';
import Swal from 'sweetalert2';
import AOS from 'aos';

const PremiumArticles = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { isPremium } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true });
  }, []);

  // Fetch only premium published articles
  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['premiumArticles'],
    queryFn: async () => {
      const response = await axios.get('/api/articles?search=' + encodeURIComponent(searchTerm) + '&category=' + encodeURIComponent(selectedCategory));
      // Only published and premium
      return (response.data.data || []).filter(article => article.status === 'published' && article.premium);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (articles.length > 0) {
      AOS.refresh();
    }
  }, [articles]);

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

  // Handle article details navigation
  const handleViewDetails = (article) => {
    if (!isPremium) {
      Swal.fire({
        title: '👑 Premium Content',
        text: 'This is a premium article. Please upgrade to premium to access exclusive content.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Upgrade to Premium',
        cancelButtonText: 'Maybe Later',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/subscription');
        }
      });
      return;
    }
    navigate(`/article/${article._id}`);
  };

  if (isLoading) return <ComponentLoading />;
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200" data-aos="fade-up">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8" data-aos="fade-down">
          <div className="text-center mb-6">
            <div className="flex flex-col xs:flex-row items-center justify-center mb-4 gap-2 xs:gap-4">
              <FaCrown className="text-3xl sm:text-4xl text-amber-500 mr-0 xs:mr-3" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900">Premium Articles</h1>
            </div>
            <p className="text-base sm:text-lg text-amber-700">
              Only premium content is shown here. Enjoy exclusive articles!
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between flex-wrap" data-aos="fade-up" data-aos-delay="100">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[180px] max-w-full sm:max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-amber-400" />
              </div>
              <input
                type="text"
                placeholder="Search premium articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-amber-300 rounded-lg placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <label className="text-sm font-medium text-amber-700 whitespace-nowrap">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 sm:px-4 sm:py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Articles Count */}
            <div className="bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 text-center w-full sm:w-auto">
              <span className="text-amber-800 font-semibold text-sm sm:text-base">
                {articles.length} Premium Article{articles.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {articles.map((article, index) => (
              <div
                key={article._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                data-aos-duration="800"
                className="group relative rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-1 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border border-amber-300"
                style={{ willChange: 'transform' }}
              >
                {/* Premium Badge */}
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
                    <FaCrown className="mr-1" />
                    PRO
                  </div>
                </div>

                {/* Article Image */}
                <div className="relative h-40 xs:h-44 sm:h-48 md:h-44 lg:h-44 overflow-hidden">
                  <img
                    src={article.image || '/placeholder-article.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent"></div>
                </div>

                {/* Article Content */}
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Article Title */}
                  <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] text-amber-900">
                    {article.title}
                  </h3>

                  {/* Article Meta Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-700 gap-1 sm:gap-0">
                    <div className="flex items-center">
                      <FaUser className="mr-1 text-amber-500" />
                      <span className="truncate max-w-20">{article.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-1 text-amber-500" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>

                  {/* Publisher Info */}
                  {article.publisher && (
                    <div className="flex items-center text-xs text-amber-700 mt-1">
                      <FaNewspaper className="mr-1 flex-shrink-0 text-amber-500" />
                      <span className="font-medium truncate">{article.publisher}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-xs text-amber-400 px-1 py-1">+{article.tags.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Article Description */}
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] text-amber-700">
                    {article.description}
                  </p>

                  {/* Details Button */}
                  <button
                    onClick={() => handleViewDetails(article)}
                    className={`w-full py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg`}
                  >
                    {!isPremium ? (
                      <>
                        <FaLock className="w-4 h-4" />
                        <span>Upgrade to View</span>
                      </>
                    ) : (
                      <>
                        <FaEye className="w-4 h-4" />
                        <span>Read Article</span>
                      </>
                    )}
                  </button>

                  {/* Premium Notice */}
                  {!isPremium && (
                    <p className="text-xs text-amber-600 text-center font-medium mt-1">
                      Premium subscription required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-lg shadow-md p-12 text-center" data-aos="fade-up">
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No Premium Articles Found</h3>
            <p className="text-amber-700 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No premium articles match your search criteria. Try adjusting your search or filter.'
                : 'There are no premium articles at the moment.'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumArticles;