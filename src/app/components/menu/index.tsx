"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"

export default function Menu() {
  const { logout } = useAuth()
  const pathname = usePathname()
  const menu = useMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `p-1 md:rounded-lg md:m-1 m-1 md:w-60 cursor-pointer block transition-all duration-300 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  function handleClick() {
    if (window.innerWidth < 768) {
      menu.toggleMenu()
    }
  }

  return (
    <div className="md:w-70 w-full h-full flex flex-col border overflow-hidden" style={{ backgroundColor: myTheme.theme.screenBack}} onClick={handleClick}>
      <ul className="font-bold text-lg md:text-2xl ml-2 text-left mt-2">
        <li><Link href="/home" className={linkClass(pathname === "/home")} style={{color:myTheme.theme.menuButtonFore}}>Início</Link></li>
        <li><Link href="/categories" className={linkClass(pathname === "/categories")} style={{color:myTheme.theme.menuButtonFore}}>Categorias</Link></li>
        <li><Link href="/find-courses" className={linkClass(pathname === "/find-courses")} style={{color:myTheme.theme.menuButtonFore}}>Encontrar cursos</Link></li>
        <li><Link href="/ranking" className={linkClass(pathname === "/ranking")} style={{color:myTheme.theme.menuButtonFore}}>Ranking</Link></li>
        <li><Link href="/duel" className={linkClass(pathname === "/duel")} style={{color:myTheme.theme.menuButtonFore}}>Duelo</Link></li>
        <li><Link href="/login" onClick={logout} className={linkClass(pathname === "/login")} style={{color:myTheme.theme.menuButtonFore}}>Sair</Link></li>
      </ul>
    </div>
  )
}