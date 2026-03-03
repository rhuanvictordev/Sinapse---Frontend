"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeMode = "light" | "dark"

type ThemeColors = {
  background: string
  foreground: string
  screenBack: string
  screenFore: string
  cardBack: string
  cardFore: string
  cardHover: string
  buttonBack: string
  buttonFore: string
  buttonHover: string
  buttonEnter: string
  buttonEnterHover: string
  buttonEdit: string
  buttonEditHover: string
  buttonDelete: string
  buttonDeleteHover: string
  menuButtonBack: string
  menuButtonHover: string
  menuButtonFore: string
  selectBack: string
  selectFore: string
  success: string
  error: string
  warning: string
  info: string
}

const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  foreground: "#000000",
  screenBack: "#EEEEF6",
  screenFore: "#000000",
  cardBack: "#FFFFFF",
  cardFore: "#000000",
  cardHover: "#E5E5E5",
  buttonBack: "#0058BC",
  buttonFore: "#FFFFFF",
  buttonHover: "#4B68A6",
  buttonEnter: "#4B68A6",
  buttonEnterHover: "#313F5F",
  buttonEdit: "#EEEDE7",
  buttonEditHover: "#B8B8B8",
  buttonDelete: "#EEEDE7",
  buttonDeleteHover: "#B8B8B8",
  menuButtonBack: "#EEEEF6",
  menuButtonHover: "#BDC1DE",
  menuButtonFore: "#000000",
  selectBack: "#2C79D0",
  selectFore: "#FFFFFF",
  success: "#346C49",
  error: "#B10E11",
  warning: "#C99811",
  info: "#2770C2"
}

const darkTheme: ThemeColors = {
  background: "#0F1115",        // quase preto azulado
  foreground: "#F5F5F5",        // branco suave
  screenBack: "#1A1D24",        // superfície principal
  screenFore: "#F5F5F5",
  cardBack: "#22252E",          // cards mais claros que fundo
  cardFore: "#FFFFFF",
  cardHover: "#2C313C",
  buttonBack: "#3A7BFF",        // azul mais vibrante
  buttonFore: "#FFFFFF",
  buttonHover: "#5A95FF",
  buttonEnter: "#385C9D",       // alinhado com primary
  buttonEnterHover: "#5C7EBB",
  buttonEdit: "#3A3D45",        // neutro escuro
  buttonEditHover: "#80889E",
  buttonDelete: "#5C1F1F",      // vermelho escuro suave
  buttonDeleteHover: "#952525",
  menuButtonBack: "#1A1D24",
  menuButtonHover: "#0A1B8E",
  menuButtonFore: "#FFFFFF",
  selectBack: "#3A7BFF",
  selectFore: "#FFFFFF",
  success: "#4FA36C",           // verde mais claro
  error: "#E05252",             // vermelho mais visível
  warning: "#E3B341",           // amarelo quente
  info: "#4C9FFF"               // azul informativo claro
}

type ThemeContextType = {
  theme: ThemeColors
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [mode, setMode] = useState<ThemeMode>("light")

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newMode)
      return newMode
    })
  }

  const theme = mode === "light" ? lightTheme : darkTheme

  useEffect(() => {

    const storedTheme = localStorage.getItem("theme")
        if (storedTheme === "light" || storedTheme === "dark") {
      setMode(storedTheme)
    }

    document.documentElement.style.backgroundColor = theme.screenBack
    document.body.style.backgroundColor = theme.screenBack
    
    const root = document.documentElement

root.style.setProperty("--background", theme.background)
root.style.setProperty("--foreground", theme.foreground)
root.style.setProperty("--screen-back", theme.screenBack)
root.style.setProperty("--screen-fore", theme.screenFore)
root.style.setProperty("--card-back", theme.cardBack)
root.style.setProperty("--card-fore", theme.cardFore)
root.style.setProperty("--card-hover", theme.cardHover)
root.style.setProperty("--button-back", theme.buttonBack)
root.style.setProperty("--button-fore", theme.buttonFore)
root.style.setProperty("--button-hover", theme.buttonHover)
root.style.setProperty("--button-enter", theme.buttonEnter)
root.style.setProperty("--button-enter-hover", theme.buttonEnterHover)
root.style.setProperty("--button-edit", theme.buttonEdit)
root.style.setProperty("--button-edit-hover", theme.buttonEditHover)
root.style.setProperty("--button-delete", theme.buttonDelete)
root.style.setProperty("--button-delete-hover", theme.buttonDeleteHover)
root.style.setProperty("--select-back", theme.selectBack)
root.style.setProperty("--select-fore", theme.selectFore)
root.style.setProperty("--success", theme.success)
root.style.setProperty("--error", theme.error)
root.style.setProperty("--warning", theme.warning)
root.style.setProperty("--info", theme.info)
root.style.setProperty("--menu-button-back", theme.menuButtonBack)
root.style.setProperty("--menu-button-hover", theme.menuButtonHover)
    
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      <div className="fixed bottom-10 right-[-15] w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:border hover:bg-green-500" onClick={toggleTheme}></div>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme deve estar dentro do ThemeProvider")
  }
  return context
}