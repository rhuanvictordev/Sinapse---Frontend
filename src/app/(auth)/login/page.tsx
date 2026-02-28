"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Google from "../../../../assets/images/google.png"
import Link from "next/link"
import { useState } from "react"
import { redirect } from "next/navigation"

export default function Login(){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(){
    if (email == "" || password == ""){
      alert("Preencha os todos os campos!")
      return
    }
    
    console.log(email, password)
    redirect("/home");
  }

  return(
    <div className="bg-[#C4D0DA] w-screen h-screen flex flex-col items-center justify-center">
      
      <div className="mb-10">
        <Image src={Logo} alt="logo" width={200}/>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold">Email</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Senha</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={password} onChange={(event) => setPassword(event.target.value)}/>
          </div>
        </div>

        <div className="text-center mt-6 mb-6">
          Esqueceu a senha? &nbsp;
          <Link href={"/recover-password"}>
            <strong className="text-blue-700">Recuperar senha</strong>
          </Link>
        </div>
      </div>

      <div className="flex w-100 justify-between gap-4">
        
        <button className="flex items-center justify-center gap-3 w-60 h-10 p-2 border rounded-2xl hover:bg-blue-400 hover:text-white duration-300 cursor-pointer hover:text-bold">
          <Image src={Google} alt="google_logo" width={20} height={20} />
          Login com o Google
        </button>

        <button
          className="w-32 h-10 p-2 bg-blue-500 rounded-2xl text-white hover:bg-blue-400 hover:text-white hover:border-white transition duration-300 cursor-pointer"
          onClick={login}
        >
          Entrar
        </button>

      </div>

      <div className="mt-20">
        Não tem conta? 
        <Link href={"/register"}> &nbsp;
          <strong className="text-blue-700">Registre-se</strong>
        </Link>
      </div>

    </div>
  )
}