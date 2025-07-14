import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaCheck, FaStar, FaNewspaper, FaEye, FaHeart, FaShieldAlt, FaBolt, FaRocket } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Subscription = () => {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('5-days');

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100
    });
  }, []);

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
            <div className="flex justify-center mb-6" data-aos="zoom-in">
              <div className="relative">
                <FaCrown className="text-6xl sm:text-7xl lg:text-8xl text-yellow-400 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
              Unlock Premium
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Content Experience
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90" data-aos="fade-up" data-aos-delay="200">
              Get exclusive access to premium articles, ad-free reading, and early access to the latest news that matters most.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base" data-aos="fade-up" data-aos-delay="300">
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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4" data-aos="fade-down">
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
        <div className="relative text-center mb-16" data-aos="fade-down">
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
          {subscriptionPlans.map((plan, index) => {
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
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12" data-aos="fade-up" data-aos-delay="300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Selected Plan</h3>
              <p className="text-gray-600 mb-6">
                You've selected the <span className="font-semibold">{selectedPlanData.duration}</span> premium subscription plan.
                This will give you full access to all premium features for {selectedPlanData.duration.toLowerCase()}.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="text-lg font-medium text-gray-900">{selectedPlanData.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-medium text-gray-900">${selectedPlanData.price}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-center mb-6">
                <FaCrown className="text-5xl text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to Upgrade?</h4>
                <p className="text-gray-600">Unlock premium content now</p>
              </div>
              
              <button
                onClick={handleSubscribe}
                disabled={isPremiumUser}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                  isPremiumUser
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `${getColorClasses(selectedPlanData.color).button}`
                }`}
              >
                {isPremiumUser ? 'Already Premium' : 'Subscribe Now'}
              </button>
              
              {isPremiumUser && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  You already have an active subscription
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Premium Benefits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FaNewspaper,
                title: 'Exclusive Content',
                description: 'Access premium articles and features not available to regular users.',
                color: 'text-blue-600 bg-blue-100'
              },
              {
                icon: FaEye,
                title: 'Ad-Free Experience',
                description: 'Enjoy a clean, distraction-free reading experience without ads.',
                color: 'text-green-600 bg-green-100'
              },
              {
                icon: FaBolt,
                title: 'Early Access',
                description: 'Get early access to breaking news and special features.',
                color: 'text-amber-600 bg-amber-100'
              },
              {
                icon: FaHeart,
                title: 'Support Quality Journalism',
                description: 'Your subscription helps fund in-depth reporting and quality content.',
                color: 'text-red-600 bg-red-100'
              },
              {
                icon: FaShieldAlt,
                title: 'Enhanced Security',
                description: 'Premium accounts get additional security features and protections.',
                color: 'text-purple-600 bg-purple-100'
              },
              {
                icon: FaRocket,
                title: 'Faster Performance',
                description: 'Experience optimized loading times and better performance.',
                color: 'text-indigo-600 bg-indigo-100'
              }
            ].map((benefit, index) => (
              <div 
                key={benefit.title} 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                data-aos="zoom-in"
                data-aos-delay={index * 50 + 200}
              >
                <div className={`w-12 h-12 rounded-full ${benefit.color} flex items-center justify-center mb-4`}>
                  <benefit.icon className="text-xl" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {[
              {
                question: 'How does the subscription work?',
                answer: 'Our subscription provides access to premium content for the duration you select. Once subscribed, you can access all premium articles and features until your subscription expires.'
              },
              {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel your subscription at any time. However, we do not provide refunds for partial subscription periods.'
              },
              {
                question: 'Will my subscription auto-renew?',
                answer: 'No, our subscriptions do not auto-renew. You will need to manually renew your subscription when it expires.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards and PayPal. All payments are processed securely through Stripe.'
              },
              {
                question: 'How can I contact support?',
                answer: 'For any questions or issues, please email support@newsdaily.com or use the contact form on our website.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="border-b border-gray-200 last:border-b-0"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-6">
                    <h5 className="text-lg font-medium text-gray-900">{faq.question}</h5>
                    <span className="ml-6 flex-shrink-0 text-gray-500 group-open:rotate-180 transition-transform">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;