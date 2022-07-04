import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { api } from "../services/api";

type SignInCredentials = {
  name: string;
  password: string;
}

type AuthContextData = {
  token: string;
  login: (data: SignInCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const toast = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem('@Impactodo:token');

    if (token) {
      setIsAuthenticated(true);

      return token;
    }

    return "";
  })

  const login = useCallback(async ({ name, password }: SignInCredentials) => {
    try {
      const response = await api.post("/users/sessions", {
        name,
        password
      });

      console.log(response);

      const { token: responseToken } = response.data;

      setToken(responseToken);

      localStorage.setItem('@Impactodo:token', responseToken);

      setIsAuthenticated(true);
    } catch (error: any) {
      console.log(error);

      if (error.response.status === 403) {
        toast({
          description: "Nome/senha incorretos",
          status: "warning",
          duration: 6000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Oops",
          description: "Erro no servidor",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    };
  }, [toast]);

  function logout() {
    localStorage.removeItem("@Impactodo:token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}