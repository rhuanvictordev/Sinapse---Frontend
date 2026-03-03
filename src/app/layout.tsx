"use client"

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { StateProvider } from "@/contexts/StateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppWrapper } from "./components/AppWrappper";


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
            <StateProvider>
                <AppWrapper>
                  {children}
                </AppWrapper>
            </StateProvider>
          </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}