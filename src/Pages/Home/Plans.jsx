import React from 'react';
import { FaCheck, FaTimes, FaCrown, FaUser, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hook/useAuth';

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribeClick = () => {
    navigate('/subscription');
  };

  const freeFeatures = [
    { feature: 'Access to basic articles', included: true },
    { feature: 'Daily news updates', included: true },
    { feature: 'Limited article views (5 per day)', included: true },
    { feature: 'Basic search functionality', included: true },
    { feature: 'Premium articles access', included: false },
    { feature: 'Unlimited article views', included: false },
    { feature: 'Advanced search filters', included: false },
    { feature: 'Article bookmarking', included: false },
    { feature: 'Ad-free experience', included: false },
    { feature: 'Priority customer support', included: false }
  ];

  const premiumFeatures = [
    { feature: 'Access to basic articles', included: true },
    { feature: 'Daily news updates', included: true },
    { feature: 'Unlimited article views', included: true },
    { feature: 'Premium articles access', included: true },
    { feature: 'Advanced search filters', included: true },
    { feature: 'Article bookmarking', included: true },
    { feature: 'Ad-free experience', included: true },
    { feature: 'Priority customer support', included: true },
    { feature: 'Early access to breaking news', included: true },
    { feature: 'Downloadable articles (PDF)', included: true }
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="plans-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plans-grid)" className="text-blue-200" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <FaCrown className="mr-2" />
            Choose Your Plan
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Pricing Plans</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your news reading needs. Upgrade anytime to unlock premium features.
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            {/* Plan Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-2xl text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for casual readers</p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {freeFeatures.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                    item.included 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {item.included ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      <FaTimes className="text-xs" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    item.included ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button removed as requested */}
          </div>

          {/* Premium Plan */}
          <div className="relative bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </div>
            </div>

            {/* Plan Header */}
            <div className="text-center mb-8 mt-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  $9.99
                </span>
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">For serious news enthusiasts</p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {premiumFeatures.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <FaCheck className="text-xs" />
                  </div>
                  <span className="text-sm text-gray-900">
                    {item.feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleSubscribeClick}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="flex items-center justify-center">
                Upgrade to Premium
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Premium?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of NewsDaily with our premium subscription
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-xl text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Content</h4>
              <p className="text-gray-600 text-sm">
                Access exclusive articles and in-depth analysis from top journalists
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-xl text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Limits</h4>
              <p className="text-gray-600 text-sm">
                Read unlimited articles without any daily restrictions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaArrowRight className="text-xl text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ad-Free</h4>
              <p className="text-gray-600 text-sm">
                Enjoy a clean, distraction-free reading experience
              </p>
            </div>
          </div>
        </div>

        {/* Money-back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full">
            <FaCheck className="mr-2" />
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;