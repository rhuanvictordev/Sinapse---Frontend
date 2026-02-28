import Image from "next/image"
import Link from "next/link"
import Logo from "../../../../assets/images/logo_horizontal.png"
import User from "../../../../assets/images/user.png"

export default function Header(){
    return (
        <header className="flex pl-20 pr-20 py-2 bg-[#C4D0DA]">
            <div className="flex items-center justify-between w-full mx-auto max-w-7x1">
                <div>
                    <a href="/home">
                        <Image src={Logo} alt="logo_sinapse"></Image>
                    </a>
                </div>
                <div className="flex flex-row gap-3 justify-center">
                    <div className="mt-3">
                        <div className="">
                            <p className="font-bold text-2xl">Rhuan Victor</p>
                        </div>
                        <div>
                            <p className="font-bold text-end">Nível 60</p>
                        </div>
                    </div>
                    <div>
                        <a href="/profile">
                            <Image src={User} alt="user_image"></Image>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}