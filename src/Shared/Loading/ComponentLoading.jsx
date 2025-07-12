import React from 'react'
import { FaNewspaper } from 'react-icons/fa'

const ComponentLoading = ({ 
  size = 'md', 
  text = 'Loading...', 
  showIcon = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
      {/* Animated Loading Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-pulse`}></div>
        
        {/* Spinning Ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin`}></div>
        
        {/* Inner Icon */}
        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FaNewspaper className={`${
              size === 'sm' ? 'w-2 h-2' :
              size === 'md' ? 'w-3 h-3' :
              size === 'lg' ? 'w-4 h-4' :
              'w-6 h-6'
            } text-gray-400 animate-pulse`} />
          </div>
        )}
      </div>

      {/* Loading Text */}
      {text && (
        <div className="mt-4 text-center">
          <p className={`${textSizes[size]} font-medium text-gray-600 animate-pulse`}>
            {text}
          </p>
          
          {/* Animated Dots */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComponentLoading