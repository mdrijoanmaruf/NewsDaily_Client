import React, { useState, useEffect } from 'react';
import useAxios from '../../../Hook/useAxios';
import { FaUserShield, FaEnvelope, FaUsers, FaCrown } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import Swal from 'sweetalert2';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userEmail) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Make Admin?',
        text: `Are you sure you want to make this user an admin?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Make Admin!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const response = await axios.put(`/api/users/${userEmail}/make-admin`);
        
        if (response.data.success) {
          // Update the users state to reflect the role change
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.email === userEmail 
                ? { ...user, role: 'admin', updatedAt: new Date().toISOString() }
                : user
            )
          );
          
          // Show success message
          Swal.fire({
            title: 'Success!',
            text: 'User has been promoted to admin successfully.',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            timerProgressBar: true
          });
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update user role. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleRemoveAdmin = async (userEmail) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Remove Admin Role?',
        text: `Are you sure you want to remove admin privileges from this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Remove Admin!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const response = await axios.put(`/api/users/${userEmail}/remove-admin`);
        
        if (response.data.success) {
          // Update the users state to reflect the role change
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.email === userEmail 
                ? { ...user, role: 'user', updatedAt: new Date().toISOString() }
                : user
            )
          );
          
          // Show success message
          Swal.fire({
            title: 'Success!',
            text: 'Admin role has been removed successfully.',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            timerProgressBar: true
          });
        }
      }
    } catch (error) {
      console.error('Error removing admin role:', error);
      
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove admin role. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-4 shadow-2xl">
              <FaUsers className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Loading Users...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 sm:p-3 rounded-xl shadow-lg w-fit">
              <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                All Users
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage all registered users</p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 border border-blue-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-3 rounded-lg">
                <HiOutlineSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{users.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-3">
            <h2 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
              <FaUserShield className="w-3 h-3 sm:w-4 sm:h-4" />
              User Management
            </h2>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {users.map((user, index) => (
              <div 
                key={user._id} 
                className="border-b border-blue-100 p-4 hover:bg-blue-50 transition-colors duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                        src={user.profileImage}
                        alt={user.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm ${user.profileImage ? 'hidden' : 'flex'}`}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <FaEnvelope className="w-3 h-3 text-blue-400 mr-1 flex-shrink-0" />
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200'
                            : user.role === 'moderator'
                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200'
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                        }`}>
                          {user.role === 'admin' && <FaCrown className="w-3 h-3 mr-1" />}
                          {user.role === 'moderator' && <FaUserShield className="w-3 h-3 mr-1" />}
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleMakeAdmin(user.email)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md w-full"
                          >
                            <FaCrown className="w-3 h-3 mr-1" />
                            Make Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleRemoveAdmin(user.email)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md w-full"
                          >
                            <FaCrown className="w-3 h-3 mr-1" />
                            Remove Admin
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {users.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-blue-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          {user.profileImage ? (
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                              src={user.profileImage}
                              alt={user.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-sm text-xs sm:text-sm ${user.profileImage ? 'hidden' : 'flex'}`}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="w-3 h-3 text-blue-400 mr-2 flex-shrink-0" />
                        <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[150px] lg:max-w-none">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200'
                          : user.role === 'moderator'
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200'
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                      }`}>
                        {user.role === 'admin' && <FaCrown className="w-3 h-3 mr-1" />}
                        {user.role === 'moderator' && <FaUserShield className="w-3 h-3 mr-1" />}
                        <span className="hidden sm:inline">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span>
                        <span className="sm:hidden">{user.role?.charAt(0).toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs font-medium">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(user.email)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <FaCrown className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline ml-1">Make Admin</span>
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleRemoveAdmin(user.email)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <FaCrown className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline ml-1">Remove Admin</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {users.length === 0 && !loading && (
            <div className="text-center py-8 sm:py-10 px-4">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-xs sm:text-sm text-gray-600">No users have been registered yet.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-3 sm:mt-4 text-center text-xs text-gray-500">
          <p>Total {users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;