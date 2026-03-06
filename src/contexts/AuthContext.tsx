"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext"

type UserType = {
  _id?: string;
  name?: string;
  email?: string;
  paying?: boolean;
  is_admin?: boolean;
  answered_questions?: number;
  points?: number;
  image?: string;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // RESTAURA USUARIO Do local storage
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");

    if (storedUserID && !user) {
      getByID(storedUserID)
    }

    setLoading(false);
  }, []);

  async function getByID(id: string){
    try {
      const token = localStorage.getItem("token")
        if (token){
          const response = await sinapseAPI.get(`/users/${id}`)
            if (response.data){
              setUser(response.data)
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Sessão expirada"
      localStorage.removeItem("token")
      localStorage.removeItem("userID")
      showToast("message", "error")
    }
  }


  async function login(email: string, password: string) {
    try {
      const response = await sinapseAPI.post("/users/login", {email: email, password: password} )
      if (response.data){
        localStorage.setItem("userID", response.data._id)
        localStorage.setItem("token", response.data.token)
        setUser(response.data)
        router.push("/home")
        showToast("Logado com sucesso.", "success")
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao fazer login"
      showToast(message, "error")
    }
  }


  async function register(name: string, email: string, password: string) {
    try {
      const response = await sinapseAPI.post("/users", { name, email, password })
      if (response.data) {
        router.push("/login")
        showToast("Conta criada com sucesso. Realize o login", "success")
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao criar conta"
      showToast(message, "error")
    }
  }

  function logout() {
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}