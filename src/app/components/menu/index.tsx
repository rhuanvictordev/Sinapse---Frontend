"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Categories, CategoriesLight, Folder, FolderLight, Persons, PersonsLight, Power, PowerLight, Search, SearchLight, Star, StarLight } from "@/app/components/icons"

export default function Menu() {
  const { logout } = useAuth()
  const pathname = usePathname()
  const menu = useMenu()
  const myTheme = useTheme()


  function linkClass(isActive: boolean) {
    return `py-1 md:rounded-lg flex flex-row gap-2 md:m-1 m-1 md:w-60 cursor-pointer block transition-all duration-300 text-(--foreground) ${isActive ? " bg-(--menu-button-hover)" : " bg-(--menu-button-back) hover:bg-(--menu-button-hover)"}`
  }

  function handleClick() {
    if (window.innerWidth < 768) {
      menu.toggleMenu()
    }
  }

  return (
    <div className="md:w-70 w-full md:fixed h-full md:pt-10 flex flex-col border overflow-hidden" style={{ backgroundColor: myTheme.theme.screenBack}} onClick={handleClick}>
      
      <ul className="font-bold text-lg md:text-xl ml-2 text-left mt-2">
        <li>
          <Link href="/home" className={linkClass(pathname === "/home")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Folder.src : FolderLight.src)} alt="" /> Início</Link>
        </li>

        <li>
          <Link href="/categories" className={linkClass(pathname === "/categories")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Categories.src : CategoriesLight.src)} alt="" /> Categorias</Link>
        </li>
        
        <li>
          <Link href="/find-courses" className={linkClass(pathname === "/find-courses")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Search.src : SearchLight.src)} alt="" /> Encontrar cursos</Link>
        </li>
        
        <li>
          <Link href="/ranking" className={linkClass(pathname === "/ranking")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Star.src : StarLight.src)} alt="" /> Ranking</Link>
        </li>
        
        <li>
          <Link href="/duel" className={linkClass(pathname === "/duel")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Persons.src : PersonsLight.src)} alt="" /> Duelo</Link>
        </li>
        
        <li>
          <Link href="/login" onClick={logout} className={linkClass(pathname === "/login")} style={{color:myTheme.theme.menuButtonFore}}> <img src={(myTheme.mode=="light" ? Power.src : PowerLight.src)} alt="" /> Sair</Link>
        </li>
      </ul>

    </div>
  )
}