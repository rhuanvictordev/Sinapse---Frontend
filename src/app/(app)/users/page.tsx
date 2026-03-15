"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/contexts/ThemeContext";
import { sinapseAPI } from "@/services/api";
import { Pencil, PencilLight, Trash, TrashLight } from "@/app/components/icons";

type User = {
    _id: string
    name: string
    email: string
    paying: string
    is_admin: boolean
    answered_questions: number
    points: number
}


export default function UsersPage(){
const router = useRouter();
const { user, loading } = useAuth();
const {showToast} = useToast();
const myTheme = useTheme();
const [users, setUsers] = useState<User[]>([]);

const [modalVisible, setModalVisible] = useState(false)
const [id, setId] = useState("");
const [name, setName] = useState("");
const [email, setEmail] = useState("");

const [modalLabelName, setModalLabelName] = useState("");
const [modalName, setModalName] = useState("");
const [modalEmail, setModalEmail] = useState("");
const [modalPassword, setModalPassword] = useState("");
const [modalADM, setModalADM] = useState("N");

const [userSelected, setUserSelected] = useState<User | null>(null)


useEffect( () => {
    document.title = "Sinapse - Usuários"
    if ( !loading && !user?.is_admin){
        router.push("/home")
        showToast("Você não tem permissão para acessar esta página!", "error");
        return
    }
} )

function editUser(user: User){
    setUserSelected(user)
    setModalLabelName(user.name)
    setModalName(user.name)
    setModalEmail(user.email)
    setModalPassword("")
    setModalADM(user.is_admin ? "Y" : "N")
    setModalVisible(true)
}


function closeModal(){
    setUserSelected(null)
    setModalLabelName("")
    setModalName("")
    setModalEmail("")
    setModalPassword("")
    setModalADM("N")
    setModalVisible(false)
}

async function updateUser(){

if(modalName==""||modalEmail==""||modalPassword==""||modalADM==""){
    showToast("Preencha todos os campos", "error")
    console.log("ID do usuario logado: " + user?._id)
}
else{
    const obj = {
        name: modalName,
        email: modalEmail,
        password: modalPassword,
        paying: true,
        is_admin: modalADM == "Y" ? true : false,
        answered_questions: user?.answered_questions,
        points: user?.points
    }
        try {
        const response = await sinapseAPI.patch(`/users/${userSelected?._id}`, obj)
        if (response.status == 200){
            showToast("Usuário atualizado com sucesso!")
        }
        } catch (error) {
            showToast("Erro ao atualizar o usuário")
        }
        closeModal()
        getUsers()
    }
}

async function deleteUser(id: string){
    if (confirm("Confirma a remoção deste usuário?")){
        try {
            const response = await sinapseAPI.delete(`/users/${id}`)
            if (response.status == 200){
                showToast("Usuário removido com sucesso!", "success")
                getUsers()
            }
        } catch (error) {
            showToast("Não foi possível excluir o usuário!", "error")
            console.log("Erro ao excluir usuario")
        }
    }
}


async function getUsers(){
    try {
        const response = await sinapseAPI.get("/users")
        setUsers(response.data)
    } catch (error) {
        showToast("Ocorreu um erro ao buscar os usuários!", "error")
        console.log("Erro ao buscar usuarios")
    }
}

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
                    <div className="w-full items-center flex flex-col md:flex-col md:gap-2 gap-2">
                        <div className="w-full">
                            <h2 className="font-bold">Id:</h2>
                            <input value={id} onChange={(e)=>setId(e.target.value)} type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/>
                        </div>
                        <div className="w-full">
                            <h2 className="font-bold">Nome:</h2>
                            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/>
                        </div>
                        <div className="w-full">
                            <h2 className="font-bold">E-mail:</h2>
                            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" className="border bg-(--input-back) text-(--input-fore) pl-1 h-8 text-sm font-normal rounded-lg w-full"/> 
                        </div>
                    </div>
                </div>
                <div className="mt-4 justify-center flex">
                    <button onClick={()=>getUsers()} className="px-4 py-1 mb-4 rounded-lg bg-(--button-back) hover:bg-(--button-hover) duration-300 text-(--button-fore) font-bold cursor-pointer">Buscar</button>
                </div>
                <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden font-bold rounded-lg border md:mt-0 mt-8">
                    <table className="w-full h-fill border-collapse">
                        <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover)">
                            <tr>
                                <th className="text-left border pl-2 md:py-3">Nome</th>
                                <th className="text-center border px-2">Email</th>
                                <th className="text-left border px-2">Pontuação</th>
                                <th className="text-center border px-2 w-10">Editar</th>
                                <th className="text-center border px-2 w-10">Remover</th>
                            </tr>
                        </thead>

                        <tbody className="bg-(--area-back) text-(--area-fore)">
                        {
                        users.map((item) => (
                        <tr key={item._id}>
                            <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)"> {item.name} </td>

                            <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)"> {item.email} </td>

                            <td className="text-left border pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)"> {item.points} </td>

                            <td className="text-center border py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=> editUser(item)}>
                                <img className="inline-block" src={myTheme.mode == "light" ? Pencil.src : PencilLight.src} alt="pencil"/>
                            </td>

                            <td className="text-center border py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer" onClick={()=> deleteUser(item._id)}>
                                <img className="inline-block" src={myTheme.mode == "light" ? Trash.src : TrashLight.src} alt="trash"/>
                            </td>
                        </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>







    <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-240 w-120 md:h-160 h-140 rounded-2xl shadow-xl">
                <div className="mt-2 text-center font-bold">
                    <h2 className="text-2xl">Atualizar dados do usuário</h2>
                    <h2 className="text-lg mt-2">{modalLabelName}</h2>
                </div>
                <div className="flex flex-col ml-2 mr-2 mt-4">
                    <div className="ml-2 mr-2">
                        <h2 className="font-bold mb-1">Nome:</h2>
                        <input value={modalName} onChange={(e) => setModalName(e.target.value)} type="text" className="bg-(--input-back) text-(--input-fore) pl-2 w-full h-8 md:mb-6 mb-3 rounded-lg" />
                    </div>
                    <div className="ml-2 mr-2"> 
                        <h2 className="font-bold mb-1">Email:</h2>
                        <input value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} type="text" className="bg-(--input-back) text-(--input-fore) pl-2 w-full h-8 md:mb-6 mb-3 rounded-lg" />
                    </div>
                    <div className="ml-2 mr-2">
                        <h2 className="font-bold mb-1">Senha:</h2>
                        <input value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} type="text" className="bg-(--input-back) text-(--input-fore) pl-2 w-full h-8 md:mb-6 mb-3 rounded-lg" />
                    </div>
                    <div className="ml-2 mr-2">
                        <h2 className="font-bold mb-1">Administrador:</h2>
                        <select value={modalADM} onChange={(e)=>setModalADM(e.target.value)} className="bg-(--select-back) text-(--select-fore) w-full h-8 md:mb-6 mb-3 rounded-lg">
                            <option value="N">Não</option>
                            <option value="Y">Sim</option>
                        </select>
                    </div>
                    <div className="items-center justify-center flex mt-26 gap-8">
                        <button onClick={()=>closeModal()} className="bg-(--button-delete) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Cancelar</button>
                        <button onClick={()=>{updateUser()}} className="bg-(--button-back) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Salvar</button>
                    </div>
                </div>
            </div>
        </div>








</div>
)
}