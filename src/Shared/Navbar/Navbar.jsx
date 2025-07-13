import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../Hook/useAuth';
import useUserRole from '../../Hook/useUserRole';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logOut, isPremium } = useAuth()
  const { userRole, isAdmin, isLoading: roleLoading } = useUserRole();
  
  // Derived states from user context
  const isLoggedIn = !!user // true if user exists
  const hasSubscription = isPremium // Use real-time premium status
  const userPhoto = user?.photoURL || null // Get user photo from auth
  const userName = user?.displayName || user?.email || 'User' // Get user name
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await logOut()
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Logout error:', error)
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem logging you out. Please try again.',
          icon: 'error'
        })
      }
    }
  }

  // Navigation items
  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/add-articles", label: "Add Articles" },
    { to: "/all-articles", label: "All Articles" },
    { to: "/subscription", label: "Subscription" },
    { to: "/my-articles", label: "My Articles" }
  ]

  // Admin only navigation items
  const adminItems = [
    { 
      to: "/dashboard", 
      label: "Dashboard", 
      condition: isAdmin,
      badge: "ADMIN"
    }
  ]

  // Conditional navigation items
  const conditionalItems = [
    // Removed Premium Articles navigation item
  ]

  // Base link styles
  const linkStyles = {
    desktop: "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
    mobile: "block px-3 py-2 rounded-md text-base font-medium"
  }

  // Function to get link classes with active state
  const getLinkClasses = (path, isMobile = false) => {
    const isActive = location.pathname === path;
    const baseClasses = isMobile ? linkStyles.mobile : linkStyles.desktop;
    
    if (isActive) {
      return `${baseClasses} text-blue-600 bg-blue-50 font-semibold`;
    }
    return `${baseClasses} text-gray-700 hover:text-blue-600`;
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v12h12V5H4zm2 2h8v2H6V7zm0 4h8v2H6v-2z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                <span className="text-blue-600">News</span>Daily
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className={getLinkClasses(item.to)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Admin Links */}
            {adminItems.map((item) => 
              item.condition && (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={getLinkClasses(item.to)}
                >
                  {item.label}
                </Link>
              )
            )}
            
            {/* Conditional Links */}
            {conditionalItems.map((item) => 
              item.condition && (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={`${getLinkClasses(item.to)} ${item.badge ? 'relative' : ''}`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* User Profile Link */}
                <Link to="/profile" className="flex items-center space-x-2 relative">
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt="Profile" 
                      className={`w-8 h-8 rounded-full border-2 ${
                        hasSubscription 
                          ? 'border-yellow-400 ring-2 ring-yellow-300' 
                          : 'border-blue-600'
                      }`}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      hasSubscription 
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 border-yellow-400 ring-2 ring-yellow-300' 
                        : 'bg-blue-600 border-blue-600'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                  {/* Premium Badge */}
                  {hasSubscription && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-1.5 py-0.5 rounded-full flex items-center font-bold">
                      👑
                    </div>
                  )}
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={getLinkClasses(item.to, true)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Admin Links for Mobile */}
              {adminItems.map((item) => 
                item.condition && (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className={getLinkClasses(item.to, true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              
              {/* Conditional Links for Mobile */}
              {conditionalItems.map((item) => 
                item.condition && (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className={getLinkClasses(item.to, true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label} {item.badge && '⭐'}
                  </Link>
                )
              )}
              
              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium relative"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {userPhoto ? (
                        <img 
                          src={userPhoto} 
                          alt="Profile" 
                          className={`w-6 h-6 rounded-full border ${
                            hasSubscription 
                              ? 'border-yellow-400 ring-1 ring-yellow-300' 
                              : 'border-blue-600'
                          }`}
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          hasSubscription 
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 border-yellow-400 ring-1 ring-yellow-300' 
                            : 'bg-blue-600 border-blue-600'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                      <span className={hasSubscription ? 'text-amber-700 font-semibold' : ''}>{userName}</span>
                      {/* Premium Badge for Mobile */}
                      {hasSubscription && (
                        <span className="text-yellow-500 text-sm">👑</span>
                      )}
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      to="/login" 
                      className="block text-center text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-base font-medium border border-blue-600 hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block text-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar