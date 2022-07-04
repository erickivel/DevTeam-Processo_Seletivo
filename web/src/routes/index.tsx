import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    } />
    <Route path="login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />
    <Route path="register" element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    } />
  </Routes>
);

export default AppRoutes;