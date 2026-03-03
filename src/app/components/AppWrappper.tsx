"use client"

import { useTheme } from "@/contexts/ThemeContext"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text }} className="w-screen h-screen">
      {children}
    </div>
  )
}