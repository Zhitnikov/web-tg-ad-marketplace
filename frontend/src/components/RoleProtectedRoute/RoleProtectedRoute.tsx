import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

interface RoleProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: ('Company' | 'Channel')[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

