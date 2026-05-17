"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Perfil"
  }, [])

  
  async function updatePassword(){
    
    if (newPassword.trim() == ""){
      showToast("Insira a nova senha","info")
      return
    }
    if (newPassword.trim().length < 8){
      showToast("A senha deve ter pelo menos 8 caracteres!","info")
      return
    }

    const response = await sinapseAPI.patch(`/users/${user?._id}`, {password: newPassword})
    if (response.status == 200){
      showToast("Sua senha foi atualizada com sucesso!","success")
    }else{
      showToast("Ocorreu um erro ao tentar atualizar sua senha!","error")
    }
  }
  

  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      <h1 className="text-2xl mb-10 font-bold mt-2">Perfil do Usuário</h1>
      <User size={80} className="border rounded-full"/>
      {/* <h1 className="text-xl text-gray-400">ID: {user?._id}</h1> */}
      <h1 className="text-lg">Nome: {user?.name}</h1>
      <h1 className="text-lg">E-mail: {user?.email}</h1>
      <h1 className="text-lg">Perguntas respondidas: {user?.answered_questions}</h1>
      <h1 className="text-lg">Pontuação acumulada: {user?.points}</h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-left">Alterar Senha:</h2>
        <input value={newPassword} onChange={ (e)=>setNewPassword(e.target.value) } type="text" className="w-50 rounded-lg bg-(--input-back) border pl-2" />
      </div>
      <button onClick={ ()=>updatePassword() } className="px-2 py-1 bg-(--button-back) text-(--button-fore) rounded-lg hover:bg-(--button-hover) duration-300 cursor-pointer">
        <h2 className="text-sm font-bold">Alterar</h2>
      </button>
      {/* <h1 className="text-xl">Status do Pagamento: {user?.paying == true? "Pendente" : "Pago"}</h1> */}
      {/* <h2>ADM: {user?.is_admin ? "Sim" : "Não"}</h2> */}
      <div className="cursor-pointer flex flex-col text-center" onClick={myTheme.toggleTheme}>
        {/*
        <div className="flex flex-row justify-center items-center gap-4">
        <h2>Alternar Tema:</h2>
        <img src={myTheme.mode == "light"? Moon.src : Sun.src} alt="" className="flex justify-center items-center bg-white rounded-full p-1" />
        </div>
        */}
      </div>
    </div>
  )
}