"use client"
import { useAuth } from "@/contexts/AuthContext";
import { sinapseAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Trash } from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

type Discipline = {
    name: string
    description: string
    user_id: string
    quizzes_ids: string[]
    students_ids: string[]
    semester_id: string
    invitation_code: string
    ranking: string
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

export default function CreateDiscipline() {
  const { user, login, logout } = useAuth();
  const myTheme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [created, setCreated] = useState(false);
  const [allSemesters, setAllSemesters] = useState <Semester[]> ([]);
  const [semesters, setSemesters] = useState <Semester[]> ([]);
  const [courses, setCourses] = useState <Course[]> ([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [semesterSelected, setSemesterSelected] = useState("");
  const [courseSelected, setCourseSelected] = useState("");
  const [restrict, setRestrict] = useState("N");

  useEffect( () => {
    document.title = "Sinapse - Nova Disciplina"
    getSemesters()
    getCourses()
    if (user?.type != "Teacher"){
        router.push("/home")
        showToast("Você não possui permissão para acessar esta página!", "info")
    }
    setCourseSelected(user?.course_id!)
    //showSemesters(user?.course_id!)
  }, [])

  useEffect(() => {
    if (user?.course_id && courses.length > 0 && allSemesters.length > 0) {
        showSemesters(user.course_id);
    }
    }, [courses, allSemesters, user]);


  async function getSemesters(){
    try {
        const response = await sinapseAPI.get("/semesters")
        setAllSemesters(response.data)
    } catch (error) {
        showToast("Ocorreu um erro ao obter os períodos","error")
    }
  }

  async function getCourses(){
    try {
        const response = await sinapseAPI.get("/courses")
        setCourses(response.data)
    } catch (error) {
        showToast("Ocorreu um erro ao obter os cursos","error")
    }
  }

  function showSemesters(courseID: string) {
    if (!courseID) {
        setSemesters([]);
        return;
    }

    const course = courses.find(course => course._id === courseID);

    if (!course) {
        setSemesters([]);
        return;
    }

    const filteredSemesters = allSemesters.filter(s =>
        course.semesters_ids.includes(s._id)
    );

    setSemesters(filteredSemesters);
    }


  async function createDiscipline(){
    
    if (name == "" || semesterSelected == "" || restrict == ""|| courseSelected == ""){
        showToast("Preencha todos os campos!","info")
    }else{
        try {
            const obj = {
                name: name,
                description: !description ? " " : description,
                user_id: user!._id,
                quizzes_ids: [],
                students_ids: [user?._id],
                semester_id: semesterSelected,
                course_id: courseSelected,
                ranking: []
            }
            const response = await sinapseAPI.post("/subjects",obj)
            if (response.status == 201){
                setCreated(true)
                showToast("Disciplina criada com sucesso!","success")
                router.push("/home")
            }
        } catch (error) {
            showToast("Insira outro nome para a disciplina!","info")
        }
    }
  }

  
    function getCourseName(courseId: string){
        const course = courses.find(course => course._id === courseId);
        return course ? course.name : undefined;
    }
  

  
  if (!created){ return (
    <div className="flex flex-col h-full text-xs md:text-lg" style={{color:myTheme.theme.foreground}}>
        <header className="flex flex-col md:flex-row md:justify-between justify-center md:pr-15 md:pl-4 text-center md:h-20">
        <h2 className="font-bold md:text-2xl text-lg mt-3 py-2">Criação de nova disciplina</h2> {/* titulo externo */}
        </header>
        <div className="p-2"> {/* paddind da area interna */}
            <div className="w-full h-full bg-(--area-back)"> {/* area interna */}
                {/* conteudo inicio */}
                <div className="w-full h-full p-2">
                    <div className="md:w-300 w-full flex flex-col text-center md:text-left justify-center gap-4">
                        <div>
                            <h2 className="font-bold text-sm md:text-lg">
                            Curso: {getCourseName(user?.course_id!) || "Carregando..."}
                            </h2>
                            {/* <select value={courseSelected} onChange={(e) => {const value = e.target.value; setCourseSelected(value); showSemesters(value);}} className="bg-(--select-back) text-xs  text-(--select-fore) w-full rounded-lg h-8 cursor-pointer">
                            <option value="">Selecione</option>
                            {
                            courses.map( (item) => (
                                <option value={item._id} key={item._id}>{item.name}</option>
                            ) )
                            }
                            </select> */}
                        </div>
                        <div>
                            <h2 className="font-bold text-sm md:text-lg">Período:</h2>
                            <select value={semesterSelected} onChange={ (e)=>setSemesterSelected(e.target.value)} className="bg-(--select-back) text-xs  text-(--select-fore) w-full rounded-lg h-8 cursor-pointer">
                            <option value="">Selecione</option>
                            {
                            semesters.map( (item) => (
                                <option value={item._id} key={item._id}>{item.name}</option>
                            ) )
                            }
                            </select>
                        </div>
                        <div>
                            <h2 className="font-bold text-sm md:text-lg">Nome:</h2>
                            <input placeholder="Nome da nova disciplina" value={name} onChange={(e)=>setName(e.target.value)} maxLength={100} className="bg-(--input-back) text-xs  text-(--input-fore) rounded-lg h-8 pl-2 w-full" type="text" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm md:text-lg">Descrição:</h2>
                            <textarea placeholder="Informe uma breve descrição sobre o conteúdo dessa disciplina" value={description} onChange={(e)=>setDescription(e.target.value)} maxLength={500} className="bg-(--input-back) text-xs  text-(--input-fore) rounded-lg h-8 md:h-16 pl-2 w-full"/>
                        </div>
                        {/* <div>
                            <h2 className="font-bold text-xl">Privar:</h2>
                            <select value={restrict} onChange={(e)=>setRestrict(e.target.value)} className="bg-(--select-back) text-(--select-fore) w-30 rounded-lg h-10 cursor-pointer">
                            <option value="">Selecione</option>
                            <option value="Y">Sim</option>
                            <option value="N">Não</option>
                            </select>
                        </div> */}
                        <div className="mt-20">
                            <button className="bg-(--button-enter) hover:bg-(--button-hover) text-(--button-fore) rounded-lg cursor-pointer h-10 font-bold px-4 duration-300" onClick={()=> createDiscipline()}>Criar Disciplina</button>
                        </div>
                    </div>
                </div>
                {/* conteudo fim */}
            </div>
        </div>
    </div>
    )

  } else { return (

        <div className="flex flex-col h-full" style={{color:myTheme.theme.foreground}}>
        <div className="p-0 h-full"> {/* paddind da area interna */}
            <div className="w-full h-full bg-(--area-back)"> {/* area interna */}
                {/* conteudo inicio */}
                <div className="md:w-160 flex flex-col md:items-end">
                    <div className="flex flex-col pt-6 md:gap-8 gap-4">
                        <div className="flex md:flex-row flex-col">
                            <h2 className="md:text-3xl text-xl font-bold text-center md:text-left mb-2 mt-20">Disciplina Criada!</h2>
                        </div>
                        <div className="flex md:flex-row flex-col mt-20 md:mt-0">
                            <h2 className="md:text-xl text-lg font-bold text-center md:text-left mb-2 ml-10 md:ml-0 mr-10">Navegue até a página inicial para começar a criar quizzes.</h2>
                        </div>
                        <div className="pt-10 flex md:justify-end justify-center">
                            <button className="bg-(--button-back) hover:bg-(--button-hover) text-(--button-fore) w-40 h-10 md:mr-2 font-bold rounded-lg cursor-pointer" onClick={()=> router.push("/home")}>Página Inicial</button>
                        </div>
                    </div>
                </div>
                {/* conteudo fim */}
            </div>
        </div>
    </div>
    
    )
  }
}