"use client";

import Header from "@/app/components/header";
import Menu from "@/app/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/contexts/StateContext";

export default function AppLayout({children,}: {children: React.ReactNode;}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const menu = useMenu();

  useEffect(() => {
  if (!loading && !user) {
    router.push("/login");
  }
  }, [user, loading]);

  if (loading) return null;
  if (!user) return null;

 return (
  <div className="h-full w-full flex flex-col bg-[#C4D0DA]">
      
    <div className="fixed top-0 left-0 w-full z-50"> {/* Header */}
      <Header />
    </div>

    <div className="md:mt-28 mt-20 flex flex-1 flex-col md:flex-row md:px-10 md:pb-10 gap-4 md:mr-0 mr-2"> {/* Menu + Conteudo */}
      
      <div className={`${menu.menuActive ? "block" : "hidden"} md:block`}> {/* Menu */}
        <Menu />
      </div>

      <div className="flex-1 bg-[#ADC6D5] rounded-2xl p-4 overflow-y-auto ml-2"> {/* Conteudo */}
        {children}
      </div>

    </div>
  </div>
);
}

