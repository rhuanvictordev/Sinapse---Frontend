"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"
import { EyeClosed, EyeOpened, LogoDark, LogoLight } from "@/app/components/icons"

export default function Login(){
  const { login} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const myTheme = useTheme();
  const [eyeOpen, setEyeOpen] = useState(false);

  useEffect(() => {
    document.title = "Sinapse - Login"
  }, [])

  function validateFields(){
    if (email === "" || password === ""){
      showToast("Preencha todos os campos!", "info")
      return
    }

    if (!email.includes("@") || !email.includes(".")){
      showToast("Insira um email válido!", "info")
      return
    }

    login(email, password);
  }

  return (
      <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
          <Image className="w-40" src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={200} height={200}/>
        
          <div className=" w-[90%] h-fill pl-8 pr-8 md:w-100 rounded-2xl flex flex-col bg-(--screen-back) shadow-2xl py-4 mb-0">
            
              <div className="w-full text-left mb-2">
                <p className="font-bold text-sm">Email</p>
                <input type="text" className=" bg-(--input-back) w-full h-8 text-xs border border-blue-900 rounded-lg pl-2" maxLength={80} value={email} onChange={(event) => setEmail(event.target.value)}/>
              </div>

              <div className="w-full text-left mb-2">
                <p className="font-bold text-sm">Senha</p>

                <div className="relative w-full">
                  <input type={eyeOpen ? "text" : "password"} className="w-full h-8 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2 pr-8" maxLength={80} value={password} onChange={(event) => setPassword(event.target.value)} />

                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {
                  eyeOpen ? (
                    <EyeOpened
                    className={`cursor-pointer ${
                      myTheme.mode === "light" ? "text-black" : "text-white"
                    }`}
                    onClick={() => setEyeOpen(false)}
                  />
                                    ) : (
                                      <EyeClosed
                    className={`cursor-pointer ${
                      myTheme.mode === "light" ? "text-black" : "text-white"
                    }`}
                    onClick={() => setEyeOpen(true)}
/>
                  )
                  }
                </div>
                  </div>
              </div>

              <div className="text-center my-2 text-sm">
                Esqueceu a senha? &nbsp;
                <Link href={"/recover-password"}> <strong className="text-blue-700">Recuperar senha</strong> </Link>
             </div>
             
             <button
              className="ml-2 mr-2 my-2 h-8 bg-(--button-back) rounded-lg font-bold text-white hover:bg-(--button-hover) hover:text-white hover:border-white transition duration-300 cursor-pointer"
              onClick={validateFields}>
                <p className="text-sm">Entrar</p>
            </button>

            <div className="mt-5 text-sm">
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