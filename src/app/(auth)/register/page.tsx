"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo_light.png"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"
import { useToast } from "@/contexts/ToastContext"
import { useAuth } from "@/contexts/AuthContext"
import { LogoDark, LogoLight } from "@/app/components/icons"

export default function Register(){

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");
  const [password2, setPassord2] = useState("");
  const myTheme = useTheme();
  const toast = useToast();
  const { user, login, logout, register } = useAuth();

  useEffect(() => {
      document.title = "Sinapse - Criação de Conta"
    }, [])

  function createUser(){
    if (userName == "" || email == "" || password == "" || password2 == ""){
      toast.showToast("Preecha todos os campos!", "info")
      return;
    }

    if (password.length < 8){
      toast.showToast("A senha deve conter 8 ou mais caracteres!", "info")
      return;
    }

    if (password != password2){
      toast.showToast("As senhas não coincidem!", "info")
      return;
    }
    if (!email.includes("@") || !email.includes(".")){
      toast.showToast("Insira um email válido!", "info")
      return
    }
    register(userName, email, password)
  }

  return(
    <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
        <Image className="w-40" src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={200} height={200}/>
        <h3 className="font-bold text-lg mb-2"> Crie sua conta </h3>
      

        <div className="w-[90%] h-fill pl-8 pr-8 md:w-100 rounded-2xl flex flex-col bg-(--screen-back) shadow-xl py-4">
          
            <div className="w-full text-left">
              <p className="font-bold text-sm">Nome de Usuário</p>
              <input type="text" className="w-full h-6 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2" maxLength={80} value={userName} onChange={(event) => setUserName(event.target.value)}/>
              {/* <h3 className="text-left font-bold text-xs md:text-xs text-red-500"> Guarde seu nome de usuário para conseguir recuperar a sua conta! </h3> */}
            </div>

            <div className="w-full text-left">
              <p className="font-bold text-sm">Email</p>
              <input type="text" className="w-full h-6 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2" maxLength={80} value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>

            <div className="w-full text-left">
              <p className="font-bold text-sm">Senha</p>
              <input type="text" className="w-full h-6 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2" maxLength={80} value={password} onChange={(event) => setPassord(event.target.value)}/>
            </div>

            <div className="w-full text-left">
              <p className="font-bold text-sm">Confirme a senha</p>
              <input type="text" className="w-full h-6 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2" maxLength={80} value={password2} onChange={(event) => setPassord2(event.target.value)}/>
            </div>

            <div className="flex flex-col w-full items-center gap-4 mt-3">
              <button className=" bg-(--button-back) text-(--button-fore) px-6 py-1 font-bold rounded-lg justify-between cursor-pointer hover:bg-(--button-hover) duration-300" onClick={createUser}>
                <p className="text-sm">Criar Conta</p>
              </button>
              <Link href={"/login"} className=" text-center font-bold text-sm">Voltar</Link>
            </div>

        </div>

              
<ThemeIcon/>

    </div>
  )
}