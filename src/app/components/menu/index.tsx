"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Categories, CategoriesLight, Folder, FolderLight, MenuIcon, Moon, Persons, PersonsLight, Power, PowerLight, Search, SearchLight, Settings, SettingsLight, Star, StarLight, Sun } from "@/app/components/icons"

export default function Menu() {
  const { logout } = useAuth()
  const pathname = usePathname()
  const menu = useMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `py-1 md:rounded-lg border md:border-0 p-2 flex flex-row gap-2 items-center md:m-1 m-2 rounded-lg md:w-60 cursor-pointer duration-500 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  return (
    <div className="h-full w-full" style={{ backgroundColor: myTheme.theme.screenBack}} onClick={ () => menu.toggleMenu() }>
      
      <ul className="font-bold bg-(--screen-back) text-lg md:text-xl text-left border md:border-0">
        
        <li>
          <Link href="/home" className={linkClass(pathname === "/home")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Folder.src : FolderLight.src)} alt="" /> Início</Link>
        </li>

        <li>
          <Link href="/semesters" className={linkClass(pathname === "/semesters")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Categories.src : CategoriesLight.src)} alt="" /> Semestres</Link>
        </li>
        
        <li>
          <Link href="/discipline/find" className={linkClass(pathname === "/discipline/find")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Search.src : SearchLight.src)} alt="" /> Disciplinas</Link>
        </li>
        
        <li>
          <Link href="/ranking" className={linkClass(pathname === "/ranking")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Star.src : StarLight.src)} alt="" /> Ranking</Link>
        </li>
        
        <li>
          <Link href="/duel" className={linkClass(pathname === "/duel")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Persons.src : PersonsLight.src)} alt="" /> Duelo</Link>
        </li>

        <li>
          <Link href="/profile" className={linkClass(pathname === "/profile")} style={{color:myTheme.theme.menuButtonFore}}> <img className="w-6" src={(myTheme.mode=="light" ? Settings.src : SettingsLight.src)} alt="" /> Perfil </Link>
        </li>

        <li onClick={()=>myTheme.toggleTheme()}>
          <h2 className={linkClass(pathname === "")} style={{color:myTheme.theme.menuButtonFore}}> <img className="w-5 bg-white rounded-full p-1" src={(myTheme.mode=="light" ? Moon.src : Sun.src)} alt="" /> {myTheme.mode == "dark" ? "Modo Claro" : "Modo Escuro"} </h2>
        </li>
        
        <li>
          <Link href="/login" onClick={logout} className={linkClass(pathname === "/login")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Power.src : PowerLight.src)} alt="" /> Sair</Link>
        </li>
      </ul>

    </div>
  )
}