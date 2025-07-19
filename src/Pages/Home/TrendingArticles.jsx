import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight, FaClock, FaUser, FaEye, FaSpinner, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../Hook/useAxios';
import useAuth from '../../Hook/useAuth';
import Swal from 'sweetalert2';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const TrendingArticles = () => {
  // TanStack Query for articles
  const {
    data: articles = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/articles');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch articles');
    }
  });

  // Filter and sort trending articles
  const trendingArticles = React.useMemo(() => {
    const publishedArticles = articles.filter(article => article.status === 'published');
    return publishedArticles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [articles]);
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();


  // Format views count for display
  const formatViews = (views) => {
    if (!views || views === 0) return '0';
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  // Handle article click with premium check
  const handleArticleClick = async (article) => {
    // Check if article is premium and user doesn't have premium access
    if (article.premium && !isPremium) {
      await Swal.fire({
        title: 'Premium Content',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <i class="fas fa-crown text-yellow-500 text-4xl mb-2"></i>
            </div>
            <p class="text-gray-600 mb-4">This is a premium article. Subscribe to our premium plan to access exclusive content.</p>
            <ul class="text-left text-sm text-gray-500 mb-4">
              <li>• Access to all premium articles</li>
              <li>• Ad-free reading experience</li>
              <li>• Early access to breaking news</li>
              <li>• Exclusive interviews and reports</li>
            </ul>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Subscribe Now',
        cancelButtonText: 'Maybe Later',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-bold text-gray-800',
          content: 'text-gray-600'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/subscription');
        }
      });
      return;
    }

    // If user is not logged in, prompt to login
    if (!user) {
      await Swal.fire({
        title: 'Login Required',
        text: 'Please login to read the full article.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      // Increment view count
      await axiosSecure.put(`/api/articles/${article._id}/view`);
      // Navigate to article details
      navigate(`/article/${article._id}`);
    } catch (error) {
      console.error('Error updating view count:', error);
      // Still navigate even if view update fails
      navigate(`/article/${article._id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trending
              </span>
              <span className="ml-2 text-gray-800">Articles</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
              <p className="text-gray-600 text-lg">Loading trending articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
if (isError) {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trending
              </span>
              <span className="ml-2 text-gray-800">Articles</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-96">
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

  // No articles state
if (!isLoading && trendingArticles.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trending
              </span>
              <span className="ml-2 text-gray-800">Articles</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          </div>
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <p className="text-gray-600 text-lg">No trending articles available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trending
            </span>
            <span className="ml-2 text-gray-800">Articles</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news and trending stories from around the world
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            effect="fade"
            fadeEffect={{
              crossFade: true
            }}
            className="trending-slider"
          >
            {trendingArticles.map((article) => (
              <SwiperSlide key={article._id || article.id}>
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                     onClick={() => handleArticleClick(article)}>
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 "
                    style={{ backgroundImage: `url(${article.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'})` }}
                  ></div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Premium Article Overlay for non-premium users */}
                  {article.premium && !isPremium && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="text-center text-white">
                        <FaLock className="text-4xl mb-3 mx-auto text-yellow-400" />
                        <h4 className="text-xl font-bold mb-2">Premium Content</h4>
                        <p className="text-sm text-gray-300 mb-4">Subscribe to access this exclusive article</p>
                        <button 
                          className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArticleClick(article);
                          }}
                        >
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      {article.tags?.[0] || article.category || 'News'}
                    </span>
                  </div>
                  
                  {/* Premium Badge */}
                  {article.premium && (
                    <div className="absolute top-6 right-6 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <FaLock className="text-xs" />
                        PREMIUM
                      </span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-200 text-lg mb-6 line-clamp-2">
                      {article.description}
                    </p>
                    
                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-blue-400" />
                        <span>{article.author?.name || 'Unknown Author'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-400" />
                        <span>{formatDate(article.createdAt || article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEye className="text-blue-400" />
                        <span>{formatViews(article.views)} views</span>
                      </div>
                    </div>
                    
                    {/* Read More Button */}
                    <button 
                      className={`mt-6 px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        article.premium && !isPremium
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArticleClick(article);
                      }}
                    >
                      {article.premium && !isPremium ? (
                        <span className="flex items-center gap-2">
                          <FaLock className="text-sm" />
                          Subscribe to Read
                        </span>
                      ) : (
                        'Read Full Article'
                      )}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg transition-all duration-300 hidden md:flex items-center justify-center group">
            <FaArrowLeft className="text-lg group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
          
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg transition-all duration-300 hidden md:flex items-center justify-center group">
            <FaArrowRight className="text-lg group-hover:transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .trending-slider .swiper-pagination {
          bottom: 20px !important;
        }
        
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: #2563eb;
          transform: scale(1.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TrendingArticles;