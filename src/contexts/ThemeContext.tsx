"use client"

import { Moon, Sun } from "@/app/components/icons"
import { createContext, useContext, useEffect, useState } from "react"
import bg_light from "@/app/(app)/images/bg_light.png";
import bg_dark from "@/app/(app)/images/bg_dark.png";

type ThemeMode = "light" | "dark"

type ThemeColors = {
  background: string
  foreground: string
  screenBack: string
  screenFore: string
  areaBack: string
  areaFore: string
  tableHeaderBack: string
  tableHeaderBackHover: string
  tableHeaderFore: string
  tableHeaderForeHover: string
  tableBodyBack: string
  tableBodyBackHover: string
  tableBodyFore: string
  tableBodyForeHover: string
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
  inputBack: string
  inputFore: string
  modalBack: string
  modalFore: string
}

const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  foreground: "#000000",
  screenFore: "#000",
  screenBack: "#aac6e8",
  areaBack: "rgba(180, 180, 180, 0.2)",
  areaFore: "#000000",
  tableHeaderBack: "#f7f7fc",
  tableHeaderBackHover: "#D5D5D5",
  tableHeaderFore: "#7c93cb",
  tableHeaderForeHover: "#0700C5",
  tableBodyBack: "#eff0f7",
  tableBodyBackHover: "#BABABA",
  tableBodyFore: "#121e42",
  tableBodyForeHover: "#000F40",
  cardBack: "#eff2fc",
  cardFore: "#000000",
  cardHover: "#E5E5E5",
  buttonBack: "#0058BC",
  buttonFore: "#FFFFFF",
  buttonHover: "#4B68A6",
  buttonEnter: "#447cdd",
  buttonEnterHover: "#313F5F",
  buttonEdit: "#eae9f3",
  buttonEditHover: "#B8B8B8",
  buttonDelete: "#FF7878",
  buttonDeleteHover: "#f6939d",
  menuButtonBack: "#EEEEF6",
  menuButtonHover: "#BDC1DE",
  menuButtonFore: "#000000",
  selectBack: "#f6f8fe",
  selectFore: "#000",
  success: "#346C49",
  error: "#B10E11",
  warning: "#C99811",
  info: "#2770C2",
  inputBack: "#FFF",
  inputFore: "#000",
  modalBack: "#CADBFF",
  modalFore: "#000000"
}

const darkTheme: ThemeColors = {
  background: "#0F1115",        // quase preto azulado
  foreground: "#F5F5F5",        // branco suave
   screenFore: "#FFF",
  screenBack: "#142b59",
  areaBack: "rgba(23, 47, 94, 0.1)",
  areaFore: "#FFFFFF",
  tableHeaderBack: "#0D3C62",
  tableHeaderBackHover: "#0B263D",
  tableHeaderFore: "#D93C15",
  tableHeaderForeHover: "#D93C15",
  tableBodyBack: "#203445",
  tableBodyBackHover: "#021321",
  tableBodyFore: "#9CEDFF",
  tableBodyForeHover: "#9CEDFF",
  cardBack: "#132543",          // cards mais claros que fundo
  cardFore: "#FFFFFF",
  cardHover: "#2C313C",
  buttonBack: "#3A7BFF",        // azul mais vibrante
  buttonFore: "#FFFFFF",
  buttonHover: "#5A95FF",
  buttonEnter: "#385C9D",       // alinhado com primary
  buttonEnterHover: "#5C7EBB",
  buttonEdit: "#3A3D45",        // neutro escuro
  buttonEditHover: "#80889E",
  buttonDelete: "#b46362",      // vermelho escuro suave
  buttonDeleteHover: "#c37f7e",
  menuButtonBack: "#1A1D24",
  menuButtonHover: "#0A1B8E",
  menuButtonFore: "#FFFFFF",
  selectBack: "#121212",
  selectFore: "#FFFFFF",
  success: "#4FA36C",           // verde mais claro
  error: "#E05252",             // vermelho mais visível
  warning: "#E3B341",           // amarelo quente
  info: "#4C9FFF",               // azul informativo claro
  inputBack: "#121212",
  inputFore: "#FFF",
  modalBack: "#161D2B",
  modalFore: "#000000"
}

type ThemeContextType = {
  theme: ThemeColors
  mode: ThemeMode
  toggleTheme: () => void
  iconColor: string
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [mode, setMode] = useState<ThemeMode | null>(null)

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newMode)
      return newMode
    })
  }

  const iconColor = mode === "light" ? "#000" : "#FFF";
  const theme = mode === "light" ? lightTheme : darkTheme


  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme === "light" || storedTheme === "dark") {
      setMode(storedTheme)
    } else {
      setMode("light")
    }
  }, [])


  useEffect(() => {
    if (!mode) return

    const currentTheme = mode === "light" ? lightTheme : darkTheme

    document.body.style.backgroundImage =
      mode === "light"
        ? `url(${bg_light.src})`
        : `url(${bg_dark.src})`

    document.body.className = "bg-cover bg-center"

    const root = document.documentElement

    root.style.setProperty("--background", currentTheme.background)
    root.style.setProperty("--foreground", currentTheme.foreground)

    root.style.setProperty("--screen-back", currentTheme.screenBack)
    root.style.setProperty("--area-fore", currentTheme.areaFore)
    root.style.setProperty("--area-back", currentTheme.areaBack)
    root.style.setProperty("--theader-back", currentTheme.tableHeaderBack)
    root.style.setProperty("--theader-back-hover", currentTheme.tableHeaderBackHover)
    root.style.setProperty("--theader-fore", currentTheme.tableHeaderFore)
    root.style.setProperty("--theader-fore-hover", currentTheme.tableHeaderForeHover)
    root.style.setProperty("--tbody-back", currentTheme.tableBodyBack)
    root.style.setProperty("--tbody-back-hover", currentTheme.tableBodyBackHover)
    root.style.setProperty("--tbody-fore", currentTheme.tableBodyFore)
    root.style.setProperty("--tbody-fore-hover", currentTheme.tableBodyForeHover)
    root.style.setProperty("--card-back", currentTheme.cardBack)
    root.style.setProperty("--card-fore", currentTheme.cardFore)
    root.style.setProperty("--card-hover", currentTheme.cardHover)
    root.style.setProperty("--button-back", currentTheme.buttonBack)
    root.style.setProperty("--button-fore", currentTheme.buttonFore)
    root.style.setProperty("--button-hover", currentTheme.buttonHover)
    root.style.setProperty("--button-enter", currentTheme.buttonEnter)
    root.style.setProperty("--button-enter-hover", currentTheme.buttonEnterHover)
    root.style.setProperty("--button-edit", currentTheme.buttonEdit)
    root.style.setProperty("--button-edit-hover", currentTheme.buttonEditHover)
    root.style.setProperty("--button-delete", currentTheme.buttonDelete)
    root.style.setProperty("--button-delete-hover", currentTheme.buttonDeleteHover)
    root.style.setProperty("--select-back", currentTheme.selectBack)
    root.style.setProperty("--select-fore", currentTheme.selectFore)
    root.style.setProperty("--success", currentTheme.success)
    root.style.setProperty("--error", currentTheme.error)
    root.style.setProperty("--warning", currentTheme.warning)
    root.style.setProperty("--info", currentTheme.info)
    root.style.setProperty("--menu-button-back", currentTheme.menuButtonBack)
    root.style.setProperty("--menu-button-hover", currentTheme.menuButtonHover)
    root.style.setProperty("--input-back", currentTheme.inputBack)
    root.style.setProperty("--input-fore", currentTheme.inputFore)
    root.style.setProperty("--modal-back", currentTheme.modalBack)
    root.style.setProperty("--modal-fore", currentTheme.modalFore)
    
  }, [mode])

  if (!mode) return null
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, iconColor }}>
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

export function ThemeIcon() {
  const { mode, toggleTheme } = useTheme()
  if (!mode) return null
  return (
    <div className="fixed bottom-4 right-4 w-8 h-8 cursor-pointer" onClick={toggleTheme}>
      {mode === "light" ? <Moon size={22}/> : <Sun size={22}/>}
    </div>
  )
}