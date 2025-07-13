import React from 'react';
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios';

const StripeTest = () => {
  const axiosInstance = useAxios();
  const testStripeConnection = async () => {
    try {
      // Test Stripe publishable key
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      console.log('Stripe Publishable Key:', publishableKey ? 'Set ✅' : 'Missing ❌');

      // Test backend connection using useAxios
      const response = await axiosInstance.post('/api/create-payment-intent', {
        amount: 1,
        email: 'test@test.com',
        plan: 'test'
      });

      const data = response.data;
      console.log('Backend Response:', data);

      if (data.success) {
        alert('✅ Stripe integration is working correctly!');
      } else {
        alert('❌ Stripe integration test failed: ' + data.message);
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Connection test failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaCreditCard className="mr-3 text-blue-600" />
          Stripe Integration Test
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Frontend Stripe Package</span>
            <FaCheckCircle className="text-green-600" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Backend Stripe Package</span>
            <FaCheckCircle className="text-green-600" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Environment Variables</span>
            <span className="text-sm text-gray-600">Check console for details</span>
          </div>
        </div>
        
        <button
          onClick={testStripeConnection}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Test Stripe Connection
        </button>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Setup Instructions:</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Add VITE_STRIPE_PUBLISHABLE_KEY to client .env file</li>
            <li>2. Add STRIPE_SECRET_KEY to server .env file</li>
            <li>3. Get keys from your Stripe Dashboard</li>
            <li>4. Use test keys for development</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StripeTest;
