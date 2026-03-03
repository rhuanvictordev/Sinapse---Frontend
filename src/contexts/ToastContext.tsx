"use client"
import { createContext, useContext, useState } from "react"
import Toast from "@/app/components/toast/Toast"

type ToastType = "success" | "error" | "info"

type Toast = {
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext({} as ToastContextType)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)

  function showToast(message: string, type: ToastType = "info", duration = 3000) {
    if(message.length <= 10){
      duration = 2000
    }
    if(message.length >= 10 && message.length <= 20 ){
      duration = 3000
    }
    if(message.length >= 20 && message.length <= 30 ){
      duration = 4000
    }
    if(message.length >= 30 && message.length <= 45 ){
      duration = 5000
    }
    if(message.length >= 45 && message.length <= 70 ){
      duration = 7000
    }
    if(message.length >= 70){
      duration = 15000
    }
    setToast({ message, type, duration })
    setTimeout(() => { setToast(null) }, duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && ( <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={()=>{}}/> )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}