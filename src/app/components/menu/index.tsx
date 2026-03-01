"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useMenu } from "@/contexts/StateContext"

export default function Menu() {
  const { logout } = useAuth()
  const pathname = usePathname()
  const menu = useMenu();

  function linkClass(path: string) {
    const isActive = pathname.startsWith(path)
    const base = "md:p-4 p-4 md:rounded-2xl md:m-3 m-1 duration-300 md:w-60 cursor-pointer block"
    const active = "bg-[#000C5C]"
    const inactive = "bg-[#2C79D0] hover:bg-[#000C5C]"
    return `${base} ${isActive ? active : inactive}`
  }

  return (
    <div className="md:w-70 w-full h-full bg-[#ADC6D5] flex flex-col rounded-2xl overflow-hidden" onClick={menu.toggleMenu}>
      <ul className="text-white font-bold text-2xl ml-2 text-center mt-2">

        <li>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link href="/find-courses" className={linkClass("/find-courses")}>
            Encontrar cursos
          </Link>
        </li>

        <li>
          <Link href="/ranking" className={linkClass("/ranking")}>
            Ranking
          </Link>
        </li>

        <li>
          <Link href="/duel" className={linkClass("/duel")}>
            Duelo
          </Link>
        </li>

        <li>
          <Link
            href="/login"
            onClick={logout}
            className={linkClass("/login")}
          >
            Sair
          </Link>
        </li>

      </ul>
    </div>
  )
}