"use client";

import Image from "next/image";
import UserImage from "../../../../assets/images/user.png";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/contexts/StateContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Logo, MenuIcon, MenuIconLight, Trash } from "@/app/components/icons"
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const menu = useMenu();
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
  }


  return (
    <div className="w-full h-20 border text-center flex md:px-10 px-4" style={{color:myTheme.theme.screenFore, backgroundColor:myTheme.theme.screenBack}}>
        <div className="flex flex-row items-center justify-between w-full">
            <div>
              <button className="p-1 fixed top-2 rounded-full cursor-pointer" onClick={menu.toggleMenu}> 
                <img src={myTheme.mode == "light" ? MenuIcon.src : MenuIconLight.src} alt="menu" className="w-10 mt-2 md:hidden"/>
                <img src={myTheme.mode == "light" ? MenuIcon.src : MenuIconLight.src} alt="menu" className="w-10 mt-3 hidden md:block"/>
                </button>
            </div>
            <div className="cursor-pointer" onClick={()=>handleLogoClick()}>
              <Image src={Logo} alt="logo" className="w-32 ml-10 mt-2 md:ml-34"/>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 cursor-pointer" onClick={()=> router.push("/profile")}>
                <div className="flex-col text-end hidden md:block">
                  <h2>{user.name}</h2>
                  <h2>Nivel {user.points}</h2>
                </div>
                <div>
                  <img className="rounded-full w-12" src={user.image ? user.image : UserImage.src} alt="user_image" />
                </div>
            </div>
        </div>
    </div>
  )
}