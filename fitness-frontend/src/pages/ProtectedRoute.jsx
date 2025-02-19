import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const userRole = userInfo?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/authenticate" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;