import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../Backend/supabase"
import isAuth from '../Backend/isAuth.js'


export default function LogIn() {
    const [errorLogIn, setErrorLogIn] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [inProgress, setInProgress] = useState(false)
    const navigate = useNavigate()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    useEffect(()=>{
        if(isAuth()){
            navigate('/profilepage')
        }
    },[])

    async function LogIn() {
        try {
            setInProgress(true)
            if (email == undefined || password == undefined) {
                setErrorLogIn(true)
                setErrMsg("Има празни полета!")
                setInProgress(false)
                return
            }

            if (!emailRegex.test(email)) {
                setErrorLogIn(true)
                setErrMsg("Невалиден e-mail!")
                setInProgress(false)
                return
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    setErrorLogIn(true)
                    setErrMsg("Грешен e-mail или парола.")
                    setInProgress(false)
                    return
                }

            }

            navigate('/profilepage')
        } catch (err) {
            console.error(err)
        }

    }

    return (
        <>
            <div className="w-screen h-screen flex justify-center pt-40">
                <div className="bg-white w-[90vw] max-w-200 min-h-100 h-fit rounded-lg flex items-center p-10 flex-col space-y-3">
                    <h1 className="text-black font-display text-2xl font-bold">Влизане в профил</h1>
                    <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-2.5 border-2 rounded-md transition-all duration-300 ease-out 
                        ${errorLogIn ? "w-[90vw] max-w-100 h-12.5 border-red-900" : "max-w-112.5 w-[80vw] border-lime-900"}`}>
                        {errMsg}
                    </div>

                    <input
                        className="border-2 border-lame-900 bg-emerald-100 max-w-100 w-[80vw] h-12.5 text-black rounded-md transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="text"
                        value={undefined}
                        placeholder="E-mail"
                        onChange={(e) => { setEmail(e.target.value) }}
                        name="email_field"
                    />

                    <input
                        className="border-2 border-lame-900 bg-emerald-100 max-w-100 w-[80vw] h-12.5 text-black rounded-md transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="password"
                        value={undefined}
                        placeholder="Парола"
                        onChange={(e) => { setPassword(e.target.value) }}
                        name="password_field"
                    />

                    <h1 className=" text-xl font-display font-bold">Нямаш профил? Регистрирай се <a onClick={() => { navigate('/signup') }} className="text-lime-600 cursor-pointer hover:brightness-125 transition-all ">тук</a>.</h1>

                    <div onClick={() => { LogIn() }}
                        className="w-50 h-15 bg-lime-900 rounded-lg hover:scale-110 hover:brightness-125 transition-all cursor-pointer text-white font-display font-bold flex justify-center items-center text-xl">
                        Влез
                    </div>

                </div>
            </div>
        </>
    )
}