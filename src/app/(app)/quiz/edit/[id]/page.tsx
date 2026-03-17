"use client"

import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter, useParams } from "next/navigation";

type Answer = {
  id: number
  text: string
  isCorrect: boolean
}

type Question = {
  id: number
  title: string
  type: string
  answers: Answer[]
}

type Quiz = {
  _id: string
  name: string
  description: string
  user_id: string
  questions: []
  categories_ids: []
}

export default function QuizEditPage() {
  const router = useRouter();
  const params = useParams();
  const quizID = params.id;
  const { showToast } = useToast();
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [newQuestion, setNewQuestion] = useState<Question>({id: questions.length, title: "", type: "MULTIPLE",answers: []});
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");

  
useEffect( () => {
  document.title = "Sinapse - Edição de Quiz"
  getQuiz()
}, [])


async function getQuiz(){
  try {
        const response = await sinapseAPI.get(`/quizzes/${quizID}`);
        setQuiz(response.data);
  
      } catch (error) {
          showToast("Erro ao obter detalhes do Quiz","error")
          router.push("/home")
      }
}

function openModal(){
    setNewQuestionText("")
    setNewAnswerText("")
    console.log("Criando nova questão. ID: " + questions.length + 1)

    setNewQuestion({id: questions.length + 1, title: "", type: "", answers: []})
    setModalVisible(true)
}

function removeQuestion() {
  console.log("Removendo Pergunta atual")
}

function nextQuestion(){
    if (questions.length === 0) {
      showToast("Não há perguntas!", "info")
      return
    }

    if (selectedQuestion >= questions.length - 1) {
      showToast("Última pergunta!", "info")
      return
    }

    setSelectedQuestion(prev => prev + 1)
}


function previousQuestion(){
    if (questions.length === 0) {
      showToast("Não há perguntas!", "info")
      return
    }

    if (selectedQuestion === 0) {
      showToast("Primeira pergunta!", "info")
      return
    }

    setSelectedQuestion(selectedQuestion - 1)
}


async function addQuestion() {
  if (newQuestion.title.trim() === "") {
    showToast("Digite o título da pergunta!", "info");
    return;
  }

  if (newQuestion.answers.length === 0) {
    showToast("Adicione respostas!", "info");
    return;
  }

  let correctAnswersCount = 0;

  newQuestion.answers.forEach((answer) => {
    if (answer.isCorrect) {
      correctAnswersCount++;
    }
  });

  if (correctAnswersCount === 0) {
    showToast("Defina a resposta correta!", "info");
    return;
  }

  if (correctAnswersCount > 1 && newQuestion.type !== "MULTIPLE") {
    showToast("Apenas uma resposta pode ser correta!", "info");
    return;
  }

  // pegar posição da correta
  let correctPosition = 0;

  for (let i = 0; i < newQuestion.answers.length; i++) {
    if (newQuestion.answers[i].isCorrect) {
      correctPosition = i + 1; // base 1
      break;
    }
  }

  const answersNames = newQuestion.answers.map(a => a.text);

  const obj = {
    question: newQuestion.title,
    possible_answers: answersNames,
    answer: correctPosition,
    boolean_answer: newQuestion.type === "MULTIPLE" ? false : true
  };

  try {
    const response = await sinapseAPI.post(`/quizzes/question/${quiz!._id}`, obj)
     if (response.status == 201){ 
      showToast("Pergunta adicionada!", "success")
    } 
  } catch (error) {
    showToast("Ocorreu um erro ao tentar adicionar a pergunta ao Quiz", "error")
  }
}


function addAnswer(){
    if (newAnswerText.trim() === "") {
      showToast("Digite o conteúdo da resposta!", "info")
      return
    }else{
    
    let exists = false;
    newQuestion.answers.forEach((answer) => {
      if (answer.text == newAnswerText.trim()){
        showToast("Esta resposta já existe!", "info")
        exists = true
        return
      }
    })
    
    if (!exists){
      setNewQuestion(prev => ({...prev, answers:[...prev.answers, {id: prev.answers.length + 1, text: newAnswerText.trim(), isCorrect: false}]}))
      setNewAnswerText("")
    }
  }
}


function removeAnswer(id: number){
    setNewQuestion(prev => ({...prev, answers: prev.answers.filter(answer => answer.id !== id)}))
}


function setCorrectAnswer(id: number){
    setNewQuestion(prev => ({...prev, answers: prev.answers.map(answer => ({
        ...answer, isCorrect: answer.id == id
    }))}))
}


function toggleQuestionType(type: string) {
  setNewQuestion((prev) => {
  if (type === "BOOLEAN") {
      return {...prev, type: "BOOLEAN",
        answers: 
        [
          { id: 1, text: "Verdadeiro", isCorrect: false },
          { id: 2, text: "Falso", isCorrect: false }
        ]
      }
    }

    if (type === "MULTIPLE") {
      return {...prev, type: "MULTIPLE", answers: []}
    }

    return {...prev, type: "", answers: []}
  })
}


   return (
    <div className="">
        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        
            <header className="flex flex-col md:justify-between justify-center border-black md:pl-6 md:mb-4">
                <div className="flex flex-row md:justify-between justify-center">
                    <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                    <h2 className="md:mt-8 mr-20 font-bold hidden md:block">{questions.length == 1 ? "1 Pergunta" : questions.length + " Perguntas"}</h2>
                </div>
                <div className="flex md:flex-row flex-col md:pr-10 w-full mb-4 md:mb-0">
                    <div className="flex md:flex-row flex-col w-full mb-6">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                        <input value={quiz?.name} className="md:w-160 md:ml-4 ml-2 mr-2 md:mr-2 pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                        <button className="md:w-50 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={ () => console.log(questions) } >Salvar Alterações</button>
                    </div>
                    <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{questions.length == 1 ? "1 Pergunta" : questions.length + " Perguntas"}</h2>
                    <button onClick={()=>setModalVisible(true)} className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" >+ Adicionar Pergunta</button>
                </div>
            </header>
            
            <div className="w-full h-full bg-(--area-back) p-2 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <p className="font-bold">Pergunta {questions.length === 0 ? 0 : selectedQuestion + 1} de {questions.length} </p>
                    <img onClick={() => removeQuestion()} className="w-5 h-5 cursor-pointer" src={myTheme.mode == "light" ? Trash.src : TrashLight.src} alt="alt" />
                  </div>
                    <div className="justify-between gap-2 w-40 flex">
                        <button className="w-20 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) cursor-pointer" onClick={()=> previousQuestion() }>◀</button>
                        <button className="w-20 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) cursor-pointer" onClick={()=> nextQuestion() }>▶</button>
                    </div>
                    <h2 className="font-bold mt-2">{questions.length === 0 ? "" : questions[selectedQuestion].title} </h2>
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
                                        <th className="text-center border py-2 w-10">?</th>
                                        <th className="text-center border py-2">Respostas</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                questions[selectedQuestion]?.answers.map((item) => (
                                    <tr key={item.id} className="text-left">
                                        <td className="text-center border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"> <input type="radio" name={"CorrectAnswerQuestion_" + selectedQuestion} checked={item.isCorrect ? true : false} /> </td>
                                        <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.text}</td>
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


                                {/* MODAL */}

        
        <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-240 w-120 md:h-160 h-140 rounded-2xl shadow-xl">
                <div className="mt-2">
                    <h2 onClick={()=>openModal()} className="text-center mb-2 font-bold">Adicionar Pergunta</h2>
                    <div className="ml-2 mr-2 text-left">
                        <h2 className="font-bold">Nome:</h2>
                        <input value={newQuestion.title} onChange={ (e)=> setNewQuestion(prev => ({...prev, title: e.target.value})) }  className="bg-(--input-back) text-(--input-fore) w-full pl-2 h-8 rounded-lg" type="text" />
                        <h2 className="mt-2 font-bold">Tipo da Resposta:</h2>
                        
                        <select value={newQuestion.type} onChange={(e)=>toggleQuestionType(e.target.value)}  className="w-full h-8 bg-(--select-back) text-(--select-fore) rounded-lg cursor-pointer">
                            <option value="">Selecione</option>
                            <option value={"MULTIPLE"}>Múltipla Escolha</option>
                            <option value={"BOOLEAN"}>Verdadeiro ou Falso</option>
                        </select>

                        {
                        (newQuestion.type == "MULTIPLE") && (
                            <div className="mt-2">
                                <h2 className="font-bold">Resposta:</h2>
                                <input value={newAnswerText} onChange={(e)=>setNewAnswerText(e.target.value)}  maxLength={150} className="bg-(--input-back) text-(--input-fore) w-full h-8 pl-2 rounded-lg" type="text" />
                                <button onClick={()=>addAnswer()} className="w-full bg-(--button-back) text-(--button-fore) hover:bg-(--button-hover) duration-300 mt-6 rounded-lg h-8 cursor-pointer">Acrescentar</button>
                            <h2 className="mt-4 font-bold">Respostas Adicionadas:</h2>
                            </div>
                            
                        )
                        }
                        

                        {
                        (newQuestion.type != "") && (
                        <div className="mt-2 w-86 md:w-full md:h-58 h-38 overflow-scroll">
                            <table className="w-full h-fill border-collapse text-xs">
                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                    <tr>
                                        <th className="text-center border w-10 px-4">?</th>
                                        <th className="text-center border">Resposta</th>
                                        {
                                        (newQuestion.type == "MULTIPLE") && (
                                            <th className="text-center border w-10 px-2">Apagar</th>
                                        )    
                                        }
                                    </tr>
                                </thead>
                                <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                newQuestion.answers.map((item) => (
                                <tr key={item.id} className="text-left">
                                    <td className="text-center border bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"> <input type="radio" name="answer" checked={item.isCorrect} onChange={(()=>setCorrectAnswer(item.id))} /></td>
                                    <td className="border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.text}</td>
                                    {
                                    (newQuestion.type == "MULTIPLE") && (
                                        <td className="border bg-(--tbody-back) py-2 text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) text-center items-center justify-center flex" onClick={()=>{removeAnswer(item.id)}}> <img className="w-4" src={myTheme.mode == "light" ? Trash.src : TrashLight.src} alt="trash" /> </td>
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
                            <button onClick={() => addQuestion()} className="w-full mt-8 bg-green-700 text-(--button-fore) hover:bg-(--button-hover) duration-300 h-8 rounded-lg cursor-pointer">Adicionar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


                                {/* MODAL */}


  </div>

    )
}