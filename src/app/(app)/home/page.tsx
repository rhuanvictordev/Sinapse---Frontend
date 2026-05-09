"use client"

import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { EyeClosed, EyeOpened, Pencil, Pino, Trash } from "@/app/components/icons";

type Discipline = {
  _id: string
  name: string
  description: string
  user_id: string
  quizzes_ids: string[]
  students_ids: string[]
  semester_id: string
  course_id: string
  ranking: []
}

type Semester = {
  _id: string
  name: string
}

type Course = {
  _id: string
  name: string
  semesters_ids: string[]
}

export default function Home() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const myTheme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect( () => {
    document.title = "Sinapse - Início"
    getCourses();
    getSemesters();
    getDisciplines();
  }, [])

  async function getDisciplines(){
    const response = await sinapseAPI.get("/subjects");
    setDisciplines(response.data);
  }

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters");
    setSemesters(response.data);
  }

  async function getCourses(){
    const response = await sinapseAPI.get("/courses");
    setAllCourses(response.data);
  }

  function getSemesterName(id: string){
      const parts = id.split("-");
      const semester = semesters.find(s => s._id === parts[0]);
      return semester?.name
  }

  function getCourseName(courseId: string){
      const course = allCourses.find(c => c._id === courseId);
      return course?.name
  }

  async function deleteDiscipline(id: string){
    if (confirm("Deseja excluir esta disciplina?")){
        try {
        const response = await sinapseAPI.delete(`/subjects/${id}`)
        if (response.status == 200){
          showToast("Disciplina removida com sucesso!","success")
          getDisciplines()
        }
      } catch (error) {
        showToast("Ocorreu um erro ao tentar excluir a disciplina","error")
      }
    }
  }

  async function removeCurrentUserFromSelectedDiscipline(disciplineID: string) {
    const discipline = disciplines.find(d => d._id === disciplineID);
    if (!discipline) return;

    const students_ids = discipline.students_ids.filter(
      studentID => studentID !== user?._id
    );

    try {
      const response = await sinapseAPI.patch(`/subjects/${disciplineID}`, {
        students_ids
      });

      if (response.status === 200) {
        showToast("Disciplina desafixada!", "success");
        getDisciplines()
      }
    } catch (error: any) {
      showToast("Erro ao tentar desafixar a disciplina do painel", "error");
    }
  }

  const myDisciplines = disciplines.filter(d =>
    d.user_id === user?._id || d.students_ids.includes(user?._id || "")
  )

  const hasDisciplines = myDisciplines.length > 0;
  
  return (
  <div style={{ color: myTheme.theme.foreground }} className="text-xs md:text-lg">
    
    {/* <div className="w-full">
        <select className="font-bold w-full h-8 text-center text-sm bg-amber-600">
          <option value="">Selecione um Curso</option>
        </select>
    </div> */}

     <header className="flex flex-col md:flex-row md:justify-between justify-center md:pl-4 text-center">
      <h2 className="font-bold md:text-2xl text-lg justify-center flex pt-6 md:pt-8 pb-2 md:mb-0"> {user?.type == "Teacher" ? "Minhas Disciplinas" : "Disciplinas disponíveis"} </h2>
        {
          user?.type == "Teacher" && (
          <button onClick={() => router.push("/discipline/create")} className="md:w-50 mt-2 mb-6 ml-10 mr-10 md:h-14 md:mt-3 h-12 font-bold cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300 rounded-lg">
            + Criar Disciplina
          </button>
          )
        }
    </header>

  <div>
    
  <div className={`flex flex-wrap ${hasDisciplines ? "md:justify-start justify-center" : "justify-center"} gap-4 py-4 md:pl-4`}>

    {myDisciplines.length > 0 ? (
      myDisciplines.map((item) => (
        <div
          key={item._id}
          className="md:w-130 w-84 h-fill pb-4 bg-(--card-back) rounded-lg font-bold text-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
        >

          <div className="ml-4 mr-5 mt-4 flex flex-row justify-between">
            <h2 className="rounded-sm pl-2 pr-2 md:h-auto border overflow-hidden text-sm">
              {getCourseName(item.course_id) + " - "+ getSemesterName(item.semester_id)}
            </h2>
            {
             item.user_id != user?._id && (
              <div className="cursor-pointer">
              <h2><Pino onClick={() => removeCurrentUserFromSelectedDiscipline(item._id)}/></h2>
            </div>
             ) 
            }
          </div>

          <div className="md:mt-4 mt-2 mr-2 md:ml-14 ml-4">
            <h2 className="overflow-hidden text-base md:text-2xl">{item.name}</h2>

            {item.quizzes_ids.length === 0 ? (
              <h2 className="md:mt-2 text-base md:text-xl">
                Nenhum Quiz disponível
              </h2>
            ) : item.quizzes_ids.length === 1 ? (
              <h2 className="text-base md:text-xl md:mt-2">
                1 Quiz disponível
              </h2>
            ) : (
              <h2 className="text-base md:text-xl md:mt-2">
                {item.quizzes_ids.length} Quizzes disponíveis
              </h2>
            )}
          </div>

          <div className="mt-4 md:mt-10">

            {user?._id !== item.user_id && (
              <div className="flex items-center justify-left ml-4 md:ml-12">
                <button
                  className="h-10 bg-(--button-enter) hover:bg-(--button-enter-hover) duration-300 text-(--button-fore) flex items-center text-lg gap-2 px-5 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/discipline/view/${item._id}`)}
                >
                  Entrar
                </button>
              </div>
            )}

            {user?._id === item.user_id && (
              <div className="flex items-center justify-center h-10">
                <div className="flex flex-row w-full justify-center md:gap-14 gap-4">
                  <button
                    className="h-10 bg-(--button-enter) hover:bg-(--button-enter-hover) text-(--button-fore) duration-300 flex items-center text-lg gap-2 px-5 rounded-lg cursor-pointer"
                    onClick={() => router.push(`/discipline/view/${item._id}`)}
                  >
                    Entrar
                  </button>

                  <button
                    className="h-10 bg-(--button-edit) hover:bg-(--button-edit-hover) duration-300 flex items-center text-lg gap-2 md:gap-4 px-2 rounded-lg cursor-pointer"
                    onClick={() => router.push(`/discipline/edit/${item._id}`)}
                  >
                    <Pencil/>
                    Editar
                  </button>

                  <button
                    className="h-10 bg-(--button-delete) hover:bg-(--button-delete-hover) duration-300 flex items-center text-lg gap-2 md:gap-4 px-2 rounded-lg cursor-pointer"
                    style={{color: myTheme.mode == "light" ? "#960a0f" : "#5f0609"}}
                    onClick={() => deleteDiscipline(item._id)}
                  >
                    <Trash style={{color: myTheme.mode == "light" ? "#960a0f" : "#5f0609"}}/>
                    Excluir
                  </button>

                </div>
              </div>
            )}

          </div>
        </div>
      ))
    ) : (
      <div className="text-xs md:text-lg">
        <h2 className="mt-40 font-bold mb-2">Não há disciplinas disponíveis...</h2>
        {
          user?.type == "Student" && (
            <h2 className="font-bold">Encontre disciplinas <strong className="text-blue-500 cursor-pointer hover:text-blue-800" onClick={(e)=>router.push("/discipline/find")}>&nbsp;clicando aqui.</strong></h2>
          )
        }
        {
          user?.type == "Teacher" && (
            <h2 className="font-bold">Crie suas disciplinas <strong className="text-blue-500 cursor-pointer hover:text-blue-800" onClick={(e)=>router.push("/discipline/create")}>&nbsp;clicando aqui.</strong></h2>
          )
        }
      </div>
    )}

  </div>
</div>
  </div>
)
}