"use client"

import { createContext, useContext, useState } from "react"

type StateContextType = {
  toggleMenu: () => void;
  menuActive: boolean;
}

const StateContext = createContext<StateContextType | undefined>(undefined)

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [menuActive, setMenuActive] = useState(false)

  function toggleMenu() {
    setMenuActive(!menuActive);
    //console.log("visibilidade do menu alterada:",menuActive)
  }


  return (
    <StateContext.Provider value={{ toggleMenu, menuActive }}>
      {children}
    </StateContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(StateContext)

  if (!context) {
    throw new Error("useMenu must be used inside StateProvider")
  }

  return context
}