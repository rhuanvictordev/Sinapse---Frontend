"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";
import { socket } from "../../../../services/socket";

type Discipline = {
    _id: string
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    students_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: []
}

type Question = {
    question: string
    possible_answers: string[]
    answer: number
    weight: number
    boolean_answer: boolean
}

type Quiz = {
    _id: string
    name: string
    description: string
    user_id: string
    questions: Question[]
}

export default function Duel() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [creator, setCreator] = useState(true);
  const [choiced, setChoiced] = useState(false);
  const [player2Name, setPlayer2Name] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([])
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
  const [quizzesFiltred, setQuizzesFiltred] = useState<Quiz[]>([])
  const [disciplinesFiltred, setDisciplinesFiltred] = useState<Discipline[]>([])
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quiz, setQuiz] = useState<Quiz>();
  
  useEffect(() => {
    document.title = "Sinapse - Resultado do Duelo"
    
    socket.on("room-created", (data) => {
        showToast("Sala criada com sucesso", "success")
        setRoomCode(data.roomCode);
        setJoinedRoom(true);
    });

      return () => {
        socket.off("room-created");
    };

  }, []);

  
  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      <div className="w-full">
      </div>
      
      <div className="w-full text-(--foreground) bg-(--area-back) h-fill py-4">
          <div className="w-full h-10">
              {
                (roomCode != "" && joinedRoom) && (
                  <h2 className="font-bold md:text-xl text-lg">Código da Sala: {roomCode}</h2>
                )
              }
          </div>
          <div className="w-full h-fill pb-10 flex flex-col justify-between items-center">
              <div className="flex flex-row md:gap-20 gap-10 text-center mt-10">
                  {
                    roomCode != "" && (
                      <div className="justify-center align-middle text-center items-center flex flex-col">
                        <User size={70}/>
                        <h2 className="font-bold">{user?.name}</h2>
                      </div>
                    )
                  }
                  {
                    player2Name != "" && (
                      <div className="flex flex-col justify-center">
                        <h2 className="font-bold text-3xl">VS</h2>
                      </div>
                    )
                  }
                  {
                    player2Name != "" && (
                      <div className="justify-center align-middle text-center items-center flex flex-col">
                        <User size={70}/>
                        <h2 className="font-bold">{player2Name}</h2>
                      </div>
                    )
                  }
              </div>
          </div>
      </div>
          <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-150 w-full md:h-100 h-80 rounded-2xl shadow-xl">
                    <div className="mt-4 text-center font-bold">
                        <h2 className="md:text-2xl text-lg mb-2">Resultados do Duelo</h2>
                          <h2 className="text-sm mb-2 md:mb-12 font-normal">Quiz: <strong className="font-bold">{"TesteX"}</strong></h2>
                        <div className="text-center ml-4 mr-4 gap-2 flex flex-col">
                          <hr />
                          <div>
                              <h2 className="font-bold">
                                <strong className="font-normal">Perdedor: </strong>
                                {"winnerName"}
                              </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {"winnerName"}
                              </h2>
                          </div>
                          <div className="py-4"><hr /></div>
                          <div className="mt-0">
                              <h2 className="font-bold">
                                <strong className="font-normal">Perdedor: </strong>
                                {"winnerName"}
                              </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {"winnerName"}
                              </h2>
                          </div>
                          <hr />
                        </div>
                        <div className="mt-6">
                            <button onClick={() => {window.location.href = ("/duel")}} className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold">Continuar</button>
                          </div>
                    </div>
                </div>
            </div>      
    </div>
  )
}