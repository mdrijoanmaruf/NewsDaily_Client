import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  FaUsers, 
  FaNewspaper, 
  FaPlus, 
  FaBars, 
  FaTimes, 
  FaTachometerAlt,
  FaUserShield,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa'
import useAuth from '../Hook/useAuth'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logOut } = useAuth()
  const location = useLocation()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: FaTachometerAlt,
      description: 'Overview & Analytics'
    },
    {
      name: 'All Users',
      path: '/dashboard/all-users',
      icon: FaUsers,
      description: 'Manage Users'
    },
    {
      name: 'All Articles',
      path: '/dashboard/all-articles',
      icon: FaNewspaper,
      description: 'Manage Articles'
    },
    {
      name: 'Add Publisher',
      path: '/dashboard/add-publisher',
      icon: FaPlus,
      description: 'Create Publisher'
    }
  ]

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center">
            <FaUserShield className="w-8 h-8 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200 transition-colors duration-200"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={user?.photoURL || 'https://via.placeholder.com/40'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">
                {user?.displayName || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 w-5 h-5 transition-colors duration-200 ${
                    active ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-600'
                  }`} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
            >
              <FaHome className="mr-3 w-4 h-4" />
              Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <FaSignOutAlt className="mr-3 w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaBars className="w-6 h-6" />
              </button>
              <div className="lg:ml-0 ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Dashboard
                </h2>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.displayName || 'Admin'}!
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              
              <div className="flex items-center">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/32'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout