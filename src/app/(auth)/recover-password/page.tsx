"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"
import { useToast } from "@/contexts/ToastContext"
import { sinapseAPI } from "@/services/api"
import { LoadingIcon } from "@/app/components/icons"

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

  return(

    <div>
        <div className="w-screen flex flex-col items-center mt-8 md:mt-40" style={{color:myTheme.theme.foreground}}>
        <div className="">
            <Image src={Logo} alt="logo" width={200}/>
        </div>
        
            <h3 className="text-center font-bold text-xl mb-8">Recuperação de Senha</h3>
            
            <div className="md:w-100 w-80 text-center">
                
                <div className="text-left">
                    <p className="font-bold">Nome de usuário</p>
                    <input type="text" className="w-80 md:w-100 h-12 pl-2 rounded-2xl border" maxLength={42} value={userName} onChange={(event) => setUserName(event.target.value)}/>
                </div>

                <div className="text-left mt-4">
                    <p className="font-bold">E-mail</p>
                    <input type="text" className="w-80 md:w-100 h-12 pl-2 rounded-2xl border" maxLength={42} value={userEmail} onChange={(event) => setUserEmail(event.target.value)}/>
                </div>
                
                <p className="mt-5 mb-5 md:w-100 w-80">
                    Caso o E-mail informado corresponda a um <strong>usuário do Sinapse</strong>, enviaremos os próximos passos para a alteração da senha.
                </p>

                <button className="bg-(--button-back) text-white font-bold rounded-2xl justify-between w-80 pl-6 pr-6 p-2  cursor-pointer hover:bg-(--button-hover) duration-300" onClick={sendConfirmation}> Enviar código </button>

                <div className="text-center mt-8">
                    <Link href={"/login"} className="mt-4 text-center">Voltar</Link>
                </div>
            </div>
        <ThemeIcon/>

    </div>
        <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="bg-(--screen-back) text-(--foreground) w-80 h-40 rounded-lg text-center items-center flex flex-col justify-center">
                <h2 className="font-bold">Processando</h2>
                <img className="mt-4 w-10" src={LoadingIcon.src} alt="" />
                <h2 className="mt-4">Aguarde...</h2>
            </div>
        </div>
    </div>
  )
}