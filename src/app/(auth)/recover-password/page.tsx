"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Link from "next/link"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

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
        
        <h3 className="text-center font-bold text-2xl mb-8">Recuperar Senha</h3>

        <div>
            <p className="font-bold">Email</p>
            <input type="text" className="w-100 h-12 rounded-2xl border pl-2" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
        </div>

        <p className="mt-5 mb-5 w-100">
        Caso o E-mail informado corresponda a um <strong>usuário do Sinapse</strong>, enviaremos um link de confirmação para a alteração da senha.
        </p>

        <div className="flex w-100 justify-between gap-4">
            <button className="bg-[#2C79D0] text-white font-bold rounded-2xl justify-between w-100 pl-6 pr-6 p-2  cursor-pointer hover:bg-blue-400 duration-300"
            id="btnSendCode"
            onClick={sendConfirmation}
            disabled={btnDisabled}
            >
            Enviar código
            </button>
        </div>
            <Link href={"/login"} className="mt-4">Voltar</Link>
    </div>
  )
}