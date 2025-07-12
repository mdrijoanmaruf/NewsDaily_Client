import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaHome, 
  FaExclamationTriangle,
  FaUsers,
  FaNewspaper,
  FaPlus
} from 'react-icons/fa'

const Dashboard404 = () => {
  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 md:rounded-2xl">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8 animate-float">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl font-bold text-blue-600 opacity-20 select-none">
              404
            </h1>
            
            {/* Dashboard Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 text-white p-6 rounded-full shadow-2xl animate-pulse-gentle">
                <FaTachometerAlt className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Dashboard Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Sorry, the dashboard page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you don't have permission to access it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-slide-in-right">
          {/* Back to Dashboard Button */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <FaTachometerAlt className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <FaHome className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 animate-slide-in-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dashboard Sections
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link 
              to="/dashboard/all-users" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              All Users
            </Link>
            <Link 
              to="/dashboard/all-articles" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              All Articles
            </Link>
            <Link 
              to="/dashboard/add-publisher" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Add Publisher
            </Link>
            <Link 
              to="/dashboard" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Main Dashboard
            </Link>
          </div>
        </div>

        {/* Fun Error Message */}
        <div className="mt-8 p-4 bg-blue-100 rounded-lg animate-fade-in">
          <p className="text-sm text-blue-800">
            ⚡ Admin Alert: This dashboard page is temporarily out of reach! System admins are on it...
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard404