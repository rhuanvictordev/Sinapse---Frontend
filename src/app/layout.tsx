"use client"

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuStateProvider } from "@/contexts/StateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";


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
            <AuthProvider>
              <MenuStateProvider>
                <ScrollToTopButton/>
                {children}
              </MenuStateProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}