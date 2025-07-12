import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8 animate-float">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl font-bold text-blue-600 opacity-20 select-none">
              404
            </h1>
            
            {/* Newspaper Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 text-white p-6 rounded-full shadow-2xl animate-pulse-gentle">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v12h12V5H4zm2 2h8v2H6V7zm0 4h8v2H6v-2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Sorry, the news article or page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-slide-in-right">
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>

          {/* Browse Articles Button */}
          <Link 
            to="/all-articles" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Browse Articles
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 animate-slide-in-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link 
              to="/add-articles" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Add Articles
            </Link>
            <Link 
              to="/subscription" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Subscription
            </Link>
            <Link 
              to="/my-articles" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              My Articles
            </Link>
            <Link 
              to="/premium-articles" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Premium Articles
            </Link>
          </div>
        </div>

        {/* Fun Error Message */}
        <div className="mt-8 p-4 bg-blue-100 rounded-lg animate-fade-in">
          <p className="text-sm text-blue-800">
            🗞️ Breaking News: This page has gone missing! Our reporters are investigating...
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound