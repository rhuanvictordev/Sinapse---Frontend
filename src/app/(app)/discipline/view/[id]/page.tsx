"use client"

import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Discipline = {
    _id: string
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    students_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: string[]
}

type Semester = {
    _id: string
    name: string
}

type Quiz = {
    _id: string
    name: string
    description: string
    user_id: string
    questions: []
    categories_ids: []
}

export default function EditDiscipline() {
    const { user, login, logout } = useAuth();
    const myTheme = useTheme();
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const disciplineID = params.id;

    const [semesters, setSemesters] = useState<Semester[]>([])
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    
    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [newDisciplineName, setNewDisciplineName] = useState("");
    const [newDisciplineDescription, setNewDisciplineDescription] = useState("");
    const [newRestrict, setNewRestrict] = useState("");

    const [newQuizName, setNewQuizName] = useState("");
    const [newQuizDescription, setNewQuizDescription] = useState("");

    const [semesterSelected, setSemesterSelected] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

  useEffect( () => {
    document.title = "Sinapse - Editar Disciplina"
    getSemesters();
    getQuizzes();
    getDiscipline();
  }, [])

  function openModal(){
    setNewQuizName("")
    setNewQuizDescription("")
    setModalVisible(true)
  }

  function closeModal(){
    setNewQuizName("")
    setNewQuizDescription("")
    setModalVisible(false)
  }

  async function getDiscipline(){
    try {
        const response = await sinapseAPI.get(`/subjects/${disciplineID}`);
        setDiscipline(response.data);
        setSemesterSelected(response.data.semester_id)
        setNewDisciplineName(response.data.name)
        setNewDisciplineDescription(response.data.description)

    } catch (error) {
        showToast("Erro ao obter detalhes da disciplina","error")
        router.push("/home")
    }
  }

  async function getSemesters(){
    try {
        const response = await sinapseAPI.get("/semesters");
        setSemesters(response.data);
    } catch (error) {
        showToast("Erro ao obter os semestres","error")
    }
  }

  async function getQuizzes(){
    try {
        const response = await sinapseAPI.get("/quizzes");
        setQuizzes(response.data);
    } catch (error) {
        showToast("Erro ao obter os quizzes","error")
    }
  }

  async function saveDisciplineChanges(){
    if (semesterSelected==""||newDisciplineName==""||newDisciplineDescription==""){
        showToast("Preencha todos os campos!", "info")
        return
    }else{
        try {
            const obj = {
                name: newDisciplineName,
                description: newDisciplineDescription,
                semester_id: semesterSelected
            }
            const response = await sinapseAPI.patch(`/subjects/${discipline!._id}`, obj)
            if (response.status == 200){
                showToast("Disciplina atualizada com sucesso!", "success")
                getDiscipline()
            }
        } catch (error) {
            showToast("Erro ao atualizar a disciplina", "error")
        }
    }
  }

  async function createQuiz(){
    if (newQuizName==""||newQuizDescription==""){
        showToast("Preencha todos os campos!", "info")
        return
    }else{
        const obj = {
            name: newQuizName,
            description: newQuizDescription,
            user_id: user!._id,
            questions: [],
            categories_ids: []
        }
        try {
            const response = await sinapseAPI.post("/quizzes",obj)
            if(response.status == 201){
                showToast("Quiz criado com sucesso!", "success")
                getQuizzes();
                closeModal();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar criar o Quiz"
            showToast(msg, "error")
        }
    }
  }

  function playQuiz(id: string){
    router.push(`/quiz/play/${id}`);
  }


  async function addQuizToCurrentDiscipline(_id: string){
        try {
            const response = await sinapseAPI.post(`/subjects/add-quiz/${discipline!._id}`,{quiz_id: _id})
            if (response.status == 201){
                showToast("Quiz adicionado com sucesso!", "success")
                getQuizzes()
                getDiscipline()
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar adicionar o Quiz à disciplina"
            showToast(msg, "error")
        }
  }


  async function removeQuizFromCurrentDiscipline(idParam: string){
        try {
            const newQuizzes = discipline?.quizzes_ids.filter((id) => id !== idParam);
            const response = await sinapseAPI.patch(`/subjects/${discipline!._id}`,{quizzes_ids: newQuizzes});
            if(response.status == 200){
                showToast("Quiz removido com sucesso!", "success")
                getDiscipline();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar remover o Quiz"
            showToast(msg, "error")
        }
  }

  function getQuizById(id: string){
    const quiz = quizzes.find( (quiz) => quiz._id == id)    
    if (quiz) {
        return quiz
    }else{
        return null
    }
  }
  
  return (
  <div>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 md:pl-6 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Visualizar Disciplina</h2>
            <h2 className="font-bold text-lg text-left md:text-left">{discipline?.name}</h2>
            <h2 className="font-normal text-sl">Código de convite: <strong className="font-bold">{discipline?.invitation_code}</strong></h2>
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="mt-8 mb-4 pl-2">
                        <div className="flex w-full justify-between pr-2 text-center items-center mt-16">
                            <h2 className="font-bold md:text-xl text-lg md:mb-2">Quizzes disponíveis</h2>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3">Nome</th>
                                    <th className="text-center border pl-2 md:py-3 w-20 px-2">Iniciar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                                discipline?.quizzes_ids.map((id) => {
                                const quiz:any = getQuizById(id);

                                if (!quiz) return null;

                                return (
                                    <tr key={quiz._id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                        {quiz.name}
                                    </td>

                                    <td onClick={ (e) => { playQuiz(quiz._id) } } className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">
                                        ▶
                                    </td>
                                    </tr>
                                );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                        <hr className="mt-8 mb-8" />
                    </div>
            </div>
        </div>
    </div>




        <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-240 w-120 md:h-160 h-140 rounded-2xl shadow-xl overflow-scroll">
                <div className="mt-6 text-center font-bold">
                    <h2 className="text-2xl">Criar novo Quiz</h2>
                    <div className="mt-8">
                        <div className="ml-4 mr-4">
                            <h2 className="font-bold mb-1 text-lg md:text-left">Nome do Quiz:</h2>
                            <input maxLength={100} value={newQuizName} onChange={(e)=>setNewQuizName(e.target.value)} type="text" className="bg-(--input-back) text-(--input-fore) pl-2 w-full h-8 md:mb-6 mb-3 rounded-lg" />
                        </div>
                        <div className="ml-4 mr-4">
                            <h2 className="font-bold mb-1 text-lg md:text-left">Descrição:</h2>
                            <textarea value={newQuizDescription} onChange={(e)=>setNewQuizDescription(e.target.value)} className="bg-(--input-back) text-(--input-fore) pl-2 w-full h-30 md:mb-6 mb-3 rounded-lg" />
                        </div>
                        <div className="items-center justify-center flex mt-26 gap-8">
                        <button onClick={()=>setModalVisible(false)} className="bg-(--button-delete) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Cancelar</button>
                        <button onClick={()=>{createQuiz()}} className="bg-(--button-back) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Salvar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        


  </div>
)
}