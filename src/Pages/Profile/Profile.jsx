import React, { useState, useEffect } from 'react';
import { FaUser, FaCrown, FaCalendarAlt, FaEnvelope, FaEdit, FaNewspaper, FaEye, FaHeart, FaClock, FaShieldAlt } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';
import useAxios from '../../Hook/useAxios';
import useUserRole from '../../Hook/useUserRole';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
  const { user, userProfileData, isPremium } = useAuth();
  const { userRole } = useUserRole();
  const axios = useAxios();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    premiumArticles: 0
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  // Fetch user's articles and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        
        // Fetch user's articles
        const articlesResponse = await axios.get('/api/articles');
        const userArticles = articlesResponse.data.data.filter(
          article => article.author?.email === user.email
        );
        
        setArticles(userArticles);
        
        // Calculate stats
        const totalViews = userArticles.reduce((sum, article) => sum + (article.views || 0), 0);
        const premiumCount = userArticles.filter(article => article.isPremium).length;
        
        setStats({
          totalArticles: userArticles.length,
          totalViews: totalViews,
          premiumArticles: premiumCount
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining in subscription
  const calculateDaysRemaining = () => {
    if (!userProfileData?.subscriptionEndDate) return 0;
    
    const endDate = new Date(userProfileData.subscriptionEndDate);
    const currentDate = new Date();
    const diffTime = endDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    switch(userRole) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        data-aos="fade-down"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 md:h-48"></div>
        <div className="px-4 py-6 md:px-6 -mt-16 flex flex-wrap">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <FaUser size={48} />
                </div>
              )}
            </div>
            {isPremium && (
              <div className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
                <FaCrown />
              </div>
            )}
          </div>
          <div className="ml-4 mt-8 md:mt-12 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user?.displayName || 'User'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
              </span>
              {isPremium && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-400 text-white flex items-center gap-1">
                  <FaCrown size={10} /> Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 md:col-span-1"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-600" /> Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user?.displayName || 'Not provided'}</p>
            </div>
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium break-all">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Joined On</p>
                <p className="font-medium">
                  {userProfileData?.createdAt ? formatDate(userProfileData.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 md:col-span-2"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaCrown className="mr-2 text-amber-500" /> Subscription Status
          </h2>
          
          {isPremium ? (
            <div>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-3 rounded-full mr-4">
                    <FaCrown className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-700">Premium Subscription Active</h3>
                    <p className="text-amber-600">Enjoy unlimited access to premium content!</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-bold text-gray-800">{userProfileData?.subscriptionPlan || 'Premium'}</p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-bold text-gray-800">
                    {userProfileData?.subscriptionStartDate ? formatDate(userProfileData.subscriptionStartDate) : 'N/A'}
                  </p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Expires On</p>
                  <p className="font-bold text-gray-800">
                    {userProfileData?.subscriptionEndDate ? formatDate(userProfileData.subscriptionEndDate) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Subscription Time Remaining</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (calculateDaysRemaining() / 10) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">
                  {calculateDaysRemaining()} days remaining
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <FaCrown className="text-gray-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700">No Active Subscription</h3>
                    <p className="text-gray-600">Upgrade to premium for exclusive content!</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-4">
                <Link 
                  to="/subscription" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-medium rounded-lg shadow-md hover:from-amber-600 hover:to-yellow-500 transition duration-300"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 md:col-span-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaNewspaper className="mr-2 text-blue-600" /> Your Activity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaNewspaper className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Articles</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalArticles}</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaEye className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total Views</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalViews}</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="text-amber-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-amber-600">Premium Articles</p>
                <p className="text-2xl font-bold text-amber-800">{stats.premiumArticles}</p>
              </div>
            </div>
          </div>
          
          {/* Recent Articles */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Recent Articles</h3>
            {loading ? (
              <p className="text-center py-4 text-gray-500">Loading your articles...</p>
            ) : articles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.slice(0, 5).map((article) => (
                      <tr key={article._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link to={`/article/${article._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {article.title}
                          </Link>
                          {article.isPremium && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              <FaCrown className="mr-1" size={10} /> Premium
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            article.status === 'declined' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status?.charAt(0).toUpperCase() + article.status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {article.views || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(article.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FaNewspaper className="mx-auto text-gray-300 text-4xl mb-3" />
                <p className="text-gray-500">You haven't published any articles yet.</p>
                <Link 
                  to="/add-article" 
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Write Your First Article
                </Link>
              </div>
            )}
            
            {articles.length > 0 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/my-articles" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  View All Articles
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;