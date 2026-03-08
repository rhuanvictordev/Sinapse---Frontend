"use client"

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuStateProvider } from "@/contexts/StateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider>
          <ToastProvider>
              <MenuStateProvider>
                  <AuthProvider>
                      {children}
                  </AuthProvider>
              </MenuStateProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}