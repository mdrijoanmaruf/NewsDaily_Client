import React from 'react'
import { FaNewspaper, FaSpinner } from 'react-icons/fa'
import { HiOutlineSparkles } from 'react-icons/hi'

const WebsiteLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            
            {/* Logo Container */}
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <div className="flex items-center space-x-3">
                <HiOutlineSparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                <FaNewspaper className="w-8 h-8 text-purple-600 animate-bounce" />
              </div>
            </div>
          </div>
          
          {/* Brand Text */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NewsDaily
            </h1>
            <p className="text-gray-600 mt-2">Loading your news experience...</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          {/* Spinning Rings */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-b-blue-400 border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>

          {/* Loading Text with Dots */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              <FaSpinner className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-lg font-medium text-gray-700">Loading</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Preparing your dashboard...</p>
        </div>

        {/* Fun Loading Messages */}
        <div className="mt-8">
          <div className="text-sm text-gray-500 animate-pulse">
            <p>🚀 Getting latest news ready for you</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteLoading