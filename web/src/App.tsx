import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { theme } from "./styles/theme";

import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
