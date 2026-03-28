"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useProfileMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Power, Settings, Star, Sun } from "../icons"

export default function ProfileMenu() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const profileMenu = useProfileMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `py-1 md:rounded-lg border md:border-0 p-2 flex flex-row gap-2 items-center md:m-1 m-2 rounded-lg md:w-60 cursor-pointer duration-500 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  return (
    <div className="h-full w-full" style={{ backgroundColor: myTheme.theme.screenBack}} onClick={ () => profileMenu.toggleProfileMenu() }>
      <ul className="font-bold bg-(--screen-back) text-lg md:text-xl text-left border md:border-0">
       
        <li>
          <Link href="/profile" className={linkClass(pathname === "/profile")} style={{color:myTheme.theme.menuButtonFore}}> <Settings/> Perfil </Link>
        </li>

        <li onClick={()=>myTheme.toggleTheme()}>
          <h2 className={linkClass(pathname === "")} style={{color:myTheme.theme.menuButtonFore}}> {myTheme.mode == "light" ? <Moon/> : <Sun/>} {myTheme.mode == "dark" ? "Modo Claro" : "Modo Escuro"} </h2>
        </li>
        
        <li>
          <Link href="/login" onClick={logout} className={linkClass(pathname === "/login")} style={{color:myTheme.theme.menuButtonFore}}> <Power/>  Sair</Link>
        </li>

      </ul>
    </div>
  )
}

