"use client";

import Header from "@/app/components/header";
import Menu from "@/app/components/menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({children,}: {children: React.ReactNode;}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (!loading && !user) {
    router.push("/login");
  }
  }, [user, loading]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#C4D0DA]">
      <Header />
      <div className="flex flex-1 px-10 pb-10 gap-4">
        <Menu />
        <div className="flex-1 bg-white rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

