"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

type Semester = {
  _id: string
  name: string
}

export default function Home() {
  const { user, login, logout, loading } = useAuth();
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const myTheme = useTheme();
  const { showToast } = useToast();
  const [name, setName] = useState("");

  useEffect( () => {
    document.title = "Sinapse - Semestres"
    if ( !loading && !user?.is_admin){
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
        showToast("Preencha o nome do Semestre!","info")
        return
    }
    try {
        await sinapseAPI.post("/semesters", {userId: user!._id, name: name} )
        showToast("Semestre criado com sucesso!","success")
        setName("")
        getSemesters();
     } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao criar o Semestre"
      showToast(message, "error")
    }
  }

  async function deleteSemester(id: string){
    if (confirm("Deseja excluir este Semestre?")){
        try {
        await sinapseAPI.delete(`/semesters/${id}`, { data: { userId: user!._id }})
        showToast("Semestre removido com sucesso!", "success")
        getSemesters();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erro ao remover o Semestre"
            showToast(message, "error")
        }
        }
    }

    async function renameSemester(id: string){
        const name = prompt("Digite um novo nome para este Semestre")
        if (name == null) {
            return
        }
        if (name.trim() == ""){
            showToast("Insira um nome válido!", "info")
            return
        }
        try {
        await sinapseAPI.put(`/semesters/${id}`, {userId: user!._id, name: name})
        showToast("Semestre renomeado!", "success")
        getSemesters();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erro ao renomear o Semestre"
            showToast(message, "error")
        }
    }

  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center border md:h-20 border-black">
      <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Semestres</h2>
    </header>
      
    <div className="w-full h-full bg-(--area-back)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="flex flex-col h-fill">
                <div className="h-fill">
                    <div>
                        <div className="w-fill h-40 text-center md:text-left">
                            <div className="md:mt-8 mt-0">
                                <h2 className="text-lg font-bold">Criar Semestre</h2>
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-4 gap-4">
                                <input type="text" className="border bg-(--input-back) pl-2 text-(--input-fore) font-bold md:w-200 w-fill h-10 rounded-lg md:mb-0 mb-2 md:mt-0 mt-2" maxLength={50} value={name} onChange={(e) => setName(e.target.value)}/>
                                <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) font-bold rounded-lg cursor-pointer duration-300 md:px-4 md:py-2 h-10" onClick={()=>createSemester()}>Criar</button>
                            </div>
                            <div className="md:mt-14 mt-2">
                                <h2 className="font-bold md:text-xl text-lg">Semestres existentes</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border md:mt-0 mt-8">
                        <table className="w-full h-fill border-collapse">
                            <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                                <tr>
                                    <th className="text-left border pl-2 md:py-3">Nome</th>
                                    <th className="text-center border pl-2 md:py-3 w-24">Renomear</th>
                                    <th className="text-left border pl-2 md:py-3 w-20">Remover</th>
                                </tr>
                            </thead>
                            <tbody className="bg-(--area-back) text-(--area-fore)">
                                {
                                semesters.map((item) => (
                                    <tr key={item._id}>
                                        <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                        <td className="border pl-10 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{renameSemester(item._id)}} ><img src={myTheme.mode == "light" ? Pencil.src : PencilLight.src } alt="trash" /></td>
                                        <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>deleteSemester(item._id)} ><img src={myTheme.mode == "light" ? Trash.src : TrashLight.src } alt="trash" /></td>
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