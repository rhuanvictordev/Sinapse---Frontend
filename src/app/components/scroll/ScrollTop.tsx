"use client"
import { useEffect, useState } from "react"
import ArrowImg from  "@/../assets/images/arrowToTop.png"

export function ScrollToTopButton() {
  const [show, setShow] = useState(false)

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
          <div className="fixed md:bottom-10 bottom-4 md:right-15 right-4" onClick={scrollToTop}>
          <img src={ArrowImg.src} alt="img_scroll_top" className="md:w-20 w-16 rounded-full border-blue-800 border-8 hover:border-black cursor-pointer"/>
        </div>
      )}
    </>
  )
}