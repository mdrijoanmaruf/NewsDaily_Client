import React from 'react';
import { FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-400 opacity-10 rounded-full blur-2xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-purple-400 to-blue-400 opacity-10 rounded-full blur-2xl -z-10 animate-pulse-slow" />

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-blue-100 max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <FaBan className="text-5xl md:text-6xl text-red-500 drop-shadow-lg" />
          <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">403</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Access Forbidden</h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 text-center max-w-md">
          Sorry, you do not have permission to access this page.<br />
          <span className="text-blue-600 font-semibold">Admin access</span> is required to view this content.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg mb-4"
        >
          Go to Home
        </button>
        <div className="mt-2 text-sm text-gray-500 text-center">
          <p className="mb-2">If you believe this is a mistake or need admin access, please contact our support team.</p>
          <a
            href="mailto:support@newsdaily.com"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            Contact Support
          </a>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800">
            <strong>Tip:</strong> If you recently upgraded your account, try logging out and logging back in.<br />
            For urgent access, reach out to your organization admin or NewsDaily support.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;