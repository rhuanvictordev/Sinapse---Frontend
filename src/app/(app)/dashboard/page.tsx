"use client"
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";

type Ranking = {
  user_id: number;
  answered_questions: number;
  correct_answers: number;
}

type Course = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  quizzes_ids: number[];
  students_ids: number[];
  categories_ids: number[];
  visibility: boolean;
  invitation_code: number;
  ranking: Ranking;
}

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect( () => {
    getCourses();
  }, [])

  async function getCourses(){
    const response = await LocalAPI.get("/courses");
    setCourses(response.data);
  }

  return (
  <div className="flex flex-col h-full">
    <header className="h-12 pl-4 flex items-center">
      <h2 className="font-bold text-2xl">Meus Cursos</h2>
    </header>
    
    <div className="bg-[url('/banner.png')] bg-fill bg-center flex-1 rounded-2xl">
      <nav className="h-25 flex items-center justify-end pr-5">
        <button className="bg-[#2C79D0] w-50 h-14 text-white font-bold px-4 rounded-lg cursor-pointer hover:bg-blue-900"> + Criar Curso </button>
      </nav>


      <div className="p-10 gap-10 flex flex-row flex-wrap justify-center">
          {courses.map((item) => (
            <div key={item.id} className="w-160 h-80 bg-[#76aece] rounded-2xl font-bold text-2xl">
              
              <div>
                <div className="ml-4 mr-5 mt-4 flex flex-row justify-between gap-10">
                  <h2 className="bg-gray-200 rounded-2xl p-2 text-center border overflow-hidden">{item.description}</h2>
                  <button className="pl-3 pr-3 bg-green-600 cursor-pointer rounded-full border-4 text-white hover:text-green-500 hover:bg-white">▶</button>
                </div>

                <div className="mt-6 ml-18">
                  <h2 className="text-3xl overflow-hidden">{item.name}</h2>

                  {item.quizzes_ids.length > 1 ? (
                    <h2 className="text-2xl mt-4">
                      {item.quizzes_ids.length} Quizzes Disponíveis
                    </h2>
                  ) : (
                    <h2 className="text-2xl mt-4">
                      {item.quizzes_ids.length} Quiz Disponível
                    </h2>
                  )}
                </div>

                <div className="justify-between flex w-140 mt-12 ml-10">
                  <button className="bg-blue-900 cursor-pointer rounded-2xl w-42 h-18 text-white hover:bg-blue-700 hover:text-white"> Entrar </button>
                  {!item.visibility && (
                    <>
                      <div className="w-90 h-18 flex flex-row justify-between">
                        <button className="bg-gray-300 cursor-pointer rounded-2xl w-42 h-18 hover:bg-gray-100"> Editar </button>
                        <button className="bg-gray-400 cursor-pointer rounded-2xl w-42 h-18 hover:bg-red-400"> Excluir </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}

      </div>
    </div>
  </div>
)
}