"use client"

import Image from "next/image"
import Google from "../../../../assets/images/google.png"
import Link from "next/link"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"
import { Logo, LogoDark, LogoLight } from "@/app/components/icons"

export default function Login(){
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("sinapse@email.com");
  const [password, setPassword] = useState("123");
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



  return (
      <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
          <Image src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={200} height={20}/>
        

          <div className=" w-[90%] h-fill pl-8 pr-8 md:w-130 rounded-2xl flex flex-col bg-(--screen-back) shadow-2xl py-6 my-3">
            
              <div className="w-full text-left md:mb-5 mb-2">
                <p className="font-bold">Email</p>
                <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={email} onChange={(event) => setEmail(event.target.value)}/>
              </div>

              <div className="w-full text-left md:mb-5 mb-2">
                <p className="font-bold">Senha</p>
                <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={password} onChange={(event) => setPassword(event.target.value)}/>
              </div>

              <div className="text-center mt-2 mb-4 text-lg">
                Esqueceu a senha? &nbsp;
                <Link href={"/recover-password"}> <strong className="text-blue-700">Recuperar senha</strong> </Link>
             </div>
             
             <button
              className="ml-2 mr-2 h-10 p-2 bg-(--button-back) rounded-2xl font-bold text-white hover:bg-(--button-hover) hover:text-white hover:border-white transition duration-300 cursor-pointer"
              onClick={validateFields}> Entrar
            </button>

            <div className="mt-14 text-lg">
              Não tem conta? 
              <Link href={"/register"}> &nbsp;
              <strong className="text-blue-700">Registre-se</strong>
              </Link>
            </div>
            

          </div>

                
  <ThemeIcon/>

      </div>
  )
}