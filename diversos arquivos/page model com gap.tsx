"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Trash } from "@/app/components/icons";

type Category = {
  id: number
  name: string
}

export default function CreateCourse() {
  const { user, login, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const myTheme = useTheme();

  useEffect( () => {
    //getCourses();
  }, [])

  async function getCategories(){
    const response = await LocalAPI.get("/categories");
    setCategories(response.data);
  }

  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center border md:h-20 border-black">
      <h2 className="font-bold md:text-2xl mt-3 py-2">Criação de novo curso</h2> {/* titulo externo */}
    </header>
      
    <div className="p-0 h-full"> {/* paddind da area interna */}
        <div className="w-full h-full bg-(--area-back)"> {/* area interna */}
            {/* conteudo inicio */}
            <div className="flex flex-col pt-6 md:gap-8 gap-4">
                <div className="flex md:flex-row flex-col">
                    <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Categoria:</h2>
                    <select className="md:w-200 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10">
                        <option>1</option>
                        <option>2</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col pt-6 md:gap-8 gap-4">
                <div className="flex md:flex-row flex-col">
                    <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Nome:</h2>
                    <select className="md:w-200 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10">
                        <option>1</option>
                        <option>2</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col pt-6 md:gap-8 gap-4">
                <div className="flex md:flex-row flex-col">
                    <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Privado:</h2>
                    <select className="md:w-200 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10">
                        <option>Sim</option>
                        <option>Não</option>
                    </select>
                </div>
            </div>
            {/* conteudo fim */}
        </div>
    </div>
  </div>
)
}