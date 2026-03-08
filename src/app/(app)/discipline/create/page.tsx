"use client"
import { ScrollToTopButton } from "@/app/components/scroll/ScrollTop";
import { useAuth } from "@/contexts/AuthContext";
import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Trash } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Semester = {
  _id: string
  name: string
}

export default function CreateDiscipline() {
  const { user, login, logout } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [created, setCreated] = useState(false);
  const myTheme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [semesterSelected, setSemesterSelected] = useState("");
  const [restrict, setRestrict] = useState("");

  useEffect( () => {
    getSemesters();
  }, [])

  async function getSemesters(){
    const response = await sinapseAPI.get("/semesters");
    setSemesters(response.data);
  }

  async function createDiscipline(){
    if(name == "" || semesterSelected == "" || restrict == ""){
        showToast("Verifique os campos!","info")
        return
    }else{
        setCreated(true)
        showToast("Disciplina criada com sucesso!","success")
        const response = await sinapseAPI.post("/disciplines")
    }

    
  }

  if (!created){ return (
    <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4 text-center border md:h-20 border-black">
        <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Criação de nova disciplina</h2> {/* titulo externo */}
        </header>
        <div className="p-0 h-full"> {/* paddind da area interna */}
            <div className="w-full h-full bg-(--area-back)"> {/* area interna */}
                {/* conteudo inicio */}
                <div className="md:w-260 flex flex-col md:items-end">
                    <div className="flex flex-col pt-6 md:gap-8 gap-4">
                    <div className="flex md:flex-row flex-col">
                        <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Semestre:</h2>
                        <select value={semesterSelected} onChange={(e)=>setSemesterSelected(e.target.value)} className="md:w-200 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                            <option value="">Selecione</option>
                            {
                            semesters.map((item)=>(
                                <option key={item._id}>{item.name}</option>
                            ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex flex-col pt-6 md:gap-8 gap-4">
                    <div className="flex md:flex-row flex-col">
                        <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Nome:</h2>
                        <input maxLength={50} type="text" className="bg-(--input-back) text-(--input-fore) md:w-200 ml-2 mr-2 w-fill rounded-lg pl-2 md:ml-4 h-10 font-bold" value={name} onChange={(e)=> setName(e.target.value)} />
                    </div>
                </div>
                    <div className="flex flex-col pt-6 md:gap-8 gap-4">
                        <div className="flex md:flex-row flex-col">
                            <h2 className="md:text-xl text-xl font-bold text-center md:text-left mb-2">Privar disciplina:</h2>
                            <select value={restrict} onChange={(e)=>setRestrict(e.target.value)} className="md:w-200 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                <option value="">Selecione</option>
                                <option value="Y" >Sim</option>
                                <option value="N" >Não</option>
                            </select>
                        </div>
                        <div className="pt-10 flex md:justify-end justify-center">
                            <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) w-40 h-10 md:mr-2 font-bold rounded-lg cursor-pointer" onClick={() => createDiscipline()}>Criar</button>
                        </div>
                    </div>
                </div>
                {/* conteudo fim */}
            </div>
        </div>
    </div>
    )
  } else { return (

        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        <div className="p-0 h-full"> {/* paddind da area interna */}
            <div className="w-full h-full bg-(--area-back)"> {/* area interna */}
                {/* conteudo inicio */}
                <div className="md:w-160 flex flex-col md:items-end">
                    <div className="flex flex-col pt-6 md:gap-8 gap-4">
                        <div className="flex md:flex-row flex-col">
                            <h2 className="md:text-3xl text-xl font-bold text-center md:text-left mb-2 mt-20">Disciplina Criada!</h2>
                        </div>
                        <div className="flex md:flex-row flex-col mt-20 md:mt-0">
                            <h2 className="md:text-xl text-lg font-bold text-center md:text-left mb-2 ml-10 md:ml-0 mr-10">Navegue até a página inicial para começar a criar quizzes.</h2>
                        </div>
                        <div className="pt-10 flex md:justify-end justify-center">
                            <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) w-40 h-10 md:mr-2 font-bold rounded-lg cursor-pointer" onClick={()=> router.push("/home")}>Página Inicial</button>
                        </div>
                    </div>
                </div>
                {/* conteudo fim */}
            </div>
        </div>
    </div>
    )
  }
}