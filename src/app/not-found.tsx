import Link from "next/link";
import Logo from "../../assets/images/logo.png"
import Image from "next/image";

export default function NotFound(){
    return(
        <div className="flex flex-col items-center justify-center mt-30">
            <Image src={Logo}  alt="logo_sinapse"/>
            <h1 className="text-center font-bold mt-9 text-4xl mb-5">404 - Página não encontrada</h1>
            <p className="mb-10">Esta página não existe!</p>
            <Link href="/" className="text-white bg-blue-500 p-4 font-bold rounded-2xl hover:bg-blue-400 duration-300">Continuar</Link>
        </div>
    )
}