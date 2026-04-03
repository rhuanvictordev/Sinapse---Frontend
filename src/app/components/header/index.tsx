"use client";

import Image from "next/image";
import UserImage from "../../../../assets/images/user.png";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu, useProfileMenu } from "@/contexts/StateContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { LogoHorizontalDark, LogoHorizontalLight, MenuIcon, Settings, User } from "../icons";

export default function Header() {
  const { user } = useAuth();
  const menu = useMenu();
  const profileMenu = useProfileMenu();
  const myTheme = useTheme();
  const router = useRouter();

  if (!user){
    return null;
  }

  function handleLogoClick(){
      router.push("/home")
      if (menu.menuActive){
        menu.toggleMenu()
      }
      if (profileMenu.profileMenuActive){
        profileMenu.toggleProfileMenu()
      }
  }

  function changeMenu(){
      menu.toggleMenu()
      if (profileMenu.profileMenuActive){
        profileMenu.toggleProfileMenu()
      }
  }

  function changeProfileMenu(){
      profileMenu.toggleProfileMenu()
      if (menu.menuActive){
        menu.toggleMenu()
      }
  }


  return (
    <div className="w-full h-20 text-center flex md:px-10 px-4" style={{color:myTheme.theme.screenFore, backgroundColor:myTheme.theme.screenBack}}>
        <div className="flex flex-row items-center justify-between w-full">
            <div>
              <button className="p-1 fixed top-2 rounded-full cursor-pointer" onClick={()=>changeMenu()}> 
                <MenuIcon color={myTheme.iconColor} size={38} className="bg-(--screen-back) p-1 border border-white shadow-xl mt-2 rounded-lg"/>
                </button>
            </div>
            <div className="cursor-pointer" onClick={()=>handleLogoClick()}>
              <Image src={myTheme.mode=="light" ? LogoHorizontalLight : LogoHorizontalDark} alt="logo" className="w-32 ml-10 mt-2 md:ml-34"/>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 cursor-pointer" onClick={() => changeProfileMenu()}>
                <div className="flex-col text-end hidden md:block">
                  <h2>{user.name}</h2>
                  <h2>Pontos: {user.points}</h2>
                </div>
                <div>
                  <Settings size={38} className="border rounded-lg p-1"/>
                </div>
            </div>
        </div>
    </div>
  )
}