"use client"
import { createContext, useContext, useState, useRef } from "react"
import Toast from "@/app/components/toast/Toast"

type ToastType = "success" | "error" | "info"

type ToastData = {
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext({} as ToastContextType)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function calculateDuration(message: string) {
    const length = message.length
    if (length <= 15) return 900
    if (length <= 30) return 1200
    if (length <= 70) return 2800
    if (length <= 120) return 6800
    return 10000
  }

  function showToast(message: string, type: ToastType = "info", duration?: number) {

    const finalDuration = duration ?? calculateDuration(message)

    // cancela o timer do toast anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // substitui o toast atual
    setToast({ message, type, duration: finalDuration })

    timeoutRef.current = setTimeout(() => {
      setToast(null)
    }, finalDuration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}