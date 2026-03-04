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

export default function Home() {
  const { user, login, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const myTheme = useTheme();

  useEffect( () => {
    getCategories();
  }, [])

  async function getCategories(){
    const response = await LocalAPI.get("/categories");
    setCategories(response.data);
  }

  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center border md:h-20 border-black">
      <h2 className="font-bold md:text-2xl mt-3 py-2">Categorias</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-xl font-bold">Criar Categoria</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <input type="text" className="border bg-(--input-back) pl-2 text-(--input-fore) font-bold md:w-200 w-fill h-10 rounded-lg md:mb-0 mb-2 md:mt-0 mt-2" maxLength={50}/>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 h-10">CRIAR</button>
                            </div>
                            <div className="md:mt-14 mt-2">
                                <h2 className="font-bold md:text-xl text-lg">Categorias existentes</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border md:mt-0 mt-8">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3">Nome</th>
                                    <th className="text-left border pl-2 md:py-3 w-20">Opções</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                categories.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)"><img src={Trash.src} alt="trash" /></td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
)
}