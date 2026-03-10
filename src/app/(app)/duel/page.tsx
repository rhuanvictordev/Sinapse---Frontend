"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Duel() {
  const { user, login, logout } = useAuth();

  useEffect( () => {
    document.title = "Sinapse - Duelo"
  } )

  return (
  <div className="flex flex-col h-full">
    <header className="h-12 pl-4 flex items-center">
      <h2 className="font-bold text-2xl">Duel</h2>
    </header>
    <div className="bg-white flex-1 rounded-2xl">
    </div>
  </div>
)
}