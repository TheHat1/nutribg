import { useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function WelcomePage() {
    const footerRef = useRef()
    const navigate = useNavigate()

    return (
        <>
            <div className="fixed inset-0 -z-10">
                <img className="w-screen h-screen object-cover pointer-events-none" src="/images/bg-img1.jpg" />
            </div>
            <div className="w-screen h-screen overflow-y-auto overflow-x-hidden pt-37">
                <div className="w-screen h-[calc(100vh-var(--nav-height))] bg-emerald-900/40 backdrop-blur-xs flex justify-center items-center p-15">
                    <div className="flex justify-center flex-col items-center">
                        <h1 className="text-5xl font-display text-white font-bold text-center">Здравето започва от храната.</h1>
                        <h1 className="text-5xl text-white caveat">Nutri BG</h1>
                        <div className="flex justify-between space-x-10 mt-6">
                            <div onClick={()=>{
                                navigate('/recipes')
                            }}
                             className="w-30 h-14 text-xl bg-emerald-950 rounded-lg text-white font-display font-bold flex justify-center items-center cursor-pointer hover:scale-110 hover:brightness-125 transition-all duration-150">Рецепти</div>
                            <div onClick={() => {
                                footerRef.current.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                })
                            }}
                                className="w-30 h-14 text-xl bg-white rounded-lg text-black font-display font-bold flex justify-center items-center cursor-pointer hover:scale-110 hover:brightness-90 transition-all duration-150">За нас</div>
                        </div>
                    </div>
                </div>
                <div ref={footerRef} className="w-screen h-fit bg-emerald-900 p-10 pt-15 space-y-5">
                    <h1 className="text-white text-5xl font-display">От екипа на <a className="caveat">Nutri BG</a></h1>
                    <p className="text-white text-xl text-pretty font-display wrap-normal indent-10 max-w-250">
                        Nutri BG е платформа, създадена с ясната цел да направи здравословното хранене по-достъпно, разбираемо и приложимо в ежедневието. В свят, пълен с противоречива информация и крайни диети, ние залагаме на баланса и практичните решения.
                    </p>
                    <p className="text-white text-xl text-pretty font-display wrap-normal indent-10 max-w-250">
                        Нашата мисия е да помагаме на хората да изграждат по-добри хранителни навици чрез качествено съдържание, ясни насоки и вдъхновение за по-здравословен начин на живот. В Nutri BG ще откриете полезна информация, съвети и идеи, които насърчават осъзнатия избор на храна, без излишни ограничения и крайности.
                    </p>
                    <p className="text-white text-xl text-pretty font-display wrap-normal indent-10 max-w-250">
                        Вярваме, че здравето не е временна цел, а дългосрочен процес, започващ от ежедневните решения, които взимаме. Затова се стремим да бъдем надежден източник на информация и подкрепа за всеки, който иска да се грижи по-добре за себе си и своето тяло.
                    </p>
                </div>
                <div className="w-screen h-fit min-h-26 bg-stone-950 flex p-1">
                    <div className="w-full h-full flex space-x-15">

                    </div>
                    <div className="min-w-80 text-gray-500 font-display text-sm flex items-end">
                        <h1>©Made by TheHatInc™. All rights reserved.</h1>
                    </div>
                </div>
            </div>
        </>
    )
}