"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";

export default function Duel() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Duelo"
  }, [])


  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      
      <User size={80} className="border rounded-full"/>
      
    </div>
  )
}