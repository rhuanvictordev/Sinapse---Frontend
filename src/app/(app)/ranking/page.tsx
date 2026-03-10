"use client"

import { Categories, Logo, Persons, Sun, Trash } from "@/app/components/icons"

export default function Ranking() {
  return (
  <div className="w-full h-full text-(--foreground) pr-2 pl-2">
      <header className="h-12 md:h-18 flex items-center justify-center">
          <h2 className="text-center font-bold text-xl">Ranking Atual</h2>
      </header>
      
      <div className="items-center justify-center flex">
          <div className="font-bold text-center flex flex-col md:flex-row gap-2 w-full ml-2 mr-2">
              <div className="w-full">
                <h2 className="text-lg mb-2">Selecione a disciplina:</h2>
                <select className="bg-(--select-back) text-(--select-fore) rounded-lg w-full h-8 cursor-pointer" name="" id="">
                <option value="">Selecione</option>
                <option value="">B</option>
              </select>
              </div>
          </div>
      </div>

      <div className="text-center mt-4">
        <button className="font-bold bg-(--button-back) text-(--button-fore) hover:bg-(--button-hover) duration-300 px-4 py-1 rounded-lg cursor-pointer">Buscar</button>
      </div>

      <div className="mt-10 "> 
            
        <table className="w-full h-fill border-collapse">
          <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm">
            <tr className="h-10 border">
              <th className="border px-2 max-w-16">Posição</th>
              <th className="border px-2">Foto</th>
              <th className="border px-2">Nome</th>
              <th className="border px-2">Pontos</th>
              <th className="border px-2">Classificação</th>
            </tr>
          </thead>
          <tbody className="bg-(--area-back) text-(--area-fore) text-sm">
          {
            <tr className="h-10">
              <td className="border text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">1º</td>
              <td className="border h-10 justify-center items-center flex text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                <img className="w-5 h-5" src={Sun.src} alt="image" />
              </td>
              <td className="border text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">Administrador</td>
              <td className="border text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">5600</td>
              <td className="border text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">Lendário</td>
            </tr>
          }
          </tbody>
        </table>

      </div>
  </div>
)
}