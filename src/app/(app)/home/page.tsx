"use client"

import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons"
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

type Discipline = {
  _id: string
  name: string
  description: string
  user_id: string
  quizzes_ids: string[]
  students_ids: string[]
  semester_id: string
  ranking: []
}

type Semester = {
  _id: string
  name: string
}

export default function Home() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const myTheme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect( () => {
    document.title = "Sinapse - Início"
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

  function getSemesterName(id: string){
      const semester = semesters.find(semester => semester._id === id)
      return semester?.name
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

  const myDisciplines = disciplines.filter(d =>
    d.user_id === user?._id || d.students_ids.includes(user?._id || "")
  )

  return (
  <div className="flex flex-col h-full" style={{ color: myTheme.theme.foreground }}>

    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pl-4 text-center md:border border-0">
      <h2 className="font-bold md:text-2xl text-lg justify-center flex pt-6 md:pt-8 pb-2 md:mb-0 border md:border-0">
        Disciplinas disponíveis
      </h2>

      <button
        className="md:w-50 mt-2 mb-6 ml-10 mr-10 md:h-14 md:mt-3 h-12 font-bold cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300 rounded-lg"
        onClick={() => router.push("/discipline/create")}
      >
        + Criar Disciplina
      </button>
    </header>

    <div style={{ backgroundColor: myTheme.theme.screenBack }}>
  <div className="flex flex-wrap justify-center gap-2 py-4">

    {myDisciplines.length > 0 ? (
      myDisciplines.map((item) => (
        <div
          key={item._id}
          className="md:w-130 w-84 border h-fill pb-4 bg-(--card-back) rounded-lg font-bold text-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
        >

          <div className="ml-4 mr-5 mt-4 flex flex-row justify-between">
            <h2 className="bg-(--card-hover) rounded-lg pl-2 pr-2 md:h-auto border overflow-hidden text-sm">
              {getSemesterName(item.semester_id)}
            </h2>
          </div>

          <div className="md:mt-4 mt-2 mr-2 md:ml-18 ml-10">
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
                    <img
                      src={myTheme.mode === "light" ? Pencil.src : PencilLight.src}
                      className="w-5 h-5"
                    />
                    Editar
                  </button>

                  <button
                    className="h-10 bg-(--button-delete) hover:bg-(--button-delete-hover) duration-300 flex items-center text-lg gap-2 md:gap-4 px-2 rounded-lg cursor-pointer"
                    onClick={() => deleteDiscipline(item._id)}
                  >
                    <img
                      src={myTheme.mode === "light" ? Trash.src : TrashLight.src}
                      className="w-5 h-5"
                    />
                    Excluir
                  </button>

                </div>
              </div>
            )}

          </div>
        </div>
      ))
    ) : (
      <div className="text-xl">
        <h2 className="mt-40 font-bold mb-2">Não há disciplinas disponíveis...</h2>
        <h2 className="font-bold">Encontre disciplinas <strong className="text-blue-500 cursor-pointer hover:text-blue-800" onClick={(e)=>router.push("/discipline/find")}>&nbsp;clicando aqui.</strong>
        </h2>
      </div>
    )}

  </div>
</div>
  </div>
)
}