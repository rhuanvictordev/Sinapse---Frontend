"use client"

import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, Trash } from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

type Semester = {
  _id: string
  name: string
}

type Discipline = {
    _id: string
    name: string
    semester_id: string
}

export default function Home() {
  const { user, login, logout, loading } = useAuth();
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const myTheme = useTheme();
  const { showToast } = useToast();
  const [name, setName] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Períodos"
    if ( !loading && !(user?.type == "Admin")){
        router.push("/home")
        showToast("Você não tem permissão para acessar esta página!", "error");
        return
    }
    getSemesters();
  }, [])

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters")
    setSemesters(response.data);
  }

  async function createSemester(){
    if(name == ""){
        showToast("Preencha o nome do Período!","info")
        return
    }
    try {
        await sinapseAPI.post("/semesters", {userId: user!._id, name: name} )
        showToast("Período criado com sucesso!","success")
        setName("")
        getSemesters();
     } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao criar o Período"
      showToast(message, "error")
    }
  }

    async function deleteSemester(semesterID: string) {
        if (!confirm("Deseja excluir este Período?")) return;

        try {
            const { data: disciplines } = await sinapseAPI.get("/subjects");

            const toDelete = disciplines.filter(
            (d: any) => d.semester_id === semesterID
            );
            await Promise.all(
                toDelete.map((d: any) =>
                    sinapseAPI.delete(`/subjects/${d._id}`)
                )
            );

            await sinapseAPI.delete(`/semesters/${semesterID}`, {
            data: { userId: user!._id },
            });

            showToast("Período removido com sucesso!", "success");
            getSemesters();

        } catch (error: any) {
            const message =
            error?.response?.data?.message || "Erro ao remover o Período";
            showToast(message, "error");
        }
    }

    async function renameSemester(id: string){
        const name = prompt("Digite um novo nome para este Período")
        if (name == null) {
            return
        }
        if (name.trim() == ""){
            showToast("Insira um nome válido!", "info")
            return
        }
        try {
            await sinapseAPI.put(`/semesters/${id}`, {userId: user!._id, name: name})
            showToast("Período renomeado!", "success")
            getSemesters();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erro ao renomear o Período"
            showToast(message, "error")
        }
    }

  return (
  <div className="flex flex-col h-full text-xs md:text-lg" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center md:h-20">
      <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Períodos</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-lg font-bold">Criar Período</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <input placeholder="Nome do novo período" type="text" className="bg-(--input-back) pl-2 text-(--input-fore) font-bold md:w-200 w-fill md:h-10 h-8 rounded-lg md:mb-0 md:mt-0 mt-2" maxLength={50} value={name} onChange={(e) => setName(e.target.value)}/>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 md:h-10 h-6" onClick={()=>createSemester()}>Criar</button>
                            </div>
                            <div className="md:mt-14 mt-2">
                                <h2 className="font-bold md:text-xl text-lg">Períodos existentes</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg md:mt-0 mt-8">
                        <table className="w-full h-fill">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left  pl-2">Nome</th>
                                    <th className="text-center w-2 px-2">Renomear</th>
                                    <th className="text-center w-2 px-2">Remover</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                semesters.map((item) => (
                                    <tr key={item._id}>
                                        <td className="text-left pl-2 py-1 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{renameSemester(item._id)}}> <Pencil className="mx-auto"/> </td>
                                        <td className="  bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>deleteSemester(item._id)}> <Trash className="mx-auto"/> </td>
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