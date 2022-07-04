import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: any;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};