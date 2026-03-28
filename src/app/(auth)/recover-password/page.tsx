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
const [userName, setUserName] = useState("");
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
    if (userName.trim() == ""){
        showToast("Informe o nome de usuário!", "info")
        return
    }
    
    setModalVisible(true)

    try {
        const response = await sinapseAPI.post("/users/forgotPassword", {email: userEmail, name: userName});
        if (response.status == 201){
            showToast("Um email foi enviado a sua caixa de entrada! Verifique e siga os próximos passos.")
            setModalVisible(false)
        }else{
            setUserEmail("")
            setUserName("")
            showToast("Usuário não encontrado!", "info")
            setModalVisible(false)
        }
    } catch (error) {
        showToast("Usuário não encontrado!", "info")
        setUserEmail("")
        setUserName("")
        setModalVisible(false)
    }
    
}


return (
      <div style={{color:myTheme.theme.foreground}} className="items-center text-center justify-center self-center flex flex-col h-screen">
        
          <Image src={myTheme.mode=="light"? LogoLight.src : LogoDark.src} alt="logo" width={170} height={20}/>
        

          <div className=" w-[90%] h-fill pl-8 pr-8 md:w-130 rounded-2xl flex flex-col bg-(--screen-back) shadow-2xl py-6 my-3">
            <h2 className="text-2xl font-bold mb-8">Recuperação de Senha</h2>
              <div className="w-full text-left md:mb-5 mb-2">
                <p className="font-bold">Nome de usuário</p>
                <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={userName} onChange={(event) => setUserName(event.target.value)}/>
              </div>

              <div className="w-full text-left md:mb-5 mb-2">
                <p className="font-bold">E-mail</p>
                <input type="text" className="w-full h-8 md:h-12 border border-blue-900 rounded-2xl bg-(--input-back) pl-2" maxLength={80} value={userEmail} onChange={(event) => setUserEmail(event.target.value)}/>
              </div>

              <p className="mt-5 mb-5 md:w-100 w-80 self-center">
                    Caso o E-mail informado corresponda a um <strong>usuário do Sinapse</strong>, enviaremos os próximos passos para a alteração da senha.
              </p>

            <button className="bg-(--button-back) text-white font-bold rounded-2xl justify-between md:h-12 h-10 cursor-pointer hover:bg-(--button-hover) duration-300" onClick={sendConfirmation}> Enviar código </button>

            <div className="text-center mt-8">
                <Link href={"/login"} className="mt-4 text-center">Voltar</Link>
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