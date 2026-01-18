import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function WelcomePage() {
    const [img, setImg] = useState('')
    const [CSS, setCSS] = useState('')
    const br = useRef(0)
    const imgs = ['/images/bg-img1.jpg','/images/bg-img2.jpg','/images/bg-img3.jpg']
    const footerRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        setImg(imgs[Math.floor(Math.random() * 3)])

        const interval = setInterval(() => {
            setCSS("opacity-0 -translate-x-[5vw] duration-300")

            setTimeout(() => {
                br.current = (br.current + 1) % imgs.length
                setImg(imgs[br.current])
                setCSS("translate-x-[5vw] opacity-0 duration-[1ms]")

                setTimeout(() => {
                    setCSS("translate-x-0 opacity-100 duration-300")
                }, 15)

            }, 300)

        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="fixed inset-0 -z-10">
                <img className={`w-screen h-screen object-cover pointer-events-none ${CSS}`} src={img} />
            </div>
            <div className="w-screen h-screen overflow-y-auto overflow-x-hidden pt-37">
                <div className="w-screen h-[calc(100vh-var(--nav-height))] bg-emerald-900/40 backdrop-blur-xs flex justify-center items-center p-15">
                    <div className="flex justify-center flex-col items-center">
                        <h1 className="text-5xl font-display text-white font-bold text-center">Здравето започва от храната.</h1>
                        <h1 className="text-5xl text-white caveat">Nutri BG</h1>
                        <div className="flex justify-between space-x-10 mt-6">
                            <div onClick={() => {
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