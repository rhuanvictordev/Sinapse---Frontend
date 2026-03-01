"use client";

import Image from "next/image";
import Logo from "../../../../assets/images/logo_horizontal.png";
import UserImage from "../../../../assets/images/user.png";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/contexts/StateContext";

export default function Header() {
  const { user } = useAuth();
  const menu = useMenu();

  if (!user){
    return null;
  }

  return (
    <header className="bg-[#C4D0DA] md:pl-10 md:pr-12 md:py-2 md:w-fill md:justify-between md:w-screen px-4 py-2 border md:border-0">
      <div className="flex items-center justify-between mx-auto">

        {/*Toggle Menu icon*/}
        <div className="text-4xl md:hidden">
          <button className="border-2 pl-3 pr-3" onClick={menu.toggleMenu}>=</button>
        </div>

        {/* Logo */}
        <a href="/home">
          <Image 
            src={Logo} 
            alt="logo_sinapse"
            className="md:w-60 w-38 "
          />
        </a>

        {/* Perfil */}
        <a href="/profile">
          <div className="flex items-center gap-3 p-2 hover:border duration-300 hover:rounded-3xl">

            {/* Nome e nível */}
            <div className="text-right">
              <p className="font-bold text-sm md:text-2xl">
                {user.name}
              </p>
              <p className="font-bold text-xs md:text-base">
                Nível {user.answered_questions}
              </p>
            </div>

            {/* Imagem */}
            <img
              src={user.image ? user.image : UserImage.src}
              alt="user_image"
              className="w-10 h-10 md:w-15 md:h-15 rounded-full"
            />
          </div>
        </a>

      </div>
    </header>
  );
}