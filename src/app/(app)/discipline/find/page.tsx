"use client"
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
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

export default function Home() {
  const { user, login, logout } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([])
  const [disciplinesFiltered, setDisciplinesFiltered] = useState<Discipline[]>([])
  const myTheme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Encontrar Disciplinas"
    getAllDisciplines();
    getSemesters();
  }, [])

    useEffect(() => {
    filterAndShow()
    }, [selectedSemester, searchName, searchCode])

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters");
    setSemesters(response.data);
  }

  async function getAllDisciplines(){
    const response = await sinapseAPI.get("/subjects");
    setAllDisciplines(response.data);
    setDisciplinesFiltered(response.data);
  }

  function filterAndShow(){
  const filtered = allDisciplines.filter(discipline =>
    (!selectedSemester || discipline.semester_id === selectedSemester) &&
    (!searchName || discipline.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchCode || discipline.invitation_code == searchCode)
  )
  setDisciplinesFiltered(filtered)
}

function getSemesterName(id: string){
    const semester = semesters.find((semester) => semester._id == id)
    return semester?.name
}


async function subscribe(discipline: Discipline){
    try {
        const obj = {
            user_id: user!._id,
            invitation_code: discipline.invitation_code
        }
        const response = await sinapseAPI.post(`/subjects/subscribe-user/${discipline._id}`, obj)
        if (response.status == 201){
            showToast("Você tem uma nova disciplina disponível!","success")
        }
    } catch (error: any) {
        const msg = error?.response?.data?.msg || "Ocorreu um erro ao tentar se juntar a disciplina"
        showToast("msg","error")
    }
}

  return (
  <div>
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    
        <header className="flex flex-col md:justify-between justify-center border-black pl-2 mb-2">
            <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Encontrar Disciplinas</h2>
        </header>
        
        <div className="w-full h-full bg-(--area-back) p-2">
            <div className="w-fill h-fill md:px-2">
                <div className="h-fill">
                    <div className="w-fill text-center md:text-left">
                        <div className="flex md:flex-col md:gap-4">
                            <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Semestre:</h2>
                                    <select value={selectedSemester} onChange={(e)=>{setSelectedSemester(e.target.value)}} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option value="">Todos</option>
                                        {
                                        semesters.map( (item)=>(
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Nome:</h2>
                                    <input value={searchName} maxLength={100} onChange={(e)=>setSearchName(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>

                                <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                    <h2 className="text-sl font-bold">Código:</h2>
                                    <input value={searchCode} maxLength={8} onChange={(e)=>setSearchCode(e.target.value)} className="md:w-60 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-(--input-fore) h-10 font-bold"></input>
                                </div>
                                
                                {/* <div>
                                    <button className="w-40 h-10 mt-2 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={()=>{filterAndShow()}}>Buscar</button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-4 pl-2">
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border">
                        <table className="w-150 md:w-full h-fill border-collapse text-sm overflow-scroll">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm md:text-lg">
                                <tr>
                                    <th className="border text-left pl-2">Semestre</th>
                                    <th className="border">Disciplina</th>
                                    <th className="border">Juntar-se</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                            {
                            disciplinesFiltered.map((discipline) => (
                                <tr key={discipline._id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{getSemesterName(discipline.semester_id)}</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{discipline.name}</td>
                                    <td className="border text-center py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={(e)=>subscribe(discipline)}>▶</td>
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