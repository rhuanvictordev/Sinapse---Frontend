"use client";

import Header from "@/app/components/header";
import Menu from "@/app/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/contexts/StateContext";
import { useTheme } from "@/contexts/ThemeContext";

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
        <div className="fixed top-0 left-0 w-full">
            <Header />  {/* height of header: ( H-20 ) */}
        </div>
        <div className="flex md:flex-row flex-col">
            <div className={`fixed left-0 top-0 h-fill md:w-64 w-full flex transition-transform duration-500 ${menu.menuActive ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="fixed w-full md:h-full h-fill mt-20 flex">
                    <Menu/>
                </div>
            </div>
            <div className="mt-20 w-full">
              {children}
            </div>
        </div>
          
    </div>
  )

  
}

