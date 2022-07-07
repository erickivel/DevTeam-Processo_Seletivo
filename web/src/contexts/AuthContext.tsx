import { useToast } from "@chakra-ui/react";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from "react";
import { SubjectData } from "../pages/Home";
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
  getTasks: () => void;
  tasksWithSubjects: SubjectData[];
  setTasksWithSubject: Dispatch<SetStateAction<SubjectData[]>>;
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

  const [tasksWithSubjects, setTasksWithSubject] = useState<SubjectData[]>([]);

  const getTasks = useCallback(() => {
    api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(response)
      setTasksWithSubject(response.data)
    }).catch(() => {
      toast({
        title: "Oops! Erro no servidor",
        description: "Não foi possível obter as tarefas",
        duration: 6000,
        status: "error",
        isClosable: true,
      });
    })
  }, [toast, token]);

  const login = useCallback(async ({ name, password }: SignInCredentials) => {
    try {
      const response = await api.post("/users/sessions", {
        name,
        password
      });

      const { token: responseToken } = response.data;

      setToken(responseToken);

      localStorage.setItem('@Impactodo:token', responseToken);

      setIsAuthenticated(true);
    } catch (error: any) {
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

    toast({
      title: "Usuário deslogado com sucesso",
      status: "success",
      duration: 6000,
      isClosable: true,
    });
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, token, getTasks, setTasksWithSubject, tasksWithSubjects }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}