import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheck, FaCrown, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../../lib/stripe';
import useAuth from '../../Hook/useAuth';
import useAxios from '../../Hook/useAxios';
import Swal from 'sweetalert2';

// Stripe Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

// Payment Form Component that uses Stripe Elements
const PaymentForm = ({ planId, price, duration }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user, checkSubscriptionStatus } = useAuth();
  const axios = useAxios();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US',
    },
  });

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Step 1: Create payment intent on the server
      const { data: paymentIntentData } = await axios.post('/api/create-payment-intent', {
        amount: parseFloat(price),
        email: user.email,
        plan: planId
      });

      if (!paymentIntentData.success) {
        throw new Error(paymentIntentData.message || 'Failed to create payment intent');
      }

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Step 3: Confirm payment on the server and update user subscription
        const { data: confirmationData } = await axios.post('/api/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          email: user.email,
          plan: planId,
          price: parseFloat(price)
        });

        if (confirmationData.success) {
          // Update subscription status in auth context
          await checkSubscriptionStatus(user.email);
          
          // Show success message and redirect
          Swal.fire({
            title: 'Payment Successful!',
            text: 'You now have premium access to all articles.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            navigate('/all-articles');
          });
        } else {
          throw new Error(confirmationData.message || 'Failed to activate subscription');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
      <div className="text-center mb-6">
        <FaCreditCard className="text-4xl text-blue-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
        <p className="text-gray-600">Complete your premium subscription with Stripe</p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        {/* Billing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={billingDetails.name}
              onChange={handleBillingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={billingDetails.email}
              onChange={handleBillingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address.line1"
            value={billingDetails.address.line1}
            onChange={handleBillingChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="address.city"
              value={billingDetails.address.city}
              onChange={handleBillingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              name="address.postal_code"
              value={billingDetails.address.postal_code}
              onChange={handleBillingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10001"
            />
          </div>
        </div>

        {/* Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Error Display */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center text-blue-800">
            <FaShieldAlt className="mr-2" />
            <span className="text-sm font-medium">
              Your payment is secured by Stripe's industry-leading encryption
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
            !stripe || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
          } text-white shadow-lg hover:shadow-xl`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FaLock className="mr-3" />
              Pay ${price} with Stripe
            </div>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Powered by Stripe. Your payment information is secure and encrypted.
          By completing this payment, you agree to our Terms of Service.
        </p>
      </form>
    </div>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract planId from location or URL
  const planData = location.state || {};
  const urlParams = new URLSearchParams(location.search);
  const planId = planData.plan || urlParams.get('plan');

  // TanStack Query for plan details (if planId exists)
  const { data: planDetails, isLoading: planLoading, isError: planError } = useQuery({
    queryKey: ['plan', planId],
    queryFn: async () => {
      if (!planId) return null;
      // Replace with your actual endpoint for plan details
      const axios = useAxios();
      const response = await axios.get(`/api/plans/${planId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch plan details');
    },
    enabled: !!planId
  });

  // Use plan details from query if available, else fallback to location/URL
  const price = planDetails?.price || planData.price || urlParams.get('price');
  const duration = planDetails?.duration || planData.duration || urlParams.get('duration') || planId;

  // Redirect if no plan selected or plan fetch failed
  useEffect(() => {
    if (!planId || !price || planError) {
      navigate('/subscription');
    }
  }, [planId, price, planError, navigate]);

  if (!planId || !price || planLoading) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/subscription')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Back to Subscription
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 h-fit">
              <div className="text-center mb-6">
                <FaCrown className="text-4xl text-amber-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Subscription Plan</span>
                  <span className="font-semibold text-gray-900">{duration}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{duration}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">${price}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${price}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <FaCheck className="mr-2" />
                  What's Included:
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Access to all premium articles</li>
                  <li>• Ad-free reading experience</li>
                  <li>• Priority customer support</li>
                  <li>• Early access to new features</li>
                  <li>• Exclusive newsletters</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <PaymentForm planId={planId} price={price} duration={duration} />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Payment;
