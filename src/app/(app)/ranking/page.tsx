"use client"

import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

type Semester = {
  _id: string
  name: string
}

type Discipline = {
    _id: string
    name: string
    semester_id: string
}

export default function Ranking() {
  const { user, login, logout, loading } = useAuth();
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const myTheme = useTheme();
  const { showToast } = useToast();
  const [name, setName] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Semestres"
    if ( !loading && !user?.is_admin){
        router.push("/home")
        showToast("Você não tem permissão para acessar esta página!", "error");
        return
    }
    // getSemesters();
  }, [])

  
  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center md:h-20">
      <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Ranking</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-lg font-bold">Disciplina:</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <select className="bg-(--input-back) text-(--input-fore) font-bold md:w-200 w-fill h-10 rounded-lg">
                                    <option value="">Selecione</option>
                                </select>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 h-10" onClick={()=>{}}>Buscar</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg md:mt-0 mt-8">
                        <table className="w-full h-fill">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left  pl-2 md:py-3">Nome</th>
                                    <th className="text-center md:py-3">Pontos</th>
                                    <th className="text-center md:py-3">Classificação</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                semesters.map((item) => (
                                    <tr key={item._id}>
                                        <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{}}> <Pencil className="mx-auto"/> </td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{}}> <Trash className="mx-auto"/> </td>
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