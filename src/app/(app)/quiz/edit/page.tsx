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
  is_correct: boolean
}

type Ask = {
    id: number
    askAnswers: Answer[]
}

export default function Home() {
  const { showToast } = useToast();
  const { user, login, logout } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [asks, setAsks] = useState<Ask[]>(
    [
        {
        id: 0, 
        askAnswers: [
                {
                    index: 1, 
                    name: "Opcao A", 
                    is_correct: false
                },
                {
                    index: 2, 
                    name: "Opcao B", 
                    is_correct: false
                },
                {
                    index: 3, 
                    name: "Opcao C", 
                    is_correct: true
                }
            ] 
        },
        { 
        id: 1,
        askAnswers: [
                {
                    index: 1, 
                    name: "Opcao A", 
                    is_correct: false
                },
                {
                    index: 2, 
                    name: "Opcao B", 
                    is_correct: false
                },
                {
                    index: 3, 
                    name: "Opcao C", 
                    is_correct: true
                }
            ] 
        },
        { 
        id: 2, 
        askAnswers: [
                {
                    index: 1, 
                    name: "Opcao A", 
                    is_correct: false
                },
                {
                    index: 2, 
                    name: "Opcao B", 
                    is_correct: false
                },
                {
                    index: 3, 
                    name: "Opcao C",
                    is_correct: false
                },
                {
                    index: 4, 
                    name: "Opcao D", 
                    is_correct: true
                }
            ] 
        }
    ]
);
  const [newAnswersToAdd, setNewAnswersToAdd] = useState<Answer[]>([])
  const myTheme = useTheme();
  const [btnAddAskClicked, setBtnAddAskClicked] = useState(false);
  const [newAsk, setNewAsk] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [askType, setAskType] = useState("");
  const [askSelected, setAskSelected] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [quizName, setQuizName] = useState("");
  

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
    if (askSelected >= asks.length){
        showToast("Você já está na última pergunta!", "info")
    }else{
        setAskSelected(askSelected + 1)
    }
}

function previousAsk(){
    if (askSelected < 2){
        showToast("Você já está na primeira pergunta!", "info")
    }else{
        setAskSelected(askSelected - 1)
    }
}

function addAsk(){
    showToast("Adicionando Pergunta ao Quiz", "info")
}


function addAnswer(){
    if (newAnswer.trim() == ""){
        showToast("Adicione o texto da resposta!", "info")
    }else{
        setNewAnswersToAdd(prev => [...prev, {index: prev.length + 1, name: newAnswer.trim(), is_correct: false}])
    }
}

  if (btnAddAskClicked){

    return (
        <div className="w-full h-fill flex flex-col text-center items-center text-(--foreground)">
            <div>
                <h2 className="font-bold md:text-2xl text-lg h-14 justify-center flex flex-col">Adicionar Pergunta:</h2>
            </div>
            <div className="md:w-250 w-full text-left md:text-center">
                <div className="flex md:flex-row flex-col">
                    <h2 className="font-bold md:text-xl text-lg ml-2 md:ml-0">Nome:</h2>
                    <input maxLength={100} value={newAsk} onChange={(e)=>setNewAsk(e.target.value)} type="text" className="bg-(--input-back) font-bold h-10 text-(--input-fore) rounded-lg w-fill md:w-full ml-2 pl-2 mr-2" />
                </div>
                <div className="flex md:flex-row flex-col mt-2">
                    <h2 className="font-bold md:text-xl text-lg ml-2 md:ml-0">Tipo: &nbsp; &nbsp;</h2>
                    <select value={askType} onChange={(e)=> setAskType(e.target.value)} className="bg-(--select-back) font-bold h-10 text-(--select-fore) rounded-lg w-fill md:w-full ml-2 mr-2 cursor-pointer">
                        <option value={""}>Selecione</option>
                        <option value={"MULTIPLE"}>Múltipla Escolha</option>
                        <option value={"BOOLEAN"}>Verdadeiro ou Falso</option>
                    </select>
                </div>
                <div className="flex md:flex-row flex-col mt-4 items-center ml-2 md:ml-0 md:mr-0 mr-2">
                    <h2 className="font-bold md:text-xl text-lg">Resposta:</h2>
                    <input onChange={(e)=>setNewAnswer(e.target.value)} value={newAnswer} maxLength={100} type="text" className="bg-(--input-back) font-bold h-10 pl-2 text-(--input-fore) rounded-lg w-full ml-2 mr-2" />
                    <button className="bg-(--button-back) text-(--button-fore) hover:bg-(--button-hover) duration-300 w-42 md:ml-4 rounded-lg mr-2 h-10 mt-10 md:mt-0 cursor-pointer" onClick={ () => {addAnswer(); setNewAnswer("");} }> Acrescentar </button>
                </div>
                <div className="mt-10 p-2">
                    <h2 className="text-left font-bold mb-2">Respostas:</h2>
                    <table className="w-full h-fill border-collapse">
                        <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                            <tr>
                                <th className="text-center border px-2 md:py-3 w-10">Itens</th>
                                <th className="text-center border md:py-3">Conteúdo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-(--area-back) text-(--area-fore)">
                        {
                        newAnswersToAdd.map((item) => (
                        <tr key={item.index} className="text-left">
                            <td className="text-center border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">{item.is_correct == true ? "V" : "X" }</td>
                            <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                        </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>
                <div className="mt-2 text-center">
                    <h2 className="font-normal text-gray-400">Questões do tipo verdadeiro ou falso não permitem adicionar ou remover respostas.</h2>
                </div>
                <div className="mt-2 text-center pb-10">
                    <button className="bg-(--button-enter) text-(--button-fore) hover:bg-(--button-enter-hover) duration-300 w-50 rounded-lg mr-2 h-10 mt-10 md:mt-0 cursor-pointer" onClick={ () => addAsk() }> + Adicionar Pergunta </button>
                </div>
            </div>
        </div>
    )
  }else {
   return (
    <div>
        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        
            <header className="flex flex-col md:justify-between justify-center border-black md:pl-2 md:mb-4">
                <div className="flex flex-row md:justify-between justify-center">
                    <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                    <h2 className="md:mt-8 mr-20 font-bold hidden md:block">{asks.length} Perguntas</h2>
                </div>
                <div className="flex md:flex-row flex-col md:pr-10 w-full mb-4 md:mb-0">
                    <div className="flex md:flex-row flex-col w-full mb-6">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                        <input value={quizName} onChange={(e)=>setQuizName(e.target.value)} maxLength={200} className="md:w-160 md:ml-4 mb-4 md:mb-0 ml-2 mr-2 md:mr-2 pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                        <button className="md:w-30 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300">Salvar Quiz</button>
                    </div>
                    <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{asks.length} Perguntas</h2>
                    <button className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>setBtnAddAskClicked(true)}>+ Adicionar Pergunta</button>
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
                                asks[askSelected -1]?.askAnswers.map((item) => (
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
  </div>
    )
  }
}