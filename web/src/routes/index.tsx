import { Route, Routes } from "react-router-dom";

import SignIn from "../pages/SignIn";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="signIn" element={<SignIn />} />
  </Routes>
);

export default AppRoutes;