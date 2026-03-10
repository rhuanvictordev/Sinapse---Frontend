"use client"
import { useEffect, useState } from "react"
import { ArrowToTop, ArrowToTopLight } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext"

export function ScrollToTopComponent() {
  const [show, setShow] = useState(false)
  const myTheme = useTheme();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <>
      {show && (
        // <div className="fixed bottom-6 right-6 bg-[#000C5C] border-3 border-blue-600 font-bold p-4 w-14 text-black rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition" onClick={scrollToTop}>
          <div className="fixed md:bottom-10 bottom-6 md:right-15 right-7" onClick={scrollToTop}>
          <img src={myTheme.mode == "light" ? ArrowToTopLight.src : ArrowToTop.src} alt="img_scroll_top" className="md:w-12 w-10 rounded-full border-blue-500 border-5 hover:border-green-600 cursor-pointer"/>
        </div>
      )}
    </>
  )
}