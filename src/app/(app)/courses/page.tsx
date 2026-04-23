"use client"

import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { EyeOpened, Pencil, Trash } from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

type Course = {
    _id: string
    name: string
    semesters_ids: string[]
}

type Discipline = {
    _id: string
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    students_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: []
}

export default function Courses() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
  const myTheme = useTheme();
  const { showToast } = useToast();
  const [name, setName] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Cursos"
    if ( !loading && !user?.is_admin){
        router.push("/home")
        showToast("Você não tem permissão para acessar esta página!", "error");
        return
    }
    getCourses();
    getDisciplines();
  }, [])

  async function getCourses(){
    const response = await sinapseAPI.get("/courses")
    setCourses(response.data);
  }

  async function getDisciplines(){
    const response = await sinapseAPI.get("/subjects")
    setAllDisciplines(response.data);
  }

  async function createCourse(){
    if(name == ""){
        showToast("Preencha o nome do Curso!","info")
        return
    }
    try {
        await sinapseAPI.post("/courses", {user_id: user!._id, name: name} )
        setName("")
        getCourses();
        showToast("Curso criado com sucesso!","success")
     } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao criar o Curso"
      showToast(message, "error")
    }
  }

  function verifyUsingCourse(courseID: string){
    let exist = false;
    allDisciplines.forEach(discipline => {
        courses.forEach(course=>{
            if (discipline.semester_id.split("-")[1] == courseID){
                exist = true;
            }
        });
    });

    return exist;
  }

    async function deleteCourse(courseID: string) {
        
        let courseUsed = (verifyUsingCourse(courseID));
        if (!courseUsed){
            if (!confirm("Deseja excluir este Curso?")) return;

            const obj = {user_id: user?._id}
            try {
                const response = await sinapseAPI.delete(`/courses/${courseID}`, {
                    data: { user_id: user?._id }
                });
                if (response.status == 200){
                    showToast("Curso excluído!", "success");
                    getCourses();
                }
            } catch (error: any) {
                const message = error?.response?.data?.message || "Erro ao excluir o Curso";
                showToast(message, "error");
            }
        }else{
            showToast("Este curso possui disciplinas vinculadas, não será possível excluir no momento!", "info");
        }
    }

    async function renameCourse(id: string){
        const name = prompt("Digite um novo nome para este Curso")
        if (name == null) {
            return
        }
        if (name.trim() == ""){
            showToast("Insira um nome válido!", "info")
            return
        }
        try {
            await sinapseAPI.patch(`/courses/${id}`, {user_id: user!._id, updated_course: {_id: id, name: name}})
            showToast("Curso renomeado!", "success")
            getCourses();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erro ao renomear o Curso"
            showToast(message, "error")
        }
    }


    function viewCourse(id: string){
        router.push(`/courses/edit/${id}`)
    }


  return (
  <div className="flex flex-col h-full text-xs md:text-lg" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center md:h-20">
      <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Cursos</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-lg font-bold">Criar novo curso</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <input placeholder="Nome do novo curso" type="text" className="bg-(--input-back) pl-2 text-(--input-fore) font-bold md:w-200 w-fill md:h-10 h-8 rounded-lg md:mb-0 md:mt-0 mt-2" maxLength={50} value={name} onChange={(e) => setName(e.target.value)}/>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 md:h-10 h-6" onClick={()=>createCourse()}>Criar Curso</button>
                            </div>
                            <div className="md:mt-14 mt-2">
                                <h2 className="font-bold md:text-xl text-lg">Cursos existentes</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg md:mt-0 mt-8">
                        <table className="w-full h-fill">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left  pl-2">Nome</th>
                                    <th className="text-center w-2 px-2">Renomear</th>
                                    <th className="text-center w-2 px-2">Visualizar</th>
                                    <th className="text-center w-2 px-2">Excluir</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                courses.map((item) => (
                                    <tr key={item._id}>
                                        <td className="text-left pl-2 py-1 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{renameCourse(item._id)}}> <Pencil className="mx-auto"/> </td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{viewCourse(item._id)}}> <EyeOpened className="mx-auto"/> </td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>deleteCourse(item._id)}> <Trash className="mx-auto"/> </td>
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