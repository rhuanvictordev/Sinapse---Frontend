"use client";

import Header from "@/app/components/header";
import Menu from "@/app/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu, useProfileMenu } from "@/contexts/StateContext";
import { useTheme } from "@/contexts/ThemeContext";
import bg_light from "@/app/(app)/images/bg_light.png";
import bg_dark from "@/app/(app)/images/bg_dark.png";
import ProfileMenu from "../components/profileMenu";

export default function AppLayout({children,}: {children: React.ReactNode;}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const menu = useMenu();
  const profileMenu = useProfileMenu();
  const myTheme = useTheme();

  useEffect(() => {
  if (!loading && !user) {
    router.push("/login");
  }
  }, [user, loading]);

  if (loading) return null;
  if (!user) return null;

  function closeMenus(){
    if (profileMenu.profileMenuActive){
        profileMenu.toggleProfileMenu()
    }
    if (menu.menuActive){
        menu.toggleMenu()
    }
  }


  return (
    
  <div>
        <div className="fixed top-0 left-0 w-full">
            <Header />  {/* height of header: ( H-20 ) */}
        </div>
        <div className="flex md:flex-row flex-col">
            <div className={`fixed left-0 top-0 h-fill md:w-64 w-full flex transition-transform duration-500 ${menu.menuActive ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="fixed w-full md:h-full h-fill mt-20 flex">
                    <Menu/>
                </div>
            </div>
            <div className={`mt-20 fixed right-0 w-fill flex transition-transform duration-500 ${profileMenu.profileMenuActive ? "translate-x-0" : "translate-x-full"}`}>
                <ProfileMenu/>
            </div>
            <div className="mt-20 w-full h-[calc(100vh-80px)]" onClick={ () => closeMenus() }>
              {children}
            </div>
        </div>
          
    </div>
  )

  
}

