"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";
import { socket } from "../../../../services/socket";

type Player = {
  socketId: string
  username: string
  score: number
}

type Question = {
  question: string
  possible_answers: string[]
  answer: number[]
  boolean_answer: boolean
  weight: number
}

type Quiz = {
  categories_ids: string[]
  description: string
  name: string
  questions: Question[]
  user_id: string
  _id: string
}

type DuelResult = {
  currentQuestion: number
  players: Player[]
  quiz: Quiz
  started: boolean
}

export default function Duel() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<DuelResult>();

  
  useEffect(() => {
    document.title = "Sinapse - Resultado do Duelo"
    socket.emit("result");

    socket.on("duel-results", (data) => {
      setData(data.result);
    });

    return () => {
      socket.off("duel-results");
    };
  }, []);




  if (!data) return null;

  const player1 = data.players[0];
  const player2 = data.players[1];
  const winner = player1.score > player2.score ? player1 : player2;
  const loser = player1.score > player2.score ? player2 : player1;
  const isTie = player1.score === player2.score;

  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      <div className="w-full">
      </div>
      
      <div className="w-full text-(--foreground) bg-(--area-back) h-fill py-4">
          <div className="w-full h-10">
              
          </div>
          <div className="w-full h-fill pb-10 flex flex-col justify-between items-center">
              <div className="flex flex-row md:gap-20 gap-10 text-center mt-10">
                  
              </div>
          </div>
      </div>
          <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${true ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-150 w-full md:h-100 h-80 rounded-2xl shadow-xl">
                    <div className="mt-4 text-center font-bold">
                        <h2 className="md:text-2xl text-lg mb-2">Resultados do Duelo</h2>
                          <h2 className="text-sm mb-2 md:mb-12 font-normal">Quiz: <strong className="font-bold">{data?.quiz.name}</strong></h2>
                        {
                          !isTie && (
                            <div className="text-center ml-4 mr-4 gap-2 flex flex-col">
                          <div className="py-2"><hr /></div>
                          <div>
                              <h2 className="font-bold">
                                  <strong className="font-normal text-green-500">Vencedor: </strong>
                                  {isTie ? "" : winner.username}
                                </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {winner.score}
                              </h2>
                          </div>
                          <div className="py-2"><hr /></div>
                          <div className="mt-0">
                              <h2 className="font-bold">
                                <strong className="font-normal text-red-500">Perdedor: </strong>
                                {isTie ? "" : loser.username}
                              </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {loser.score}
                              </h2>
                          </div>
                          <hr />
                        </div>
                          )
                        }

                        {
                          isTie && (
                            <div className="text-center ml-4 mr-4 gap-2 flex flex-col">
                          <div className="py-2"><hr /></div>
                          <div>
                              <h2 className="font-bold">
                                  {isTie ? "" : winner.username}
                                </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {winner.score}
                              </h2>
                          </div>
                          <div className="py-2"><hr /></div>
                          <div className="mt-0">
                              <h2 className="font-bold">
                                {isTie ? "" : loser.username}
                              </h2>

                              <h2 className="font-bold">
                                <strong className="font-normal">Pontos: </strong>
                                {loser.score}
                              </h2>
                          </div>
                          <hr />
                        </div>
                          )
                        }
                        <div className="mt-6">
                            <button onClick={() => {window.location.href = ("/duel")}} className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold">Continuar</button>
                          </div>
                    </div>
                </div>
            </div>      
    </div>
  )
}