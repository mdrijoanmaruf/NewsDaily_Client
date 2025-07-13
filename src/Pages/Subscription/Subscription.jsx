import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaCheck, FaStar, FaNewspaper, FaEye, FaHeart, FaShieldAlt, FaBolt, FaRocket } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';

const Subscription = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('5-days');

  // Check if user is currently premium (using the real-time status from AuthProvider)
  const isPremiumUser = isPremium;

  // Subscription plans
  const subscriptionPlans = [
    {
      id: '1-minute',
      duration: '1 Minute',
      price: 1,
      originalPrice: 2,
      description: 'Perfect for testing',
      badge: 'Demo',
      color: 'blue',
      features: [
        'Access to all premium articles',
        'Ad-free reading experience',
        'Priority customer support',
        'Early access to new features'
      ]
    },
    {
      id: '5-days',
      duration: '5 Days',
      price: 9.99,
      originalPrice: 14.99,
      description: 'Great for short-term access',
      badge: 'Popular',
      color: 'green',
      features: [
        'Access to all premium articles',
        'Ad-free reading experience',
        'Priority customer support',
        'Early access to new features',
        'Exclusive newsletters',
        'Download articles for offline reading'
      ]
    },
    {
      id: '10-days',
      duration: '10 Days',
      price: 19.99,
      originalPrice: 29.99,
      description: 'Best value for extended access',
      badge: 'Best Value',
      color: 'amber',
      features: [
        'Access to all premium articles',
        'Ad-free reading experience',
        'Priority customer support',
        'Early access to new features',
        'Exclusive newsletters',
        'Download articles for offline reading',
        'Premium content archives',
        'Video content access',
        'Personal reading analytics'
      ]
    }
  ];

  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);

  const handleSubscribe = () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }
    if (isPremium) {
      alert('You already have an active premium subscription');
      return;
    }
    // Navigate to payment page with selected plan data
    navigate('/payment', { 
      state: { 
        plan: selectedPlan, 
        price: selectedPlanData.price,
        duration: selectedPlanData.duration,
        userEmail: user.email 
      } 
    });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        ring: 'ring-blue-500',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        ring: 'ring-green-500',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      amber: {
        bg: 'from-amber-500 to-yellow-500',
        ring: 'ring-amber-500',
        text: 'text-amber-600',
        button: 'bg-amber-600 hover:bg-amber-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaCrown className="text-6xl sm:text-7xl lg:text-8xl text-yellow-400 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Unlock Premium
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Content Experience
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Get exclusive access to premium articles, ad-free reading, and early access to the latest news that matters most.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base">
              <div className="flex items-center">
                <FaShieldAlt className="mr-2 text-green-400" />
                <span>Premium Content</span>
              </div>
              <div className="flex items-center">
                <FaBolt className="mr-2 text-yellow-400" />
                <span>Ad-Free Experience</span>
              </div>
              <div className="flex items-center">
                <FaRocket className="mr-2 text-blue-400" />
                <span>Early Access</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-5 w-8 h-8 bg-purple-400 opacity-30 rounded-full"></div>
      </div>

      {/* Current Status Banner */}
      {isPremiumUser && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <FaCrown className="mr-3 text-yellow-400" />
              <span className="font-semibold">
                You're currently a Premium subscriber! Valid until: {new Date(user.premiumTaken).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section Header */}
        <div className="relative text-center mb-16">
          {/* Bullet Points in Top Right */}
          <div className="absolute top-0 right-0 flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Premium Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect subscription duration that fits your reading needs
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => {
            const colors = getColorClasses(plan.color);
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  isSelected 
                    ? `ring-4 ${colors.ring} shadow-2xl scale-105` 
                    : 'shadow-lg hover:shadow-xl'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Badge */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r ${colors.bg} text-white rounded-full text-sm font-bold shadow-lg`}>
                  {plan.badge}
                </div>

                <div className="bg-white p-8 rounded-2xl h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 line-through ml-2">${plan.originalPrice}</span>
                    </div>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-opacity-10`}>
                      <FaStar className="mr-1" />
                      Save ${(plan.originalPrice - plan.price).toFixed(2)}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className={`mr-3 mt-1 ${colors.text} flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Selected Plan: {selectedPlanData.duration}
              </h3>
              <p className="text-gray-600 mb-4">{selectedPlanData.description}</p>
              
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">${selectedPlanData.price}</span>
                  <span className="text-gray-500 line-through ml-2">${selectedPlanData.originalPrice}</span>
                </div>
                <div className="flex items-center text-green-600">
                  <FaHeart className="mr-1" />
                  <span className="font-medium">Save ${(selectedPlanData.originalPrice - selectedPlanData.price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <button
                onClick={handleSubscribe}
                disabled={isPremiumUser}
                className={`w-full lg:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isPremiumUser
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : `${getColorClasses(selectedPlanData.color).button} text-white hover:shadow-xl`
                }`}
              >
                {isPremiumUser ? 'Already Premium' : `Subscribe for $${selectedPlanData.price}`}
              </button>
              
              {!isPremiumUser && (
                <p className="text-sm text-gray-500 mt-2">
                  Secure payment • Cancel anytime
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <FaNewspaper className="text-4xl text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Articles</h4>
            <p className="text-gray-600">Access exclusive content from top journalists and industry experts.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <FaEye className="text-4xl text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Ad-Free Experience</h4>
            <p className="text-gray-600">Enjoy uninterrupted reading without any advertisements.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <FaBolt className="text-4xl text-amber-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Early Access</h4>
            <p className="text-gray-600">Be the first to read breaking news and exclusive stories.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;