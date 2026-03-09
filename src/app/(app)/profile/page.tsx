"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();

  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      <h1 className="text-2xl mb-10 font-bold mt-2">Perfil do Usuário</h1>
      <img src={user?.image == null ? User.src : user.image} alt="logo_user" />
      <h1 className="text-xl text-gray-400">ID: {user?._id}</h1>
      <h1 className="text-xl">Nome: {user?.name}</h1>
      <h1 className="text-xl">E-mail: {user?.email}</h1>
      <h1 className="text-xl">Quizzes respondidos: {user?.answered_questions}</h1>
      <h1 className="text-xl">Pontuação acumulada: {user?.points}</h1>
      <h1 className="text-xl">Status do Pagamento: {user?.paying == true? "Pendente" : "Pago"}</h1>
      <div className="cursor-pointer flex flex-col text-center" onClick={myTheme.toggleTheme}>
        {/*

      <div className="flex flex-row justify-center items-center gap-4">
        <h2>Alternar Tema:</h2>
        <img src={myTheme.mode == "light"? Moon.src : Sun.src} alt="" className="flex justify-center items-center bg-white rounded-full p-1" />
      </div>
        
        */}
      </div>
    </div>
  )
}