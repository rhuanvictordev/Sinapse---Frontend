"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Link from "next/link"
import { useState } from "react"
import { ThemeIcon, useTheme } from "@/contexts/ThemeContext"

export default function Register(){

const [email, setEmail] = useState("");
const [btnDisabled, setbtnDisabled] = useState(false);
const myTheme = useTheme();

function sendConfirmation(){
    if (email == ""){
      alert("Preencha o Email!")
      return
    }

    console.log(email)
    alert("Email enviado, verifique sua caixa de entrada.")
    setEmail("");
    setbtnDisabled(true);
}

  return(

    <div className="w-screen h-screen flex flex-col items-center justify-center" style={{color:myTheme.theme.foreground}}>
        <div className="mb-5">
            <Image src={Logo} alt="logo" width={200}/>
        </div>
        
            <h3 className="text-center font-bold text-2xl mb-8">Recuperação de Senha</h3>
            
            <div className="md:w-100 w-80 text-center">
                <div className="text-left">
                    <p className="font-bold">Email</p>
                    <input type="text" className="w-80 md:w-100 h-12 rounded-2xl border" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
                </div>
                <p className="mt-5 mb-5 md:w-100 w-80">
                    Caso o E-mail informado corresponda a um <strong>usuário do Sinapse</strong>, enviaremos um link de confirmação para a alteração da senha.
                </p>

                <button className="bg-(--button-back) text-white font-bold rounded-2xl justify-between w-80 pl-6 pr-6 p-2  cursor-pointer hover:bg-(--button-hover) duration-300" onClick={sendConfirmation} disabled={btnDisabled}> Enviar código </button>

                <div className="text-center mt-8">
                    <Link href={"/login"} className="mt-4 text-center">Voltar</Link>
                </div>
            </div>
        <ThemeIcon/>
    </div>
  )
}