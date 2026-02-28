"use client"

import Image from "next/image"
import Logo from "../../../../assets/images/logo.png"
import Link from "next/link"
import { useState } from "react"

export default function Register(){

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");
  const [password2, setPassord2] = useState("");

  function register(){
    if (userName == "" || email == "" || password == "" || password2 == ""){
      alert("Preencha todos os campos!");
      return;
    }
    if (password != password2){
      alert("As senhas não coincidem!");
      return;
    }

    console.log(userName, email, password);
  }

  return(
    <div className="bg-[#C4D0DA] w-screen h-screen flex flex-col items-center justify-center">
      
      <div className="mb-5">
        <Image src={Logo} alt="logo" width={200}/>
      </div>
      <h3 className="text-center font-bold text-3xl mb-8">Crie sua conta</h3>
      <div>
        <div className="flex flex-col gap-4">

          <div>
            
            <p className="font-bold">Nome de Usuário</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={userName} onChange={(event) => setUserName(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Email</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={email} onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Senha</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={password} onChange={(event) => setPassord(event.target.value)}/>
          </div>

          <div>
            <p className="font-bold">Confirme a senha</p>
            <input type="text" className="w-100 h-12 bg-gray-300 rounded-2xl border pl-2" maxLength={42} value={password2} onChange={(event) => setPassord2(event.target.value)}/>
          </div>
        </div>
      </div>

      <div className="flex w-100 justify-between gap-4 mt-8">
        <button className="bg-[#2C79D0] text-white font-bold rounded-2xl justify-between w-35 pl-6 pr-6 p-2 ml-32 cursor-pointer hover:bg-blue-400 duration-300"
          onClick={register}>
        Criar conta
        </button>
      </div>
        <Link href={"/login"} className="mt-4">Voltar</Link>
    </div>
  )
}