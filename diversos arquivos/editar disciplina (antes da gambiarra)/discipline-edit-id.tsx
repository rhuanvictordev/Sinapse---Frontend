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
                addQuizToCurrentDiscipline(obj)
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


  async function addQuizToCurrentDiscipline(quiz: object){
        
        try {
            const response = await sinapseAPI.post(`/subjects/add-quiz/${discipline!._id}`,{quiz_id: "69b8b747e572a20b2df4688e"})
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar adicionar o Quiz à disciplina"
            showToast(msg, "error")
        }
  }


  async function deleteQuiz(quiz: Quiz){
        try {
            const response = await sinapseAPI.delete(`/quizzes/${quiz._id}`)
            if(response.status == 200){
                showToast("Quiz removido com sucesso!", "success")
                getQuizzes();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar remover o Quiz"
            showToast(msg, "error")
        }
  }

  function getQuizzesByDisciplines(id: string){

  }
  
  return (
  <div>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 md:pl-6 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Editar Disciplina</h2>
            <h2 className="font-bold text-lg text-left md:text-left">{discipline?.name}</h2>
            <h2 className="font-normal text-sl">Código de convite: <strong className="font-bold">{discipline?.invitation_code}</strong></h2>
            
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="w-fill text-center md:text-left">
                        <div className="flex md:flex-col md:gap-4">
                            <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-lg font-bold">Semestre:</h2>
                                    <select value={semesterSelected} onChange={(e)=>setSemesterSelected(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        {
                                        semesters.map( (semester)=>(
                                            <option key={semester._id} value={semester._id}>{semester.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-lg font-bold">Nome:</h2>
                                    <input value={newDisciplineName} onChange={(e)=>setNewDisciplineName(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-lg font-bold">Descrição:</h2>
                                    <textarea value={newDisciplineDescription} onChange={(e)=>setNewDisciplineDescription(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></textarea>
                                </div>
                                {/* <div className="flex md:flex-row md:mr-2 flex-col items-center md:w-100 w-full mb-6 md:mt-0 mt-2 md:justify-end">
                                    <h2 className="text-lg font-bold">Privar disciplina:</h2>
                                    <select value={newRestrict} onChange={(e)=>setNewRestrict(e.target.value)} className="w-35 md:w-fill mt-2 md:mt-0 bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        <option value="N">Não</option>
                                        <option value="Y">Sim</option>
                                    </select>
                                </div> */}
                                <div>
                                    <button className="w-40 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{saveDisciplineChanges()}}>Salvar alterações</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-4 pl-2">
                        <div className="flex w-full justify-between pr-2 text-center items-center mt-16">
                            <h2 className="font-bold md:text-xl text-lg md:mb-2">Quizzes nesta disciplina</h2>
                            <button className="w-35 h-10 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{openModal()}}>+ Novo Quiz</button>
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
                            quizzes.map((quiz) => (
                                <tr key={quiz._id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{quiz.name}</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer">▶</td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>router.push("/quiz/edit")}><img src={myTheme.mode == "light"? Pencil.src : PencilLight.src} alt="trash" /></td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={(e)=>{deleteQuiz(quiz)}}><img src={myTheme.mode == "light"? Trash.src : TrashLight.src} alt="trash" /></td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>


                    
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border mt-10">
                        <h2 className="text-center">Adicionar Quizzes à esta disciplina</h2>
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3">Nome</th>
                                    <th className="text-center border md:py-3">Descrição</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                            quizzes.map((quiz) => (
                                <tr key={quiz._id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{quiz.name}</td>
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