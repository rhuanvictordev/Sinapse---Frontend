"use client"

import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { use, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter, useParams } from "next/navigation";
import { Trash } from "@/app/components/icons";

type Answer = {
  id: number
  text: string
  isCorrect: boolean
}

type Question = {
  id: number
  title: string
  type: string
  weight: number
  answers: Answer[]
}

type QuestionResponse = {
  question: string
  possible_answers: string[]
  answer: number[]
  weight: number
  boolean_answer: boolean
}

type Quiz = {
  _id: string
  name: string
  description: string
  user_id: string
  requesterId: string
  questions: QuestionResponse[]
  categories_ids: []
}

type QuizResponse = {
  _id: string
  name: string
  description: string
  user_id: string
  questions: QuestionResponse[]
  categories_ids: []
}

export default function QuizEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const quizID = params.id;
  const { showToast } = useToast();
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [quiz, setQuiz] = useState<QuizResponse>();
  const [quizEdited, setQuizEdited] = useState<QuizResponse>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [newQuestion, setNewQuestion] = useState<Question>({id: questions.length, title: "", type: "MULTIPLE",answers: [], weight: 0});
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newQuizName, setNewQuizName] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");

  
useEffect( () => {
  document.title = "Sinapse - Edição de Quiz"
  getQuiz()
}, [])


async function getQuiz(){
  try {
        const response = await sinapseAPI.get(`/quizzes/${quizID}`);
        setQuiz(response.data);
        setNewQuizName(response.data.name)
        setNewQuizDescription(response.data.description)
        console.log("Quiz obtido: ", response.data)
  
      } catch (error) {
          showToast("Erro ao obter detalhes do Quiz","error")
          router.push("/home")
      }
}

function openModal(){

    if (quiz?.user_id != user?._id){
      showToast("Você não tem permissão para alterar o quiz de outros usuários", "error");
      return
    }

    setNewQuestionText("")
    setNewAnswerText("")
    console.log("Criando nova questão. ID: " + questions.length + 1)

    setNewQuestion({id: questions.length + 1, title: "", type: "", answers: [], weight: 0})
    setModalVisible(true)
}

function closeModal(){
  setNewQuestion(prev => ({...prev, id: questions.length, title: "", type: "",answers: []}))
  setModalVisible(false)
}

function removeCurrentQuestion() {
  
  if (quiz?.user_id != user?._id){
    showToast("Você não tem permissão para alterar o quiz de outros usuários!", "error");
    return
  }

  setQuiz(prev => {
    if (!prev) return prev;

    const updatedQuestions = prev.questions.filter(
      (_, index) => index !== selectedQuestion
    );

    return {
      ...prev,
      questions: updatedQuestions
    };
  });

  if (selectedQuestion > 1){
    setSelectedQuestion(prev => prev - 1)
    showToast("Pergunta removida, salve as alterações!","info")
  }else{
    setSelectedQuestion(0)
    showToast("Pergunta removida, salve as alterações!","info")
  }
}

function nextQuestion(){
    if (quiz?.questions.length === 0) {
      showToast("Não há perguntas!", "info")
      return
    }

    if (quiz?.questions){
      if (selectedQuestion >= quiz?.questions.length - 1) {
            showToast("Última pergunta!", "info")
            return
        }
    }

    setSelectedQuestion(prev => prev + 1)
}


function previousQuestion(){
    if (quiz?.questions.length === 0) {
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

  if (quiz?.user_id != user?._id){
    showToast("Você não tem permissão para alterar o quiz de outros usuários!", "error");
    return;
  }

  if (newQuestion.title.trim() === "") {
    showToast("Digite o título da pergunta!", "info");
    return;
  }

  if (newQuestion.answers.length === 0) {
    showToast("Adicione respostas!", "info");
    return;
  }

  if (newQuestion.weight == 0){
    showToast("Adicione o peso da pergunta!", "info");
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

  const correctPositions = newQuestion.answers.map((a, index) => a.isCorrect ? index : -1).filter(index => index !== -1);

  const answersNames = newQuestion.answers.map(a => a.text);

  const obj = {
    question: newQuestion.title,
    possible_answers: answersNames,
    answer: correctPositions,
    weight: newQuestion.weight,
    boolean_answer: newQuestion.type === "BOOLEAN"
  };

  try {
    const response = await sinapseAPI.post(`/quizzes/question/${quiz!._id}`, obj)
     if (response.status == 201){ 
      showToast("Pergunta adicionada!", "success")
      setNewQuestion(prev => ({...prev, id: questions.length, title: "", type: "",answers: []}))
      setModalVisible(false)
      getQuiz()
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


function addCorrectAnswer(id: number) {

  setNewQuestion(prev => ({
    ...prev,
    answers: prev.answers.map(answer =>
      answer.id === id
        ? { ...answer, isCorrect: !answer.isCorrect }
        : answer
    )
  }))
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



async function saveQuizEdited(){

  if (newQuizName == "" || newQuizDescription == ""){
    showToast("Insira um nome e uma descrição para o Quiz!")
    return
  }

  const updatedQuiz = {...quiz,
    requesterId: user?._id,
    quiz: {...quiz,
      name: newQuizName,
      description: newQuizDescription
    }
  }

  try {
    const response = await sinapseAPI.patch(`/quizzes/${quiz?._id}`, updatedQuiz)
    if (response.status === 200){
      showToast("Quiz atualizado!", "success")
      getQuiz()
    }

  } catch (error) {
    showToast("Não foi possível salvar alterações no Quiz porque você não tem permissão para alterar o quiz de outro usuário.", "error")
  }
}

  
   return (
    <div className="">
        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        
            <header className="flex-col md:justify-between justify-center border-black md:pl-6 md:mb-4 hidden md:block">
                <div className="flex flex-row md:justify-between justify-center">
                    <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                    <h2 className="md:mt-8 mr-20 font-bold hidden md:block">{quiz?.questions.length == 1 ? "1 Pergunta" : quiz?.questions.length + " Perguntas"}</h2>
                </div>
                <div className="flex md:flex-row flex-col md:pr-10 w-full mb-4 md:mb-0">
                    <div className="flex md:flex-row flex-col w-full mb-4">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                        <input value={newQuizName} onChange={(e)=>setNewQuizName(e.target.value)} className="md:w-160 md:ml-4 ml-2 mr-2 md:mr-2 pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                        <button className="md:w-50 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={ () => saveQuizEdited() } >Salvar Alterações</button>
                    </div>
                    <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{quiz?.questions.length == 1 ? "1 Pergunta" : quiz?.questions.length + " Perguntas"}</h2>
                    <button onClick={()=> openModal()} className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" >+ Adicionar Pergunta</button>
                </div>
                      <div className="w-full">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-1">Descrição:</h2>
                        <textarea value={newQuizDescription} onChange={(e)=>setNewQuizDescription(e.target.value)} className="md:w-180 w-full pl-2 bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                      </div>
                  <div className="my-2 hidden md:block">
                        <h2>Navegação Rápida:</h2>
                        <div className="bg-(--screen-back) flex-row justify-self-start md:flex w-fill h-fill scroll-auto gap-2 rounded-lg my-1 p-2">
                          {
                            quiz?.questions.map((q, index)=>(
                              <div key={q.question}>
                                <h2 onClick={ () => setSelectedQuestion(index) } className="w-10 text-center justify-center flex flex-col text-(--button-fore) rounded-lg h-10 bg-(--button-back) hover:bg-(--button-hover) duration-300 cursor-pointer">{index + 1}</h2>
                              </div>
                            ))
                          }
                        </div>
                  </div>
            </header>


            <header className="flex-col md:justify-between justify-center border-black md:hidden">
                <div className="flex flex-row md:justify-between justify-center">
                    <h2 className="font-bold md:text-2xl text-lg mt-3 mb-4">Edição de Quiz</h2>
                </div>
                <div className="flex md:flex-row flex-col w-full mb-4 md:mb-0">
                    <div className="flex md:flex-row flex-col w-full mb-4">
                        <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 md:mb-0">Nome:</h2>
                        <input value={newQuizName} onChange={(e)=>setNewQuizName(e.target.value)} className="md:w-160 md:ml-4 ml-2 mr-2 md:mr-2 pl-2 w-fill bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-10 font-bold" />
                              
                          <div className="w-full pl-2 pr-2">
                            <h2 className="font-bold md:text-xl text-ls pl-2 text-center md:text-left mb-2 mt-4">Descrição:</h2>
                            <textarea value={newQuizDescription} onChange={(e)=>setNewQuizDescription(e.target.value)} className="md:w-180 w-full pl-2 bg-(--input-back) rounded-lg text-(--input-fore) text-sx h-15 font-bold" />
                          </div>
                        
                        <button className="md:w-50 w-fill mt-4 md:mt-0 ml-2 mr-2 md:mr-0 md:text-lg text-sm md:ml-5 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={ () => saveQuizEdited() } >Salvar Alterações</button>
                    </div>
                    <h2 className="md:mt-8 mr-20 font-bold md:hidden text-center w-full">{quiz?.questions.length == 1 ? "1 Pergunta" : quiz?.questions.length + " Perguntas"}</h2>
                    <button onClick={()=>setModalVisible(true)} className="md:w-50 w-fill mr-20 md:mr-0 ml-20 md:ml-0 h-10 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" >+ Adicionar Pergunta</button>
                </div>
            </header>


            
            <div className="w-full h-full bg-(--area-back) p-2 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <p className="font-bold">Pergunta {quiz?.questions.length === 0 ? 0 : selectedQuestion + 1} de {quiz?.questions.length} </p>
                    <Trash size={28} className="border p-1 rounded-lg cursor-pointer hover:text-red-500 duration-300" onClick={()=> removeCurrentQuestion()}/>
                  </div>
                    <div className="justify-between gap-2 w-40 flex">
                        <button className="w-20 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) cursor-pointer" onClick={()=> previousQuestion() }>◀</button>
                        <button className="w-20 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) cursor-pointer" onClick={()=> nextQuestion() }>▶</button>
                    </div>
                    <h2 className="font-bold mt-2">{quiz?.questions.length === 0 ? "" : quiz?.questions[selectedQuestion].question} </h2>
                </div>
                <div className="w-fill h-fill md:px-2">
                    <div className="h-fill">

                        <div className="flex w-full justify-between pr-2 text-center items-center">
                            <h2 className="font-bold md:text-xl text-lx">Respostas:</h2>
                        </div>
                        <div className="w-full h-fill overflow-auto font-bold rounded-lg">
                            <table className="w-full h-fill border-collapse">
                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                    <tr>
                                        <th className="text-center py-2 w-10"></th>
                                        <th className="text-center py-2">Alternativas</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-(--area-back) text-(--area-fore)">
                                  {
                                    quiz?.questions[selectedQuestion]?.possible_answers.map((item, index) => {
                                      const correctAnswers = quiz?.questions[selectedQuestion]?.answer ?? [];

                                      return (
                                        <tr key={item} className="text-left">
                                          <td className="text-center  pl-2 py-2 bg-(--tbody-back)">
                                            <input
                                              type="checkbox"
                                              checked={correctAnswers.includes(index)}
                                              readOnly
                                            />
                                          </td>
                                          <td className=" pl-6 py-2 bg-(--tbody-back)">
                                            {item}
                                          </td>
                                        </tr>
                                      )
                                    })
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
                        <h2 className="font-bold">Sua Pergunta:</h2>
                        <input value={newQuestion.title} onChange={ (e)=> setNewQuestion(prev => ({...prev, title: e.target.value})) }  className="bg-(--input-back) text-(--input-fore) w-full pl-2 h-8 rounded-lg" type="text" />
                        
                        <h2 className="font-bold">Peso da pergunta:</h2>
                        <select value={newQuestion.weight} onChange={ (e)=> setNewQuestion(prev => ({...prev, weight: Number(e.target.value)})) }  className="bg-(--input-back) text-(--input-fore) w-full pl-2 h-6 rounded-lg">
                          <option value={0}>Selecione</option>
                          <option value={1}>1 ponto</option>
                          <option value={3}>3 pontos</option>
                          <option value={4}>4 pontos</option>
                          <option value={6}>6 pontos</option>
                          <option value={8}>8 pontos</option>
                          <option value={10}>10 pontos</option>
                          <option value={12}>12 pontos</option>
                          <option value={15}>15 pontos</option>
                        </select>
                        
                        <h2 className="mt-2 font-bold">Tipo da Resposta:</h2>
                        <select value={newQuestion.type} onChange={(e)=>toggleQuestionType(e.target.value)}  className="w-full h-8 bg-(--select-back) text-(--select-fore) rounded-lg cursor-pointer">
                            <option value="">Selecione</option>
                            <option value={"MULTIPLE"}>Múltipla Escolha</option>
                            <option value={"BOOLEAN"}>Verdadeiro ou Falso</option>
                        </select>

                        {
                        (newQuestion.type == "MULTIPLE") && (
                            <div className="mt-2">
                                <h2 className="font-bold">Acrescentar opções de resposta:</h2>
                                <input value={newAnswerText} onChange={(e)=>setNewAnswerText(e.target.value)}  maxLength={150} className="bg-(--input-back) text-(--input-fore) w-full h-8 pl-2 rounded-lg" type="text" />
                                <button onClick={()=>addAnswer()} className="w-full bg-(--button-back) text-(--button-fore) hover:bg-(--button-hover) duration-300 mt-6 rounded-lg h-8 cursor-pointer text-xs md:text-lg font-bold">Acrescentar</button>
                            <h2 className="mt-4 font-bold">Respostas Adicionadas:</h2>
                            </div>
                            
                        )
                        }

                        {
                        (newQuestion.type != "") && (
                        <div className="mt-2 w-full md:h-44 h-24 overflow-auto">
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
                                    <td className="text-center border bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>addCorrectAnswer(item.id)}> <input type="checkbox" name="answer" checked={item.isCorrect} readOnly /></td>
                                    <td className="border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.text}</td>
                                    {
                                    (newQuestion.type == "MULTIPLE") && (
                                        <td className="border bg-(--tbody-back) py-2 text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) text-center items-center justify-center flex cursor-pointer" onClick={()=>{removeAnswer(item.id)}}> <Trash size={16}/> </td>
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
                            <button onClick={()=> closeModal()} className="w-full mt-8 bg-blue-600 text-(--button-fore) hover:bg-(--button-hover) duration-300 h-8 rounded-lg cursor-pointer text-xs md:text-lg font-bold">Cancelar</button>
                            <button onClick={() => addQuestion()} className="w-full mt-8 bg-green-700 text-(--button-fore) hover:bg-(--button-hover) duration-300 h-8 rounded-lg cursor-pointer text-xs md:text-lg font-bold">Adicionar Pergunta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


                                {/* MODAL */}


  </div>

    )
}