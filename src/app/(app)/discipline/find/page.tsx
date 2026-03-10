"use client"
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Quiz = {
  id: number
  name: string
}

type Semester = {
  _id: string
  name: string
}

export default function Home() {
  const { user, login, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [disciplineName, setDisciplineName] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Encontrar Disciplinas"
    getQuizzes();
    getSemesters();
  }, [])

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters");
    setSemesters(response.data);
  }

  async function getQuizzes(){
    const response = await LocalAPI.get("/quizzes");
    setQuizzes(response.data);
  }

  async function createQuiz(){
    setModalVisible(false)
    toast.showToast("Quiz criado com sucesso!", "success")
    getQuizzes();
    
  }

  return (
  <div>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Encontrar Disciplinas</h2>
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="w-fill text-center md:text-left">
                        <div className="flex md:flex-col md:gap-4">
                            <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Semestre:</h2>
                                    <select value={selectedSemester} onChange={(e)=>setSelectedSemester(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        {
                                        semesters.map( (item)=>(
                                            <option key={item._id}>{item.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Nome:</h2>
                                    <input value={disciplineName} maxLength={120} onChange={(e)=>setDisciplineName(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>

                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Código:</h2>
                                    <input value={disciplineName} maxLength={24} onChange={(e)=>setDisciplineName(e.target.value)} className="md:w-60 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>
                                
                                <div>
                                    <button className="w-40 h-10 mt-2 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{setModalVisible(true)}}>Buscar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-4 pl-2">
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3 w-120">Semestre</th>
                                    <th className="text-center border md:py-3 px-2">Disciplina</th>
                                    <th className="text-center border md:py-3 w-40 px-2">Juntar-se</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                            quizzes.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">Banco de dados</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">▶</td>
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