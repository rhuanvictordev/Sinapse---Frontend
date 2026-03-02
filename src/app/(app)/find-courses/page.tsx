"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LocalAPI } from "@/services/api";

type Course = {
  id: string;
  name: string;
  creator: string;
  code: string;
}

type Category = {
  id: string;
  name: string;
}

export default function FindCourses() {
  const { user, login, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect( () => {
      getCategories();
    }, [])

  async function getCourses(){
    const response = await LocalAPI.get("/find");
    setCourses(response.data);
  }

  async function getCategories(){
    const response = await LocalAPI.get("/categories");
    setCategories(response.data);
  }

  return (
  <div className="flex flex-col h-full">
    <header className="h-fill md:mb-10 mb-4 md:pl-4 md:pr-4 flex items-center">
      <div className="flex flex-col w-full">
        <div className="md:mb-4">
          <h2 className="font-bold text-2xl">Encontrar Cursos Públicos</h2>
        </div>
        
        <div className="flex flex-col md:flex-row font-bold md:mb-3 text-xl md:h-10">
          <h2 className="font-bold">Categoria: &nbsp;</h2>
              <select className="bg-[#2C79D0] md:w-200 text-white md:rounded-lg cursor-pointer h-10">
                {
                  categories.map((item) => (
                    <option key={item.id} value={item.id} className="font-bold">{item.name}</option>
                  ))
                }
              </select>
              <div className="md:flex md:flex-row flex-col md:flex-1 md:justify-end">
                &nbsp;<h2>Código:</h2>
                &nbsp;<input type="text" className="bg-[#2C79D0] md:rounded-lg text-white md:pl-2 md:w-60 w-50 h-10 mb-4 md:mb-0" maxLength={14}/>
              </div>
        </div>

        <div className="flex md:flex-row flex-col mb-5">
          <h2 className="font-bold text-xl md:mt-1 md:ml-10">Nome:</h2>
          &nbsp;<input type="text" className="bg-[#2C79D0] w-full md:rounded-lg h-10 text-white text-xl font-bold pl-2" maxLength={80}/>
        </div>
        <div className="w-full text-center">
          <button className="font-bold text-xl bg-[#000C5C] text-white p-1 pl-8 pr-8 md:rounded-lg cursor-pointer hover:bg-blue-500 duration-300" onClick={getCourses}>Buscar</button>
        </div>
      </div>
    </header>

    <div className="bg-white flex-1 md:rounded-2xl md:text-center md:p-4 p-2 shadow-2xl overflow-x-scroll">

        <table className="md:w-full md:text-xl text-sm font-bold border-separate border-spacing-y-4">
          <thead className="md:h-14">
            <tr>
              <th className="text-left md:pl-6">Nome</th>
              <th className="text-left md:text-center">Criador</th>
              <th className="text-left md:text-center">Código</th>
              <th className="md:w-100 w-16">Opções</th>
            </tr>
          </thead>

          <tbody>
            {
            courses.map((item) => (
              <tr key={item.code} className="bg-blue-200 hover:bg-blue-300 transition duration-300">
                <td className="px-2 md:px-0">{item.name}</td>
                <td className="px-2 md:px-0">{item.creator}</td>
                <td className="px-2 md:px-0">{item.code}</td>
                <td className="md:p-2">
                  <button className="bg-[#000C5C] text-white text-xs md:text-lg md:px-4 py-2 px-1 rounded-lg hover:bg-blue-500 transition duration-300 cursor-pointer"> Juntar-se </button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
        
    </div>
  </div>
)
}