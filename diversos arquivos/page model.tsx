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
      
    <div className="p-2 bg-gray-400 h-full"> {/* paddind da area interna */}
        <div className="w-full h-full bg-yellow-200"> {/* area interna */}
            {/* conteudo inicio */}
            <div className="flex flex-row bg-blue-400">
                <h2>Categoria:</h2>
                <select>
                    <option>1</option>
                    <option>2</option>
                </select>
            </div>
            {/* conteudo fim */}
        </div>
    </div>
  </div>
)
}