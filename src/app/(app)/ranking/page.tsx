"use client"
import { useAuth } from "@/contexts/AuthContext";

export default function Ranking() {
  const { user, login, logout } = useAuth();

  return(
    <div>
      <h1 className="text-2xl">Ranking</h1>
      <h1 className="text-2xl">ID: {user?.id}</h1>
      <h1 className="text-2xl">Usuário: {user?.name}</h1>
      <h1 className="text-2xl">Nível: {user?.level}</h1>
    </div>
  )
}