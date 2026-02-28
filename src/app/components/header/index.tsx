"use client";

import Image from "next/image";
import Logo from "../../../../assets/images/logo_horizontal.png";
import UserImage from "../../../../assets/images/user.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  if (!user){
    return null;
  }

  return (
    <header className="flex pl-10 pr-12 py-2 bg-[#C4D0DA]">
      <div className="flex items-center justify-between w-full mx-auto max-w-7x1">
        <div>
          <a href="/">
            <Image src={Logo} alt="logo_sinapse" />
          </a>
        </div>

        <a href="/profile">
          <div className="flex flex-row gap-3 justify-center p-2 hover:border duration-300 hover:rounded-3xl">
          <div>
            <p className="font-bold text-2xl">{user.name}</p>
            <p className="font-bold text-end">Nível {user.level}</p>
          </div>

          <div>
                <img src={user.image ? user.image : UserImage.src} alt="user_image" className="w-15 h-15 rounded-full"/>
              {/* <Image src={user.image ? user.image : UserImage } alt="user_image" width={60} height={60} className="rounded-full"/> */}
          </div>
        </div>
        </a>
      </div>
    </header>
  );
}