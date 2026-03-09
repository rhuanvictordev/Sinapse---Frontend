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
      <h2 className="font-bold md:text-2xl mt-3 py-2">Detalhes da Disciplina</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2"> 
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="border md:border-0 py-2">
                                <h2 className="text-lg font-bold mt-0 md:pl-4">{"Banco de dados"}</h2>
                                <h2 className="text-sm font-normal mt-2 md:pl-4">{"Primeiro Período"}</h2>
                            </div>
                            <div className="mt-10 ml-4">
                                <h2 className="font-bold md:text-xl text-lg">Quizzes disponíveis</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border mt-2">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3 w-100">Nome</th>
                                    <th className="text-center border md:py-3 w-280">Descrição</th>
                                    <th className="text-center border md:py-3 px-2 w-18">Iniciar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                categories.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-left border pl-2 text-xs py-4 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="text-left border pl-2 text-xs py-4 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{"Descrição personalizada para testar o frontend da aplicação e constar se vale a pena ou não"}</td>
                                        <td className="border text-center text-xs  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">▶</td>
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