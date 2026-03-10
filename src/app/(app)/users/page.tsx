"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function UsersPage(){
const router = useRouter();
const { user, loading } = useAuth();
const {showToast} = useToast();
const myTheme = useTheme();

useEffect( () => {
    if ( !loading && !user?.is_admin){
        router.push("/home")
        showToast("Você não tem permissão para acessar esta página!", "error");
        return
    }
} )


return (
<div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
    <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4  text-center border md:h-20 border-black">
        <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Usuários</h2>
    </header>
    
    <div className="w-full h-full bg-(--area-back) text-(--foreground)">
        <div className="w-fill h-fill md:p-4 p-2 md:px-2">
            <div className="h-fill ml-2 mr-2">
                <div className="mb-4">
                    <h2 className="text-lg font-bold">Encontrar Usuários</h2>
                </div>
                <div className="items-center justify-center flex flex-col">
                    <div className="w-full items-center flex flex-col md:flex-row md:gap-4 gap-2">
                        <div className="w-full">
                            <h2 className="font-bold">Id:</h2>
                            <input type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/>
                        </div>
                        <div className="w-full">
                            <h2 className="font-bold">Nome:</h2>
                            <input type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/>
                        </div>
                        <div className="w-full">
                            <h2 className="font-bold">E-mail:</h2>
                            <input type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/> 
                        </div>
                    </div>
                </div>
                <div className="mt-4 justify-center flex">
                    <button className="px-4 py-1 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) font-bold cursor-pointer">Buscar</button>
                </div>
                <div className="mt-8">
                    <table className="w-full h-fill border-collapse">
                        <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                            <tr className="h-8">
                                <th className="text-left border pl-2">Nome</th>
                                <th className="text-center border px-2">E-mail</th>
                                <th className="text-center border px-2">ADM</th>
                            </tr>
                        </thead>
                        <tbody className="bg-(--area-back) text-(--area-fore)">
                            {/* {
                            semesters.map((item) => (
                                <tr key={item._id}>
                                    <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{item.name}</td>
                                    <td className="border pl-10 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>{renameSemester(item._id)}} ><img src={myTheme.mode == "light" ? Pencil.src : PencilLight.src } alt="trash" /></td>
                                    <td className="border pl-6 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=>deleteSemester(item._id)} ><img src={myTheme.mode == "light" ? Trash.src : TrashLight.src } alt="trash" /></td>
                                </tr>
                            ))
                            } */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
)
}