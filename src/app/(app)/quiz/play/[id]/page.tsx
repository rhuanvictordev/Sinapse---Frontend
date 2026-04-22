"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { useEffect, useRef, useState } from "react"
import { sinapseAPI } from "@/services/api"

type Question = {
    question: string
    possible_answers: string[]
    answer: number
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

type Ranking = {
    student_id: string
    answered_questions: number
    correct_answers: number
}

type Discipline = {
    _id: string
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: Ranking[]
}

export default function playQuizPage(){
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [quizDiscipline, setQuizDiscipline] = useState<Discipline>()
    const [quiz, setQuiz] = useState<QuizResponse>()
    const params = useParams();
    const searchParams = useSearchParams();
    const subjectId = searchParams.get('subject');
    const [points, setPoints] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [correctAnsweredQuestions, setCorrectAnsweredQuestions] = useState(0);
    
    const correctSound = new Audio("/sounds/correct.mp3")
    const wrongSound = new Audio("/sounds/wrong.mp3")

    useEffect(() => {
        getQuiz(params.id)
        getDiscipline(subjectId!)
    }, [])

    useEffect(() => {
        if (user) {
            setAnsweredQuestions(user.answered_questions ?? 0)
        }
    }, [user])


    async function getDiscipline(subjectId: string){
        try {
            const response = await sinapseAPI.get(`/subjects/${subjectId}`)
            setQuizDiscipline(response.data)
        } catch (error: any) {
            showToast("Erro ao obter a disciplina do Quiz", "error")
        }
    }

    async function getQuiz(id: any){
        try {
            const response = await sinapseAPI.get(`/quizzes/${id}`)
            if (response.data.questions.length == 0){
                showToast("O quiz não possui perguntas!", "info")
                router.push("/home")
            }else{
                setQuiz(response.data)
                console.log("Quiz obtido: ", response.data)
            }
        } catch (error: any) {
            showToast("Ocorreu um erro ao obter os dados do Quiz", "info")
            router.push("/home")
        }
    }

    async function finalizeQuiz(finalPoints: number){
        try {
            const updatedDiscipline = buildUpdatedDiscipline();
            const { invitation_code, ...DTOupdatedDiscipline } = updatedDiscipline!;
            console.log(DTOupdatedDiscipline)

            const response = await sinapseAPI.patch(`/subjects/${subjectId}`, DTOupdatedDiscipline);

            if (response.status == 200){
                const totalPoints = (user?.points ?? 0) + finalPoints;

                const userResponse = await sinapseAPI.patch(`/users/${user?._id}`, {
                    points: totalPoints
                });

                if (userResponse.status === 200){
                    showToast("Quiz finalizado, Total de Pontos: " + finalPoints,"success")

                    setTimeout(() => {
                        window.location.href = "/home";
                    }, 1500);
                }
            }

        } catch (error) {
            showToast("Erro ao finalizar o quiz", "error")
        }
    }


    function buildUpdatedDiscipline() {
        if (!quizDiscipline || !user) return quizDiscipline;

        const existingIndex = quizDiscipline.ranking.findIndex(
            rank => rank.student_id === user._id
        );

        let updatedRanking;

        if (existingIndex !== -1) {
            updatedRanking = quizDiscipline.ranking.map((rank, index) => {
                if (index === existingIndex) {
                    return {
                        ...rank,
                        answered_questions: answeredQuestions,
                        correct_answers: correctAnsweredQuestions
                    };
                }
                return rank;
            });
        } else {
            updatedRanking = [
                ...quizDiscipline.ranking,
                {
                    student_id: user._id,
                    answered_questions: answeredQuestions,
                    correct_answers: correctAnsweredQuestions
                }
            ];
        }

        return {
            ...quizDiscipline,
            ranking: updatedRanking
        };
    }

    function nextQuestion(updatedPoints?: number){
        if (currentQuestion >= quiz!.questions.length - 1){
            finalizeQuiz(updatedPoints ?? points)
        }else{
            setCurrentQuestion(prev => prev + 1)
        }
    }

    async function verifyAnswer(questionText: string, indexAnswer: number){
        const newAnsweredQuestions = answeredQuestions + 1
        setAnsweredQuestions(newAnsweredQuestions)
        console.log("texto da questao:", questionText, "resposta:", indexAnswer)

        try {
            const response = await sinapseAPI.patch(`/users/${user?._id}`,{ answered_questions: newAnsweredQuestions })
            if (response.status === 200){
                const responseAnswer = await sinapseAPI.post(`/quizzes/answer/${quiz!._id}`,
                    { userAnswer: indexAnswer },
                    { params: { questionText } }
                )
                if (responseAnswer.data === true){
                    const newPoints = points + Number(quiz?.questions[currentQuestion].weight)
                    setPoints(newPoints)
                    setCorrectAnsweredQuestions(prev => prev + 1)
                    showToast("Acertou","success")
                    correctSound.play()
                    nextQuestion(newPoints)
                } else {
                    const newPoints = points >= Number(quiz?.questions[currentQuestion].weight) ? points - Number(quiz?.questions[currentQuestion].weight) : points
                    setPoints(newPoints)
                    showToast("Errou","error")
                    wrongSound.play()
                    nextQuestion(newPoints)
                }
            }
        } catch (error: any) {
            showToast("Ocorreu um erro ao verificar a resposta", "error")
        }
    }


    const totalQuestions = quiz?.questions?.length ?? 0
    const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0
    
    if (quiz != null)
    return (
        <div className="w-full text-center items-center justify-center flex flex-col pb-10 text-(--foreground) pl-2 pr-2">
            <div className="flex w-full h-16 flex-row justify-between items-center bg-(--area-back) rounded-lg overflow-auto gap-10">
                <h2 className="font-bold md:text-2xl text-xs pl-2 text-left">{quiz.name}</h2>
                <h2 className="font-bold md:text-2xl text-xs pr-2 text-right">Pontuação: {points}</h2>
            </div>
            
            <div className="h-6 bg-blue-200 md:w-300 w-full md:mt-10 mt-4 rounded-lg">
                <div className="bg-green-500 h-6 rounded-lg transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="mt-4 text-xl font-bold">
                <h2 className="text-sm md:text-xl">Pergunta {currentQuestion + 1} de {quiz.questions.length}</h2>
                <h2 className="md:mt-10 mt-4 font-bold md:text-3xl text-lg">{quiz.questions[currentQuestion].question}</h2>
            </div>
            <div className="bg-(--area-back) rounded-lg py-4 w-full h-fill mt-10 flex flex-col gap-3 md:gap-6 text-center items-center justify-center">
                {
                   quiz.questions[currentQuestion].possible_answers.map( (answer, index) => (
                        <div key={index} onClick={ (e)=> verifyAnswer(quiz.questions[currentQuestion].question, index) } className="md:h-18 h-fill py-3 md:w-200 w-full bg-blue-200 text-black items-center text-center justify-center flex rounded-xl hover:bg-blue-400 duration-300 cursor-pointer">
                            <h2 className="font-bold md:text-2xl text-xs">{answer}</h2>
                        </div>
                    ) )
                }
            </div>
        </div>
    )
}