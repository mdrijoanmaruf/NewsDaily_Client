import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrendingArticles from './TrendingArticles'
import Hero from './Hero'
import Statistic from './Statistic'
import AllPublisher from './AllPublisher'
import Plans from './Plans'
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaCrown, FaTimes } from 'react-icons/fa';
import useAuth from '../../Hook/useAuth';

const Home = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
      easing: 'ease-in-out',
    });

    // Only show subscription modal if user is not already premium
    if (!isPremium) {
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 5000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isPremium]);

  const handleSubscribeClick = () => {
    setShowSubscriptionModal(false);
    navigate('/subscription');
  };

  const closeModal = () => {
    setShowSubscriptionModal(false);
  };

  return (
    <div className="relative">
      <div data-aos="fade-up">
        <Hero />
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <TrendingArticles />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <AllPublisher />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <Statistic />
      </div>
      <div data-aos="zoom-in-up" data-aos-delay="400">
        <Plans />
      </div>
      <div data-aos="fade-up" data-aos-delay="500">
        <Testimonials />
      </div>
      <div data-aos="fade-up" data-aos-delay="600">
        <FAQ />
      </div>

      {/* Subscription Promotion Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl"
            data-aos="zoom-in"
            data-aos-duration="300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <FaCrown className="text-3xl text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Unlock exclusive premium content and enjoy an ad-free experience with our premium subscription.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Access to all premium articles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Ad-free reading experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Early access to breaking news</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Starting at just $1 for a trial subscription
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe later
              </button>
              
              <button
                onClick={handleSubscribeClick}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                View Subscription Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home