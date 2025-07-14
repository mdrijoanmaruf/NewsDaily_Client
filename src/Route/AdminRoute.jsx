import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hook/useAuth';
import WebsiteLoading from '../Shared/Loading/WebsiteLoading';
import useUserRole from '../Hook/useUserRole';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const { userRole, isLoading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <WebsiteLoading />;
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;