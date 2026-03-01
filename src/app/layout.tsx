"use client"

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { StateProvider } from "@/contexts/StateContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-[#C4D0DA]">
        <AuthProvider>
            <StateProvider>
                {children}
            </StateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// NUNCA INSERIR O AUTH CONTEXT AQUI, ESSA É A ROTA BASE