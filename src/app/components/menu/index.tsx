"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext";

export default function Menu() {
  const { user, login, logout } = useAuth();

  const pathname = usePathname()
  function linkClass(path: string) {

    const base = "p-6 rounded-2xl m-3 duration-300 w-90 cursor-pointer"
    const active = "bg-[#000C5C]"
    const inactive = "bg-[#2C79D0] hover:bg-[#000C5C]"
    return `${base} ${pathname === path ? active : inactive}`
  }

  return (
    <div className="w-100 h-fill bg-[#ADC6D5] ml-10 flex flex-col rounded-2xl">
      <ul className="text-white font-bold text-2xl ml-2">
        
        <li className="flex flex-col mt-2">
          <Link href="/dashboard">
            <button className={linkClass("/dashboard")}
            onClick={()=>{}}
            >
            Dashboard: {user?.name}
            </button>
          </Link>
        </li>

        <li>
          <Link href="/find-courses">
            <button className={linkClass("/find-courses")}>
              Encontrar cursos
            </button>
          </Link>
        </li>

        <li>
          <Link href="/ranking">
            <button className={linkClass("/ranking")}>
              Ranking
            </button>
          </Link>
        </li>

        <li>
          <Link href="/duel">
            <button className={linkClass("/duel")}>
              Duelo
            </button>
          </Link>
        </li>

        <li>
          <Link href="/posts">
            <button className={linkClass("/posts")}>
              Posts
            </button>
          </Link>
        </li>

        <li>
          <Link href="/">
            <button className={linkClass("/")} onClick={logout}>
              Sair
            </button>
          </Link>
        </li>

      </ul>
    </div>
  )
}