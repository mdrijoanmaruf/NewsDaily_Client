import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../Hook/useAuth';
import useUserRole from '../../Hook/useUserRole';
import Swal from 'sweetalert2';
import { FaCrown } from 'react-icons/fa';

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
                    <div className="relative">
                      <img 
                        src={userPhoto} 
                        alt="Profile" 
                        className={`w-9 h-9 rounded-full border-2 ${
                          hasSubscription 
                            ? 'border-amber-600 ring-2 ring-amber-300' 
                            : 'border-blue-600'
                        }`}
                      />
                      {/* Premium Badge */}
                      {hasSubscription && (
                        <div className="absolute -top-2 -right-2 transform rotate-12 transition-transform hover:rotate-0">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-sm animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-amber-600 to-yellow-400 w-6 h-6 rounded-full flex items-center justify-center border border-amber-700 shadow-lg">
                              <FaCrown className="text-xs text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                        hasSubscription 
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-600 ring-2 ring-amber-300' 
                          : 'bg-blue-600 border-blue-600'
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      {/* Premium Badge */}
                      {hasSubscription && (
                        <div className="absolute -top-2 -right-2 transform rotate-12 transition-transform hover:rotate-0">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-sm animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-amber-600 to-yellow-400 w-6 h-6 rounded-full flex items-center justify-center border border-amber-700 shadow-lg">
                              <FaCrown className="text-xs text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Link>
                
                {/* Premium Status Text */}
                {hasSubscription && (
                  <div className="hidden lg:flex items-center">
                    <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-xs font-bold px-2 py-1 rounded-md border border-amber-200">
                      PREMIUM
                    </span>
                  </div>
                )}
                
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
              
              {/* Admin Links (Mobile) */}
              {adminItems.map((item) => 
                item.condition && (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className={getLinkClasses(item.to, true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
              
              {/* Conditional Links (Mobile) */}
              {conditionalItems.map((item) => 
                item.condition && (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className={getLinkClasses(item.to, true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="px-4">
                  <div className="flex items-center mb-3">
                    {userPhoto ? (
                      <div className="relative">
                        <img 
                          src={userPhoto} 
                          alt="Profile" 
                          className={`w-10 h-10 rounded-full border-2 ${
                            hasSubscription 
                              ? 'border-amber-600 ring-2 ring-amber-300' 
                              : 'border-blue-600'
                          }`}
                        />
                        {/* Premium Badge (Mobile) */}
                        {hasSubscription && (
                          <div className="absolute -top-2 -right-2 transform rotate-12">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-sm animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-amber-600 to-yellow-400 w-6 h-6 rounded-full flex items-center justify-center border border-amber-700 shadow-lg">
                                <FaCrown className="text-xs text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          hasSubscription 
                            ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-600 ring-2 ring-amber-300' 
                            : 'bg-blue-600 border-blue-600'
                        }`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        {/* Premium Badge (Mobile) */}
                        {hasSubscription && (
                          <div className="absolute -top-2 -right-2 transform rotate-12">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-sm animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-amber-600 to-yellow-400 w-6 h-6 rounded-full flex items-center justify-center border border-amber-700 shadow-lg">
                                <FaCrown className="text-xs text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{userName}</div>
                      {user?.email && (
                        <div className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                          {user.email}
                        </div>
                      )}
                      {/* Premium Status Text (Mobile) */}
                      {hasSubscription && (
                        <div className="mt-1">
                          <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent text-xs font-bold">
                            PREMIUM MEMBER
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;