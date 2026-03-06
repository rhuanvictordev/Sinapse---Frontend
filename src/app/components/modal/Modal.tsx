"use client"

import { useEffect, useState } from "react"

type Modal = {
  active: boolean
  showInput: boolean
  message: string
  subText: string
  textButton: string
  onClose: () => void
  onConfirm: () => void
}

export function Modal({ active, message, textButton, onClose, onConfirm, showInput, subText }: Modal) {
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [inputShow, setInputShow] = useState(true)
  const [subTextShow, setSubTextShow] = useState(false)

  useEffect(() => {
    if (active) {
      setVisible(true)
      setTimeout(() => { setAnimate(true) }, 10)
      if (!showInput){
        setInputShow(false)
      }
    } else {
      setAnimate(false)
      const timer = setTimeout(() => { setVisible(false) }, 500)
      return () => clearTimeout(timer)
    }
  }, [active])


  if (!visible) return null

  return (
    <div className={`fixed inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-500 ${ animate ? "opacity-100" : "opacity-0" }`}>
      <div className="bg-(--modal-back) rounded-lg md:w-210 w-80 md:h-150 h-90 border-(--foreground) border text-center">
        
        <div className="flex flex-col items-center justify-center">
          
          <p className="md:text-lg text-(--foreground) font-light md:mt-40 mt-10 md:mb-10 mb-4">{message}</p>
          
          {<>
            {
            inputShow && (
              <input type="text" className="bg-(--input-back) text-(--input-fore) md:mb-10 h-10 md:w-200 w-74 rounded-lg pl-2" maxLength={70} />
            )
            }

            {
            subTextShow && (
              <p className="md:text-lg text-(--foreground) font-light md:mt-40 mt-10 md:mb-10 mb-4">{message}</p>
            )
            }
          </>}

          <div className="flex justify-center md:mt-58 mt-47 gap-5">
            <button className="bg-(--button-delete) hover:bg-(--button-delete-hover) text-(--button-fore) text-sm md:text-lg font-bold px-6 py-2 rounded-xl transition cursor-pointer" onClick={onClose}> Cancelar </button>
            <button className="bg-(--button-back) text-(--button-fore) text-sm md:text-lg font-bold px-6 py-2 rounded-xl hover:bg-(--button-hover) transition cursor-pointer" onClick={onConfirm}> {textButton} </button>
          </div>

        </div>

      </div>
    </div>
  )
}