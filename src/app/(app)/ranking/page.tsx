"use client"

import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, Trash} from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

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

type Ranking = {
    user_id: string
    user_name: string
    score: number
}

type User = {
    _id: string
    name: string
    email: string
    paying: string
    is_admin: boolean
    answered_questions: number
    points: number
}

export default function Ranking() {
  const { user } = useAuth();
  const router = useRouter();
  const myTheme = useTheme();
  const { showToast } = useToast();
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [disciplineSelected, setDisciplineSelected] = useState("");
  const [allrank, setAllRank] = useState<Ranking[]>([]);

  useEffect( () => {
    document.title = "Sinapse - Ranking"
    getAllDisciplines()
    getAllUsers();
  }, [])

  async function getAllDisciplines(){
    const response = await sinapseAPI.get("/subjects");
    setAllDisciplines(response.data);
    filterDisciplinesByUser(response.data)
  }

  async function getAllUsers(){
    const response = await sinapseAPI.get("/users");
    setAllUsers(response.data);
  }

  function filterDisciplinesByUser(disciplines: Discipline[]) {
    const filtered = disciplines.filter(d =>
        d.user_id === user?._id ||
        d.students_ids.includes(user?._id || "")
    )

    setAllDisciplines(filtered)
    }

  async function getRanking(){
    if (disciplineSelected == ""){
        showToast("Selecione uma disciplina antes", "info")
        return
    }else{
        try{
            const response = await sinapseAPI.get(`/subjects/ranking/${disciplineSelected}`)
            setAllRank(response.data)
        }catch(error){
          showToast("Ocorreu um erro de servidor, tente mais tarde!", "error");
        }
    }
  }

  function getUserDetails(user_id: string, getPointsOrClassification: string){
    const user = allUsers.find(user => user._id == user_id)
    if (getPointsOrClassification == "points"){
        return user?.points;
    }else{
        return getClassification(user?.points!);
    }
}

  function getClassification(points: number){
    if (points <= 1000){
        return "Café com leite";
    } else if (points > 1000 && points <= 2000){
        return "Iniciante"
    } else if (points > 2000 && points <= 3000){
        return "Guerreiro"
    } else if (points > 3000 && points <= 4000){
        return "Focado"
    } else if (points > 4000 && points <= 8000){
        return "Pegando Fogo"
    } else if (points > 8000 && points <= 16000){
        return "Intermediário"
    } else if (points > 16000 && points <= 20000){
        return "Avançado"
    } else if (points > 20000 && points <= 30000){
        return "Profissional"
    } else if (points > 30000 && points <= 40000){
        return "Imparável"
    } else if (points > 40000 && points <= 60000){
        return "Maldoso"
    } else if (points > 60000 && points <= 80000){
        return "Negociante de almas"
    } else if (points > 80000 && points <= 90000){
        return "Tenebroso"
    } else if (points > 90000 && points <= 100000){
        return "Imbatível"
    } else if (points > 100000 && points <= 150000){
        return "Inalcançável"
    } else if (points > 150000 && points <= 200000){
        return "Dono do jogo"
    } else if (points > 200000){
        return "Aposentado do Saber"
    }
  }

  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center md:h-20">
      <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Ranking</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-lg font-bold">Disciplina:</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <select value={disciplineSelected} onChange={ (e) => setDisciplineSelected(e.target.value)} className="cursor-pointer bg-(--input-back) text-(--input-fore) font-bold md:w-200 w-fill h-10 rounded-lg">
                                    <option value="">Selecione</option>
                                    {
                                        allDisciplines.map( (discipline) => (
                                            <option key={discipline._id} value={discipline._id}>{discipline.name}</option>
                                        ) )
                                    }
                                </select>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 h-10" onClick={()=>{getRanking()}}>Buscar</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg md:mt-0 mt-8">
                        {
                        allrank.length > 0 && (
                        <table className="w-full h-fill">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm md:text-lg">
                                <tr>
                                    <th className="text-left pl-2">Usuário</th>
                                    <th className="text-center pl-2">Pontos</th>
                                    <th className="text-center">Pontuação Acumulada</th>
                                    <th className="text-center">Classificação</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore) text-sm md:text-lg">
                                {
                                allrank && (
                                    allrank.map((user) => (
                                    <tr key={user.user_id} className="border border-gray-500">
                                        <td className="text-left pl-2"> {user.user_name}</td>
                                        <td className="text-center h-12" onClick={()=>{}}> {Math.round(user.score)}</td>
                                        <td className="text-center" onClick={()=>{}}> {getUserDetails(user.user_id, "points")}</td>
                                        <td className="text-center" onClick={()=>{}}> {getUserDetails(user.user_id, "classification")}</td>
                                    </tr>
                                ))
                                )
                                }
                            </tbody>
                        </table>
                        )
                        }
                        {allrank.length == 0 && (
                        <div className="text-center py-10 text-lg">
                            <h2>Esta disciplina ainda não possui histórico de respostas!</h2>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
)
}