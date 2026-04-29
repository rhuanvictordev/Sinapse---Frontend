"use client"
import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Add, Pencil, Trash, } from "@/app/components/icons";
import { useRouter } from "next/navigation";
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
  const { user, login, logout } = useAuth();
  const [courseSemesters, setCourseSemesters] = useState<Semester[]>([]);
  const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([])
  const [disciplinesFiltered, setDisciplinesFiltered] = useState<Discipline[]>([])
  const myTheme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Encontrar Disciplinas"
    getSemesters();
    getCourses();
    getAllDisciplines();
  }, [])

    useEffect(() => {
    filterAndShow()
    }, [selectedSemester, searchName, searchCode, selectedCourse])

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters");
    setAllSemesters(response.data);
  }

  async function getCourses(){
    const response = await sinapseAPI.get("/courses");
    setCourses(response.data);
    setAllCourses(response.data);
  }

  async function getAllDisciplines(){
    const response = await sinapseAPI.get("/subjects");
    setAllDisciplines(response.data);
    setDisciplinesFiltered(response.data);
  }

  function showCourseSemesters(courseID: string){
        const course = courses.find(c => c._id === courseID);
        if (!course) {
            setCourseSemesters([]);
            return;
        }
        const filteredSemesters = allSemesters.filter(s =>
        course.semesters_ids.includes(s._id)
        );
        setCourseSemesters(filteredSemesters);
  }

  function filterAndShow(){
    const filtered = allDisciplines.filter(discipline =>
    (!selectedCourse || discipline.semester_id.split("-")[1] === selectedCourse) &&
    (!selectedSemester || discipline.semester_id.split("-")[0] === selectedSemester) &&
    (!searchName || discipline.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchCode || discipline.invitation_code == searchCode)
    )
    setDisciplinesFiltered(filtered)
  }

function getSemesterName(id: string){
    const part = id.split("-");
    const semester = allSemesters.find((semester) => semester._id == part[0])
    return semester?.name
}

function getCourseName(id: string){
    const part = id.split("-");
    const course = allCourses.find((course) => course._id == part[1])
    return course?.name
}


async function subscribe(discipline: Discipline){
    try {
        const obj = {
            user_id: user!._id,
            invitation_code: discipline.invitation_code
        }
        const response = await sinapseAPI.post(`/subjects/subscribe-user/${discipline._id}`, obj)
        if (response.status == 201){
            showToast("A disciplina foi fixada no painel principal","success")
        }
    } catch (error: any) {
        const msg = error?.response?.data?.msg || "Ocorreu um erro ao tentar se juntar a disciplina"
        showToast(msg,"error")
    }
}

  return (
  <div>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3 md:pl-2">Disciplinas</h2>
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="w-fill text-center md:text-left">
                        <div className="flex md:flex-col md:gap-4">
                            <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Curso:</h2>
                                    <select value={selectedCourse} onChange={(e)=>{setSelectedCourse(e.target.value); showCourseSemesters(e.target.value)}} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-8 text-xs font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        {
                                        courses.map( (item)=>(
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Período:</h2>
                                    <select value={selectedSemester} onChange={(e)=>{setSelectedSemester(e.target.value);}} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-8 text-xs font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        {
                                        courseSemesters.map( (item)=>(
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Disciplina:</h2>
                                    <input placeholder="Nome da disciplina" value={searchName} maxLength={100} onChange={(e)=>setSearchName(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-8 text-xs font-bold"></input>
                                </div>

                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Código:</h2>
                                    <input placeholder="Código da disciplina" value={searchCode} maxLength={8} onChange={(e)=>setSearchCode(e.target.value)} className="md:w-60 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-8 text-xs font-bold"></input>
                                </div>
                                        
                                {/* <div>
                                    <button className="w-40 h-10 mt-2 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{filterAndShow()}}>Buscar</button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-4 pl-2">
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg">
                        <table className="w-150 md:w-full h-fill border-collapse text-sm overflow-scroll">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm md:text-lg">
                                <tr>
                                    <th className="text-left pl-2 px-2">Curso</th>
                                    <th className="text-left px-2">Semestre</th>
                                    <th className="text-left px-2">Disciplina</th>
                                    <th className="w-20 text-center px-2">Fixar</th>
                                </tr>
                            </thead>

                            <tbody className="bg-(--area-back) text-(--area-fore) text-sm md:text-sm">
                                {disciplinesFiltered.map((discipline) => (
                                    <tr key={discipline._id}>
                                        <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                            {getCourseName(discipline.semester_id)}
                                        </td>

                                        <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                            {getSemesterName(discipline.semester_id)}
                                        </td>

                                        <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                            {discipline.name}
                                        </td>

                                        <td
                                            className="text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"
                                            onClick={() => subscribe(discipline)}
                                        >
                                            <Add className="align-middle w-full" />
                                        </td>
                                    </tr>
                                ))}
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