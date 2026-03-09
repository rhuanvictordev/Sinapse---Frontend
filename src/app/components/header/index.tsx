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
                <img src={myTheme.mode == "light" ? MenuIcon.src : MenuIconLight.src} alt="menu" className="w-12 mt-2 md:hidden"/>
                <img src={myTheme.mode == "light" ? MenuIcon.src : MenuIconLight.src} alt="menu" className="w-16 hidden md:block"/>
                </button>
            </div>
            <div className="cursor-pointer" onClick={()=>handleLogoClick()}>
              <Image src={Logo} alt="logo" className="w-32 ml-10 mt-2 md:ml-34"/>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 cursor-pointer" onClick={()=> router.push("/profile")}>
                <div className="flex-col text-end hidden md:block">
                  <h2>Administrador</h2>
                  <h2>Nivel 0</h2>
                </div>
                <div>
                  <img className="rounded-full w-12" src={user.image ? user.image : UserImage.src} alt="user_image" />
                </div>
            </div>
        </div>
    </div>
  )

  // return (
  //   <header className="md:pl-10 md:pr-12 md:py-4 justify-between w-full px-4 py-2 ml-2 md:ml-0 border" style={{backgroundColor:myTheme.theme.screenBack}}>
  //     <div className="flex items-center justify-between" style={{color:myTheme.theme.foreground}}>

  //       {/*Toggle Menu icon*/}
  //       <div className="text-2xl md:hidden">
  //         <button className="border-2 pl-2 pr-2" onClick={menu.toggleMenu}> = </button>
  //       </div>

  //       {/* Logo */}
  //       <a href="/home"> 
  //       <Image src={LogoMobile} alt="logo" className="w-40 md:bg md:hidden"/>
  //       <Image src={Logo} alt="logo" className="md:w-50 hidden md:block"/>
  //       </a>

  //       {/* Perfil */}
  //       <a href="/profile">
  //         <div className="flex items-center gap-3 p-2 hover:border duration-300 hover:rounded-3xl">

  //           {/* Nome e nível */}
  //           <div className="text-right">
  //             <p className="font-bold text-xs md:text-2xl"> {user.name} </p>
  //             <p className="font-bold text-xs md:text-base"> Nível {user.answered_questions} </p>
  //           </div>

  //           {/* Imagem */}
  //           <img
  //             src={user.image ? user.image : UserImage.src}
  //             alt="user_image"
  //             className="w-10 h-10 md:w-15 md:h-15 rounded-full"
  //           />
  //         </div>
  //       </a>

  //     </div>
  //   </header>
  // );
}