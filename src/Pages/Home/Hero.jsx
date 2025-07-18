import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaNewspaper, FaCrown, FaUsers, FaChartLine, FaArrowRight, FaPlay, FaSpinner } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';
import useAxios from '../../Hook/useAxios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = () => {
  const { user, isPremium, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalViews: 0
  });
  const [premiumLoading, setPremiumLoading] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: 'ease-in-out',
    });
  }, []);

  // Fetch website statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch articles for count and total views
        const articlesResponse = await axiosSecure.get('/api/articles');
        if (articlesResponse.data.success) {
          const articles = articlesResponse.data.data;
          const totalArticles = articles.length;
          const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
          
          setStats(prev => ({
            ...prev,
            totalArticles,
            totalViews
          }));
        }

        // Fetch users count
        const usersResponse = await axiosSecure.get('/api/users');
        if (usersResponse.data) {
          setStats(prev => ({
            ...prev,
            totalUsers: usersResponse.data.length || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  // Set premium loading state based on auth loading
  useEffect(() => {
    if (!authLoading) {
      // Add a slight delay to ensure premium status is fully loaded
      const timer = setTimeout(() => {
        setPremiumLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-200" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float" data-aos="fade-right" data-aos-delay="300">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
          <FaNewspaper className="text-2xl text-blue-600" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }} data-aos="fade-left" data-aos-delay="500">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg">
          <FaChartLine className="text-xl text-indigo-600" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }} data-aos="fade-up" data-aos-delay="700">
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <FaUsers className="text-xl text-purple-600" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Welcome Badge */}
            <div 
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              <FaNewspaper className="mr-2" />
              Welcome to NewsDaily
            </div>

            {/* Main Headline */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Stay Informed with
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Latest News
              </span>
              <span className="text-3xl md:text-4xl lg:text-5xl">& Stories</span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-xl text-gray-600 mb-8 max-w-2xl"
              data-aos="fade-right" 
              data-aos-delay="300"
            >
              Discover breaking news, trending articles, and exclusive content from trusted sources worldwide. 
              Join millions of readers who trust NewsDaily for their daily information needs.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {!user ? (
                <>
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link 
                    to="/all-articles"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaPlay className="mr-2" />
                    Explore Articles
                  </Link>
                </>
              ) : (
                <>
                  {premiumLoading ? (
                    <button 
                      disabled
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                    >
                      <FaSpinner className="mr-2 animate-spin" />
                      Checking Premium Status...
                    </button>
                  ) : !isPremium ? (
                    <Link 
                      to="/subscription"
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaCrown className="mr-2" />
                      Upgrade to Premium
                    </Link>
                  ) : (
                    <Link 
                      to="/all-articles"
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaCrown className="mr-2" />
                      Access Premium Content
                    </Link>
                  )}
                  <Link 
                    to="/add-articles"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaNewspaper className="mr-2" />
                    Write Article
                  </Link>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div 
              className="grid grid-cols-3 gap-6"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="text-center" data-aos="zoom-in" data-aos-delay="600">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {formatNumber(stats.totalArticles)}+
                </div>
                <div className="text-sm text-gray-600">Articles Published</div>
              </div>
              <div className="text-center" data-aos="zoom-in" data-aos-delay="700">
                <div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-1">
                  {formatNumber(stats.totalUsers)}+
                </div>
                <div className="text-sm text-gray-600">Active Readers</div>
              </div>
              <div className="text-center" data-aos="zoom-in" data-aos-delay="800">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                  {formatNumber(stats.totalViews)}+
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Illustration */}
          <div className="relative" data-aos="fade-left" data-aos-delay="300">
            <div className="relative">
              {/* Main Hero Image */}
              <div 
                className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-indigo-200"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <img 
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="NewsDaily - Stay Informed" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div 
                className="absolute -top-4 -left-4 w-24 h-24 bg-white rounded-xl shadow-xl flex items-center justify-center animate-pulse"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                <div className="text-center">
                  <FaNewspaper className="text-2xl text-blue-600 mb-1" />
                  <div className="text-xs font-semibold text-gray-700">Breaking News</div>
                </div>
              </div>

              <div 
                className="absolute -bottom-4 -right-4 w-32 h-20 bg-white rounded-xl shadow-xl flex items-center justify-center animate-pulse" 
                style={{ animationDelay: '1s' }}
                data-aos="fade-left"
                data-aos-delay="700"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">Live</div>
                  <div className="text-xs text-gray-600">Updates</div>
                </div>
              </div>

              <div 
                className="absolute top-1/2 -right-6 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce"
                data-aos="zoom-in"
                data-aos-delay="800"
              >
                <FaCrown className="text-xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;