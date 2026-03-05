"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext"

type UserType = {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
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

  // RESTAURA USUARIO AO INICIAR
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const obj = {email: email, password: password}
    try {
      const response = await sinapseAPI.post("/users/login", obj )
      if (response.data){
        const user = response.data
        console.log(user)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
        router.push("/home")
        showToast("Logado com sucesso.", "success")
      }
    } catch (error: any) {
      showToast("Email ou senha incorretos.", "error")
    }
  }


  async function register(name: string, email: string, password: string){
      const obj = {name: name, email: email, password: password}
      try {
        const response = await sinapseAPI.post("/users", obj )
        if (response.data){
          showToast("Conta criada com sucesso. Realize o login", "success")
          router.push("/login")
        }
      } catch (error: any) {
        showToast("Não foi possível criar a conta. Esse email já existe!", "error")
      }
  }

  function logout() {
    localStorage.removeItem("user");
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