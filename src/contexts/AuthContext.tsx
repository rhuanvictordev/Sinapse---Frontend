"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";

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
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      const userData = response.data
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      router.push("/home")
    } catch (error: any) {
      console.log("Erro no login:", error.response?.data || error.message)
    }
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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