import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";

type SignInCredentials = {
  name: string;
  password: string;
}

type AuthContextData = {
  token: string;
  signIn: (data: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem('@Impactodo:token');

    if (token) {
      setIsAuthenticated(true);

      return token;
    }

    return "";
  })

  async function signIn({ name, password }: SignInCredentials) {
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
    } catch (error) {
      console.log(error);
      throw new Error("Error on signIn");
    }
  };

  function signOut() {
    localStorage.removeItem("@Impactodo:token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}