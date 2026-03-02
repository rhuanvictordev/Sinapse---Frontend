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

export default function Home() {
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
    
    <div className="bg-[url('/banner.png')] bg-fill bg-center flex-1 rounded-2xl shadow-2xl">
      <nav className="h-25 flex items-center justify-end pr-5">
        <button className="bg-[#2C79D0] md:w-50 w-79 md:h-14 h-10 text-white font-bold md:rounded-lg cursor-pointer hover:bg-blue-900"> + Criar Curso </button>
      </nav>


      <div className="md:p-10 md:gap-10 gap-2 flex flex-row flex-wrap justify-center">
          {

          courses.map((item) => (
            <div key={item.id} className="md:w-160 w-84 md:h-80 h-40 mb-4 bg-[#76aece] md:rounded-2xl font-bold text-2xl overflow-hidden">
              
              <div>
                <div className="ml-4 mr-5 mt-4 flex flex-row justify-between">
                  <h2 className="bg-gray-200 md:rounded-2xl pl-2 pr-2 md:h-auto h-7 border overflow-hidden text-base md:text-2xl">{item.description}</h2>
                  <button className="pl-2 pr-1 text-sm md:text-3xl bg-green-600 cursor-pointer rounded-full border-2 text-white hover:text-green-500 hover:bg-white">▶</button>
                </div>

                <div className="md:mt-6 mt-2 mr-2 md:ml-18 ml-10">
                  <h2 className="overflow-hidden text-base md:text-3xl">{item.name}</h2>
                  {item.quizzes_ids.length > 1 ? ( <h2 className="md:mt-4 text-base md:text-2xl"> {item.quizzes_ids.length} Quizzes Disponíveis </h2> ) : ( <h2 className="text-base md:text-2xl md:mt-4"> {item.quizzes_ids.length} Quiz Disponível </h2> )}
                </div>

                <div className="justify-between flex md:w-140 w-84 md:mt-12 mt-2 md:ml-10">
                  <button className="bg-blue-900 cursor-pointer md:rounded-2xl md:w-42 md:h-18 ml-4 text-white hover:bg-blue-700 hover:text-white"> Entrar </button>
                  {!item.visibility && (
                    <>
                      <div className="md:w-90 w-47 md:h-18 flex flex-row justify-between mr-4">
                        <button className="bg-gray-300 cursor-pointer md:rounded-2xl md:w-42 md:h-18 hover:bg-gray-100 md:ml-3 p-2 md:p-0"> Editar </button>
                        <button className="bg-gray-400 cursor-pointer md:rounded-2xl md:w-42 md:h-18 hover:bg-red-400 p2 md:p-0"> Excluir </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))
          
          }

      </div>
    </div>
  </div>
)
}