import { Route, Routes } from "react-router-dom";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="signIn" element={<SignIn />} />
    <Route path="signUp" element={<SignUp />} />
  </Routes>
);

export default AppRoutes;