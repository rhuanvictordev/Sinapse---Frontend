"use client"
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Pencil, Sun, Trash, User } from "@/app/components/icons"
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sinapseAPI } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";
import { socket } from "../../../services/socket";

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
    document.title = "Sinapse - Duelo"

    getAllDisciplines();
    getAllQuizzes();
    
    //socket.on("connect", () => {console.log("Conectado:", socket.id);});
    //socket.on("joined-room", (data) => {console.log(data.message);});

    socket.on("room-created", (data) => {
        showToast("Sala criada com sucesso", "success")
        setRoomCode(data.roomCode);
        setJoinedRoom(true);
    });

    socket.on("player-joined", (data) => {
      showToast("Jogador conectado", "success");
      const otherPlayer = data.players.find((player: any) => player.socketId !== socket.id);
      if (otherPlayer){
          setPlayer2Name(otherPlayer.username);
      }
      setModalVisible(false);
      setJoinedRoom(true);
    });

      socket.on("room-not-found", (data) => {
          showToast("Sala não encontrada!", "info")
      });

      socket.on("started-game", () => {
        showToast("Iniciando o duelo!", "success", 2000)
        setTimeout( () =>{
          router.push("/duel/play");
        }, 2000)
      });

      socket.on("room-full", (data) => {
          showToast("Sala lotada!", "info")
      });

      socket.on("player-left", () => {
      showToast("O Jogador saiu da sala. Redirecionando, aguarde... ", "info");
      setTimeout(() => {window.location.href = "/duel";}, 2500);
      });

      return () => {
        //socket.off("connect");
        //socket.off("joined-room");
        socket.off("room-created");
        socket.off("player-joined");
        socket.off("room-not-found");
        socket.off("room-full");
        socket.off("player-left");
        socket.off("started-game");
    };

  }, []);

  async function getAllDisciplines() {
      try {
          const response = await sinapseAPI.get("/subjects");
          setAllDisciplines(response.data);

          setDisciplinesFiltred(
              response.data.filter((d: Discipline) =>
                  d.students_ids.includes(user?._id || "")
              )
          );

      } catch (error) {
          showToast("Erro ao obter as disciplinas", "error")
      }
  }

  async function getAllQuizzes() {
      try {
          const response = await sinapseAPI.get("/quizzes");
          setAllQuizzes(response.data);

      } catch (error) {
          showToast("Erro ao obter os quizzes", "error")
      }
  }

  async function getQuiz(quizID: string){
    const response = await sinapseAPI.get(`/quizzes/${quizID}`);
    setQuiz(response.data);
  }
  
  async function createRoom(){
    if (roomCode == ""){
        if (selectedQuiz == ""){
          showToast("Selecione um Quiz para criar uma sala!", "info");
          return;
        }else{
          if (!quiz){
            showToast("Carregando Quiz...", "info");
            await getQuiz(selectedQuiz);
            showToast("Erro ao criar a sala, tente novamente.", "info");
            return;
          }else{
            socket.emit("create-room", {username: user?.name});
          }
        }
    } else {
        showToast("A sala já foi criada.", "info");
    }
  }

  function joinRoom(){
        socket.emit("join-room", {
        roomCode,
        username: user?.name
    })
  }

  function setCreatingRoom(value: boolean){
    if (!choiced){
        if (value == true){
        setModalVisible(false);
        setCreator(value);
      }else{
        setCreator(value);
      }
      setChoiced(true);
    }else{
      joinRoom()
    }
  }

  function filterAndShowQuizzes(disciplineID: string){

    const discipline = disciplinesFiltred.find(
        d => d._id === disciplineID
    );

    if(!discipline){
        setQuizzesFiltred([]);
        return;
    }

    const filtered = allQuizzes.filter(q =>
        discipline.quizzes_ids.includes(q._id)
    );

    setQuizzesFiltred(filtered);
}


  function startGame(){
    if (!roomCode){
      showToast("Sala não encontrada", "error");
      return
    }

    if (!quiz){
      showToast("Quiz não encontrado", "error");
      return
    }

    socket.emit("start-game", {roomCode, quiz});
  }
  

  return(
    <div className="p-4 gap-4 flex flex-col items-center justify-center text-center text-(--foreground) pb-0">
      <div className="w-full">
        <h2 className="text-2xl text-left w-full font-bold">Duelo</h2>
      </div>
      {
        (choiced && creator) && (
          <div className="w-full text-(--foreground) bg-(--area-back) h-fill py-4">
          <div className="pl-2 pr-2">
             <h2 className="text-lg text-start py-2 mb-1 font-bold">Disciplina:</h2>
             <select onChange={(e) => {const value = e.target.value; setSelectedDiscipline(value); filterAndShowQuizzes(value);}} className="w-full bg-(--select-back) h-8 rounded-lg cursor-pointer font-bold">
              <option value="">Selecione</option>
              {
                disciplinesFiltred.map((d)=>(
                    <option key={d._id} value={d._id}>{d.name}</option>
                ))
              }
             </select>
          </div>

          <div className="pl-2 pr-2">
             <h2 className="text-lg text-start py-2 mb-1 font-bold">Quiz:</h2>
             <select onChange={(e) => {const value = e.target.value; setSelectedQuiz(value); getQuiz(value);}} className="w-full bg-(--select-back) h-8 rounded-lg cursor-pointer font-bold">
              <option value="">Selecione</option>
              {
                  quizzesFiltred.map((q) => (
                      <option key={q._id} value={q._id}>
                          {q.name}
                      </option>
                  ))
              }
             </select>
          </div>

          <div className="pl-2 pr-2 mt-6 gap-4 flex flex-row justify-center">
             <button onClick={() => createRoom()} className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold">Criar Sala</button>
            </div>
      </div>
        )
      }

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
          {
            (roomCode != "" && creator && player2Name) && (
              <div className="pl-2 pr-2 mt-6">
                <button className="bg-(--button-enter) px-4 py-1 rounded-lg text-(--button-fore) hover:bg-(--button-hover) duration-300 cursor-pointer font-bold" onClick={()=> startGame()}>Iniciar Competição</button>
              </div>
            )
          }
          {
            (roomCode && !creator) && (
              <div>
                <h2>Aguardando o criador iniciar o jogo...</h2>
              </div>
            )
          }
      </div>
          <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-150 w-full md:h-100 h-80 rounded-2xl shadow-xl">
                    <div className="mt-4 text-center font-bold">
                        <h2 className="md:text-2xl text-lg">Duelo</h2>
                        {
                          creator && (
                            <h2 className="md:text-lg text-lg mt-4">Escolha uma opção:</h2>
                          )
                        }
                        {
                          !creator && (
                            <div className="mt-8">
                              <h2>Informe o código da partida:</h2>
                              <input maxLength={6} value={roomCode} onChange={(e)=>{setRoomCode(e.target.value.toUpperCase())}} type="text" className="text-center text-3xl bg-(--input-back) text-(--input-fore) pl-2 w-70 my-4 h-16 md:mb-6 mb-3 rounded-lg" />
                            </div>
                          )
                        }
                        <div className="items-center justify-between flex mt-8 gap-8 pl-10 pr-10">
                            {
                              creator && (
                                <button onClick={() => setCreatingRoom(true)} className="bg-blue-500 hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-full h-12 rounded-lg">Criar Partida</button>
                              )
                            }
                            {
                              choiced && (
                                <button onClick={() => router.push("/home")} className="bg-red-600 hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-full h-12 rounded-lg">Cancelar</button>
                              )
                            }
                            <button onClick={() => setCreatingRoom(false)} className="bg-blue-500 hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-full h-12 rounded-lg">Entrar na partida</button>
                        </div>
                        {
                          !choiced && (
                            <div className="my-20">
                              <button onClick={() => router.push("/home")} className="bg-red-600 hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-50 h-12 rounded-lg">Cancelar</button>
                            </div>
                          )
                        }
                        
                    </div>
                </div>
            </div>      
    </div>
  )
}