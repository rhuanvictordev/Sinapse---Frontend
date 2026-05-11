"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { useEffect, useRef, useState } from "react"
import { LoadingIcon } from "@/app/components/icons"
import { socket } from "../../../../services/socket";

type Question = {
    question: string
    possible_answers: string[]
    answer: number[]
    weight: number
    boolean_answer: boolean
}

type QuizResponse = {
    _id: string
    name: string
    description: string
    user_id: string
    questions: Question[]
}

export default function playQuizDuel(){
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [myProgress, setMyProgress] = useState(0);
    const [enemyProgress, setEnemyProgress] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [quizName, setQuizName] = useState("");
    const correctSound = useRef<HTMLAudioElement | null>(null);
    const wrongSound = useRef<HTMLAudioElement | null>(null);
    const [enemyName, setEnemyName] = useState("Carregando...");
 
    useEffect(() => {
        correctSound.current = new Audio("/sounds/correct.mp3"); correctSound.current.load();
        wrongSound.current = new Audio("/sounds/wrong.mp3"); wrongSound.current.load();
        
        const loadingTimeout = setTimeout(() => {
            router.push("/duel");
            showToast("Ocorreu um erro ao conectar-se à partida.", "error");
        }, 4000);

        socket.on("next-question", (data) => {
            clearTimeout(loadingTimeout)
            setQuizName(data.quizName)
            setAnswered(false);
            setQuizQuestions(data.questions);
            setQuestion(data.question);
            setCurrentQuestion(data.currentQuestion);
            setTotalQuestions(data.totalQuestions);
            setEnemyName(data.players?.find((player: any) => player.socketId !== socket.id).username);
        });

        
        socket.on("player-left", () => {
            showToast("O Jogador saiu da sala. Aguarde... ", "info");
            setTimeout(() => {window.location.reload() }, 1500);
        });

        socket.on("player-progress", (data) => {
            if (data.player == user?.name){
                setMyProgress(data.progress);
                setMyScore(data.score)
            } else {
                setEnemyName(data.player)
                setEnemyProgress(data.progress);
                setEnemyScore(data.score)
            }

            if (data.correct){
                if (data.player == user?.name){
                    correctSound.current?.play();
                    showToast("Você acertou!", "success", 1400);
                } else {
                    correctSound.current?.play();
                    showToast(`${data.player} acertou!`, "gray", 1400);
                }
            } else {
                if (data.player == user?.name){
                    wrongSound.current?.play();
                    showToast("Você errou!", "error", 1400);
                } else {
                    wrongSound.current?.play();
                    showToast(`${data.player} errou!`, "gray", 1400);
                }
            }
        });

        socket.on("player-finished", (data) => {
            if (data.player == user?.name){
                showToast("Você terminou o quiz!", "info", 3000);
            } else {
                showToast(`${data.player} terminou o quiz!`, "info", 3000);
            }
            setTimeout(() => {
                router.push("/duel/result");
            }, 3000);
        });

        return () => {
            clearTimeout(loadingTimeout);
            socket.off("next-question");
            socket.off("player-answered");
            socket.off("player-left");
            socket.off("player-progress");
        }

    }, []);

    function sendAnswer(answerIndex: number){

    if (!question || answered){
        return;
    }

    setAnswered(true);

    const correct = question.answer.includes(answerIndex);

    socket.emit("answer-question", {
        correct,
        currentQuestion: currentQuestion + 1,
        totalQuestions
    });

    setTimeout(() => {

        if (currentQuestion + 1 < totalQuestions){

            setCurrentQuestion(prev => prev + 1);

            setQuestion(
                quizQuestions[currentQuestion + 1]
            );

            setAnswered(false);

        } else {

            socket.emit("finish-game");

        }

    }, 1200);

}


    // const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0
    const progressPlayer1 = myProgress;
    const progressPlayer2 = enemyProgress;

    if (question != null) 
        return (
        <div className="w-full text-center items-center justify-center flex flex-col pb-10 text-(--foreground) pl-2 pr-2">
            <div className="flex w-full h-fill flex-row justify-between items-center bg-(--area-back) rounded-lg overflow-auto gap-10">
                <h2 className="font-bold md:text-2xl text-xs pl-2 text-left">Quiz: {quizName}</h2>
                {
    (myScore > 0 || enemyScore > 0) && (
        <div className="w-fill px-4 h-full">
            <h2 className="font-bold pr-2 text-right text-lg">Pontuação:</h2>

            {
                (myScore > enemyScore) && (
                    <>
                        <h2 className="font-bold pr-2 text-right text-green-500">
                            Eu: {myScore}
                        </h2>

                        <h2 className="font-bold pr-2 text-right text-red-800">
                            {enemyName}: {enemyScore}
                        </h2>
                    </>
                )
            }

            {
                (myScore < enemyScore) && (
                    <>
                        <h2 className="font-bold pr-2 text-right text-red-800">
                            Eu: {myScore}
                        </h2>

                        <h2 className="font-bold pr-2 text-right text-green-500">
                            {enemyName}: {enemyScore}
                        </h2>
                    </>
                )
            }
        </div>
    )
}
            </div>
            
            <div className="flex flex-col mt-4">
                <div className="flex flex-row gap-10 font-bold">
                    
                    <div>
                        <h2 className="text-left">Eu</h2>
                        <div className="flex flex-row justify-center align-middle text-center items-center gap-2">
                            <h2>{progressPlayer1}%</h2>
                        <div className="h-3 bg-blue-200 md:w-80 w-full rounded-lg">
                            <div className="bg-green-500 h-3 rounded-lg transition-all duration-300" style={{ width: `${progressPlayer1}%` }}></div>
                        </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-left">{enemyName}</h2>
                        <div className="flex flex-row justify-center align-middle text-center items-center gap-2">
                            <h2>{progressPlayer2}%</h2>
                            <div className="h-3 bg-blue-200 md:w-80 w-full rounded-lg">
                                <div className="bg-green-500 h-3 rounded-lg transition-all duration-300" style={{ width: `${progressPlayer2}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-xl font-bold">
                <h2 className="text-sm md:text-xl">Pergunta {currentQuestion + 1} de {totalQuestions}</h2>
                <h2 className="md:mt-10 mt-4 font-bold md:text-3xl text-lg">{question.question}</h2>
            </div>
            <div className="bg-(--area-back) rounded-lg py-4 w-full h-fill mt-10 flex flex-col gap-3 md:gap-6 text-center items-center justify-center">
                {
                question?.possible_answers.map((answer, index) => (
                    <div key={index} onClick={() => sendAnswer(index)} className="md:h-18 h-fill py-3 md:w-200 w-full bg-blue-200 text-black items-center text-center justify-center flex rounded-xl hover:bg-blue-400 duration-300 cursor-pointer">
                        <h2 className="font-bold md:text-2xl text-xs">{answer}</h2>
                    </div>
                ))
                }
            </div>
        </div>
    )
    

    return (
        <div className="w-full h-full text-center items-center justify-center flex flex-col text-(--foreground) gap-8">
            <div className="w-fill h-fill bg-(--area-back) p-10 items-center text-center align-middle justify-center flex flex-col rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
                <h2 className="font-bold">Carregando Dados</h2>
                <h2>Aguarde</h2>
                <img src={LoadingIcon.src} className="w-10 mt-4"/>
            </div>
        </div>
    )
    
}