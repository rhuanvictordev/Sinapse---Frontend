"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Link from "next/link"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useToast } from "@/contexts/ToastContext"
import { useAuth } from "@/contexts/AuthContext"

export default function Register(){

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");
  const [password2, setPassord2] = useState("");
  const myTheme = useTheme();
  const toast = useToast();
  const { user, login, logout, register } = useAuth();

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
    <div className="w-full h-full flex flex-col items-center justify-center pt-2" style={{color:myTheme.theme.foreground}}>
      
      <div className="md:mb-5">
        <Image src={Logo} alt="logo" width={200}/>
      </div>

      <h3 className="text-center font-bold text-2xl md:mb-8 mb-4"> Crie sua conta </h3>

      <div className="md:w-100 w-80">
        <div className="flex flex-col gap-4">

          <div className="md:w-100 w-80">
            
            <p className="font-bold">Nome de Usuário</p>
            <input type="text" className="md:w-100  w-80 md:h-12 h-10 rounded-2xl border pl-2" maxLength={42} value={userName} onChange={(event) => setUserName(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Email</p>
            <input type="text" className="md:w-100  w-80 md:h-12 h-10 rounded-2xl border pl-2" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Senha</p>
            <input type="text" className="md:w-100  w-80 md:h-12 h-10  rounded-2xl border pl-2" maxLength={42} value={password} onChange={(event) => setPassord(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Confirme a senha</p>
            <input type="text" className="md:w-100  w-80 md:h-12 h-10  rounded-2xl border pl-2" maxLength={42} value={password2} onChange={(event) => setPassord2(event.target.value)}/>
          </div>
        </div>
      </div>

      <div className="flex md:w-100 w-80 justify-center items-center gap-4 md:mt-8 mt-6 flex-col">
        <button className=" bg-(--button-back) text-(--button-fore) font-bold rounded-2xl justify-between w-35 p-2 cursor-pointer hover:bg-(--button-hover) duration-300" onClick={createUser}>Criar conta </button>
        <Link href={"/login"} className="md:mt-4 mt-2 text-center">Voltar</Link>
      </div>
        
    </div>
  )
}