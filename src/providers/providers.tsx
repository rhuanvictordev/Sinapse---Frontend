"use client"

import { AuthProvider } from "@/contexts/AuthContext";
import { MenuStateProvider } from "@/contexts/StateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ScrollToTopComponent } from "@/app/components/scroll/ScrollTop";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MenuStateProvider>
            <ScrollToTopComponent />
            {children}
          </MenuStateProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}