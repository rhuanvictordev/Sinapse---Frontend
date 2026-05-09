"use client"
import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

type ToastType = {
  message: string
  type: "success" | "error" | "info" | "gray"
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastType) {
  const [progress, setProgress] = useState(100)

  const colors = {
    success: "bg-green-700",
    error: "bg-red-700",
    info: "bg-yellow-700",
    gray: "bg-gray-500"
  }

  useEffect(() => {
    setProgress(100)

    const interval = setInterval(() => {
      setProgress((prev) => prev - 100 / (duration / 100))
    }, 100)

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`fixed md:bottom-8 bottom-4 md:right-6 right-2 ${colors[type]} md:w-200 w-[320px] rounded-xl p-4 border-2 hover:border-4 duration-200 text-white`}>
      <p className="font-normal md:mb-4 mb-2">{type=="error" ? "Erro" : type=="info" ? "Aviso" : type== "success"? "Mensagem" : "" }</p>
      <p className="mb-4 font-bold">{message}</p>
      <div className="h-1 bg-white/30 w-full rounded">
        <div className="h-1 bg-white transition-all" style={{ width: `${progress}%` }}/>
      </div>
    </div>
  )
}