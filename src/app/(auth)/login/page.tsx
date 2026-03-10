"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Google from "../../../../assets/images/google.png"
import Link from "next/link"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext";
import { Modal } from "@/app/components/modal/Modal"
import { useToast } from "@/contexts/ToastContext"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"

export default function Login(){
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("rhuansoliveira1072@gmail.com");
  const [password, setPassword] = useState("Rrr19283.");
  const [modalVisible, setModalVisible] = useState(false);
  const { showToast } = useToast();
  const myTheme = useTheme();


  useEffect(() => {
    document.title = "Sinapse - Login"
  }, [])

  function validateFields(){
    if (email === "" || password === ""){
      showToast("Preencha todos os campos!", "error")
      return
    }

    if (!email.includes("@") || !email.includes(".")){
      showToast("Insira um email válido!", "error")
      return
    }

    login(email, password);
  }

  return(
    <div className="w-screen h-screen flex flex-col items-center justify-center" style={{color:myTheme.theme.foreground}}>
      
      <div>
        <Image src={Logo} alt="logo" width={200}/>
      </div>

      <div className="md:w-100 w-80">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <p className="font-bold">Email</p>
            <input type="text" className="w-full h-12 rounded-2xl border pl-2" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div className="w-full">
            <p className="font-bold">Senha</p>
            <input type="text" className="w-full h-12 rounded-2xl border pl-2" maxLength={42} value={password} onChange={(event) => setPassword(event.target.value)}/>
          </div>
        </div>

        <div className="text-center mt-6 mb-6">
          Esqueceu a senha? &nbsp;
          <Link href={"/recover-password"}>
            <strong className="text-blue-700">Recuperar senha</strong>
          </Link>
        </div>
      </div>

      <div className="flex md:w-100 w-80 justify-between gap-4">
        
        <button className="flex items-center justify-center gap-3 w-60 h-10 p-2 border rounded-2xl hover:bg-blue-400 hover:text-white duration-300 cursor-pointer hover:text-bold">
          <Image src={Google} alt="google_logo" width={20} height={20} />
          Login com o Google
        </button>

        <button
          className="w-32 h-10 p-2 bg-(--button-back) rounded-2xl text-white hover:bg-(--button-hover) hover:text-white hover:border-white transition duration-300 cursor-pointer"
          onClick={validateFields}>
          Entrar
        </button>

      </div>

      <div className="mt-20">
        Não tem conta? 
        <Link href={"/register"}> &nbsp;
          <strong className="text-blue-700">Registre-se</strong>
        </Link>
      </div>
        <ThemeIcon/>
    </div>
  )
}