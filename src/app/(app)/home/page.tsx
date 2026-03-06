"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, Trash } from "@/app/components/icons"
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const myTheme = useTheme();

  useEffect( () => {
    getCourses();
  }, [])

  async function getCourses(){
    const response = await LocalAPI.get("/courses");
    setCourses(response.data);
  }

  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4 text-center md:h-20 border border-black">
      <h2 className="font-bold md:text-2xl mt-3 py-2">Cursos disponíveis</h2>
      <button className="md:w-50 mt-2 mb-6 ml-10 mr-10 md:h-14 md:mt-3 h-12 font-bold md:rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{router.push("/course/create")}}>+ Criar Curso</button>
    </header>
    
    <div style={{backgroundColor:myTheme.theme.screenBack}}>
      
      <div className="md:p-10 md:gap-10 gap-2 flex flex-row flex-wrap justify-center">
          {

          courses.map((item) => (
            <div key={item.id} className="md:w-160 border w-84 md:h-80 h-fill mt-4 md:pb-2 pb-4 mb-4 bg-(--card-back) rounded-lg font-bold text-2xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
              
              <div>
                <div className="ml-4 mr-5 mt-4 flex flex-row justify-between">
                  <h2 className="bg-(--card-hover) rounded-lg pl-2 pr-2 md:h-auto h-7 border overflow-hidden text-base md:text-2xl">{item.description}</h2>
                </div>

                <div className="md:mt-6 mt-2 mr-2 md:ml-18 ml-10">
                  <h2 className="overflow-hidden text-base md:text-3xl">{item.name}</h2>
                  {item.quizzes_ids.length > 1 ? ( <h2 className="md:mt-4 text-base md:text-2xl"> {item.quizzes_ids.length} Quizzes Disponíveis </h2> ) : ( <h2 className="text-base md:text-2xl md:mt-4"> {item.quizzes_ids.length} Quiz Disponível </h2> )}
                </div>

                <div className="justify-between flex md:w-140 md:mt-12 mt-3 md:ml-10 gap-2 pl-2 md:pl-0">
                  <button className="cursor-pointer rounded-lg md:w-42 md:h-18 md:ml-4 text-white px-2 bg-(--button-enter) hover:bg-(--button-enter-hover) hover:text-white duration-300" onClick={()=> router.push("/course/detail")}> Entrar </button>
                  {!item.visibility && (
                    <>
                      <div className="md:w-90 w-full md:h-18 h-8 flex flex-row justify-between md:mr-4 mr-2 gap-2">
                        <button className="bg-(--button-edit) hover:bg-(--button-edit-hover) cursor-pointer rounded-lg md:w-42 md:h-18 md:ml-3 px-2 md:px-0 flex items-center justify-center gap-2 duration-300" onClick={()=> router.push("/course/edit")} ><img src={Pencil.src} className="w-5 h-5"/> Editar</button>
                        <button className="bg-(--button-delete) hover:bg-(--button-delete-hover) cursor-pointer rounded-lg md:w-42 md:h-18 md:ml-3 px-2 flex items-center justify-center gap-2 duration-300"><img src={Trash.src} className="w-5 h-5"/> Excluir</button>
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