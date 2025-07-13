import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah Williams',
    role: 'Premium Subscriber',
    text: 'NewsDaily keeps me updated with quality news and zero ads. The premium plan is totally worth it!',
    rating: 5
  },
  {
    name: 'James Lee',
    role: 'Free User',
    text: 'I love the daily news updates and the clean interface. Highly recommended for everyone!',
    rating: 4
  },
  {
    name: 'Ava Patel',
    role: 'Premium Subscriber',
    text: 'The unlimited article access and premium content are a game changer for me.',
    rating: 5
  }
];

const Testimonials = () => (
  <div className="relative bg-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">What Our Users Say</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Real feedback from our readers and subscribers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-blue-50 rounded-2xl p-8 shadow-md flex flex-col items-center text-center">
            <FaQuoteLeft className="text-3xl text-blue-400 mb-4" />
            <p className="text-gray-700 text-lg mb-4">{t.text}</p>
            <div className="flex items-center mb-2">
              {[...Array(t.rating)].map((_, idx) => (
                <FaStar key={idx} className="text-yellow-400" />
              ))}
            </div>
            <div className="font-bold text-blue-700">{t.name}</div>
            <div className="text-sm text-gray-500">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials;
