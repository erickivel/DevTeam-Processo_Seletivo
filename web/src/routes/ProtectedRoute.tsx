import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};