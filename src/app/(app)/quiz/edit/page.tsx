"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { Modal } from "@/app/components/modal/Modal";
import { useToast } from "@/contexts/ToastContext";

type Answer = {
  index: number
  name: string
  isCorrect: boolean
}

type Ask = {
    id: number
    name: string
    askAnswers: Answer[]
}

export default function Home() {
  const { showToast } = useToast();
  const { user, login, logout } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [asks, setAsks] = useState<Ask[]>(
    [
        // {
        // id: 1,
        // askAnswers: [
        //         {
        //             index: 0, 
        //             name: "Opcao A", 
        //             isCorrect: false
        //         },
        //         {
        //             index: 1, 
        //             name: "Opcao B", 
        //             isCorrect: false
        //         },
        //         {
        //             index: 2, 
        //             name: "Opcao C",
        //             isCorrect: false
        //         },
        //         {
        //             index: 3, 
        //             name: "Opcao D", 
        //             isCorrect: true
        //         }
        //     ] 
        // }
    ]
);
  let [newAnswersToAdd, setNewAnswersToAdd] = useState<Answer[]>([]);
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newAsk, setNewAsk] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [askType, setAskType] = useState("");
  const [askSelected, setAskSelected] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  let [tempAnswersToAdd, setTempAnswersToAdd] = useState<Answer[]>([]);
  

  useEffect( () => {
    if(asks.length > 0){
        setAskSelected(1)
    }
  }, [])

  function toggleAskType(){
    if(newAsk.trim() == "" || askType == "" || newAnswer.trim() == ""){
        return
    }else{
        addAsk()
    }
}

function nextAsk(){
    if(asks.length == 0){
        showToast("Não há perguntas para exibir!", "info")
        return
    }
    if (askSelected >= asks.length){
        showToast("Você já está na última pergunta!", "info")
    }else{
        setAskSelected(askSelected + 1)
    }
}

function previousAsk(){
    if(asks.length == 0){
        showToast("Não há perguntas para exibir!", "info")
        return
    }
    if (askSelected < 1){
        showToast("Você já está na primeira pergunta!", "info")
    }else{
        setAskSelected(askSelected - 1)
    }
}

function addAsk(){
    setModalVisible(false)
    showToast("Adicionando Pergunta ao Quiz", "info")
    setAsks( prev => [...prev, {id: asks.length + 1, name: newAsk.trim(),askAnswers: newAnswersToAdd}] )
    console.log(asks)
}

function handleShowModal(){
    setAnswers([])
    setNewAsk("")
    setAskType("")
    setNewAnswersToAdd([])
    setTempAnswersToAdd([])
    setModalVisible(true)
}


function addAnswer(){
    if (newAnswer.trim() == ""){
        showToast("Adicione o texto da resposta!", "info")
    }
    else{
        const answer = {index: newAnswersToAdd.length + 1, name: newAnswer.trim(), isCorrect: false}
        setNewAnswersToAdd( prev => [...prev, answer] )
        setNewAnswer("")
        // setNewAnswersToAdd( prev => [...prev, {index: prev.length + 1, name: newAnswer.trim(), isCorrect: false}] )
    }
}

function addDefaultAsks(value: string){
    if (value === "BOOLEAN") {
        setTempAnswersToAdd(newAnswersToAdd)
        const list: Answer[] = [{ index: 0, name: "Verdadeiro", isCorrect: true }, { index: 1, name: "Falso", isCorrect: false }]
        setNewAnswersToAdd(list)
    }
    if (value === "MULTIPLE") {
        setNewAnswersToAdd(tempAnswersToAdd)
        setTempAnswersToAdd([])
    }
}

   return (
    <div className="">
        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        
            <header className="flex flex-col md:justify-between justify-center border-black md:pl-6 md:mb-4">
                <div className="flex flex-row md:justify-between justify-center">
                    <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                    <h2 className="md:mt-8 mr-20 font-bold hidden md:block">{asks.length} Perguntas</h2>
                </div>
                <div className="flex md:flex-row flex-col md:pr-10 w-full mb-4 md:mb-0">
                    <div className="flex md:flex-row flex-col w-full mb-6">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                        <input value={quizName} onChange={(e)=>setQuizName(e.target.value)} maxLength={200} className="md:w-160 md:ml-4 mb-4 md:mb-0 ml-2 mr-2 md:mr-2 pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                        <button className="md:w-50 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300">Salvar Alterações</button>
                    </div>
                    <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{asks.length} Perguntas</h2>
                    <button className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>handleShowModal()}>+ Adicionar Pergunta</button>
                </div>
            </header>
            
            <div className="w-full h-full bg-(--area-back) p-2 text-center">
                <div className="flex flex-col items-center gap-4">
                    <h2 className="font-bold mt-4">Pergunta {askSelected} de {asks.length}</h2>
                    <div className="justify-between gap-10 w-40 flex">
                        <button className="w-20 bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) cursor-pointer" onClick={()=> previousAsk() }>◀</button>
                        <button className="w-20 bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) cursor-pointer" onClick={()=> nextAsk() }>▶</button>
                    </div>
                </div>
                <div className="w-fill h-fill md:px-2">
                    <div className="h-fill">

                        <div className="flex w-full justify-between pr-2 text-center items-center">
                            <h2 className="font-bold md:text-xl text-lx">Respostas:</h2>
                        </div>
                        <div className="w-full h-fill overflow-x-scroll font-bold rounded-lg border">
                            <table className="w-full h-fill border-collapse">
                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                    <tr>
                                        <th className="text-left border pl-2 md:py-3 w-20">Índice</th>
                                        <th className="text-center border pl-2 md:py-3">Respostas</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                asks[askSelected]?.askAnswers.map((item) => (
                                    <tr key={item.index} className="text-left">
                                        <td className="text-center border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">{item.index}</td>
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




        
        <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-240 w-120 md:h-160 h-140 rounded-2xl shadow-xl">
                <div className="mt-2">
                    <h2 className="text-center mb-2 font-bold">Adicionar Pergunta</h2>
                    <div className="ml-2 mr-2 text-left">
                        <h2 className="font-bold">Nome:</h2>
                        <input value={newAsk} onChange={(e)=>setNewAsk(e.target.value)} className="bg-(--input-back) text-(--input-fore) w-full pl-2 h-8 rounded-lg" type="text" />
                        <h2 className="mt-2 font-bold">Tipo da Resposta:</h2>
                        
                        <select value={askType} onChange={(e)=> {setAskType(e.target.value); addDefaultAsks(e.target.value)}} className="w-full h-8 bg-(--select-back) text-(--select-fore) rounded-lg cursor-pointer">
                            <option value="">Selecione</option>
                            <option value={"MULTIPLE"}>Múltipla Escolha</option>
                            <option value={"BOOLEAN"}>Verdadeiro ou Falso</option>
                        </select>

                        {
                        (askType == "MULTIPLE") && (
                            <div className="mt-2">
                                <h2 className="font-bold">Adicionar Opção:</h2>
                                <input onChange={(e)=>setNewAnswer(e.target.value)} value={newAnswer} maxLength={100} className="bg-(--input-back) text-(--input-fore) w-full h-8 pl-2 rounded-lg" type="text" />
                                <button onClick={()=>{addAnswer()}} className="w-full bg-(--button-back) text-(--button-fore) hover:bg-(--button-hover) duration-300 mt-6 rounded-lg h-8 cursor-pointer">Acrescentar</button>
                            <h2 className="mt-4 font-bold">Respostas Adicionadas:</h2>
                            </div>
                            
                        )
                        }
                        

                        {
                        (askType != "") && (
                        <div className="mt-2 w-full md:h-58 h-38 overflow-scroll">
                            <table className="w-full h-fill border-collapse text-xs">
                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                    <tr>
                                        <th className="text-center border w-10">?</th>
                                        <th className="text-center border">Conteúdo</th>
                                        {
                                        (askType == "MULTIPLE") && (
                                            <th className="text-center border w-10">X</th>
                                        )    
                                        }
                                    </tr>
                                </thead>
                                <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                newAnswersToAdd.map((item) => (
                                <tr key={item.index} className="text-left">
                                    <td className="text-center border bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"> <input type="radio" name="answer" checked={correctIndex === item.index} onChange={()=>setCorrectIndex(item.index)} /></td>
                                    <td className="border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                    {
                                    (askType == "MULTIPLE") && (
                                        <td className="border bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) text-center">{"X"}</td>
                                    )    
                                    }
                                </tr>
                                ))
                                }
                                </tbody>
                            </table>  
                        </div>
                        )    
                        }

                        <div className="flex flex-row gap-4">
                            <button onClick={()=>setModalVisible(false)} className="w-full mt-8 bg-blue-600 text-(--button-fore) hover:bg-(--button-hover) duration-300 h-8 rounded-lg cursor-pointer">Cancelar</button>
                            <button onClick={()=>addAsk()} className="w-full mt-8 bg-green-700 text-(--button-fore) hover:bg-(--button-hover) duration-300 h-8 rounded-lg cursor-pointer">Adicionar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>

    )
}