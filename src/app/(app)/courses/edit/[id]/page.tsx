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
export default function EditCourse() {
    const { user, login, logout } = useAuth();
    const myTheme = useTheme();
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const courseID = params.id;

    const [semesters, setSemesters] = useState<Semester[]>([])
    const [course, setCourse] = useState<Course>()

    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [newDisciplineName, setNewDisciplineName] = useState("");
    const [newDisciplineDescription, setNewDisciplineDescription] = useState("");
    const [newRestrict, setNewRestrict] = useState("");

    const [newQuizName, setNewQuizName] = useState("");
    const [newQuizDescription, setNewQuizDescription] = useState("");

    const [semesterSelected, setSemesterSelected] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [showAllPeriods, setShowAllPeriods] = useState(false);

    useEffect(() => {
        document.title = "Sinapse - Visualizar Curso"
        getSemesters();
        getCourse();
        // getDiscipline();
    }, [])

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

    // async function getDiscipline() {
    //     try {
    //         const response = await sinapseAPI.get(`/subjects/${disciplineID}`);
    //         setDiscipline(response.data);
    //         setSemesterSelected(response.data.semester_id)
    //         setNewDisciplineName(response.data.name)
    //         setNewDisciplineDescription(response.data.description)

    //     } catch (error) {
    //         showToast("Erro ao obter detalhes da disciplina", "error")
    //         router.push("/home")
    //     }
    // }

    async function getSemesters() {
        try {
            const response = await sinapseAPI.get("/semesters");
            setSemesters(response.data);
        } catch (error) {
            showToast("Erro ao obter os semestres", "error")
        }
    }

    function getSemesterName(semesterID: string) {
        const semester = semesters.find(s => s._id === semesterID);
        return semester?.name;
    }

    async function getCourse() {
        try {
            const response = await sinapseAPI.get(`/courses/${courseID}`);
            setCourse(response.data);
        } catch (error) {
            showToast("Erro ao obter detalhes do curso", "error")
            router.push("/home");
        }
    }

    async function addPeriodToCurrentCourse(periodID: string) {
        if (!course) return;

        if (course.semesters_ids.includes(periodID)) {
            showToast("Esse período já foi adicionado", "info");
            return;
        }

        const updatedSemesters = [...course.semesters_ids, periodID];

        const obj = {
            user_id: user?._id,
            updated_course: {
                name: course.name,
                semesters_ids: updatedSemesters
            }
        };

        try {
            const response = await sinapseAPI.patch(`/courses/${courseID}`, obj);
            if (response.status === 200) {
                showToast("Período adicionado ao curso com sucesso!", "success");
                getCourse();
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erro ao adicionar período";
            showToast(message, "error");
        }
    }

    async function removeSemesterFromCurrentCourse(semesterID: string) {
        if (!course) return;

        const updatedSemesters = course.semesters_ids.filter(
            id => id !== semesterID
        );

        const obj = {
            user_id: user?._id,
            updated_course: {
                name: course.name,
                semesters_ids: updatedSemesters
            }
        };

        try {
            const response = await sinapseAPI.patch(`/courses/${courseID}`, obj);

            if (response.status === 200) {
                showToast("Período removido do curso com sucesso!", "success");
                getCourse();
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Erro ao remover o período";
            showToast(message, "error");
        }
    }


    return (
        <div>
            <div className="flex flex-col h-full" style={{ color: myTheme.theme.foreground }}>

                <header className="flex flex-col md:justify-between justify-center border-black pl-2 md:pl-6 mb-2">
                    <h2 className="font-bold md:text-2xl text-xl mt-3 text-center md:text-left mb-3">Visualizar Curso</h2>
                    <h2 className="font-bold text-lg text-left md:text-left">{discipline?.name}</h2>
                </header>

                <div className="w-full h-full bg-(--area-back) p-2">
                    <div className="w-fill h-fill md:px-2">
                                    <div className="w-fill flex flex-col md:flex-row gap-2 text-center md:text-left">
                                        <h2 className="font-normal text-sm md:text-xl">Gerenciar períodos do curso:</h2>
                                        <h2 className="font-bold text-sm md:text-xl">{course?.name}</h2>
                                    </div>
                        <div className="h-fill">
                            <div className="mt-8 mb-4">
                                <div className="w-full flex flex-row gap-3">
                                    <h2 onClick={() => setShowAllPeriods(false)} className="font-bold text-center text-xs md:text-sm py-2 w-full cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-white duration-300 rounded-lg">Períodos neste curso</h2>
                                    <h2 onClick={() => setShowAllPeriods(true)} className="font-bold text-center text-xs md:text-sm py-2 w-full cursor-pointer bg-(--button-back) hover:bg-(--button-hover) text-white duration-300 rounded-lg">Períodos cadastrados</h2>
                                </div>
                            </div>

                            {
                                (!showAllPeriods) && (
                                    <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                        
                                        <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                            <table className="w-full h-fill border-collapse">
                                            <thead className="bg-(--theader-back) md:text-lg text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm">
                                                <tr className="h-8">
                                                    <th className="text-left pl-2">Nome</th>
                                                    <th className="text-center w-30">Remover</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-(--area-back) text-(--area-fore) md:text-sm text-xs font-bold">
                                                {
                                                    course?.semesters_ids.map((semester) => {
                                                        return (
                                                            <tr key={semester}>
                                                                <td className="text-left pl-2 py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">
                                                                    {getSemesterName(semester)}
                                                                </td>

                                                                <td
                                                                    className="py-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer"
                                                                    onClick={() => removeSemesterFromCurrentCourse(semester)}
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
                                (showAllPeriods) && (
                                    <div>
                                        <div className="w-full h-fill overflow-x-scroll md:overflow-x-hidden rounded-lg">
                                            <table className="w-full h-fill text-lg">
                                                <thead className="bg-(--theader-back) text-(--theader-fore) hover:bg-(--theader-back-hover) hover:text-(--theader-fore-hover) text-sm md:text-lg">
                                                    <tr className="h-8">
                                                        <th className="text-left pl-2">Nome</th>
                                                        <th className="w-2 px-2">Adicionar</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-(--area-back) text-(--area-fore) text-xs md:text-sm font-bold">
                                                    {
                                                    semesters.map((semester) => (
                                                        <tr key={semester._id}>
                                                            <td className=" h-8 border-gray-400 pl-2 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover)">{semester.name}</td>
                                                            <td className=" border-gray-400 bg-(--tbody-back) text-(--tbody-fore) hover:bg-(--tbody-back-hover) hover:text-(--tbody-fore-hover) cursor-pointer text-center text-3xl items-center" onClick={(e) => addPeriodToCurrentCourse(semester._id)}>
                                                                <Add size={20} className="align-middle w-full"/>
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
                                {/* <button onClick={() => { createQuiz() }} className="bg-(--button-back) hover:bg-(--button-hover) cursor-pointer duration-300 text-(--button-fore) font-bold w-30 h-12 rounded-lg">Salvar</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}