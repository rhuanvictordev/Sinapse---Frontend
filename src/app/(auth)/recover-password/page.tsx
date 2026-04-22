"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo_light.png"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"
import { useToast } from "@/contexts/ToastContext"
import { sinapseAPI } from "@/services/api"
import { LoadingIcon, LogoDark, LogoLight } from "@/app/components/icons"

export default function Register(){
const { showToast } = useToast();
const [userEmail, setUserEmail] = useState("");
const [modalVisible, setModalVisible] = useState(false);
const myTheme = useTheme();


useEffect(() => {
    document.title = "Sinapse - Recuperação de Senha"
  }, [])


async function sendConfirmation(){
    if (userEmail.trim() == ""){
        showToast("Informe o email corretamente!", "info")
        return
    }
    
    setModalVisible(true)

    try {
        const response = await sinapseAPI.post("/users/forgotPassword", {email: userEmail});
        if (response.status == 201){
            showToast("Um email foi enviado a sua caixa de entrada! Verifique e siga os próximos passos.")
            setModalVisible(false)
        }else{
            setUserEmail("")
            showToast("Usuário não encontrado!", "info")
            setModalVisible(false)
        }
    } catch (error) {
        showToast("Ocorreu um erro", "info")
        setUserEmail("")
        setModalVisible(false)
    }
    
}


return (
      <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
          <Image className="w-40" src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={200} height={200}/>
        
          <div className=" w-[90%] h-fill pl-8 pr-8 md:w-100 rounded-2xl flex flex-col bg-(--screen-back) shadow-2xl py-4">
            <h2 className="md:text-lg font-bold">Recuperação de Senha</h2>
              <div className="w-full text-left mt-4">
              </div>

              <div className="w-full text-left my-2">
                <p className="font-bold text-sm">E-mail</p>
                <input type="text" className="w-full h-6 text-xs border border-blue-900 rounded-lg bg-(--input-back) pl-2" maxLength={80} value={userEmail} onChange={(event) => setUserEmail(event.target.value)}/>
                <p className="text-sm my-2 text-center">
                    Caso o E-mail informado corresponda a um <strong>usuário do Sinapse</strong>, enviaremos os próximos passos para a alteração da senha.
                </p>
              </div>

            <button className="bg-(--button-back) text-white font-bold w-30 self-center rounded-lg text-sm justify-between h-8 cursor-pointer hover:bg-(--button-hover) duration-300" onClick={sendConfirmation}> Enviar código </button>

            <div className="text-center mt-3">
                <Link href={"/login"} className="text-center text-sm font-bold">Voltar</Link>
            </div>
            

          </div>

              <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="text-(--foreground) bg-(--screen-back) w-80 h-40 rounded-lg text-center items-center flex flex-col justify-center">
                    <h2 className="font-bold">Processando</h2>
                    <img className="mt-4 w-10" src={LoadingIcon.src} alt="" />
                    <h2 className="mt-4">Aguarde...</h2>
                </div>
            </div>

  <ThemeIcon/>

      </div>
  )
}