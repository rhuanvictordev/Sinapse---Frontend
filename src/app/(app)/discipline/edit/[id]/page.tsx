"use client"

import { useAuth } from "@/contexts/AuthContext";
import {  sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Add, Pencil, Trash } from "@/app/components/icons";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Discipline = {
    _id: string
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    students_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: string[]
}

type Semester = {
    _id: string
    name: string
}

type Course = {
    _id: string
    name: string
    semesters_ids: string[]
}

type Quiz = {
    _id: string
    name: string
    description: string
    user_id: string
    questions: []
    categories_ids: []
}

export default function EditDiscipline() {
    const { user, login, logout } = useAuth();
    const myTheme = useTheme();
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const disciplineID = params.id;
    const [allCourses, setAllCourses] = useState<Course[]>([])
    const [allsemesters, setAllSemesters] = useState<Semester[]>([])
    const [courseSemesters, setCourseSemesters] = useState<Semester[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([])

    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [newDisciplineName, setNewDisciplineName] = useState("");
    const [newDisciplineDescription, setNewDisciplineDescription] = useState("");
    const [newRestrict, setNewRestrict] = useState("");

    const [newQuizName, setNewQuizName] = useState("");
    const [newQuizDescription, setNewQuizDescription] = useState("");
    const [courseSelected, setCourseSelected] = useState("");
    const [semesterSelected, setSemesterSelected] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [showAllQuizzes, setShowAllQuizzes] = useState(false);

    useEffect(() => {
        document.title = "Sinapse - Editar Disciplina"
        getCourses();
        getSemesters();
        getQuizzes();
        getDiscipline();
    }, []);

    useEffect(() => {
        if (courseSelected && allCourses.length && allsemesters.length) {
            showCourseSemesters(courseSelected);
        }
    }, [courseSelected, allCourses, allsemesters]);

    function openModal() {
        setNewQuizName("")
        setNewQuizDescription("")
        setModalVisible(true)
    }

    function closeModal() {
        setNewQuizName("")
        setNewQuizDescription("")
        setModalVisible(false)
    }

    async function getDiscipline() {
        try {
            const response = await sinapseAPI.get(`/subjects/${disciplineID}`);
            setDiscipline(response.data);
            setSemesterSelected(response.data.semester_id.split("-")[0])
            setCourseSelected(response.data.semester_id.split("-")[1])
            setNewDisciplineName(response.data.name)
            setNewDisciplineDescription(response.data.description)
        } catch (error) {
            showToast("Erro ao obter detalhes da disciplina", "error")
            router.push("/home")
        }
    }

    async function getSemesters() {
        try {
            const response = await sinapseAPI.get("/semesters");
            setAllSemesters(response.data);
        } catch (error) {
            showToast("Erro ao obter os semestres", "error")
        }
    }

    async function getCourses() {
        try {
            const response = await sinapseAPI.get("/courses");
            setAllCourses(response.data);
        } catch (error) {
            showToast("Erro ao obter os cursos", "error")
        }
    }

    async function getQuizzes() {
        try {
            const response = await sinapseAPI.get(`/quizzes/user-quizzes/${user?._id}`);
            setQuizzes(response.data);
        } catch (error) {
            showToast("Erro ao obter os quizzes", "error")
        }
    }

    async function deleteQuiz(id: string){
        try{
            const response = await sinapseAPI.delete(`/quizzes/${id}`)
            if (response.status == 200){
                removeQuizFromCurrentDiscipline(id);
                getQuizzes()
                showToast("Quiz apagado com sucesso!", "success")
            }
        }catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar apagar o Quiz"
            showToast(msg, "error")
        }
    }

    async function saveDisciplineChanges() {
        if (semesterSelected == "" || newDisciplineName == "" || newDisciplineDescription == "" || courseSelected == "") {
            showToast("Preencha todos os campos!", "info")
            return
        } else {
            try {
                const obj = {
                    name: newDisciplineName,
                    description: newDisciplineDescription,
                    semester_id: semesterSelected+"-"+courseSelected
                }
                const response = await sinapseAPI.patch(`/subjects/${discipline!._id}`, obj)
                if (response.status == 200) {
                    showToast("Disciplina salva com sucesso!", "success")
                    getDiscipline()
                }
            } catch (error) {
                showToast("Erro ao atualizar a disciplina", "error")
            }
        }
    }

    async function createQuiz() {
        if (newQuizName == "" || newQuizDescription == "") {
            showToast("Preencha todos os campos!", "info")
            return
        } else {
            const obj = {
                name: newQuizName,
                description: newQuizDescription,
                user_id: user!._id,
                questions: [],
                categories_ids: []
            }
            try {
                const response = await sinapseAPI.post("/quizzes", obj)
                if (response.status == 201) {
                    showToast("Quiz criado com sucesso!", "success")
                    const createdQuiz = response.data
                    await addQuizToCurrentDiscipline(createdQuiz._id)
                    getQuizzes();
                    setShowAllQuizzes(false);
                    closeModal();
                }
            } catch (error: any) {
                const msg = error?.response?.data?.message || "Erro ao tentar criar o Quiz"
                showToast(msg, "error")
            }
        }
    }


    async function addQuizToCurrentDiscipline(_id: string) {
        try {
            const response = await sinapseAPI.post(`/subjects/add-quiz/${discipline!._id}`, { quiz_id: _id })
            if (response.status == 201) {
                showToast("Quiz adicionado a disciplina!", "success")
                getQuizzes()
                getDiscipline()
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar adicionar o Quiz à disciplina"
            showToast(msg, "error")
        }
    }

    function showCourseSemesters(courseID: string){
        const course = allCourses.find(c => c._id === courseID);

        if (!course) {
            setCourseSemesters([]);
            return;
        }

        const filteredSemesters = allsemesters.filter(s =>
            course.semesters_ids.includes(s._id)
        );

        setCourseSemesters(filteredSemesters);
    }


    async function removeQuizFromCurrentDiscipline(idParam: string) {
        try {
            const newQuizzes = discipline?.quizzes_ids.filter((id) => id !== idParam);
            const response = await sinapseAPI.patch(`/subjects/${discipline!._id}`, { quizzes_ids: newQuizzes });
            if (response.status == 200) {
                showToast("Quiz removido da disciplina!", "success")
                getDiscipline();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Erro ao tentar remover o Quiz"
            showToast(msg, "error")
        }
    }

    
    function getQuizById(id: string) {
        const quiz = quizzes.find((quiz) => quiz._id == id)
        if (quiz) {
            return quiz
        } else {
            return null
        }
    }

    return (
        <div>
            <div className="flex flex-col h-full" style={{ color: myTheme.theme.foreground }}>

                <header className="flex flex-col md:justify-between justify-center border-black pl-2 md:pl-6 mb-2">
                    <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Editar Disciplina</h2>
                    <h2 className="font-bold text-lg text-left md:text-left">{discipline?.name}</h2>
                    <h2 className="font-normal text-sl">Código de convite: <strong className="font-bold">{discipline?.invitation_code}</strong></h2>
                </header>

                <div className="w-full h-full bg-(--area-back) p-2">
                    <div className="w-fill h-fill md:px-2">
                        <div className="h-fill">
                            <div className="w-fill text-center md:text-left">
                                <div className="flex md:flex-col md:gap-4">
                                    <div className="md:w-220 w-full md:items-end flex flex-col md:ml-4 md:mt-4 mt-2">
                                        <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                            <h2 className="text-sm font-bold">Curso:</h2>
                                            <select value={courseSelected} onChange={(e)=>{setCourseSelected(e.target.value)}} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-8 text-sm font-bold cursor-pointer">
                                                <option value="">Selecione</option>
                                                {
                                                    allCourses.map((course) => (
                                                        <option key={course._id} value={course._id}>{course.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                            <h2 className="text-sm font-bold">Período:</h2>
                                            <select value={semesterSelected} onChange={(e) => setSemesterSelected(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-8 text-sm font-bold cursor-pointer">
                                                <option value="">Selecione</option>
                                                {
                                                    courseSemesters.map((semester) => (
                                                        <option key={semester._id} value={semester._id}>{semester.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                            <h2 className="text-sm font-bold">Nome:</h2>
                                            <input value={newDisciplineName} onChange={(e) => setNewDisciplineName(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) rounded-lg pl-2 md:ml-4 text-sm  text-(--input-fore) h-8 font-bold"></input>
                                        </div>
                                        <div className="flex md:flex-row flex-col md:mb-4 mb-2">
                                            <h2 className="text-sm font-bold">Descrição:</h2>
                                            <textarea value={newDisciplineDescription} onChange={(e) => setNewDisciplineDescription(e.target.value)} className="md:w-160 ml-2 mr-2 w-fill bg-(--input-back) text-sm rounded-lg pl-2 md:ml-4 text-(--input-fore) h-8 font-bold"></textarea>
                                        </div>
                                        {/* <div className="flex md:flex-row md:mr-2 flex-col items-center md:w-100 w-full mb-6 md:mt-0 mt-2 md:justify-end">
                                        <h2 className="text-lg font-bold">Privar disciplina:</h2>
                                        <select value={newRestrict} onChange={(e)=>setNewRestrict(e.target.value)} className="w-35 md:w-fill mt-2 md:mt-0 bg-(--select-back) rounded-lg pl-2 md:ml-4 text-(--select-fore) h-10 font-bold cursor-pointer">
                                        <option value="">Selecione</option>
                                        <option value="N">Não</option>
                                        <option value="Y">Sim</option>
                                        </select>
                                        </div> */}
                                        <div>
                                            <button className="w-40 h-8 mt-4 md:mt-0 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300" onClick={() => { saveDisciplineChanges() }}>Salvar alterações</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 mb-4 pl-2">
                                <div className="flex w-full gap-2 pr-2 text-center items-center mt-16">
                                    <h2 onClick={() => setShowAllQuizzes(false)} className="font-bold text-xs md:text-sm px-4 py-2 cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-white duration-300 rounded-lg">Quizzes nesta disciplina</h2>
                                    <h2 onClick={() => setShowAllQuizzes(true)} className="font-bold text-xs md:text-sm px-4 py-2 cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-white duration-300 rounded-lg">Meus Quizzes</h2>
                                </div>
                            </div>

                            {
                                (!showAllQuizzes) && (
                                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                        <h2 className="pl-2 font-bold text-sm mb-4">Quizzes nesta disciplina</h2>
                                        <button className="md:text-sm text-xs px-4 py-2 font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300 mb-5" onClick={() => { openModal() }}>+ Novo Quiz</button>
                                        <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                            <table className="w-full h-fill border-collapse">
                                            <thead className="bg-(--theader-back) md:text-lg text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm">
                                                <tr className="h-8">
                                                    <th className="text-left pl-2">Nome</th>
                                                    <th className="text-center w-30">Editar</th>
                                                    <th className="text-center w-30">Remover</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-(--area-back) text-(--area-fore) md:text-sm text-xs font-bold">
                                                {
                                                    discipline?.quizzes_ids.map((id) => {
                                                        const quiz: any = getQuizById(id);

                                                        if (!quiz) return null;

                                                        return (
                                                            <tr key={quiz._id}>
                                                                <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                                                    {quiz.name}
                                                                </td>

                                                                <td
                                                                    className="py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"
                                                                    onClick={() => router.push(`/quiz/edit/${quiz._id}`)}
                                                                >
                                                                    <Pencil className="mx-auto" />
                                                                </td>

                                                                <td
                                                                    className="py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"
                                                                    onClick={() => removeQuizFromCurrentDiscipline(quiz._id)}
                                                                >
                                                                    <Trash className="mx-auto" />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                )
                            }

                            {   
                                (showAllQuizzes) && (
                                    <div>
                                        <h2 className="pl-2 font-bold text-sm mb-4">Todos os meus Quizzes</h2>
                                        <button className="px-4 py-2 text-xs md:text-sm font-bold rounded-lg cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) transition-all duration-300 mb-5" onClick={() => { openModal() }}>+ Novo Quiz</button>

                                        <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                            <table className="w-full h-fill text-lg">
                                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm md:text-lg">
                                                    <tr className="h-8">
                                                        <th className="text-left pl-2">Nome</th>
                                                        <th>Descrição</th>
                                                        <th className="w-2 px-2">Adicionar</th>
                                                        <th className="w-2 px-4">Apagar</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-(--area-back) text-(--area-fore) text-xs md:text-sm font-bold">
                                                    {
                                                        quizzes.map((quiz) => (
                                                            <tr key={quiz._id}>
                                                                <td className=" h-8 border-gray-400 pl-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{quiz.name}</td>
                                                                <td className=" border-gray-400 text-center bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{quiz.description}</td>
                                                                <td className=" border-gray-400 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer text-center text-3xl items-center" onClick={(e) => addQuizToCurrentDiscipline(quiz._id)}>
                                                                    <Add size={20} className="align-middle w-full"/>
                                                                </td>
                                                                <td className=" border-gray-400 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer text-center text-3xl items-center" onClick={(e) => deleteQuiz(quiz._id)}>
                                                                    <Trash size={20} className="align-middle w-full"/>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${modalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="border-4 border-blue-700 bg-(--screen-back) text-(--foreground) m-4 md:w-240 w-120 md:h-160 h-140 rounded-2xl shadow-xl">
                    <div className="mt-6 text-center font-bold">
                        <h2 className="md:text-lg text-lg">Criar novo Quiz</h2>
                        <div className="mt-8">
                            <div className="ml-4 mr-4">
                                <h2 className="font-bold mb-1 md:text-lg text-xs text-left">Nome do Quiz:</h2>
                                <input maxLength={100} value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)} type="text" className="text-xs md:text-lg bg-(--input-back) text-(--input-fore) pl-2 w-full h-8 md:mb-6 mb-3 rounded-lg" />
                            </div>
                            <div className="ml-4 mr-4">
                                <h2 className="font-bold mb-1 md:text-lg text-xs text-left pt-4">Descrição:</h2>
                                <textarea value={newQuizDescription} onChange={(e) => setNewQuizDescription(e.target.value)} className="bg-(--input-back) text-(--input-fore) text-xs md:text-lg pl-2 w-full h-20 md:mb-6 mb-3 rounded-lg" />
                            </div>
                            <div className="items-center justify-center flex mt-26 gap-8">
                                <button onClick={() => setModalVisible(false)} className="bg-(--button-delete) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Cancelar</button>
                                <button onClick={() => { createQuiz() }} className="bg-(--button-back) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}