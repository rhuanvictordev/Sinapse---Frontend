"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { Modal } from "@/app/components/modal/Modal";

type Answer = {
  id: number
  name: string
}

type Category = {
  id: number
  name: string
}

export default function Home() {
  const { user, login, logout } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [indice, setIndice] = useState(0);

  useEffect( () => {
    getQuizzes();
  }, [])

  async function getQuizzes(){
    const response = await LocalAPI.get("/answers");
    setAnswers(response.data);
  }

  return (
  <div className="">
    <Modal active={modalVisible} message="Nome do Quiz:" textButton="Criar Quiz" onClose={()=>{setModalVisible(false)}} onConfirm={()=>{}}/>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black md:pl-2 md:mb-4">
            <div className="flex flex-row md:justify-between justify-center">
                <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                <h2 className="md:mt-8 mr-20 font-bold hidden md:block">{indice} Perguntas</h2>
            </div>
            <div className="flex md:flex-row flex-col md:pr-10 w-full mb-4 md:mb-0">
                <div className="flex md:flex-row flex-col w-full mb-6">
                    <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                    <input className="md:w-160 md:ml-4 mb-4 md:mb-0 ml-2 mr-2 md:mr-2 md:pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                    <button className="md:w-30 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300">Salvar Quiz</button>
                </div>
                <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{indice} Perguntas</h2>
                <button className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300">+ Adicionar Pergunta</button>
            </div>
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2 text-center">
            <div className="flex flex-col items-center gap-4">
                <h2 className="font-bold mt-4">Pergunta {indice} de {0}</h2>
                <div className="justify-between gap-10 w-40 flex">
                    <button className="w-20 bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) cursor-pointer" onClick={()=> setIndice(indice-1)}>◀</button>
                    <button className="w-20 bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) cursor-pointer" onClick={()=> setIndice(indice+1)}>▶</button>
                </div>
            </div>
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">

                    <div className="flex w-full justify-between pr-2 text-center items-center">
                        <h2 className="font-bold md:text-xl text-lx">Respostas:</h2>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3 w-20">Índice</th>
                                    <th className="text-center border pl-2 md:py-3">Respostas</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                            answers.map((item) => (
                                <tr key={item.id} className="text-left">
                                    <td className="text-center border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">{item.id}</td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
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