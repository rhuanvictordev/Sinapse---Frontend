"use client"
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { Modal } from "@/app/components/modal/Modal";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Quiz = {
  id: number
  name: string
}

type Semester = {
  id: number
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

  useEffect( () => {
    document.title = "Sinapse - Editar Disciplina"
    getQuizzes();
    getSemesters();
  }, [])

  async function getSemesters(){
    const response = await LocalAPI.get("/categories");
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
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 md:pl-6 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Editar Disciplina</h2>
            <h2 className="font-bold text-lg text-left md:text-left">Banco de dados</h2>
            <h2 className="font-normal text-sl">Código de convite: <strong className="font-bold">{"RA025"}</strong></h2>
            
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="w-fill text-center md:text-left">
                        <div className="flex md:flex-col md:gap-4">
                            <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-lg font-bold">Semestre:</h2>
                                    <select className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        {
                                        semesters.map( (item)=>(
                                            <option key={item.id}>{item.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-lg font-bold">Novo nome:</h2>
                                    <input value={"Banco de dados"} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>
                                <div className="flex md:flex-row md:mr-2 flex-col items-center md:w-100 w-full mb-6 md:mt-0 mt-2 md:justify-end">
                                    <h2 className="text-lg font-bold">Privar disciplina:</h2>
                                    <select className="w-20 md:w-fill mt-2 md:mt-0 bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option>Não</option>
                                        <option>Sim</option>
                                    </select>
                                </div>
                                <div>
                                    <button className="w-40 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{setModalVisible(true)}}>Salvar alterações</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-4 pl-2">
                        <div className="flex w-full justify-between pr-2 text-center items-center mt-16">
                            <h2 className="font-bold md:text-xl text-lg md:mb-2">Quizzes nesta disciplina</h2>
                            <button className="w-35 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{setModalVisible(true)}}>+ Novo Quiz</button>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3">Nome</th>
                                    <th className="text-center border pl-2 md:py-3 w-20">Iniciar</th>
                                    <th className="text-center border pl-2 md:py-3 w-20">Editar</th>
                                    <th className="text-center border pl-2 md:py-3 w-20">Excluir</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                            quizzes.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">▶</td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>router.push("/quiz/edit")}><img src={myTheme.mode == "light"? Pencil.src : PencilLight.src} alt="trash" /></td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"><img src={myTheme.mode == "light"? Trash.src : TrashLight.src} alt="trash" /></td>
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