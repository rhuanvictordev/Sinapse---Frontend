"use client"

import { createContext, useContext, useState } from "react"

type StateContextType = {
  toggleMenu: () => void;
  toggleProfileMenu: () => void;
  menuActive: boolean;
  profileMenuActive: boolean;
}

const StateContext = createContext<StateContextType | undefined>(undefined)

export function MenuStateProvider({ children }: { children: React.ReactNode }) {
  const [menuActive, setMenuActive] = useState(false)
  const [profileMenuActive, setProfileMenuActive] = useState(false)

  function toggleMenu() {
    setMenuActive(!menuActive);
  }

  function toggleProfileMenu() {
    setProfileMenuActive(!profileMenuActive);
  }


  return (
    <StateContext.Provider value={{ toggleMenu, menuActive, toggleProfileMenu, profileMenuActive }}>
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

export function useProfileMenu() {
  const context = useContext(StateContext)

  if (!context) {
    throw new Error("useMenu must be used inside StateProvider")
  }

  return context
}