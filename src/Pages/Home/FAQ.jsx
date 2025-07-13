import React from 'react';
import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: 'What is NewsDaily?',
    answer: 'NewsDaily is a modern news platform providing trusted news, trending articles, and premium content for subscribers.'
  },
  {
    question: 'How do I become a premium member?',
    answer: 'Simply click the Upgrade to Premium button in the Plans section and follow the subscription process.'
  },
  {
    question: 'Can I access premium articles with a free account?',
    answer: 'No, premium articles are exclusive to premium subscribers. Upgrade to enjoy unlimited access.'
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, we use Stripe and industry-standard encryption to keep your payment details safe.'
  }
];

const FAQ = () => (
  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Frequently Asked Questions</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Everything you need to know about NewsDaily</p>
      </div>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 flex items-start gap-4">
            <FaQuestionCircle className="text-2xl text-blue-500 mt-1" />
            <div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">{faq.question}</div>
              <div className="text-gray-600 mt-2">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FAQ;
