import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { FaUsers, FaCrown, FaUserFriends, FaNewspaper, FaEye, FaChartLine } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios';

const Statistic = () => {
  // TanStack Query for users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/users');
      if (response.data) {
        return response.data;
      }
      return [];
    }
  });

  // TanStack Query for articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/articles');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    }
  });

  // Calculate statistics from query data
  const totalUsers = users.length;
  const premiumUsers = users.filter(user => {
    if (user.subscriptionEndDate) {
      const endDate = new Date(user.subscriptionEndDate);
      const currentDate = new Date();
      return currentDate < endDate;
    }
    return false;
  }).length;
  const normalUsers = totalUsers - premiumUsers;
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(article => article.status === 'published').length;
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);

  const stats = {
    totalUsers,
    normalUsers,
    premiumUsers,
    totalArticles,
    totalViews,
    publishedArticles
  };
  const [isVisible, setIsVisible] = useState(false);
  const axiosSecure = useAxios();


  // Intersection Observer for triggering animation when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('statistics-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const statisticsData = [
    {
      icon: FaUsers,
      count: stats.totalUsers,
      label: 'Total Users',
      description: 'Registered members on our platform',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: FaUserFriends,
      count: stats.normalUsers,
      label: 'Free Users',
      description: 'Users with free access',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: FaCrown,
      count: stats.premiumUsers,
      label: 'Premium Users',
      description: 'Subscribers with premium access',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: FaNewspaper,
      count: stats.publishedArticles,
      label: 'Published Articles',
      description: 'Live articles available to read',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: FaEye,
      count: stats.totalViews,
      label: 'Total Views',
      description: 'Combined article views',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: FaChartLine,
      count: stats.totalArticles,
      label: 'Total Articles',
      description: 'All articles including drafts',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div id="statistics-section" className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stats-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" className="text-blue-200" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <FaChartLine className="mr-2" />
            Platform Statistics
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Growing <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Community</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of readers and writers who trust NewsDaily for their daily dose of information and premium content.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statisticsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`text-2xl ${stat.iconColor}`} />
                </div>

                {/* Count */}
                <div className="mb-4">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {isVisible ? (
                      <CountUp
                        start={0}
                        end={stat.count}
                        duration={2.5}
                        delay={index * 0.2}
                        separator=","
                        suffix={stat.label === 'Total Views' && stat.count >= 1000 ? '' : ''}
                      />
                    ) : (
                      '0'
                    )}
                    {stat.label === 'Total Views' && stat.count >= 1000000 && 'M'}
                    {stat.label === 'Total Views' && stat.count >= 1000 && stat.count < 1000000 && 'K'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.label}</h3>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>

                {/* Progress Bar (Visual Enhancement) */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 delay-300`}
                    style={{ 
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 0.1 + 0.5}s`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={Math.round((stats.premiumUsers / Math.max(stats.totalUsers, 1)) * 100)}
                      duration={2}
                      suffix="%"
                    />
                  ) : (
                    '0%'
                  )}
                </div>
                <p className="text-gray-600">Premium Conversion Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={Math.round((stats.publishedArticles / Math.max(stats.totalArticles, 1)) * 100)}
                      duration={2}
                      suffix="%"
                    />
                  ) : (
                    '0%'
                  )}
                </div>
                <p className="text-gray-600">Article Approval Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {isVisible ? (
                    <CountUp
                      start={0}
                      end={Math.round(stats.totalViews / Math.max(stats.publishedArticles, 1))}
                      duration={2}
                    />
                  ) : (
                    '0'
                  )}
                </div>
                <p className="text-gray-600">Average Views per Article</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;