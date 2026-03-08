"use client"

import { LocalAPI, sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons"
import { useRouter } from "next/navigation";
import { Modal } from "@/app/components/modal/Modal";

type Ranking = {
  user_id: number;
  answered_questions: number;
  correct_answers: number;
}

type Discipline = {
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
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const myTheme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect( () => {
    getDisciplines();
  }, [])

  async function getDisciplines(){
    const response = await LocalAPI.get("/courses");
    setDisciplines(response.data);
  }

  function handleDeleteDiscipline(id: number){
      setModalVisible(true)
  }

  async function deleteByID(id: number){
      const response = await sinapseAPI.get("")
  }


  return (
  <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>

    <Modal message="Deseja remover esta disciplina?" textButton="Remover" active={modalVisible} onClose={()=>{setModalVisible(false)}} onConfirm={()=>{}} showInput={false} subText=""></Modal>

    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pl-4 text-center md:border border-0">
      <h2 className="font-bold md:text-2xl text-lg justify-center flex pt-6 md:pt-8 pb-2 md:mb-0 border md:border-0">Disciplinas disponíveis</h2>
      <button className="md:w-50 mt-2 mb-6 ml-10 mr-10 md:h-14 md:mt-3 h-12 font-bold cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300 rounded-lg" onClick={()=>{router.push("/discipline/create")}}>+ Criar Disciplina</button>
    </header>
    
    <div style={{backgroundColor:myTheme.theme.screenBack}}>
      
      <div className="flex flex-wrap justify-center gap-4 py-4">
          {

          disciplines.map((item) => (
            <div key={item.id} className="md:w-130 w-84 border h-fill pb-4 bg-(--card-back) rounded-lg font-bold text-2xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
              
                <div className="ml-4 mr-5 mt-4 flex flex-row justify-between">
                  <h2 className="bg-(--card-hover) rounded-lg pl-2 pr-2 md:h-auto h-7 border overflow-hidden text-base md:text-2xl">{item.description}</h2>
                </div>

                <div className="md:mt-6 mt-2 mr-2 md:ml-18 ml-10">
                  <h2 className="overflow-hidden text-base md:text-3xl">{item.name}</h2>
                  {item.quizzes_ids.length > 1 ? ( <h2 className="md:mt-4 text-base md:text-2xl"> {item.quizzes_ids.length} Quizzes Disponíveis </h2> ) : ( <h2 className="text-base md:text-2xl md:mt-4"> {item.quizzes_ids.length} Quiz Disponível </h2> )}
                </div>

                <div className="mt-4 md:mt-10">
                {
                  <>
                    {
                      !item.visibility && (
                      <div className="flex flex=row items-center justify-left ml-4 md:ml-12">
                          <button className="h-10 bg-(--button-enter) hover:bg-(--button-enter-hover) duration-300 text-(--button-fore) flex items-center text-lg gap-2 px-5 rounded-lg cursor-pointer" onClick={()=> router.push("/discipline")}> Entrar </button>
                      </div>
                      )
                    }
                    
                    {
                      item.visibility && (
                      <div className="flex flex=row items-center justify-center h-10">
                        <div className="flex flex-row w-full justify-center md:gap-14 gap-4">
                          <button className=" h-10 bg-(--button-enter) hover:bg-(--button-enter-hover) text-(--button-fore) duration-300 flex items-center text-lg gap-2 px-5 rounded-lg cursor-pointer" onClick={()=> router.push("/discipline")} > Entrar</button>
                          <button className=" h-10 bg-(--button-edit) hover:bg-(--button-edit-hover) duration-300 flex items-center text-lg gap-2 md:gap-4 px-2 rounded-lg cursor-pointer" onClick={()=> router.push("/discipline/edit")} ><img src={ myTheme.mode == "light" ? Pencil.src : PencilLight.src } className="w-5 h-5"/> Editar</button>
                          <button className=" h-10 bg-(--button-delete) hover:bg-(--button-delete-hover) duration-300 flex items-center text-lg gap-2 md:gap-4 px-2 rounded-lg cursor-pointer" onClick={()=> handleDeleteDiscipline(item.id)}><img src={ myTheme.mode == "light" ? Trash.src : TrashLight.src } className="w-5 h-5"/> Excluir</button>
                        </div>
                      </div>
                      )
                    }
                  </>
                }
                </div>
              </div>
          ))
          
          }

      </div>
    </div>
  </div>
)
}