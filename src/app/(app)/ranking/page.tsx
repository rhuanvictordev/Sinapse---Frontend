"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LocalAPI } from "@/services/api";
import UserImage from "@/../assets/images/user.png";

type Rank = {
  id: string;
  position: string;
  image?: string;
  name: string;
  score: string;
  classification: string;
}

type Course = {
  code: number;
  name: string;
}

export default function Ranking() {
  const { user, login, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);

  useEffect( () => {
      getMyCourses();
    }, [])

  async function getMyCourses(){
    const response = await LocalAPI.get("/find");
    setCourses(response.data);
  }

  async function getRanks(){
    const response = await LocalAPI.get("/rank");
    setRanks(response.data);
  }

  return (
  <div className="flex flex-col h-full">
    <header className="h-fill mb-10 pl-4 pr-4 flex items-center">
      <div className="flex flex-col w-full">
        <div className="mb-4">
          <h2 className="font-bold text-2xl">Ranking Atual: </h2>
        </div>
        
        <div className="flex md:flex-row flex-col font-bold md:mb-3 mb-4 text-xl md:text-xl h-20 md:h-10">
          <h2 className="font-bold">Curso: &nbsp;</h2>
              <select className="bg-[#2C79D0] w-full text-white rounded-lg cursor-pointer md:text-lg text-sm md:h-10 h-12">
                {
                  courses.map((item) => (
                    <option key={item.code} value={item.name} className="font-bold">{item.name}</option>
                  ))
                }
              </select>
        </div>

        <div className="w-full text-center">
          <button className="font-bold text-xl bg-[#000C5C] text-white p-1 pl-8 pr-8 rounded-lg cursor-pointer hover:bg-blue-500 duration-300" onClick={getRanks}>Buscar</button>
        </div>
      </div>
    </header>

    <div className="bg-white flex-1 rounded-2xl text-center p-4 shadow-2xl">

        <table className="md:w-full md:text-xl text-sm font-bold border-separate border-spacing-y-4">
          <thead className="md:h-14">
            <tr>
              <th className="">Posição</th>
              <th className="pl-2 md:pl-0">Imagem</th>
              <th className="">Nome</th>
              <th className="">Pontos</th>
              <th className="">Divisão</th>
              <th className="">Id</th>
            </tr>
          </thead>

          <tbody>
            {
            ranks.map((item) => (
              <tr key={item.id} className="bg-blue-200 hover:bg-blue-300 transition duration-300">
                <td className="px-2 md:px-0">{item.position}</td>
                <td>
                  <div className="flex justify-center">
                    <img src={item.image? item.image : UserImage.src} alt="profile_img" className="w-15 h-15 rounded-full"/>
                  </div>
                </td>
                <td className="px-2 md:px-0">{item.name}</td>
                <td className="px-2 md:px-0">{item.score}</td>
                <td className="px-2 md:px-0">{item.classification}</td>
                <td className="px-2 md:px-0">{item.id}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
        
    </div>
  </div>
)
}