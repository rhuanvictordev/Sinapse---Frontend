"use client";

import Header from "@/app/components/header";
import Menu from "@/app/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/contexts/StateContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ScrollToTopButton } from "../components/scroll/ScrollTop";

export default function AppLayout({children,}: {children: React.ReactNode;}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const menu = useMenu();
  const myTheme = useTheme();

  useEffect(() => {
  if (!loading && !user) {
    router.push("/login");
  }
  }, [user, loading]);

  if (loading) return null;
  if (!user) return null;

 return (
  <div className="h-full w-full flex flex-col" style={{backgroundColor:myTheme.theme.screenBack}}>
      
    <div className="fixed top-0 left-0 w-full"> {/* Header */}
      <Header />
    </div>

    <div className="md:mt-27 mt-19 flex flex-1 flex-col md:flex-row md:pb-10"> {/* Menu + Conteudo */}
      
      <div className={`${menu.menuActive ? "block fixed w-full" : "hidden"} md:block`}> {/* Menu */}
        <Menu />
      </div>

      <div className="flex-1 md:ml-70" style={{backgroundColor:myTheme.theme.screenBack}}> {/* Conteudo */}
        {children}
        <ScrollToTopButton/>
      </div>

    </div>

  </div>
);
}

