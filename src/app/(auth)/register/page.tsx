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
      toast.showToast("Preecha todos os campos!", "error")
      return;
    }
    if (password != password2){
      toast.showToast("As senhas não coincidem!", "error")
      return;
    }
    if (!email.includes("@") || !email.includes(".")){
      toast.showToast("Insira um email válido!", "error")
      return
    }
    register(userName, email, password)
  }

  return(
    <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
        <Image src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={170} height={20}/>
        <h3 className="font-bold text-2xl md:mt-5"> Crie sua conta </h3>
      

        <div className=" w-[90%] h-fill pl-8 pr-8 md:w-130 rounded-2xl flex flex-col bg-(--screen-back) shadow-xl py-6 my-3">
          
            <div className="w-full text-left md:mb-5 mb-2">
              <p className="font-bold">Nome de Usuário</p>
              <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={userName} onChange={(event) => setUserName(event.target.value)}/>
              <h3 className="text-left font-bold text-xs md:text-lg text-red-500"> Guarde seu nome de usuário para conseguir recuperar a sua conta! </h3>
            </div>

            <div className="w-full text-left md:mb-5 mb-2">
              <p className="font-bold">Email</p>
              <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>

            <div className="w-full text-left md:mb-5 mb-2">
              <p className="font-bold">Senha</p>
              <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={password} onChange={(event) => setPassord(event.target.value)}/>
            </div>

            <div className="w-full text-left md:mb-8 mb-4">
              <p className="font-bold">Confirme a senha</p>
              <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={password2} onChange={(event) => setPassord2(event.target.value)}/>
            </div>

            <div className="flex flex-col w-full items-center md:gap-8 gap-4">
              <button className=" bg-(--button-back) text-(--button-fore) font-bold md:text-xl rounded-2xl justify-between md:w-40 w-30 md:h-10 h-8 cursor-pointer hover:bg-(--button-hover) duration-300" onClick={createUser}>Criar conta </button>
              <Link href={"/login"} className=" text-center font-bold">Voltar</Link>
            </div>

        </div>

              
<ThemeIcon/>

    </div>
  )
}