"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Categories, CoursesIcon, Folder, Home, Lamp, MenuIcon, Moon, Persons, Power, Search, Settings, Star, Sun, Users } from "@/app/components/icons"

export default function Menu() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const menu = useMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `py-2 border md:border-0 p-2 flex flex-row gap-3 items-center m-0 cursor-pointer duration-500 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  return (
    <div className="h-full w-full md:w-50" onClick={ () => menu.toggleMenu() }>
      
      <ul className="font-bold text-lg md:text-xl text-left md:h-screen bg-(--menu-button-back)">
        
        <li className="hidden" style={ (user?.type == "Teacher" || user?.type == "Student") ? {display: "block"} : {} }>
          <Link href="/home" className={linkClass(pathname === "/home")} style={{color:myTheme.theme.menuButtonFore}}> <Lamp/> Painel</Link>
        </li>

        <li className="hidden" style={ user?.type == "Admin" ? {display: "block"} : {} }>
          <Link href="/courses" className={linkClass(pathname === "/courses")} style={{color:myTheme.theme.menuButtonFore}}> <CoursesIcon/> Cursos</Link>
        </li>

        {/* <li className="hidden" style={ user?.is_admin == true ? {display: "block"} : {} }>
          <Link href="/semesters" className={linkClass(pathname === "/semesters")} style={{color:myTheme.theme.menuButtonFore}}> <Categories/> Períodos</Link>
        </li> */}

        <li className="hidden" style={ (user?.type == "Student") ? {display: "block"} : {} }>
          <Link href="/discipline/find" className={linkClass(pathname === "/discipline/find")} style={{color:myTheme.theme.menuButtonFore}}> <Search/> <strong className="text-lg">Encontrar Disciplinas</strong></Link>
        </li>

        <li className="hidden" style={ user?.type == "Admin" ? {display: "block"} : {} }>
          <Link href="/users" className={linkClass(pathname === "/users")} style={{color:myTheme.theme.menuButtonFore}}> <Users/> Usuários</Link>
        </li>
        
        <li className="hidden" style={ (user?.type == "Student" || user?.type == "Teacher") ? {display: "block"} : {} }>
          <Link href="/ranking" className={linkClass(pathname === "/ranking")} style={{color:myTheme.theme.menuButtonFore}}> <Star/> Ranking</Link>
        </li>
        
        <li onClick={() => window.location.href = "/duel"} className="hidden" style={ (user?.type == "Student") ? {display: "block"} : {} }>
          <h2 className={linkClass(pathname === "/duel")} style={{color:myTheme.theme.menuButtonFore}}> <Persons/> Duelo</h2>
        </li>
        
      </ul>

    </div>
  )
}