"use client"

import { useEffect, useState } from "react"

type Props = {
  active: boolean
  message: string
  textButton: string
  onClose: () => void
}

export function Modal({ active, message, textButton, onClose }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (active) {
      setVisible(true)
    } else {
      const timer = setTimeout(() => {
        setVisible(false)
      }, 500) // tempo da animação
      return () => clearTimeout(timer)
    }
  }, [active])

  if (!active && !visible) return null

  return (
    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-gray-100 md:w-[550px] w-[360px] rounded-2xl p-6 transition-all duration-300 ${active ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        <div className="flex flex-col">
          
          <div className="text-center flex flex-col justify-center min-h-[120px] md:min-h-[200px]">
            <p className="md:text-lg font-light">{message}</p>
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-blue-700 text-white text-sm md:text-lg font-bold px-6 py-2 rounded-xl hover:bg-blue-600 transition cursor-pointer" onClick={onClose}>
              {textButton}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
