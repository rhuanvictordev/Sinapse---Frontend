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
      <div className="w-full">
        <h2 className="text-2xl text-left w-full font-bold">Duelo</h2>
      </div>
      <div className="w-full text-(--foreground) bg-(--area-back) h-fill py-4">
          <div className="pl-2 pr-2">
             <h2 className="text-lg text-start py-2 mb-1 font-bold">Disciplina:</h2>
             <select className="w-full bg-(--select-back) h-8 rounded-lg cursor-pointer font-bold">
              <option value="">Lógica de Programação</option>
              <option value="">Selecione</option>
              <option value="">Selecione</option>
             </select>
          </div>

          <div className="pl-2 pr-2">
             <h2 className="text-lg text-start py-2 mb-1 font-bold">Quiz:</h2>
             <select className="w-full bg-(--select-back) h-8 rounded-lg cursor-pointer font-bold">
              <option value="">Teste de Lógica 1</option>
              <option value="">Selecione</option>
              <option value="">Selecione</option>
             </select>
          </div>

          <div className="pl-2 pr-2 mt-6">
             <button className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold">Criar Sala</button>
          </div>
      </div>

      <div className="w-full text-(--foreground) bg-(--area-back) h-fill py-4">
          <div className="w-full h-10">
              <h2 className="font-bold md:text-xl text-lg">Código da Sala: {"AYGU2"}</h2>
          </div>
          <div className="w-full h-fill pb-10 flex flex-col justify-between items-center">
              <div className="flex flex-row md:gap-20 gap-10 text-center mt-10">
                  <div className="justify-center align-middle text-center items-center flex flex-col">
                    <User size={70}/>
                    <h2 className="font-bold">João Carlos</h2>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="font-bold text-3xl">VS</h2>
                  </div>
                  <div className="justify-center align-middle text-center items-center flex flex-col">
                    <User size={70}/>
                    <h2 className="font-bold">Matheus Santos</h2>
                  </div>
              </div>
          </div>

          <div className="pl-2 pr-2 mt-6">
             <button className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold" onClick={()=> router.push("/duel/play/69f655ec21163aa4ba21a060?subject=69f6536621163aa4ba219eae")}>Iniciar Competição</button>
          </div>
      </div>
      
    </div>
  )
}