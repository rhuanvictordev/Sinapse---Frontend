"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  id: number;
  name: string;
  email: string;
  level?: number;
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

  function login(email: string, password: string) {
    const test = { id: 1, name: "Teste", email: email, level: 99, image: "https://img.freepik.com/fotos-premium/distinto-homem-afro-americano-de-camisola-cinzenta-contra-fundo-laranja_1143378-8127.jpg?w=360" };
    setUser(test);
    localStorage.setItem("user", JSON.stringify(test));
    console.log("Usuário logado, Email: " + email + " Senha: " + password);
    router.push("/home");
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