"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Categories, CategoriesLight, Folder, FolderLight, Home, MenuIcon, Moon, Persons, PersonsLight, Power, PowerLight, Search, SearchLight, Settings, SettingsLight, Star, StarLight, Sun, Users, UsersLight } from "@/app/components/icons"

export default function Menu() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const menu = useMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `py-1 md:rounded-lg border md:border-0 p-2 flex flex-row gap-2 items-center m-1 cursor-pointer duration-500 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  return (
    <div className="h-full w-full" onClick={ () => menu.toggleMenu() }>
      
      <ul className="font-bold text-lg md:text-xl text-left">
        
        <li>
          <Link href="/home" className={linkClass(pathname === "/home")} style={{color:myTheme.theme.menuButtonFore}}> <Home/> Início</Link>
        </li>

        <li className="hidden" style={ user?.is_admin == true ? {display: "block"} : {} }>
          <Link href="/semesters" className={linkClass(pathname === "/semesters")} style={{color:myTheme.theme.menuButtonFore}}> <Categories/> Semestres</Link>
        </li>

        <li className="hidden" style={ user?.is_admin == true ? {display: "block"} : {} }>
          <Link href="/users" className={linkClass(pathname === "/users")} style={{color:myTheme.theme.menuButtonFore}}> <Users/> Usuários</Link>
        </li>
        
        <li>
          <Link href="/discipline/find" className={linkClass(pathname === "/discipline/find")} style={{color:myTheme.theme.menuButtonFore}}> <Search/> Disciplinas</Link>
        </li>
        
        <li>
          <Link href="/ranking" className={linkClass(pathname === "/ranking")} style={{color:myTheme.theme.menuButtonFore}}> <Star/> Ranking</Link>
        </li>
        
        <li>
          <Link href="/duel" className={linkClass(pathname === "/duel")} style={{color:myTheme.theme.menuButtonFore}}> <Persons/> Duelo</Link>
        </li>
        
      </ul>

    </div>
  )
}